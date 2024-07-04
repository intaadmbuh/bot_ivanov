require('dotenv').config()
const {Bot, GrammyError, HttpError, InputFile, Keyboard, Context, InlineKeyboard, session} = require('grammy')
const {run} = require("@grammyjs/runner");//
const {hydrate} = require('@grammyjs/hydrate')
const {apiThrottler} = require("@grammyjs/transformer-throttler");//https://grammy.dev/plugins/transformer-throttler
const {limit} = require("@grammyjs/ratelimiter");//https://grammy.dev/plugins/ratelimiter
const {FileFlavor, hydrateFiles} = require("@grammyjs/files")
const {conversations, createConversation,} = require("@grammyjs/conversations");//npm install grammyjs/conversations
const {DbConnect} = require('./MODULES/BD/PG/PG_CONNECT')
const {DataTypes, Op} = require("sequelize");
let distance = require("gps-distance");//npm i gps-distance
const {busStops} = require('./MODULES/BUS_STOP/bus_stops')
const bot = new Bot(process.env.BOT_API_KEY)//СОЗДАЕМ БОТА
bot.use(hydrate())
bot.use(limit())
const throttler = apiThrottler()
bot.api.config.use(throttler)//и накладываем ограничения. тут конфиг по дефолту
bot.api.config.use(hydrateFiles(process.env.BOT_API_KEY));// https://grammy.dev/plugins/transformer-throttler   - почитать об ограничениях
bot.use(session({initial: () => ({})}));
bot.use(conversations());// https://grammy.dev/plugins/conversations
const {logger, timestamp} = require("./MODULES/LOGGER/LOGGER");
const {Logger_Func} = require("./MODULES/LOGGER/LOGGER_FUNC");
const {My_Func} = require("./MODULES/FUNC/MY_FUNC");
const {File_Func} = require('./MODULES/FILES/FILES_FUNC')
const {Tables} = require("./MODULES/BD/PG/TABLES");
const {TablesModels} = require("./MODULES/BD/PG/TABLES_MODELS");
const {Table_Func} = require("./MODULES/BD/PG/TABLES_FUNC");
const {clMenu} = require('./MODULES/MENU/MENU_BOTTOM/MENU_BOTTOM')
const {MenuHamburger} = require('./MODULES/MENU/MENU_BOTTOM/MENU_HAMBURGER')
const {Menu_Func} = require("./MODULES/MENU/MENU_BOTTOM/MENU_FUNC");
const {create} = require("axios");
const {AbortSignal} = require("@grammyjs/hydrate/out/shim.node");
const {clBtnMenuAdmin} = require('./MODULES/MENU/MENU_ADMIN/M_CLASS_BTN')
const {M_BTN_FUNC} = require('./MODULES/MENU/MENU_ADMIN/M_BTNS_FUNC')
const {clMenuBtns, clMenuBtnsTogether} = require("./MODULES/MENU/MENU_ADMIN/M_CLASS_PANEL");
const schedule = require('node-schedule');
const readXlsxFile = require("read-excel-file/node");
//https://github.com/node-schedule/node-schedule
//**********************************************ОПРЕДЕЛИЛИ ВСЕ КОНСТАНТЫ И ПЕРЕМЕННЫЕ**********************************************************************
async function greeting(conversation, ctx) {//ФУНКЦИЯ ОБРАБОТЧИК ФУНКЦИЙ КНОПОК АДМИН ПАНЕЛИ
		const numBtn = +ctx.callbackQuery.data
		if (typeof (myMenuOdj.mapBtnsAll.get(numBtn)) == 'undefined') {
				ctx.reply('Меню устарело! Перезапусти команду вызова меню администратора /adminMenu')
				return
		}
		const msg = myMenuOdj.mapBtnsAll.get(numBtn).msg

		await ctx.reply(msg)
		// const {message} = await conversation.wait();
		if (numBtn != 200) {//если не кнопка закрыть
				if (!myMenuOdj.mapMenuAll.has(numBtn)) {//если не кнопка перехода
						await myMenuOdj.mapBtnsAll.get(numBtn)._toDoSomething(conversation, ctx, dataAdminPanelBtns)
				}
		}

		const menu = myMenuOdj._stackMenuUpdate(numBtn)//функция greeting будет вызвать ся 2 раза. поэтому эту перменную мы должны получать только после получения результата
		if (menu)
				await ctx.reply('Внимание!!! Открыто меню администратора. В этом меню ты можешь меня программировать. Надеюсь ты понимаешь, что делаешь'
						, {reply_markup: InlineKeyboard.from(menu)})
		else
				await ctx.reply('Закрыл меню адмнистратора'
						, {reply_markup: {remove_keyboard: true}})

		return//обязательно вызвать. так как беседа закончена
}//ФУНКЦИЯ ОБРАБОТЧИК ФУНКЦИЙ КНОПОК АДМИН ПАНЕЛИ
bot.use(createConversation(greeting));//ИНИЦИАЛИЗАЦИЯ ЭТОЙ ФУНКЦИИ

