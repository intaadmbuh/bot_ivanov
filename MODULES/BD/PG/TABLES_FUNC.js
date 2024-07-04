//ВАЖНО. ЗАПИСЬ СОХРАНЯТЬ ЗАПИСЬ НУЖНО ПОСЛЕ КАЖДОГО ПРИСВАИВАНИЯ НОВОГО ЗНАЧЕНИЯ ПОЛЯ

const {logger} = require("../../LOGGER/LOGGER");
const {My_Func} = require("../../FUNC/MY_FUNC");
const {TablesModels} = require("./TABLES_MODELS");
const {Op, DataTypes} = require("sequelize");
const {File_Func} = require("../../FILES/FILES_FUNC");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");

// const readXlsxFile = require("read-excel-file");


async function _dbAddUserMsg(ctx, table) {
		try {
				const user_ID = ctx.chat.id
				const rec = await table.create({
						user_id: user_ID,
						msg: ctx.message.text,
						update_id: ctx.update.update_id,
						message_id: ctx.update.message.message_id,
						userUserId: user_ID,
				})
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_dbAddUserMsg],
				[USER ID - ${ctx.chat.id}]
				[err - ${e}]`)
		}
}

async function _dbAddUserLoc(ctx, table, minDist, nameBusStop) {
		try {
				const user_ID = ctx.chat.id
				const rec = await table.create({
						user_id: user_ID,
						bus_stop: nameBusStop,
						latitude: ctx.message.location.latitude,
						longitude: ctx.message.location.longitude,
						minDist: minDist,
						update_id: ctx.update.update_id,
						message_id: ctx.update.message.message_id,
						userUserId: user_ID,
				})
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_dbAddUserLoc],
				[USER ID - ${ctx.chat.id}]
				[err - ${e}]`)
		}
}

async function _dbAddUser(ctx, table) {
		//ЗДЕСЬ ОБЪЯВЛЯЮ ДАННЫЕ ПОТОМУ ЧТО ДИНАМИЧЕСКИ ПОСЛЕ ВЫЗОВА ЗАПРОСА ДАННЫЕ CTX СТИРАЮТСЯ
		const user_ID = ctx.chat.id
		const user_FirstName = ctx.chat.first_name
		const user_LastName = ctx.chat.last_name
		const user_language_code = ctx.message.from.language_code
		try {
				const [rec, created] = await table.findOrCreate({
						where: {
								user_id: user_ID,//ИЩЕМ ТОЛЬКО ПО ID МАЛО ЛИ ЮЗЕР ПОМЕНЯЛ ФИО
						}
				})
				if (created) {
						await ctx.reply('ДОБРО ПОЖАЛОВАТЬ В МОЮ КОМАНДУ!', user_ID)//отправляем в чат пользователю сообщение добро пожаловать
				}
				if (rec.active === false) {
						rec.active = true
						await rec.save()
						await ctx.reply('С ВОЗВРАЩЕНИЕМ В КОМАНДУ', user_ID)//отправляем в чат пользователю сообщение добро пожаловать
				}
				rec.first_name = user_FirstName
				await rec.save()
				rec.last_name = user_LastName
				await rec.save()
				rec.language_code = user_language_code
				await rec.save()
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_dbAddUser],
				[USER ID - ${ctx.chat.id}]
				[err - ${e}]`)
		}
}

//********************************************************
class clResult {
		ALL = 0
		ACTIV = 0
		PASSIVE = 0
		USERS_ID_ARR = []

		reset() {
				this.ALL = 0
				this.ACTIV = 0
				this.PASSIVE = 0
				this.USERS_ID_ARR.length = 0
		}
}

async function _dbGetIdAllUsers(table, result) {
		try {
				const rec = await table.findAll()
				result.ALL = rec.length

				for (let jsonKey in rec)
						result.USERS_ID_ARR.push(rec[jsonKey].user_id)

				const {count, rows} = await table.findAndCountAll({
						where: {
								active: true
						}
				})
				result.ACTIV = count
				result.PASSIVE = result.ALL - result.ACTIV
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_dbGetIdAllUsers],
				[err - ${e}]`)
		}
}

async function _dbIsUser(idUser, table) {
		const {count, rows} = await table.findAndCountAll({
				where: {
						user_id: idUser
				}
		})
		if (count) return true
		else return false
}


async function _dbSetActiveAllUsers(table) {
		try {
				const rec = await table.findAll({
						where: {
								active: false
						}
				})
				if (rec === null) {
				} else
						for (let jsonKey in rec) {
								rec[jsonKey].active = true
								await rec[jsonKey].save()
						}
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_dbSetActiveAllUsers],
				[err - ${e}]`)
		}
}

async function _dbSetPassiveUser(id, table) {
		try {
				let rec = await table.findOne({
						where: {
								user_id: id
						}
				})
				if (rec != null) {
						rec.active = false
						await rec.save()
				}
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_dbSetPassiveUser],
				[err - ${e}]`)
		}
}

