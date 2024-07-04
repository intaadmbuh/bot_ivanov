// const {User} = require("../BTN_KEYBORDS/USER");
// const {Files} = require("../FILES/FILES");
const {logger} = require("../LOGGER/LOGGER");
const {InputFile, Keyboard} = require("grammy");
const {File_Func} = require("../FILES/FILES_FUNC");
const {Op, Sequelize, fn} = require("sequelize");
const {scheduleNextRecurrence} = require("node-schedule/lib/Invocation");

// const {e} = require("../EVENT/global");

async function _getStatistic(ctx, table) {
		try {
				let act = 0
				let pas = 0
				const rec = await table.findAll()
				for (let i of rec)
						if (i.dataValues.active) act++
						else pas++
				ctx.reply(`Количество активных пользователей - ${act}\nКоличество пользователей, которые меня удалили - ${pas}`)
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
        [ФАЙЛ - MY_FUNC.JS], [ФУНКЦИЯ -_getStatistic],
        err - ${e}`)
		}
}

async function _sendNews(msg, externalData) {
		try {
				let rec = await externalData.TABLE_USERS.findAll()

				for (let i in rec) {
						if (rec[i].active == false) {
								rec[i].active = true
								await rec[i].save()
						}
						try {
								await externalData.BOT.api.sendMessage(rec[i].user_id, msg, {
										"reply_markup": {
												// 		"keyboard": [["Sample text", "Second sample"],   ["Keyboard"], ["I'm robot"]]
												"keyboard": externalData.MENU.get(+rec[i].user_id).KEYBOARD_STACK.at(-1),
												"resize_keyboard": true,//https://core.telegram.org/bots/api#replykeyboardmarkup
												"is_persistent": true,
										},
										"disable_notification": true,
								});
						} catch (e) {
								rec[i].active = false
								await rec[i].save()
								externalData.MENU.delete(+rec[i].user_id)
						}
				}
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
        [ФАЙЛ - MY_FUNC.JS], [ФУНКЦИЯ -_sendNews],
        err - ${e}`)
		}
}

async function _sendMsgToUser(bot, msg, table) {
		const adminID = JSON.parse(process.env.BOT_ADMIN)//только для меня
		const obj = {
				id: 0,
				msg: msg
		}
		if (__getFirstNumberFromMessage(obj)) {
				try {
						let rec = await table.findAll()

						for (let i in rec) {
								if (rec[i].user_id == obj.id) {
										try {
												await bot.api.sendMessage(rec[i].user_id, obj.msg)
										} catch (e) {
												await bot.api.sendMessage(adminID[0], `Ошибка отправки сообщения. Скорее всего пользователь удалил бота`)
										}
										return
								}
						}
						await bot.api.sendMessage(adminID[0], `Не удалось найти пользователя с id - ${obj.id}`)
				} catch (e) {
						logger.error(`[${My_Func._getDateTime()}],
        [ФАЙЛ - MY_FUNC.JS], [ФУНКЦИЯ -_sendMsgToUser],
        err - ${e}`)
				}
		}
}

function __getFirstNumberFromMessage(obj) {
		// Разделяем сообщение на слова
		// const words = obj.msg.split(/[\s.,!?]+/);
		const words = obj.msg.split(' ');

		// Проходимся по каждому слову
		for (let i = 0; i < words.length; i++) {
				// Пытаемся преобразовать слово в число
				let number = parseFloat(words[i]);
				if (!isNaN(number)) {
						let numberTmp = number.toFixed(0);//отбрасываем дробную часть
						const amountDigits = numberTmp.toString().length;
						if (amountDigits === 10 || amountDigits === 9) {//id состоит из 9 или 10 цифр
								obj.id = numberTmp;
								let pos = obj.msg.indexOf(numberTmp);
								if (pos !== -1) obj.msg = obj.msg.replace(numberTmp, '');
						}
				}
				if (obj.id != 0) return 1
		}
		return 0
}


// если сегодняшняя дата больше чем контрольная дата - вернул правду
const _compareDate = (dateDeadLine) => {
		if (dateDeadLine == null) return 0
		let arr = __prepareDate(dateDeadLine)
		if (arr.length !== 8) return 0

		// let reversDateDeadLine = [arr.splice(-4).join(''), arr.splice(-2).join(''), arr.splice(-2).join('')].join('-');
		let DateDeadLine = [arr.splice(0, 2).join(''), arr.splice(0, 2).join(''), arr.splice(0, 4).join('')].join('-');

		const date2 = _convertStringToDate(DateDeadLine)

		if (date2 == 'Invalid Date') return 0

		const dateNow = new Date()
		const dateNow1 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());


		if (date2 - dateNow1 === 0) return 2
		else if (date2 < dateNow1) return 1
		else if (date2 > dateNow1) return -1
		else return 0
}