//НИЖНЕЕ МЕНЮ
const mapUsersMenuBottonMain = new Map()//ТУТ БУДЕМ ИНИЦИАЛИЗИРОВАТЬ МЕНЮ ВСЕХ ПОЛЬЗВАТЕЛЕЙ
//ТУТ БУДЕТ ХРАНИТЬ МЕНЮ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ

//НИЖНЕЕ МЕНЮ
async function setMenuBottom(user_ID) {
		const MenuBottomMain = new clMenu(Tables.Mod.MENU_MAIN)
		const MenuBottomMisc = new clMenu(Tables.Mod.MENU_MISC)
		const MenuBottomNearest = new clMenu(Tables.Mod.MENU_NEAREST)

		const MenuBottomSchedulesOld = new clMenu(Tables.Mod.MENU_SCHEDULE_OLD)
		const MenuBottomSchedulesNew = new clMenu(Tables.Mod.MENU_SCHEDULE_NEW)
		const MenuBottomChoceSch = new clMenu(Tables.Mod.MENU_SW_OLD_NEW_SCH)

		let init = await MenuBottomMain.init()
		if (init) {
				await MenuBottomMisc.init()
				await MenuBottomNearest.init()

				await MenuBottomMain.register('🔑', MenuBottomMisc)
				await MenuBottomMain.register('⏱️Ближайший', MenuBottomNearest)
				init = await MenuBottomSchedulesOld.init()
				if (init) {
						init = await MenuBottomSchedulesNew.init()
						if (init) {
								await MenuBottomChoceSch.init()
								await MenuBottomMain.register('🚌 Расписание', MenuBottomChoceSch)
								await MenuBottomMain.register('🚌 Действующее', MenuBottomSchedulesOld)
								await MenuBottomMain.register('⚠️ Новое', MenuBottomSchedulesNew)
						} else {
								await MenuBottomMain.register('🚌 Расписание', MenuBottomSchedulesOld)
						}
				}
		}
		MenuBottomMain.redefineBtn('📍 Где автобус')//переопределил кнопку
		MenuBottomMain.redefineBtn('️🤠➡️🐪')
		MenuBottomMain.redefineBtn('🐪➡️🤠')
		MenuBottomMain.setActive()

		mapUsersMenuBottonMain.set(+user_ID, MenuBottomMain)
}//ЗАПОЛНЯЕМ ДАННЫМИ НИЖНЕЕ МЕНЮ ПОЛЬЗОВАТЕЛЯ
async function changeMenuBottom(ctx, obj) {
		const user_ID = ctx.chat.id
		await setMenuBottom(user_ID)
		await setMenuBottom(user_ID)

		await ctx.reply('С чего начнём?', {
				reply_markup: Keyboard.from(obj.get(user_ID).KEYBOARD_STACK.at(-1)).resized(),
				is_persistent: true
		})
}