async function _db_CountCmd(ctx, table) {
		//ЗДЕСЬ ОБЪЯВЛЯЮ ДАННЫЕ ПОТОМУ ЧТО ДИНАМИЧЕСКИ ПОСЛЕ ВЫЗОВА ЗАПРОСА ДАННЫЕ CTX СТИРАЮТСЯ
		const user_ID = ctx.chat.id
		try {
				const [rec, created] = await table.findOrCreate({
						where: {
								user_id: user_ID,//ИЩЕМ ТОЛЬКО ПО ID МАЛО ЛИ ЮЗЕР ПОМЕНЯЛ ФИО
								msg: ctx.message.text,
						}
				})
				if (created) {
				}
				rec.i = +rec.i + 1// ЧЕРЕЗ + ПРЕОБРАЗОВАЛИ ЗНАЧЕНИЯ ПОЛЯ ТАБЛИЦЫ В ЧИСЛО
				await rec.save()
				rec.userUserId = user_ID//внесли значения внешнего ключа
				await rec.save()
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_db_CountCmd],
				[USER ID -${user_ID}]
				[err - ${e}]`)
		}
}

const _tablesMenuInit = async () => {
		// await TablesModels.MENU_MAIN.destroy({
		// 		where:{
		// 				num: {[Op.ne]: null}
		// 		}
		// })
		//временное заполнение главного нижнего меню
		await TablesModels.MENU_MAIN.findOrCreate({
				where: {
						num: 1,
				}
		})
		await TablesModels.MENU_MAIN.findOrCreate({
				where: {
						num: 2,
				}
		})
		await TablesModels.MENU_MAIN.findOrCreate({
				where: {
						num: 3,
				}
		})
		await TablesModels.MENU_MAIN.findOrCreate({
				where: {
						num: 4,
				}
		})
// временное заполнение действующих расписаний
		await TablesModels.MENU_SCHEDULE_OLD.findOrCreate({
				where: {
						num: '1',
				}
		})
		await TablesModels.MENU_SCHEDULE_OLD.findOrCreate({
				where: {
						num: '3',
				}
		})
		await TablesModels.MENU_SCHEDULE_OLD.findOrCreate({
				where: {
						num: '5',
				}
		})
		await TablesModels.MENU_SCHEDULE_OLD.findOrCreate({
				where: {
						num: '101',
				}
		})
//временное заполнение меню выбора между новым и старым расписанием
		await TablesModels.MENU_SW_OLD_NEW_SCH.findOrCreate({
				where: {
						num: 1,
				}
		})
		await TablesModels.MENU_SW_OLD_NEW_SCH.findOrCreate({
				where: {
						num: 2,
				}
		})
		//временное заполнение меню БЛИЖАЙШИЙ
		await TablesModels.MENU_NEAREST.findOrCreate({
				where: {
						num: 1,
				}
		})
		await TablesModels.MENU_NEAREST.findOrCreate({
				where: {
						num: 2,
				}
		})
		//временное заполнение меню РАЗНОЕ
		await TablesModels.MENU_MISC.findOrCreate({
				where: {
						num: 1,
				}
		})
		await TablesModels.MENU_MISC.findOrCreate({
				where: {
						num: 2,
				}
		})
		await TablesModels.MENU_MISC.findOrCreate({
				where: {
						num: 3,
				}
		})
		await TablesModels.MENU_MISC.findOrCreate({
				where: {
						num: 4,
				}
		})
		// временное заполнение новых расписаний
		// await TablesModels.MENU_SCHEDULE_NEW.findOrCreate({
		// 		where: {
		// 				num: 1,
		// 				// date:'05-03-2024',
		// 		}
		// })
		// await TablesModels.MENU_SCHEDULE_NEW.findOrCreate({
		// 		where: {
		// 				num: 5,
		// 				// date:'05-03-2024',
		// 		}
		// })
		// await TablesModels.MENU_SCHEDULE_NEW.findOrCreate({
		// 		where: {
		// 				num: 3,
		// 				// date:'05-03-2024',
		// 		}
		// })
		// await TablesModels.MENU_SCHEDULE_NEW.findOrCreate({
		// 		where: {
		// 				num: 101,
		// 				// date:'05-03-2024',
		// 		}
		// })
}

//ВРЕМЕННОЕ ЗАПОЛНЕНИЕ ГЛАВНОГО НИЖНЕГО МЕНЮ
const _tablesAdminPanelBtnsInit = async () => {
		await TablesModels.ADMIN_PANEL_BTNS.destroy({
				where: {
						num: {[Op.ne]: null}
				}
		})
		//РАССЫЛКА НОВОСТИ
		const [rec1, created1] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 1,
				}
		})
		rec1.caption = 'Рассылка новости'
		rec1.msg = 'Рассылка новости'
		await rec1.save()
		//ОБЪЯВЛЕНИЕ
		const [rec2, created2] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 2,
				}
		})
		rec2.caption = 'Объявление'
		rec2.msg = 'Объявление'
		await rec2.save()
		//ПОЛУЧИТЬ СТАТИСТИКУ
		const [rec3, created3] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 3,
				}
		})
		rec3.caption = 'Получить статистику'
		rec3.msg = 'Получить статистику'
		await rec3.save()
//ВНЕСТИ ИЗМЕНЕНИЯ В РАСПИСАНИЕ - КНОПКА ПЕРЕХОДА
		const [rec4, created4] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 4,
				}
		})
		rec4.caption = 'Внести изм. в расп.'
		rec4.msg = 'Переход в подменю'
		await rec4.save()
//УДАЛИТЬ ИЗ БД - КНОПКА ПЕРЕХОДА
		const [rec5, created5] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 5,
				}
		})
		rec5.caption = 'Удалить из БД'
		rec5.msg = 'Переход в подменю'
		await rec5.save()

		//МЕНЮ 2
// МАРШРУТ
		const [rec6, created6] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 6,
				}
		})
		rec6.caption = 'Маршрут'
		rec6.msg = 'Пришли мне номер маршрута. Пришли мне 0 для отмены ввода.'
		await rec6.save()
//ДАТА ВВОДА МАРШРУТА
		const [rec7, created7] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 7,
				}
		})
		rec7.caption = 'Дата ввода'
		rec7.msg = `Введи дату с которой будет действовать расписание.`
		await rec7.save()
//ФАЙЛ РАСПИСАНИЯ
		const [rec8, created8] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 8,
				}
		})
		rec8.caption = 'Файл расписания'
		rec8.msg = 'Пришли мне файл расписания или объявления о ликвидации маршрута (формат JPG). Пришли мне 0 для отмены ввода'
		await rec8.save()
		//ОПУБЛИКОВАТЬ
		const [rec9, created9] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 9,
				}
		})
		rec9.caption = 'Опубликовать данные'
		rec9.msg = 'Опубликовать данные'
		await rec9.save()
		//МЕНЮ 3
//кнопка удаления из таблицы новых расписаний
		const [rec10, created10] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 10,
				}
		})
		rec10.caption = 'Удал. зап. из табл. нов. расп.'
		rec10.msg = 'Удал. зап. из табл. нов расп.'
		await rec10.save()
//кнопка удаления из таблицы действующих расписаний
		const [rec11, created11] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 11,
				}
		})
		rec11.caption = 'Удал. зап. из табл. действ. расп.'
		rec11.msg = 'Удал. зап. из табл. действ. расп.'
		await rec11.save()
//кнопка удаления из таблицы главного нижнего меню
		const [rec12, created12] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 12,
				}
		})
		rec12.caption = 'Удал. зап. из табл. гл. ниж. меню'
		rec12.msg = 'Удал. зап. из табл. гл. ниж. меню'
		await rec12.save()
		//МЕНЮ 4
		//производственный календарь - кнопка перехода
		const [rec13, created13] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 13,
				}
		})
		rec13.caption = 'Производ. календарь'
		rec13.msg = 'Переход в подменю'
		await rec13.save()
		//ФАЙЛ РАСПИСАНИЯ
		const [rec14, created14] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 14,
				}
		})
		rec14.caption = 'JSON файл календаря'
		rec14.msg = 'Пришли мне файл производственного календаря (формат calendar.json). Пришли мне 0 для отмены ввода'
		await rec14.save()
		//ОПУБЛИКОВАТЬ
		const [rec15, created15] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 15,
				}
		})
		rec15.caption = 'Перенести данные из файла в БД'
		rec15.msg = 'Перенести данные из файла в БД'
		await rec15.save()
		const [rec16, created16] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 16,
				}
		})
		rec16.caption = 'Внести данные в БД'
		rec16.msg = 'Внести выходной в таблицу выходных'
		await rec16.save()
		const [rec17, created17] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 17,
				}
		})
		rec17.caption = 'Удалить данные в БД'
		rec17.msg = 'Удалить выходной из таблицы выходных'
		await rec17.save()
		const [rec18, created18] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 18,
				}
		})
		rec18.caption = 'Просмотреть выходные за месяц'
		rec18.msg = 'Просмотреть выходные за месяц'
		await rec18.save()
		const [rec19, created19] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 19,
				}
		})
		rec19.caption = 'Ввод Exel файла расписаний'
		rec19.msg = 'Пришли мне Exel файл расписаний. 0 - отмена ввода'
		await rec19.save()
		const [rec20, created20] = await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 20,
				}
		})
		rec20.caption = 'Сформировать расписания на год'
		rec20.msg = 'Пришли мне дату с которой ты хочешь сформировать расписания. Я сформирую их до конца этого года. 0  - отмена ввода'
		await rec20.save()


//кнопка закрыть у неё номер 200
		await TablesModels.ADMIN_PANEL_BTNS.findOrCreate({
				where: {
						num: 200,
						caption: 'Закрыть',
						msg: 'Закрыл текущее меню',
				}
		})

}

async function _tablesDayOffInit(pathFile, table) {//https://xmlcalendar.ru/ календарь брал тут
		try {
				const dataJson = JSON.parse(fs.readFileSync(pathFile, 'utf8'));
				console.log('dataJson', dataJson)
				// console.log('year', dataJson.year)
				// console.log('year', typeof (dataJson.year))
				// console.log('months', dataJson.months)
				// console.log('month', dataJson.months[0])
				// console.log('month', dataJson.months[0].month)
				// console.log('month', dataJson.months[0].days)
				// console.log('month', typeof (dataJson.months[0].days))
				// const arrDays = dataJson.months[0].days.split('')

				let year = dataJson.year
				let arrDays = []
				const arrMonths = dataJson.months
				const dayOff = []
				for (let i = 0; i < arrMonths.length; i++) {
						let month = arrMonths[i].month - 1//месяц с 0 начинается в объекте дата
						arrDays.length = 0
						arrDays = dataJson.months[i].days.split(',')

						for (let j = 0; j < arrDays.length; j++) {
								// if (arrDays[j].indexOf('*') !== -1)

								if (arrDays[j].indexOf('+') !== -1)
										arrDays[j] = arrDays[j].replace(/\D/g, '')

								let date = new Date(+year, +month, +arrDays[j])
								if (!isNaN(date))
										dayOff.push(date)
						}
				}
				let dayOfWeek
				for (let i of dayOff) {
						dayOfWeek = i.toLocaleString('default', {weekday: 'long'});
						const [rec, created] = await table.findOrCreate({
								where: {
										date: i,
										week_day: dayOfWeek,
								}
						})
				}

				const {count, rows} = await table.findAndCountAll({
						where: {
								date: {[Op.gte]: new Date(+year, 0, 1)}
						}
				})
				return count == dataJson.statistic.holidays ? -1 : count//-1- все выходные совпали иначе количество записей которые добавились
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_tablesDayOffInit],
				[err - ${e}]`)
				return -2//проблемы с чтением данных из файла
		}

}