function _prepareDateToShow(dateString) {
		let arr = __prepareDate(dateString)
		if (arr.length !== 8) return 0
		const year = arr.splice(-4).join('')
		const month = arr.splice(2).join('')
		const day = arr.splice(-2).join('')
		let dateCheck = new Date([year, month, day].join('-'));
		return dateCheck.toISOString().slice(0, 10).split('-').reverse().join('-')
}

function __prepareDate(dateString) {
		const arr = dateString.split('')
		const filteredArr = arr.filter(item => __isDigit(item));
		return filteredArr
}

// Функция для проверки, является ли символ цифрой
function __isDigit(char) {
		return char >= '0' && char <= '9';
}


const dataOptions = {
		// era: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long',
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
}

function _getDateTime() {
		try {
				return new Date().toLocaleString("ru", dataOptions)
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
        [ФАЙЛ - MY_FUNC.JS], [ФУНКЦИЯ - _getDateTime],
        err - ${e}`)
		}
}

function _getDate() {
		// return new Date().toISOString().slice(0, 10).split('-').reverse().join('-')
		const dateNow = new Date()
		const day = dateNow.getDate()
		let month = (dateNow.getMonth() + 1).toString()
		if (month.length === 1) month = '0' + month
		const year = dateNow.getFullYear()
		return `${day}.${month}.${year}`
}

function _getDateRevers() {
		return new Date().toISOString().slice(0, 10).split('-').join('-')
}


//
//
function _pad(s) {
		return ('00' + s).slice(-2)
}

function _getArrOfDatesBeforeNow() {
		let pastDate = new Date("2000-01-01")
		const now = new Date()
		const result = []

		while (pastDate.getTime() < now.getTime()) {
				result.push(pastDate.getFullYear() + '-' + _pad(pastDate.getMonth() + 1) + '-' + _pad(pastDate.getDate()));
				pastDate.setDate(pastDate.getDate() + 1);
		}
		return result
}

async function _getLocationBtn(ctx) {
		await ctx.reply('Я посмотрю где вы находитесь и найду для вас ближайшую остановку. Пришлю вам картинку, нажав на которую яндекс построит маршрут до неё' +
				', а также ссылку, нажав на которую яндекс покажет все маршруты и расчетное время прибытия автобуса. ' +
				'Кнопка' +
				'\n📍Отправить свою локацию📍' +
				'\nнаходится в самом низу вашего экрана', {
				reply_markup: {
						keyboard: [[{
								text: '📍Отправить свою локацию📍',
								request_location: true,
						}]],
						resize_keyboard: true,
				},
				is_persistent: true,
		})
}

function _isTheSameDay(date1, date2) {
		return date1.getDate() === date2.getDate() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getFullYear() === date2.getFullYear()
}

async function _helpUser(ctx, pathMp4, caption, pathTxt) {
		await ctx.replyWithVideo(new InputFile(pathMp4)
				, {caption: caption})
		await File_Func._sendMsgFromFile(pathTxt, ctx)
}

const arrUserMessages = ['1', '3', '5', '101', 'расписание', 'расписание номер',
		'расписание маршрута номер', 'расписание 1', 'расписание 3', 'расписание 5', 'расписание 101',
		'маршрут', 'маршрут номер', 'маршрут 1', 'маршрут 3', 'маршрут 5',
		'маршрут 101']

function __levenshteinDistance(s1, s2) {
		let len1 = s1.length;
		let len2 = s2.length;
		let col = [];

		for (let i = 0; i <= len1; i++) col[i] = [];
		col[0][0] = 0;
		for (let i = 1; i <= len1; i++) col[i][0] = i;
		for (let j = 1; j <= len2; j++) col[0][j] = j;
		for (let i = 1; i <= len1; i++) {
				for (let j = 1; j <= len2; j++) {
						if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
								col[i][j] = col[i - 1][j - 1];
						} else {
								col[i][j] = Math.min(col[i - 1][j], // удаление
										col[i][j - 1], // вставка
										col[i - 1][j - 1]) + 1; // замена или вставка
						}
				}
		}
		return col[len1][len2];
}

function _isCloseInContent(text, userMessages, maxDistance) {
		let closeMatches = [];
		for (let message of userMessages) {
				let distance = __levenshteinDistance(text.toLowerCase(), message);
				if (distance <= maxDistance) {
						closeMatches.push({message, distance});
				}
		}
		return closeMatches.length > 0 ? closeMatches : null;
}

function _convertStringToDate(dateString) {
		// Разделяем строку на день, месяц и год
		const parts = dateString.split('-');
		// Преобразуем каждый элемент в число
		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10) - 1; // Месяцы начинаются с 0 в объекте Date
		const year = parseInt(parts[2], 10);
		// Создаем объект Date
		const dateObject = new Date(year, month, day, 0, 0, 0);
		return dateObject
}

async function _changeKeyboad(ctx) {
		const labels = [
				"Yes, they certainly are",
				"I'm not quite sure",
				"No. 😈",
		];
		const buttonRows = labels
				.map((label) => [Keyboard.text(label)]);
		const keyboard = Keyboard.from(buttonRows).resized();
		await ctx.reply('ТЕСТОВОЕ СООБЩЕНИЕ ДЛЯ КЛАВИАТУРЫ ПОЛЬЗОВАТЕЛЯ',
				{
						reply_markup: keyboard,
				}
		)
}//тестовая функция

function _getAllProperties(obj) {
		const arrProp = [];
		for (let property in obj)
				if (obj.hasOwnProperty(property))
						arrProp.push(property);
		return arrProp;
}

function _isDateInArray(date, array) {
		for (let i of array)
				if (i - date === 0)
						return true;
}

async function _getSchedule(externalData, minutes = 60, flagWestEast = true) {
		try {
				let msg = ''
				const startTime = new Date();
				// startTime.setDate(startTime.getDate() + 1)//убрать после тестирования
				// startTime.setHours(0)//убрать после тестирования
				// startTime.setMinutes(20)//убрать после тестирования

				const endOfDay = new Date(startTime);//проверка на не пустотность  таблицы фактических расписаний.
				endOfDay.setDate(startTime.getDate() + 1)//на сутки вперед посмотрю если что
				const endTime = new Date(startTime.getTime() + 20 * minutes * 60 * 1000)//от балды поставил 24 часа +-
				const beforeTime = new Date(startTime.getTime() - minutes * 60 * 1000)

				let isRecAfterStartTime = await externalData.YEAR_SCHEDULES.findOne({
						where: {
								date: {
										[Op.between]: [startTime, endOfDay],
								}
						},
						raw: true,
				})//Посмотрим есть ли вообще записи в таблице с момента сейчас
				if (isRecAfterStartTime === null) return null
// локальное время (чтобы на серваке не было глюков)
				msg += '\n' + `Время запроса ${startTime.toLocaleDateString('ru-RU', {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric'
				})}  ${startTime.toLocaleTimeString('ru-RU', {hour12: false})}.` + '\n'

				await __isDayOff(startTime, externalData.DAY_OFF) ? msg += 'Выходной день.' + '\n' : msg += 'Будний день.' + '\n'

				//СПИСОК №1 БЛИЖАЙШИЙ АВТОБУСОВ
				const list_1 = await externalData.YEAR_SCHEDULES.findAll({//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
						attributes: ['bus', 'start', [fn('min', Sequelize.col('date')), 'date']],
						group: ['bus', 'start'],
						raw: true,
						order: [["bus", "ASC"]],//сортировка по возрастанию
						where: {
								date: {
										[Op.between]: [startTime, endTime],
								},
								west_to_east: flagWestEast,
						},
				})

				let arrId = []
				if (list_1)
						for (let i of list_1)
								arrId.push(...await __getArrId(list_1, externalData.YEAR_SCHEDULES))

				//ФОРМИРУЕМ СПИСОК №2 СЛЕДУЮЩИХ ЗА СЛЕДУЮЩИМИ АВТОБУСАМИ
				const list_2 = await externalData.YEAR_SCHEDULES.findAll({//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
						attributes: ['bus', 'start', [fn('min', Sequelize.col('date')), 'date']],
						// group: ['bus', 'start', 'day_off', 'west_to_east'],
						group: ['bus', 'start'],
						raw: true,
						order: [["bus", "ASC"]],//сортировка по возрастанию
						where: {
								date: {
										[Op.between]: [startTime, endTime],
								},
								west_to_east: flagWestEast,
								id: {
										[Op.notIn]: arrId,
								},
						},
				})

				//НАЙДЕМ КАКИЕ БЫЛИ САМЫЕ ПОСЛЕДНИЕ АВТОБУСЫ ДО ТЕКУЩЕГО ВРЕМЕНИ ЗА ЗАДАННЫЙ ПРОМЕЖУТОК ВРЕМЕНИ
				let list_3 = await externalData.YEAR_SCHEDULES.findAll({//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
						attributes: ['bus', 'start', [fn('max', Sequelize.col('date')), 'date']],
						group: ['bus', 'start'],
						raw: true,
						order: [["bus", "ASC"]],//сортировка по возрастанию
						where: {
								date: {
										[Op.between]: [beforeTime, startTime],
								},
								west_to_east: flagWestEast,
						},
				})
//ПОДГОТОВИМ СПИСОК К РАСПЕЧАТКЕ
				let msgFromTable = __prepareMsg(list_3)
				if (msgFromTable == null)
						msg += '\n' + `За последние  ${minutes} мин. отправлений не было.` + '\n'
				else {
						msg += '\n' + `Отправления за последние ${minutes} мин.`
						msg += msgFromTable
				}
				msg += '\n' + `Расписание ближайших автобусов:`
				msgFromTable = __prepareMsg(list_1)
				msg += msgFromTable
				msgFromTable = __prepareMsg(list_2)
				msg += msgFromTable + '\n'

				return msg //восстановить после тестирования
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
        [ФАЙЛ - MY_FUNC.JS], [ФУНКЦИЯ - _getSchedule],
        err - ${e}`)
		}
}


