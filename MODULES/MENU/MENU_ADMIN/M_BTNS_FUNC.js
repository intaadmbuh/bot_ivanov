const {File_Func} = require("../../FILES/FILES_FUNC");
const {My_Func} = require("../../FUNC/MY_FUNC");
const {logger} = require("../../LOGGER/LOGGER");
const fs = require("fs");
const {Keyboard} = require("grammy");
const {e} = require("../../EVENT/global");
const {Tables} = require("../../BD/PG/TABLES");
const {Table_Func} = require("../../BD/PG/TABLES_FUNC");
const {Op, fn, Sequelize} = require("sequelize");
const {TablesModels} = require("../../BD/PG/TABLES_MODELS");
// const {Keyboard} = require("grammy");

//МЕНЮ №1
async function funcBtn1(conversation, ctx, externalData) {//КНОПКА МАССОВОЙ РАССЫЛКИ СООБЩЕНИЙ


		await ctx.reply('Введи текст сообщения, которое хочешь разослать пользователям. Пришли цифру 0 - для отмены')
		const {message} = await conversation.wait();
		const msg = message?.text
		if (msg == 0) {
				await ctx.reply(`Я отменил подачу объявления`)
				return
		} else if (typeof (msg) == 'undefined') {
				await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
				return
		} else if (msg) {
				const rec = await Tables.Mod.USERS.findAll({
						where: {
								active: true
						}
				})
				if (rec === null) {
				} else
						for (let jsonKey in rec) {
								await externalData.RESET_MENU(rec[jsonKey].user_id)
								await externalData.RESET_MENU(rec[jsonKey].user_id)
						}
				await My_Func._sendNews(msg, externalData)
		}
}//КНОПКА МАССОВОЙ РАССЫЛКИ СООБЩЕНИЙ
async function funcBtn2(conversation, ctx, externalData) {//КНОПКА ПОДАЧИ ОБЪЕВЛЕНИЯ
		await ctx.reply('Пришли мне текст объявления. Пришли цифру 0 - для отмены')
		const {message} = await conversation.wait();
		const msg = message?.text
		if (msg == 0) {
				await ctx.reply(`Я отменил подачу объявления`)
				return
		} else if (typeof (msg) == 'undefined') {
				await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
				return
		}
		await ctx.reply('Пришли мне дату до которой будет висеть объявление. Формат ДД-ММ-ГГГГ. Пришли цифру 0 - для отмены')
		await ctx.reply(`Дата на сегодня ${My_Func._getDate()}`)
		let checkDate = null
		let userDate = null
		do {
				const {message} = await conversation.wait();
				userDate = message?.text
				if (userDate == 0) {
						await ctx.reply(`Я отменил подачу объявления`)
						return
				} else if (typeof (userDate) == 'undefined') {
						await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
						return
				}
				checkDate = My_Func._compareDate(userDate)
				switch (checkDate) {
						case -1:
								userDate = My_Func._prepareDateToShow(message.text)
								await ctx.reply(`Отлично!. Я принял дату ${userDate}`)

								userDate = My_Func._convertStringToDate(userDate)

								break
						case 1:
						case 2:
								await ctx.reply(`Введенная дата раньше или равна текущей. Пробуй снова.`)
								break
						case 0:
								await ctx.reply(`Неверный формат даты. Сделай еще попытку`)
								break
				}
		} while (checkDate !== -1);

		await ctx.reply(`Всё супер!. Пришли мне цифру 1 для подачи объявления. Или цифру 0 если ты передумал`)
		let userAnswer = -5
		do {
				userAnswer = await conversation.form?.number();
				if (userAnswer === 1) break
				if (userAnswer === 0) {
						await ctx.reply(`Ну передумал так передумал. Может в следующий раз`)
						return
				}
		} while (userAnswer < 0)
		await externalData.MENU_MAIN.destroy({
				where: {
						num: 5,
				}
		})

		const [rec, created] = await externalData.MENU_MAIN.findOrCreate({
				where: {
						num: 5, //В ТАБЛИЦЕ МОДЕЛЕЙ TABLES_MODELS  В ХУКАХ ОПИСАНА ЭТА ЦИФРА
						date: userDate,
				}
		})
		if (rec) {
				await ctx.reply(`Объявление опубликовано`)
				// await e.emit('RenderMenuBottom', ctx)//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		}
		// setTimeout(() => {
		// 		externalData.changeMenuBottom(ctx)
		// }, 5 * 2000);

		await fs.writeFile(rec.file_text,
				msg,
				'utf8',
				(err) => {
						if (err) return false
				})
}//ОБЪЯВЛЕНИЕ
async function funcBtn3(conversation, ctx, externalData) {//ПОЛУЧЕНИЕ СТАТИСТИКИ
		await My_Func._getStatistic(ctx, externalData.TABLE_USERS)
}//ПОЛУЧЕНИЕ СТАТИСТИКИ
async function funcBtn4(conversation, ctx, externalData) {
}//КНОПКА ПЕРЕХОДА В МЕНЮ РЕДАКТИРОВАНИЯ РАСПИСАНИЯ
async function funcBtn5(conversation, ctx, externalData) {
}//КНОПКА ПЕРЕХОДА В МЕНЮ РЕДАКТИРОВАНИЯ БД
//МЕНЮ №2
async function funcBtn6(conversation, ctx, externalData) {//кнопка маршрута
		let userAnswer = -5
		do {
				userAnswer = await conversation.form.number();
				this.result = userAnswer
				if (userAnswer > 0)
						await ctx.reply(`Отлично!. Я принял маршрут №${this.result}`)
				else if (userAnswer === 0) {
						this.result = null
						await ctx.reply(`Отменил ввод маршрута`)
						return
				}
		} while (userAnswer < 0)
		const rec = await externalData.MENU_SCHEDULE_NEW.findAll({
				where: {
						num: userAnswer,
				}
		})
		if (rec.length) {
				await ctx.reply('Такая запись уже есть в базе. Удали её сначала')
				this.result = null
				return
		}
}//ПРИНИМАЕМ НОМЕР МАРШРУТА//ДАННЫЕ ДЛЯ КНОПКИ 9
async function funcBtn7(conversation, ctx, externalData) {//КНОПКА ДАТЫ ПРИ ВВОДЕ НОВОГО МАРШРУТА
		await ctx.reply(`Пришли мне 0 для отмены ввода. Формат ДД-ММ-ГГГГ. Дата на сегодня ${My_Func._getDate()}`)
		let checkDate = null
		do {
				const {message} = await conversation.wait();
				const userAnswer = message?.text
				if (userAnswer == 0) {
						this.result = 0
						await ctx.reply(`Я отменил ввод даты`)
						return
				} else if (typeof (userAnswer) == 'undefined') {
						await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
						return
				}
				checkDate = My_Func._compareDate(userAnswer)
				switch (checkDate) {
						case -1:
						case 2:
								this.result = My_Func._prepareDateToShow(userAnswer)
								await ctx.reply(`Отлично!. Я принял дату ${this.result}`)
								this.result = My_Func._convertStringToDate(this.result)
								return
						case 1:
								await ctx.reply(`Введенная дата раньше текущей. Пробуй снова.`)
								break
						case 0:
								await ctx.reply(`Неверный формат даты. Сделай еще попытку`)
								break
				}
		} while (true);
}//ПРИНИМАЕМ ДАТУ//ДАННЫЕ ДЛЯ КНОПКИ 9
async function funcBtn8(conversation, ctx, externalData) {//ПРИНИМАЕМ ФАЙЛ РАСПИСАНИЯ
		do {
				ctx = await conversation.wait();
				if (ctx.message?.text == 0) {
						this.result = 0
						await ctx.reply("Я отменил ввод файла");
						return
				}
		} while (!ctx.message?.photo);
		const pathFile = './src/pic/tmp.jpg'
		const res = await File_Func._saveFile(ctx, pathFile)//
		if (res) {
				this.result = pathFile
				await ctx.reply(`Отлично. Я принял файл и временно сохранил его`)
		}
}//ПРИНИМАЕМ ФАЙЛ РАСПИСАНИЯ//ДАННЫЕ ДЛЯ КНОПКИ 9
async function funcBtn9(conversation, ctx, externalData) {
		for (let i = 6; i < 9; i++) //проверка на полноту введенных данных
				if (!this.getAccessToOtherBtns.get(i).result) {
						await ctx.reply('Нехватает данных')
						return
				}
		ctx.reply('Пришли мне код.')
		ctx.reply('Код - 1. Расписание будет опубликовано в разделе НОВЫЕ РАСПИСАНИЯ и в указанную дату будет перенесено в действующие расписания.')
		ctx.reply('Код - 2. Расписание или объявление будет опубликовано в разделе НОВЫЕ РАСПИСАНИЯ и в указанную дату будет удалено везде.')
		ctx.reply('Код - 0. Удаление записи если ты её сделал')
		let flag = true
		let code = 5
		do {
				code = await conversation.form.number();
				switch (code) {
						case 0:
						case 1:
						case 2:
								flag = false
				}
		} while (flag);
		await ctx.reply(`Отлично!. Я принял код-${code}`)
		switch (code) {
				case 0:
						try {
								const rec = await externalData.MENU_SCHEDULE_NEW.findAll({
										where: {
												num: this.getAccessToOtherBtns.get(6).result,
										}
								})
								if (!rec.length) {
										await ctx.reply('Такой записи нет в базе')
										return
								} else
										for (let i in rec) {
												rec[i].num = null
												await rec[i].save()
												await ctx.reply('Такая запись в базе была. Я установил ей нулевой номер. Она будет удалена автоматически')
												this.result = null
										}
						} catch (e) {
								await ctx.reply('Ошибка в удалении записи из БД')
								logger.error(`[${My_Func._getDateTime()}],
								[ФАЙЛ - M_BTNS_FUNC.JS], [ФУНКЦИЯ - 5й кнопки меню администратора КОД - 0],
								[err - ${e}]`)
						}
						break
				case 1:
				case 2:
						try {
								const [rec, created] = await externalData.MENU_SCHEDULE_NEW.findOrCreate({
										where: {
												num: this.getAccessToOtherBtns.get(6).result,
												date: this.getAccessToOtherBtns.get(7).result,
												code: code,
										}
								})
								if (created) {
										await ctx.reply(`Запись в базу добавлена с кодом - ${code}.`)
										// await e.emit('RenderMenuBottom', ctx)
										this.result = 1
								} else await ctx.reply(`Такая запись в базе уже есть. Удали запись сначала`)
						} catch (e) {
								await ctx.reply('Ошибка создания записи в базе новых расписаний')
								logger.error(`[${My_Func._getDateTime()}],
								[ФАЙЛ - M_BTNS_FUNC.JS], [ФУНКЦИЯ - 9й кнопки меню администратора КОД 1 или 2],
								[err - ${e}]`)
						}
						break
		}
}//ОПУБЛИКОВАТЬ ИЗМЕНЕНИЯ В БД//ПРОВЕРЯЕМ ДАННЫЕ ИЗ КНОПОК 6,7,8
//МЕНЮ №3
async function funcBtn10(conversation, ctx, externalData) {
		const table = externalData.MENU_SCHEDULE_NEW
		await __delRecInTable(conversation, ctx, table)
}//ЭТО КНОПКА УДАЛЕНИЯ ДАННЫХ ИЗ ТАБЛИЦЫ "НОВЫЙ РАСПИСАНИЙ"
async function funcBtn11(conversation, ctx, externalData) {//ЭТО КНОПКА УДАЛЕНИЯ ДАННЫХ ИЗ ТАБЛИЦЫ "СТАРЫХ РАСПИСАНИЙ"
		const table = externalData.MENU_SCHEDULE_OLD
		await __delRecInTable(conversation, ctx, table)
}//ЭТО КНОПКА УДАЛЕНИЯ ДАННЫХ ИЗ ТАБЛИЦЫ "СТАРЫХ РАСПИСАНИЙ"
async function funcBtn12(conversation, ctx, externalData) {
		const table = externalData.MENU_MAIN
		await __delRecInTable(conversation, ctx, table)
}//КНОПКА УДАЛЕНИЯ ДАННЫХ ИЗ ГЛАВНОГО НИЖНЕГО МЕНЮ

async function funcBtn13(conversation, ctx, externalData) {
}//КНОПКА ПЕРЕХОДА В МЕНЮ ПРОИЗВОДСТВЕННОГО КАЛЕНДАРЯ
async function funcBtn14(conversation, ctx, externalData) {
		do {
				ctx = await conversation.wait();
				if (ctx.message?.text == 0) {
						this.result = 0
						await ctx.reply("Я отменил ввод файла");
						return
				}
		} while (!ctx.message?.document)
		const pathFile = './src/json/calendar.jpg'//нормально можно только медиа файлы сохранить
		const res = await File_Func._saveFile(ctx, pathFile)
		if (res) {
				this.result = pathFile
				await ctx.reply(`Отлично. Я принял файл и временно сохранил его`)
		}
}//КНОПКА ВВОДА ФАЙЛА ПРОПРОИЗВОДСТВЕННОГО КАЛЕНДАРЯ
async function funcBtn15(conversation, ctx, externalData) {//здесь используем данные из 14й функции
		let userAnswer = -6
		ctx.reply('Пришли мне цифру 1 для занесения данных в базу. 0 - отмена')
		do {
				userAnswer = await conversation.form.number();
				this.result = userAnswer

				if (userAnswer === 0) {
						this.result = null
						await ctx.reply(`Отменил операцию`)
						return
				}
				if (userAnswer !== 1) ctx.reply('Пришли мне цифру 1 для занесения данных в базу. 0 - отмена')
		} while (userAnswer !== 1)

		if (!this.getAccessToOtherBtns.get(14).result) {
				await ctx.reply('Нехватает данных')
				this.result = null
				return
		}
		const pathFile = this.getAccessToOtherBtns.get(14).result//нормально можно только медиа файлы сохранить
		// const pathFile = './src/json/calendar.jpg'//нормально можно только медиа файлы сохранить
		const res = await Table_Func._tablesDayOffInit(pathFile, externalData.DAY_OFF)

		switch (+res) {
				case -1:
						ctx.reply('Все отлично занес данные в базу. Количество записей в базе совпало с данными из файла')
						return
				case -2:
						ctx.reply('Проблемы с чтением данных из файла. Проверь структуру JSON объекта')
						return
				default:
						ctx.reply('Количество записей которые я занес в таблицу не совпадает с количеством выходных.')
						return
		}


}//КНОПКА ПЕРЕНОСА В ТАБЛИЦУ ДАННЫХ ИЗ ФАЙЛА JSON
async function funcBtn16(conversation, ctx, externalData) {//КНОПКА ВНЕСТИ ДАТУ ВЫХОДНОГО/ПРАЗДНИЧНОГО ДНЯ
		await ctx.reply('Пришли мне дату. Формат ДД-ММ-ГГГГ. Дата должна быть больше или равна текущей. Пришли цифру 0 - для отмены')
		await ctx.reply(`Дата на сегодня ${My_Func._getDate()}`)
		let checkDate = null
		let userDate = null
		let flag = true
		do {
				const {message} = await conversation.wait();
				userDate = message?.text
				if (userDate == 0) {
						await ctx.reply(`Я отменил ввод даты`)
						return
				} else if (typeof (userDate) == 'undefined') {
						await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
						return
				}
				checkDate = My_Func._compareDate(userDate)
				switch (checkDate) {
						case -1://позже текущей даты
						case 2://равна текущей дате
								userDate = My_Func._prepareDateToShow(message.text)
								await ctx.reply(`Отлично!. Я принял дату ${userDate}`)
								userDate = My_Func._convertStringToDate(userDate)
								flag = false
								const [rec, created] = await externalData.DAY_OFF.findOrCreate({
										where: {
												date: userDate,
										}
								})
								if (rec)
										await ctx.reply(`Отлично!. Я добавил в таблицу выходных дней эту дату ${userDate}`)
								break
						case 1:
								await ctx.reply(`Введенная дата раньше текущей. Пробуй снова.`)
								break
						case 0:
								await ctx.reply(`Неверный формат даты. Сделай еще попытку`)
								break
				}
		} while (flag);

}//КНОПКА ВНЕСТИ ДАТУ

async function funcBtn17(conversation, ctx, externalData) {//КНОПКА УДАЛИТЬ ДАТУ
		let userAnswer = -6
		let flag = true
		let msg = 'Не выбран месяц для редактирования выходных дней';

		if (!this.getAccessToOtherBtns.get(18).result) {
				await ctx.reply(msg)
				return
		} else {
				msg = ''
				ctx.reply('Номера строк, которые ты запрашивал на просмотр')
				for (let i of this.getAccessToOtherBtns.get(18).result)//тут храним номера записей в таблице выходных которые запросили на просмотр
						msg = msg + '\n' + `${i}`
				await ctx.reply(msg)
		}

		do {
				await ctx.reply(`Пришли мне номер строки для удаления. Строка с этой датой будет удалена. Цифра 0 - отмена. -29 все записи.`)
				userAnswer = await conversation.form.number();
				this.result = userAnswer

				if (this.getAccessToOtherBtns.get(18).result.includes(userAnswer.toString())) {
						flag = false
						await ctx.reply(`Отлично!. Я принял номер:  ${this.result}`)
						await externalData.DAY_OFF.destroy({
								where: {
										id: userAnswer,
								}
						})
						await ctx.reply('Запись удалил. Проверь таблицу выходных дней')
						this.result = null
						return
				} else if (userAnswer === -29) {
						this.result = null
						await externalData.DAY_OFF.destroy({where: {}, truncate: true})
						await ctx.reply(`Удалил все записи. Проверь таблицу выходных дней`)
						return
				} else if (userAnswer === 0) {
						this.result = null
						await ctx.reply(`Отменил операцию удаления`)
						return
				}
		} while (flag)
}//КНОПКА УДАЛИТЬ ДАТУ. ТУТ ИСПОЛЬЗУЕМ ДАННЫЕ ИЗ КНОПКИ 18
async function funcBtn18(conversation, ctx, externalData) {//КНОПКА ПРОСМОТРЕТЬ МЕСЯЦ ВЫХОДНЫХ
		await ctx.reply('Пришли мне дату. Формат ДД-ММ-ГГГГ. Дата должна быть больше или равна текущей. Пришли цифру 0 - для отмены')
		await ctx.reply(`Дата на сегодня ${My_Func._getDate()}`)
		let checkDate = null
		let userDate = null
		let flag = true
		do {
				const {message} = await conversation.wait();
				userDate = message?.text
				if (userDate == 0) {
						await ctx.reply(`Я отменил ввод даты`)
						return
				} else if (typeof (userDate) == 'undefined') {
						await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
						return
				}
				checkDate = My_Func._compareDate(userDate)
				switch (checkDate) {
						case -1://позже текущей даты
						case 2://равна текущей дате
								userDate = My_Func._prepareDateToShow(message.text)
								await ctx.reply(`Отлично!. Я принял дату ${userDate}`)
								userDate = My_Func._convertStringToDate(userDate)
								flag = false
								break
						case 1:
								await ctx.reply(`Введенная дата раньше текущей. Пробуй снова.`)
								break
						case 0:
								await ctx.reply(`Неверный формат даты. Сделай еще попытку`)
								break
				}
		} while (flag);

		const startOfMonth = new Date(Date.UTC(userDate.getFullYear(), userDate.getMonth()))
		const endOfMonth = new Date(startOfMonth);
		endOfMonth.setMonth(endOfMonth.getMonth() + 1);
		endOfMonth.setDate(0);

		const {count, rows} = await externalData.DAY_OFF.findAndCountAll({
				where: {
						// user_id: idUser
						date: {
								[Op.between]: [startOfMonth, endOfMonth],//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
						}
				}
		})
		let msg = `В таблице нет записей`
		if (count) {
				msg = ''
				const arr = []
				for (let i in rows) {
						msg = msg + '\n' + `${rows[i].id}` + ' : ' + `${rows[i].date}`
						arr.push(rows[i].id)
				}
				this.result = arr
				console.log(this.result)
				await ctx.reply(msg)
				return
		}

		await ctx.reply(`В таблице нет записей на введенную тобой дату`)

}//КНОПКА ПРОСМОТРЕТЬ МЕСЯЦ ВЫХОДНЫХ//ГОТОВИМ ДАННЫЕ ДЛЯ КНОПКИ 17
async function funcBtn19(conversation, ctx, externalData) {//КНОПКА ВВОДА ФАЙЛА РАСПИСАНИЙ EXEL
		do {
				ctx = await conversation.wait();
				if (ctx.message?.text == 0) {
						this.result = 0
						await ctx.reply("Я отменил ввод файла");
						return
				}
		} while (!ctx.message?.document)

		const pathFile = './src/xlsx/schedules.jpg'//нормально можно только медиа файлы сохранить
		const res = await File_Func._saveFile(ctx, pathFile)

		if (res) {
				this.result = pathFile
				await ctx.reply(`Отлично. Подожди немного я пытаюсь обработать файл`)
		}

		if (await Table_Func._tablesSchedulesInit(pathFile, externalData.SCHEDULES) === -1) {
				ctx.reply('Возникли проблемы с занесением данных в таблицу')
				this.result = null
				return
		}
		await ctx.reply(`Данные в базу занес`)
		const {count, rows} = await externalData.SCHEDULES.findAndCountAll()
		if (count)
				ctx.reply(`Количество записей, которые находятся в таблице ` + count)
}//КНОПКА ВВОДА ФАЙЛА РАСПИСАНИЙ EXEL
async function funcBtn20(conversation, ctx, externalData) {//СФОРМИРОВАТЬ ТАБЛИЦУ РАСПИСАНИЙ НА ГОД
		await ctx.reply(`Дата на сегодня ${My_Func._getDate()}`)
		let checkDate = null
		let flag = true

		do {
				const {message} = await conversation.wait();
				const userAnswer = message?.text
				if (userAnswer == 0) {
						this.result = 0
						await ctx.reply(`Я отменил ввод даты`)
						return
				} else if (typeof (userAnswer) == 'undefined') {
						await ctx.reply('Слишком часто жмешь на клавиши. Не спеши. Всё успеем). Выбери пункт меню еще раз')
						return
				}
				checkDate = My_Func._compareDate(userAnswer)
				switch (checkDate) {
						case -1:
						case 2:
								this.result = My_Func._prepareDateToShow(userAnswer)
								await ctx.reply(`Отлично!. Я принял дату ${this.result}`)
								this.result = My_Func._convertStringToDate(this.result)
								flag = false
								break
						case 1:
								await ctx.reply(`Введенная дата раньше текущей. Пробуй снова.`)
								break
						case 0:
								await ctx.reply(`Неверный формат даты. Сделай еще попытку`)
								break
				}
		} while (flag);

		let recDateStartFirstShift = await externalData.SCHEDULES.findOne({//Найдем минимальное значение даты. Начало дня
				attributes: [[fn('min', Sequelize.col('date')), 'date']],
		})
		if (recDateStartFirstShift === null) {
				ctx.reply(`В таблице расписаний не нашел ни одной записи`)
				return null
		}//проверка на не пустотность таблицы расписаний
		const emptyDayOffTable = await externalData.DAY_OFF.count({
				where: {
						date: {
								[Op.gte]: this.result,//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
						}
				}, // Пустое где означает все записи
		});//проверка на не пустотность таблицы выходных
		if (emptyDayOffTable === 0) {
				ctx.reply('В таблице выходных дней нет ни одной записи о выходных днях позже введенной даты. Расписание может быть некорректным. 0 - отмена. 1 - дальше')
				let flag = true
				do {
						const {message} = await conversation.wait();
						const userAnswer = message?.text
						if (userAnswer == 0) {
								this.result = 0
								await ctx.reply(`Понял. Отмена`)
								return
						} else flag = false
				} while (flag) ;
		}
		ctx.reply('Работаем братья')
		await externalData.YEAR_SCHEDULES.destroy({where: {}, truncate: true})

		const startDate = this.result

		const dateEndOfYear = new Date(startDate.getFullYear(), 11, 31);
		let isDayOff = false

		let recDayOff

		let listBuses_1
		let listBuses_2
		let dayOfWeek

		let recDateStartFirstBus = await externalData.SCHEDULES.findOne({//Найдем минимальное значение даты. Начало дня
				attributes: [[fn('min', Sequelize.col('date')), 'date']],
		})
		let tableBusDataStart = new Date(recDateStartFirstBus.date)
		tableBusDataStart.setHours(0)
		tableBusDataStart.setMinutes(0)
		tableBusDataStart.setSeconds(0)
		tableBusDataStart.setMilliseconds(0)


		const tableBusDataEnd = new Date(tableBusDataStart.getTime() + (1000 * 60 * 60 * 24));
		let nextDate

		for (let currentDate = startDate; currentDate <= dateEndOfYear; currentDate.setDate(currentDate.getDate() + 1)) {

				dayOfWeek = currentDate.toLocaleString('default', {weekday: 'long'});
				recDayOff = await externalData.DAY_OFF.findOne({
						where: {
								date: currentDate,
						}
				})
				isDayOff = !!recDayOff;

				listBuses_1 = await externalData.SCHEDULES.findAll({//вносим с даты, начиная с первых утренних рейсов. Ночные рейсы со вчера не попадут
						where: {//что бы они попали в этот день нужно вводить с даты на день раньше.
								day_off: isDayOff,
								date: {
										[Op.gte]: tableBusDataStart,
										[Op.lt]: tableBusDataEnd,
								}
						}
				})
				await __addRecsFromList(listBuses_1, externalData.YEAR_SCHEDULES, currentDate, dayOfWeek, isDayOff)

				listBuses_2 = await externalData.SCHEDULES.findAll({//вносим с даты, начиная с первых утренних рейсов. Ночные рейсы со вчера не попадут
						where: {//что бы они попали в этот день нужно вводить с даты на день раньше.
								day_off: isDayOff,
								date: {
										[Op.gte]: tableBusDataEnd,
								}
						}
				})
				nextDate = new Date(currentDate)
				nextDate.setDate(currentDate.getDate() + 1)
				nextDate.setHours(0)
				nextDate.setMinutes(0)
				nextDate.setSeconds(0)
				dayOfWeek = nextDate.toLocaleString('default', {weekday: 'long'});
				await __addRecsFromList(listBuses_2, externalData.YEAR_SCHEDULES, nextDate, dayOfWeek, isDayOff)

				// if (__isLastDateOfYear(currentDate)) break;
		}

}//СФОРМИРОВАТЬ ТАБЛИЦУ РАСПИСАНИЙ НА ГОД

function __isLastDateOfYear(date) {
		const lastDayOfYear = new Date(date.getFullYear(), 11, 31); // Последний день предыдущего года
		return date.getTime() === lastDayOfYear.getTime();
}

async function __addRecsFromList(list, table, currentDate, dayOfWeek, isDayOff) {
		let tmpConvertDate = currentDate
		if (list) {
				for (let i of list) {
						tmpConvertDate.setHours(i.date.getHours())
						tmpConvertDate.setMinutes(i.date.getMinutes())
						tmpConvertDate.setSeconds(i.date.getSeconds())
						const [rec, created] = await table.findOrCreate({
								where: {
										date: tmpConvertDate,
										bus: i.bus,
										start: i.start,
										west_to_east: i.west_to_east,
										week_day: dayOfWeek,
										day_off: isDayOff,
										last_bus: i.last_bus,
								}
						})
				}
		}
}


//******************************************************************************************************************************
//****КНОПКА ЗАКРЫТИЯ МЕНЮ*****************
async function funcBtn21(conversation, ctx, externalData) {
}//****КНОПКА ЗАКРЫТИЯ МЕНЮ*****************
//ВНУТРЕНЯЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ЗАПИСИ ИЗ ТАБЛИЦЫ
async function __delRecInTable(conversation, ctx, table) {//ВНУТРЕНЯЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ЗАПИСИ ИЗ ТАБЛИЦЫ
		const rec = await table.findAll()
		if (!rec.length) {
				ctx.reply(`Таблица пуста`)
				return
		}
		await ctx.reply(`Данные которые находятся в таблице:`)
		let j = 0
		for (let i in rec)
				await ctx.reply(`${++j}. №№${rec[i].num}. ${rec[i].cmd}. Дата ввода: ${rec[i].date}. Код обработки:${rec[i].code}`)

		await ctx.reply(`Пришли мне цифру после №№. Строка с этими данными будет удалена. Цифра 0 - отмена`)

		let userAnswer = -6//ЧИСЛО ОТ БАЛДЫ ДЛЯ ТОГО ЧТО БЫ ЦИКЛ РАБОТАЛ
		let flag = false
		do {
				userAnswer = await conversation.form.number();
				this.result = userAnswer
				if (userAnswer > 0) {
						for (let i in rec) {
								if (userAnswer == rec[i].num) flag = true// ИЗ БАЗЫ ПОЛУЧИМ STRING
								if (flag) {
										await ctx.reply(`Отлично!. Я принял №№${this.result}`)
										await rec[i].destroy()
										await ctx.reply(`Запись в базе удалена`)
										// await e.emit('RenderMenuBottom', ctx)                 //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
										this.result = null
										return
								}
						}
						await ctx.reply(`Такой записи нет в таблице. Попробуй еще раз. Сосредоточься`)
						userAnswer = -6
				} else if (userAnswer === 0) {
						this.result = null
						await ctx.reply(`Отменил ввод №№`)
						return
				}
		} while (userAnswer < 0)
}//ВНУТРЕНЯЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ЗАПИСИ ИЗ ТАБЛИЦЫ
// Исходный массив


const M_BTN_FUNC = [
		funcBtn1,//КНОПКА МАССОВОЙ РАССЫЛКИ СООБЩЕНИЙ
		funcBtn2,//ОБЪЯВЛЕНИЕ
		funcBtn3,//ПОЛУЧЕНИЕ СТАТИСТИКИ
		funcBtn4,//ВНЕСТИ ИЗМ В РАСП
		funcBtn5,//УДАЛИТЬ ИЗ БД

		funcBtn6,//МАРШРУТ
		funcBtn7,//ДАТА
		funcBtn8,//ФАЙЛ
		funcBtn9,//ОПУБЛИКОВАТЬ

		funcBtn10,//ЭТО КНОПКА УДАЛЕНИЯ ДАННЫХ ИЗ ТАБЛИЦЫ "НОВЫХ РАСПИСАНИЙ"
		funcBtn11,//ЭТО КНОПКА УДАЛЕНИЯ ДАННЫХ ИЗ ТАБЛИЦЫ "ДЕЙСТВУЮЩИХ РАСПИСАНИЙ"
		funcBtn12,//ЭТО КНОПКА УДАЛЕНЯ ДАННЫХ ИЗ ТАБЛИЦЫ ГЛАВНОГО НИЖНЕГО МЕНЮ

		funcBtn13,//ПЕРЕХОД В МЕНЮ ПРОИЗВОДСТВЕННОГО КАЛЕНДАРЯ
		funcBtn14,//ВВОД ФАЙЛА JSON ПРОПРОИЗВОДСТВЕННОГО КАЛЕНДАРЯ
		funcBtn15,//ЗАПИСЬ ДАННЫХ ИХ ФАЙЛА JSON В БД
		funcBtn16,//УДАЛЕНИЕ ДАННЫХ ИЗ ТАБЛИЦЫ ВЫХОДНЫХ ДНЕЙ
		funcBtn17,//ВНЕСЕНИЕ ДАННЫХ В ТАБЛИЦУ ВЫХОДНЫХ ДНЕЙ
		funcBtn18,//ПРОСМОТР ДАННЫХ ИЗ ТАБЛИЦЫ ВЫХОДНЫХ ДНЕЙ
		funcBtn19,//ВВОД ФАЙЛА РАСПИСАНИЙ EXEL
		funcBtn20,//СФОРМИРОВАТЬ ТАБЛИЦУ РАСПИСАНИЙ НА ГОД


		funcBtn21,//КНОПКА закрыть
]
module.exports.M_BTN_FUNC = M_BTN_FUNC