//АДМИН ПАНЕЛЬ
const dataAdminPanelBtns = {
		MENU_SCHEDULE_NEW: Tables.Mod.MENU_SCHEDULE_NEW,
		MENU_SCHEDULE_OLD: Tables.Mod.MENU_SCHEDULE_OLD,
		MENU_MAIN: Tables.Mod.MENU_MAIN,
		TABLE_USERS: Tables.Mod.USERS,
		DAY_OFF: Tables.Mod.DAY_OFF,
		SCHEDULES: Tables.Mod.SCHEDULES,
		YEAR_SCHEDULES: Tables.Mod.YEAR_SCHEDULES,
		BOT: bot,
		MENU: mapUsersMenuBottonMain,
		RESET_MENU: setMenuBottom
}//ОБЪЕКТ ДЛЯ ПЕРЕДАЧИ ДАННЫХ В ФУНКЦИИ КНОПОК АДМИН ПАНЕЛИ

const myMenuOdj = new clMenuBtnsTogether()//панель админа
const myMenu1 = new clMenuBtns()//первое меню
const myMenu2 = new clMenuBtns()//первое меню
const myMenu3 = new clMenuBtns()//второе меню
const myMenu4 = new clMenuBtns()//третье меню
const myMenu5 = new clMenuBtns()//третье меню
const setAdminPanel = async () => {
		const arrBtns = []
		myMenuOdj._clearAllData()
		myMenu1._clearAllData()
		myMenu2._clearAllData()
		myMenu3._clearAllData()
		myMenu4._clearAllData()
		const {count, rows} = await Tables.Mod.ADMIN_PANEL_BTNS.findAndCountAll({
				order: [["num", "ASC"]]//сортировка по возрастанию
		})
		for (let i = 0; i < count; i++) {
				btn = new clBtnMenuAdmin()
				btn.num = +rows[i].num
				btn.caption = rows[i].caption
				btn.msg = rows[i].msg
				btn._toDoSomething = M_BTN_FUNC[i]
				arrBtns.push(btn)
		}
		myMenu1._registerBtns(arrBtns[0], arrBtns[1], arrBtns[2], arrBtns[3], arrBtns[4], arrBtns[12], arrBtns.at(-1))
		myMenu2._registerBtns(arrBtns[5], arrBtns[6], arrBtns[7], arrBtns[8], arrBtns.at(-1))
		myMenu2._setJumpBtn(arrBtns[3])
		myMenu3._registerBtns(arrBtns[9], arrBtns[10], arrBtns[11], arrBtns.at(-1))
		myMenu3._setJumpBtn(arrBtns[4])
		myMenu4._registerBtns(arrBtns[13], arrBtns[14], arrBtns[15], arrBtns[16], arrBtns[17], arrBtns[18],arrBtns[19], arrBtns.at(-1))
		myMenu4._setJumpBtn(arrBtns[12])
		myMenuOdj._init(myMenu1, myMenu2, myMenu3, myMenu4)
}//ЗАПОЛНЯЕМ ДАННЫМИ АДМИН ПАНЕЛЬ
const start = async () => {
		try {
				await DbConnect.authenticate()
				// перегенерим таблицу если что-то поменялось
				// await DbConnect.sync({alter: true})//https://sequelize.org/docs/v6/core-concepts/model-basics/
				await DbConnect.sync()
				logger.info(`[ФАЙЛ - INDEX.JS], [ФУНКЦИЯ -start],
        [СУПЕР!! ПОДКЛЮЧЕНИЕ ПРОШЛО УСПЕШНО.]`)
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
        [ФАЙЛ - INDEX.JS], [ФУНКЦИЯ -start],
        [КАКАЯ ТО ХЕРНЯ С ПОДКЛЮЧЕНИЕМ К БАЗЕ]
        err - ${e}`)
		}

		await Table_Func._tablesAdminPanelBtnsInit()
		await Tables.Func._tablesMenuInit()
		const rec = await Tables.Mod.USERS.findAll({
				where: {
						active: true
				}
		})
		if (rec === null) {
		} else
				for (let jsonKey in rec) {
						await setMenuBottom(rec[jsonKey].user_id)
						await setMenuBottom(rec[jsonKey].user_id)
				}
		await My_Func._sendNews('Обновление программного обеспения бота', dataAdminPanelBtns)
};//ЗДЕСЬ ДЕЛАЕМ СОЕДИНЕНИЕ С БД + ИНИЦИАЛИЗИРУЕМ НИЖНЕЕ МЕНЮ И АДМИН ПАНЕЛЬ

bot.api.setMyCommands(MenuHamburger)//СОЗДАЕМ МЕНЮ БУГРЕР

bot.command(process.env.COMMAND_MENU, async (ctx) => {
		await changeMenuBottom(ctx, mapUsersMenuBottonMain)
		await Tables.Func._dbAddUser(ctx, Tables.Mod.USERS)//ДОБАВИЛИ ЮЗЕРА В БАЗУ//СОБИРАЕМ СТАТИСТИКУ
})
bot.command(process.env.COMMAND_START, async (ctx) => {
		await changeMenuBottom(ctx, mapUsersMenuBottonMain)
		await ctx.replyWithPhoto(new InputFile('./src/pic/COMMAND_START.jpg')
				, {caption: 'Меня зовут Пазя'})
		await File_Func._sendMsgFromFile('./src/text/COMMAND_START.txt', ctx)
		await Tables.Func._dbAddUser(ctx, Tables.Mod.USERS)//ДОБАВИЛИ ЮЗЕРА В БАЗУ//СОБИРАЕМ СТАТИСТИКУ
})
bot.command(process.env.COMMAND_HELP, async (ctx) => {
		await My_Func._helpUser(ctx, './src/mp4/command_help.mp4', 'Если кнопки снизу скрыты', './src/text/command_help.txt')
		await Tables.Func._dbAddUser(ctx, Tables.Mod.USERS)//ДОБАВИЛИ ЮЗЕРА В БАЗУ//СОБИРАЕМ СТАТИСТИКУ
})
bot.command(process.env.COMMAND_SHARE, async (ctx) => {
		var But_Reflink = {
				reply_markup: JSON.stringify({
						inline_keyboard: [
								[{
										text: 'Поделиться ботом',
										// callback_data: 'Поделиться ботом',
										switch_inline_query: 'Ссылка на бота, который умеет показывать расписания автобусов в г. Инта'
								}]
						]
				})
		}
// Отправляем сообщение с кнопкой
		await ctx.reply('Хотите поделиться этим ботом?', But_Reflink)
		await Tables.Func._dbAddUser(ctx, Tables.Mod.USERS)//ДОБАВИЛИ ЮЗЕРА В БАЗУ//СОБИРАЕМ СТАТИСТИКУ
})

//-----
bot.command(process.env.COMMAND_CARD, async (ctx) => {
		const msg = ctx.message.text.slice(process.env.COMMAND_SEND_NEWS.length + 2, ctx.message.text.length) //вырезаем из сообщения команду
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id))
						await ctx.replyWithPhoto(new InputFile('./src/pic/card.jpg')
								, {caption: 'Карта партнёра'})
})
bot.command(process.env.COMMAND_SEND_NEWS, async (ctx) => {
		const msg = ctx.message.text.slice(process.env.COMMAND_SEND_NEWS.length + 2, ctx.message.text.length) //вырезаем из сообщения команду
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id)) {
						const rec = await Tables.Mod.USERS.findAll({
								where: {
										active: true
								}
						})
						if (rec === null) {
						} else
								for (let jsonKey in rec) {
										await setMenuBottom(rec[jsonKey].user_id)
										await setMenuBottom(rec[jsonKey].user_id)
								}
						await My_Func._sendNews(msg, dataAdminPanelBtns)
				}
})
bot.command(process.env.COMMAND_SEND_MSG_TO_ONE_USER, async (ctx) => {
		const msg = ctx.message.text.slice(process.env.COMMAND_SEND_MSG_TO_ONE_USER.length + 2, ctx.message.text.length) //вырезаем из сообщения команду
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id))
						await My_Func._sendMsgToUser(bot, msg, Tables.Mod.USERS)
})
bot.command(process.env.COMMAND_GET_STATISTIC, async (ctx) => {
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id))
						await My_Func._getStatistic(ctx, Tables.Mod.USERS)
})
bot.command(process.env.COMMAND_ADMIN_MENU, async (ctx) => {
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id)) {
						await setAdminPanel()
						await ctx.reply('Внимание!!! Открыто меню администратора. В этом меню ты можешь меня программировать. Надеюсь ты понимаешь, что делаешь'
								, {reply_markup: InlineKeyboard.from(myMenuOdj._stackMenuUpdate())})
				}
})
bot.command(process.env.COMMAND_ADMIN_MENU_CANCEL, async (ctx) => {
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id)) {
						await ctx.conversation.exit("greeting")
						await ctx.reply('Полный выход из меню администратора')
				} else await ctx.reply('У вас нет прав на использование этой команды')
})
bot.command(process.env.COMMAND_RENDER_MENU, async (ctx) => {
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id)) {
						arrDatesFromAllTables = []
						for (let property in Tables.Mod) {//перебор всех таблиц проекта на предмет наличия ненулевых полет в стоблике date
								try {
										switch (Tables.Mod[property]) {
												case Tables.Mod.DAY_OFF://эти таблицы внесем в исключения.
												case Tables.Mod.SCHEDULES:
														break
												default:
														const allRecordsInTheTable = await Tables.Mod[property].findAll({
																where: {
																		date: {[Op.ne]: null}
																}
														})
														for (let record of allRecordsInTheTable)
																arrDatesFromAllTables.push(record.date)
														break
										}
								} catch {
								}
						}

						arrUniqueDates = []
						for (let date of arrDatesFromAllTables)
								if (!My_Func._isDateInArray(date, arrUniqueDates))
										arrUniqueDates.push(date)

						ctx.reply('Даты на которые назначен рендер таблиц и меню')
						schedule.gracefulShutdown()
						for (let i of arrUniqueDates) {
								schedule.scheduleJob(i, async () => {
										const rec = await Tables.Mod.USERS.findAll({
												where: {
														active: true
												}
										})
										if (rec === null) {
										} else
												for (let jsonKey in rec) {
														await setMenuBottom(rec[jsonKey].user_id)
														await setMenuBottom(rec[jsonKey].user_id)
												}
										await My_Func._sendNews('Рэндер клавиатуры пользователя', dataAdminPanelBtns)
								})
								ctx.reply(i.toLocaleString())
						}
				}
})
bot.command(process.env.COMMAND_REMOVE_RENDER_MENU, async (ctx) => {
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id)) {
						schedule.gracefulShutdown()
						ctx.reply('Задания на рэндер удалены')
				}
})
bot.command(process.env.COMMAND_CMD_HELP, async (ctx) => {
		if (ctx.chat.type === "private")
				if (process.env.BOT_ADMIN.includes(ctx.from.id)) {
						await File_Func._sendMsgFromFile('./src/text/cmd_help.txt', ctx)
				} else await ctx.reply('У вас нет прав на использование этой команды')
})


bot.on("callback_query:data", async (ctx) => {
		try {
				await ctx.callbackQuery.message.delete()
		} catch (e) {
				ctx.reply('Ты слишком быстрый. Жми на кнопки по-медленней')
				return
		}
		await ctx.conversation.enter("greeting")
});//ТУТ ОБРАБАТЫВАЕМ АДМИН ПАНЕЛЬ
bot.on(":text", async (ctx) => {
		await Tables.Func._dbAddUser(ctx, Tables.Mod.USERS)//ДОБАВИЛИ ЮЗЕРА В БАЗУ//СОБИРАЕМ СТАТИСТИКУ

		const user_ID = ctx.chat.id
		if (!mapUsersMenuBottonMain.has(user_ID))
				await changeMenuBottom(ctx, mapUsersMenuBottonMain)

		const resHear = await mapUsersMenuBottonMain.get(user_ID)?.hear(ctx)
		if (resHear === 0) {
				const samePhrase = My_Func._isCloseInContent(ctx.message.text, My_Func.arrUserMessages, +process.env.CLOSE_TO_CONTEX_DISTANCE)
				if (samePhrase)
						await File_Func._sendMsgFromFile('./src/text/reference_help.txt', ctx)

				await Tables.Func._dbAddUserMsg(ctx, Tables.Mod.MSG)
				if (!process.env.BOT_ADMIN.includes(user_ID)) {
						if (await Tables.Func._dbIsUser(user_ID, Tables.Mod.BLACK_LIST) == false) {
								//						for (let i = 0; i < process.env.BOT_ADMIN.length; i++)//это если мы хотим оптавлять всем админам
								const adminID = JSON.parse(process.env.BOT_ADMIN)
								await bot.api.sendMessage(adminID[0], ctx.message.from.id)
								await bot.api.sendMessage(adminID[0], ctx.message.text)
						}
				}
		} else {
				let msg = null
				switch (resHear) {
						case '📍 Где автобус'://это переопределенная кнопка
								await My_Func._getLocationBtn(ctx)
								await Tables.Func._db_CountCmd(ctx, Tables.Mod.COUNT)
								break
						case '🐪➡️🤠':
								//календарь брал тут https://xmlcalendar.ru/
								msg = await My_Func._getSchedule(dataAdminPanelBtns, +process.env.NEAREST_BUS_MINUTES, false)
								await ctx.reply(msg === null ? 'Профилактические работы' : msg)
								await Tables.Func._db_CountCmd(ctx, Tables.Mod.COUNT)
								break
						case '️🤠➡️🐪':
								msg = await My_Func._getSchedule(dataAdminPanelBtns, +process.env.NEAREST_BUS_MINUTES)
								await ctx.reply(msg === null ? 'Профилактические работы' : msg)
								await Tables.Func._db_CountCmd(ctx, Tables.Mod.COUNT)
								break
						case 2:
						case 3:
						case 4:
								await Tables.Func._db_CountCmd(ctx, Tables.Mod.COUNT)
								break
						default:
								break;
				}
		}
})//ТУТ ОБРАБАТЫВАЕМ НИЖНЕЕ МЕНЮ И ВСЕ ВЛОЖЕННЫЕ В НЕГО МЕНЮ

bot.on('message', async (ctx) => {
		if (ctx.message.location.latitude !== undefined && ctx.message.location.longitude !== undefined) {
				let result = 0
				let arrDist = []
				for (let i = 0; i < busStops.length; i++) {
						result = distance(ctx.message.location.latitude, ctx.message.location.longitude, busStops[i].lat, busStops[i].lng)
						arrDist.push(result)
				}
				let minDist = Math.min(...arrDist)
				let index = arrDist.indexOf(Math.min(...arrDist))

				await ctx.reply(busStops[index].ref, {
						reply_markup:
								{
										remove_keyboard: true
								}
				})
				if (minDist <= 9.9) await ctx.reply('Минимальное расстояние до остановки = ' + ' ' + (minDist * 1000).toFixed(2) + ' м')
				else await ctx.reply('Минимальное расстояние до остановки = ' + ' ' + minDist.toFixed(2) + ' км')

				await Tables.Func._dbAddUserLoc(ctx, Tables.Mod.LOC, minDist.toFixed(4), busStops[index].name)
		}
})

bot.catch((err) => {
		const ctx = err.ctx;
		const e = err.error;
		logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - INDEX.JS], [ФУНКЦИЯ - bot.catch],
				[Error while handling update: ${ctx.update.update_id}]`)
		if (e instanceof GrammyError) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - INDEX.JS], [ФУНКЦИЯ - bot.catch],
				[Ошибка в запросе: ${e.description}]`)
		} else if (e instanceof HttpError) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - INDEX.JS], [ФУНКЦИЯ - bot.catch],
				[Не могу подсокдиниться к Телеграмм: ${e}]`)
		} else {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - INDEX.JS], [ФУНКЦИЯ - bot.catch],
				[Неизвестная ошибка ${e}]`)
		}
})
bot.start()
start()