async function __isDayOff(dateNow, tableDayOff) {
		const countTodayDayOff = await tableDayOff.count({
				// const {countTodayDayOff, rows} = await tableDayOff.findAndCountAll({
				where: {
						date: dateNow,
				}
		})//смотрим выходной сегодня или нет
		if (countTodayDayOff) return true
		else return false
}

async function __getArrId(recordList, tableSchedule) {
		const arrId = []
		for (let i of recordList) {
				const list_1_NextDay_ID = await tableSchedule.findOne({
						where: {
								date: i.date,
								bus: i.bus,
								// day_off: i.day_off,
								// west_to_east: i.west_to_east,
								start: i.start,
						}
				})//https://sequelize.org/docs/v6/core-concepts/model-querying-basics
				arrId.push(list_1_NextDay_ID?.id)
		}
		return arrId
}

async function __listBusesAdd(table, startTime, arrId, arrNumbers, nextDayOff, flagWestEast) {
		return await table.findAll({//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
				attributes: ['bus', 'start', [fn('min', Sequelize.col('date')), 'date'], 'day_off', 'west_to_east'],
				group: ['bus', 'start', 'day_off', 'west_to_east'],
				raw: true,
				order: [["bus", "ASC"]],//сортировка по возрастанию
				where: {
						date: {
								[Op.lt]: startTime,
						},
						bus:
								{
										[Op.notIn]: arrNumbers

								},
						day_off: nextDayOff,
						west_to_east: flagWestEast,
						id:
								{
										[Op.notIn]: arrId,

								},
				}
		})
}