//функция заполнения таблицы расписаний
async function _tablesSchedulesInit(pathExelFile, table) {
		try {
				await table.destroy({where: {}, truncate: true})

				const records = await readXlsxFile(pathExelFile)
				let flagDayOff = true
				let flagWestToEast = true
				let nextDay = true
				let lastBus = true
				let exelDate
				let exelDateUTC
				let tableDate
				let tableDateSave = new Date()
				const dayNow = tableDateSave.getDate()
				const arr = []
				for (let i = 1; i < records.length; i++) {//заголовок пропустим
						tableDate = new Date(tableDateSave)
						flagDayOff = !!records[i][2]// records[i][2] == 1 ? flagDayOff = true : flagDayOff = false
						flagWestToEast = !!records[i][5]
						nextDay = !!records[i][6]
						lastBus = !!records[i][7]

						exelDate = new Date(records[i][0])
//меняем часовой пояс не изменяя времени (что делается через UTC)
						tableDate.setHours(exelDate.getUTCHours())
						tableDate.setMinutes(exelDate.getUTCMinutes())
						tableDate.setSeconds(0)
						tableDate.setMilliseconds(0)

						if (nextDay) tableDate.setDate(dayNow + 1)

						const [rec, created] = await table.findOrCreate({
								where: {
										date: tableDate,
										bus: +records[i][1],
										day_off: flagDayOff,
										// exit: records[i][3],
										start: records[i][4].toString(),
										west_to_east: flagWestToEast,
										next_day: nextDay,
										last_bus: lastBus,
								}
						})
				}
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - TABLES_FUNC.JS], [ФУНКЦИЯ -_tablesSchedulesInit],
				[err - ${e}]`)
				return -1//проблемы с занесением данных из файла
		}
}


const Table_Func = {
		// _recToTableMenuSchNew,
		_tablesMenuInit,
		_tablesAdminPanelBtnsInit,
		_tablesSchedulesInit,

		_db_CountCmd,
		_dbAddUser,
		_dbAddUserMsg,
		_dbAddUserLoc,
		_dbIsUser,

		clResult,
		// _dbGetIdAllUsers,

		_dbSetActiveAllUsers,
		_dbSetPassiveUser,
		_tablesDayOffInit,

}

module.exports.Table_Func = Table_Func