function __prepareMsg(recFromTable) {
		let msg = ''
		if (recFromTable.length != 0) msg += '\n' + '№   ' + '  Время  ' + '  Начало движ.' + '\n'
		else return null

		recFromTable.sort((a, b) => a.bus - b.bus)//сортируем по возрастанию

		let busString = ''
		let busStringModified = ''

		let timeString = ''
		let timeStringModified = ''

		for (let i in recFromTable) {
				let hours = recFromTable[i].date.getHours()
				let min = recFromTable[i].date.getMinutes().toString()
				if (min.length === 1) min = '0' + min
				let time = hours + ':' + min

				busString = recFromTable[i].bus.toString()
				busStringModified = busString.padEnd(busString.length + 9 - busString.length * 2, ' ')//подгоняем что бы таблица была ровной

				timeString = time.toString()
				timeStringModified = timeString.padEnd(timeString.length + 16 - timeString.length * 2, ' ')//подгоняем что бы таблица была ровной

				msg += busStringModified + timeStringModified + recFromTable[i].start + "\n"
		}
		return msg
}

const My_Func = {
		// clMenuFill,
		_getStatistic,
		_sendNews,
		_sendMsgToUser,
		__getFirstNumberFromMessage,
		_getDateTime,
		_getDate,
		_getArrOfDatesBeforeNow,
		_compareDate,
		_prepareDateToShow,
		_getLocationBtn,
		_helpUser,
		arrUserMessages,
		_isCloseInContent,
		_isTheSameDay,
		_convertStringToDate,
		_changeKeyboad,
		_getAllProperties,
		_isDateInArray,
		// _setPath,
		// _changeTraceFlag,
		// dataOptions,
		_getSchedule
}

module.exports.My_Func = My_Func