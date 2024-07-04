const {logger} = require("../../LOGGER/LOGGER");
const {DbConnect} = require('./PG_CONNECT')
const {DataTypes, Op} = require('sequelize')

const {My_Func} = require("../../FUNC/MY_FUNC");
// const {Table_Func} = require("./TABLES_FUNC");
const {File_Func} = require("../../FILES/FILES_FUNC");
// const {e} = require('../../EVENT/global')
//ТАБЛИЦЫ МЕНЮ
const modelMenuDefine = {
		id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, allowNull: false, autoIncrement: true},
		num: {type: DataTypes.BIGINT, unique: true, allowNull: true},
		cmd: {type: DataTypes.STRING, unique: true},
		code: {type: DataTypes.BIGINT, defaultValue: 0},
		date: {type: DataTypes.DATE, defaultValue: null},
		msg_text: {type: DataTypes.STRING},
		msg_exit: {type: DataTypes.STRING},
		file_intro: {type: DataTypes.STRING},
		file_text: {type: DataTypes.STRING},
}

const tableMenuMain = DbConnect.define('menu_main',
		modelMenuDefine, {
				hooks: {
						beforeSave: async (record) => {
								try {
										if (record.num != null) {
												if (record.num == 1) {
														record.cmd = '🚌 Расписание'
														record.msg_text = 'Расписание какого маршрута вас интересует'
														record.msg_exit = '👇'
												}
												if (record.num == 2) {
														record.cmd = '⏱️Ближайший'
														record.msg_text = 'Выберите направление движения автобуса по городу. С запада на восток или с востока на запад'
												}
												if (record.num == 3) {
														record.cmd = '📍 Где автобус'
														record.msg_text = 'Отправьте мне свою геолокацию'
												}
												if (record.num == 4) {
														record.cmd = '🔑'
														record.msg_text = 'Разное'
												}
												if (record.num == 5) {
														record.cmd = '❗ОБЪЯВЛЕНИЕ❗️'
														record.msg_text = 'Хотел рассказать, что...'
												}
												record.file_intro = `./src/pic/${tableMenuMain.name}${record.num}.jpg`
												record.file_text = `./src/text/${tableMenuMain.name}${record.num}.txt`
												// changeTablesMenuBottomFlag = true
										}

										if (record.msg_exit == null)
												record.msg_exit = 'Для продолжения работы отправьте мне сообщение /menu или выберите команду "Начать работу" из меню'

								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeSave on tableMenuMain],
										[err - ${e}]`)
								}
						},
						beforeCount: async () => {
								try {
										await tableMenuMain.destroy({
												where: {
														num: null,
												}
										})

										await tableMenuMain.destroy({
												where: {
														date: {
																[Op.lte]: new Date(),
														}
												}
										})
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeCount: on tableMenuMain],
										[err - ${e}]`)
								}
						},
						//	afterSave: async () => {
						// e.emit('test','Запись в базу добавлена')
						//	},//выполнение кода после добавления записи в базу
						//afterDestroy: async () => {
						// e.emit('test', 'Запись в базе удалена')
						//},//выполнение кода после удаления записи из базы
				}
		}
);
//МЕНЮ БЛИЖАЙШИЙ ...
const tableMenuNearest = DbConnect.define('menu_nearest',
		modelMenuDefine, {
				hooks: {
						beforeSave: async (record) => {
								try {
										if (record.num != null) {

												if (record.num == 1) {
														record.cmd = '️🤠➡️🐪'
														record.msg_text = 'Вы выбрали направление с ЗАПАДА НА ВОСТОК'
												}
												if (record.num == 2) {
														record.cmd = '🐪➡️🤠'
														record.msg_text = 'Вы выбрали направление с ВОСТОКА НА ЗАПАД'
												}

												record.file_intro = `./src/pic/${tableMenuMisc.name}${record.num}.jpg`
												record.file_text = `./src/text/${tableMenuMisc.name}${record.num}.txt`
										}

								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeSave on tableMenuMisc],
										[err - ${e}]`)
								}
						},
						beforeCount: async () => {
								try {
										await tableMenuMisc.destroy({
												where: {
														num: null,
												}
										})
										await tableMenuMisc.destroy({
												where: {
														date: {
																[Op.lte]: new Date(),
														}
												}
										})
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeCount: on tableMenuMisc],
										[err - ${e}]`)
								}
						},
				}
		}
);
//МЕНЮ РАЗНОЕ ...
const tableMenuMisc = DbConnect.define('menu_misc',
		modelMenuDefine, {
				hooks: {
						beforeSave: async (record) => {
								try {
										if (record.num != null) {

												if (record.num == 1) {
														record.cmd = '📈 Маршруты движения'
														record.msg_text = 'Маршруты движения'
												}
												if (record.num == 2) {
														record.cmd = '🎫 Билеты'
														record.msg_text = 'Ваш билетик'
												}
												if (record.num == 3) {
														record.cmd = '🆘 Помощь'
														record.msg_text = 'Неприятность? Бывает('
												}
												if (record.num == 4) {
														record.cmd = '🏦 О нас'
														record.msg_text = 'Приятно познакомиться'
												}

												record.file_intro = `./src/pic/${tableMenuMisc.name}${record.num}.jpg`
												record.file_text = `./src/text/${tableMenuMisc.name}${record.num}.txt`
										}

								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeSave on tableMenuMisc],
										[err - ${e}]`)
								}
						},
						beforeCount: async () => {
								try {
										await tableMenuMisc.destroy({
												where: {
														num: null,
												}
										})
										await tableMenuMisc.destroy({
												where: {
														date: {
																[Op.lte]: new Date(),
														}
												}
										})
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeCount: on tableMenuMisc],
										[err - ${e}]`)
								}
						},
				}
		}
);
//МЕНЮ ДЕЙСТВУЮЩЕГО РАСПИСАНИЯ
const tableMenuSchedulesOld = DbConnect.define('menu_schedules_old',
		modelMenuDefine, {
				hooks: {
						beforeSave: async (record) => {
								try {
										if (record.num != null) {
												tableMenuSchedulesOld.name
												record.cmd = `Маршрут №${record.num}`
												record.msg_text = `Расписание движения автобуса маршрута №${record.num}`
												record.file_intro = `./src/pic/${tableMenuSchedulesOld.name}${record.num}.jpg`
												record.file_text = `./src/text/${tableMenuSchedulesOld.name}${record.num}.txt`
												// await File_Func._createTxtFile(record.file_text, `Расписание движения маршрута №${record.num}`)
										}
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeSave on tableMenuSchedulesOld],
										[err - ${e}]`)
								}
						},
						beforeCount: async () => {
								try {
										await tableMenuSchedulesOld.destroy({
												where: {
														num: null,
												}
										})
										await tableMenuSchedulesOld.destroy({
												where: {
														date: {
																[Op.lte]: new Date(),
														}
												}
										})
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeCount: on tableMenuSchedulesOld],
										[err - ${e}]`)
								}
						},
				}
		}
);
//МЕНЮ НОВОГО РАСПИСАНИЯ
const tableMenuSchedulesNew = DbConnect.define('menu_schedules_new',
		modelMenuDefine, {
				hooks: {
						beforeSave: async (record) => {
								try {
										if (record.num != null) {
												record.cmd = `⚠️ Маршрут №${record.num}`
												record.msg_text = `Расписание движения автобуса маршрута №${record.num}`
												record.file_intro = `./src/pic/${tableMenuSchedulesNew.name}${record.num}.jpg`
												record.file_text = `./src/text/${tableMenuSchedulesNew.name}${record.num}.txt`
												// await File_Func._createTxtFile(record.file_text, `Расписание движения маршрута №${record.num} c ${record.date.toLocaleString()}. Время внесения изменений: ${My_Func._getDateTime()}`)
												const day = record.date.getDate()
												let month = (record.date.getMonth() + 1).toString()
												if (month.length === 1) month = '0' + month
												const year = record.date.getFullYear()
												await File_Func._createTxtFile(record.file_text, `Расписание движения маршрута №${record.num}. Вводится с ${day}.${month}.${year}`)
												await File_Func._removeDataFromFile('./src/pic/tmp.jpg', record.file_intro)//ПУТЬ К ЭТОМУ ФАЙЛУ ПРОПИСАН В M_BTNS_FUNC.JS В async function funcBtn3 ФУНКЦИЯ ПРИЕМА ФАЙЛА
										}
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeSave:on tableMenuSchedulesNew],
										[err - ${e}]`)
								}
						},
						beforeCount: async () => {
								try {
										await tableMenuSchedulesNew.destroy({
												where: {
														num: null,
												}
										})
										const recNewSchedules = await tableMenuSchedulesNew.findAll({
												where: {
														// date: {[Op.ne]: null}
														date: {[Op.lte]: new Date()}
												}
										})
										for (let i of recNewSchedules) {
												if (i.dataValues.code == 1) {
														const [recOldSchedules, created] = await tableMenuSchedulesOld.findOrCreate({
																where: {
																		num: i.dataValues.num
																}
														})
														await File_Func._removeDataFromFile(i.dataValues.file_intro, recOldSchedules.file_intro)
														await File_Func._removeDataFromFile(i.dataValues.file_text, recOldSchedules.file_text)
												}
												if (i.dataValues.code == 2)
														await tableMenuSchedulesOld.destroy({
																where: {
																		num: i.dataValues.num
																}
														})
										}
										await tableMenuSchedulesNew.destroy({
												where: {
														date: {[Op.lte]: new Date()}
												}
										})
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeCount: on tableMenuSchedulesNew],
										[err - ${e}]`)
								}
						},
				}
		}
);
//МЕНЮ ВЫБОРА МЕЖДУ ДЕЙСТВУЮЩИМ И НОВЫМ РАСПИСАНИЕМ
const tableMenuSwitchOldNewSch = DbConnect.define('menu_switch_old_new_sch',
		modelMenuDefine, {
				hooks: {
						beforeSave: async (record) => {
								try {
										if (record.num != null) {
												if (record.num == 1) {
														record.cmd = `🚌 Действующее`
														record.msg_text = `Действующее расписание`;
												}
												if (record.num == 2) {
														record.cmd = `⚠️ Новое`
														record.msg_text = `Новое расписание`;
												}
												record.file_intro = `./src/pic/${tableMenuSwitchOldNewSch.name}${record.num}.jpg`
												record.file_text = `./src/text/${tableMenuSwitchOldNewSch.name}${record.num}.txt`
												await File_Func._createTxtFile(record.file_text, 'Запрос выполнил')
										}
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeSave:on tableMenuSwitchOldNewSch],
										[err - ${e}]`)
								}
						},
						beforeCount: async () => {
								try {
										await tableMenuSwitchOldNewSch.destroy({
												where: {
														num: null,
												}
										})
										await tableMenuSwitchOldNewSch.destroy({
												where: {
														date: {
																[Op.lte]: new Date(),
														}
												}
										})
								} catch
										(e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook beforeCount: on tableMenuSwitchOldNewSch],
										[err - ${e}]`)
								}
						},
				}
		}
);

//ТАБЛИЦА С ДАННЫМИ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
const tableUsers = DbConnect.define('users', {
		user_id: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
		active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
		first_name: {type: DataTypes.STRING},
		last_name: {type: DataTypes.STRING},
		telephone: {type: DataTypes.STRING},
		coordinate: {type: DataTypes.STRING},
		email: {type: DataTypes.STRING},
		real_first_name: {type: DataTypes.STRING},
		real_last_name: {type: DataTypes.STRING},
		address: {type: DataTypes.STRING},
		language_code: {type: DataTypes.STRING},
})
//ТАБЛИЦА СООБЩЕНИЙ ДЛЯ ОПРЕДЕЛЕННЫХ ПОЛЬЗОВАТЕЛЕЙ
const tableUsersBlackList = DbConnect.define('users_black_list', {
				user_id: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
				active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
				first_name: {type: DataTypes.STRING},
				last_name: {type: DataTypes.STRING},
				telephone: {type: DataTypes.STRING},
				coordinate: {type: DataTypes.STRING},
				email: {type: DataTypes.STRING},
				real_first_name: {type: DataTypes.STRING},
				real_last_name: {type: DataTypes.STRING},
				address: {type: DataTypes.STRING},
				language_code: {type: DataTypes.STRING},
		},
		{
				hooks: {
						beforeCount: async () => {
								try {
										await tableUsersBlackList.destroy({
												where: {
														createdAt: {[Op.lt]: new Date(new Date() - process.env.DAYS_IN_BLACK_LIST * 24 * 60 * 60 * 1_000)},//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
														// createdAt: {[Op.lt]: new Date(new Date() - 2 * 60 * 1000)},
												}
										})
								} catch (e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook on tableUsersBlackList],
										[ОШИБКА ПРИ УДАЛЕНИИ ПОЛЬЗОВАТЕЛЕЙ ИЗ ЧЕРНОГО СПИСКА]
										[err - ${e}]`)
								}
						}
				}
		})
//ТАБЛИЦА РЕГИСТРАЦИИ СМС ПОЛЬЗОВАТЕЛЯ
const tableUsersMsg = DbConnect.define('users_msg', {
				user_id: {type: DataTypes.BIGINT, allowNull: false},
				msg: {type: DataTypes.STRING},
				update_id: {type: DataTypes.BIGINT, allowNull: false},
				message_id: {type: DataTypes.BIGINT, allowNull: false,},
		},
		{
				hooks: {
						afterSave: async (record) => {
								try {
										let {count, rows} = await tableUsersMsg.findAndCountAll({
												where: {
														user_id: record.user_id
												}
										})
										if (count > 300) {
												const rec = await tableUsersMsg.findAll({
														where: {
																user_id: record.user_id
														}
												})
												let min = rec[0].updatedAt
												let index = 0
												if (rec == null) {
												} else {
														let min = rec[0].updatedAt
														for (let jsonKey in rec)
																if (rec[jsonKey].updatedAt < min) {
																		min = rec[jsonKey].updatedAt
																		index = jsonKey
																}
												}
												await tableUsersMsg.destroy({
														where: {
																updatedAt: min,
																user_id: rec[index].user_id
														}
												})
												if (count > 1000) {
														await tableUsersMsg.destroy({
																where: {
																		user_id: record.user_id
																}
														})
												}
										}
								} catch (e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook on tableUsersMsg],
										[err - ${e}]`)
								}
								try {
										if (!process.env.BOT_ADMIN.includes(record.user_id)) {
												const now = new Date()
												now.setUTCHours(0, 0, 0, 0)
												const startDay = now
												const endDay = new Date(now.getTime() + 24 * 60 * 60 * 1000)
												let {count, rows} = await tableUsersMsg.findAndCountAll({
														where: {
																user_id: record.user_id,
																createdAt: {
																		[Op.between]: [startDay, endDay]
																}
														}
												})

												if (count > process.env.MSG_MAX_COUNT) {
														const [rec, created] = await tableUsersBlackList.findOrCreate({
																where: {
																		user_id: record.user_id,
																}
														})
												}
										}
								} catch (e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook on tableUsersMsg],
										[Считаем количество сообщений],
										[err - ${e}]`)
								}
						}
				}
		})
//ТАБЛИЦА ПОДСЧЕТА НАЖАТИЙ КЛАВИШ
const tableCountCmd = DbConnect.define('count_cmd', {
		user_id: {type: DataTypes.BIGINT, allowNull: false},
		msg: {type: DataTypes.STRING},
		i: {type: DataTypes.BIGINT, defaultValue: 0},
})
//ТАБЛИЦА РЕГИСТРАЦИИ ЛОКАЦИИ ПОЛЬЗОВАТЕЛЯ И КАКАЯ ОСТАНОВКА РЯДОМ С НИМ
const tableUsersLoc = DbConnect.define('users_loc', {
				user_id: {type: DataTypes.BIGINT, allowNull: false},
				bus_stop: {type: DataTypes.STRING},
				minDist: {type: DataTypes.FLOAT},
				latitude: {type: DataTypes.FLOAT},
				longitude: {type: DataTypes.FLOAT},
				update_id: {type: DataTypes.BIGINT, allowNull: false},
				message_id: {type: DataTypes.BIGINT, allowNull: false,},
		},
		{
				hooks: {
						afterSave: async (record) => {
								try {
										let {count, rows} = await tableUsersLoc.findAndCountAll({
												where: {
														user_id: record.user_id
												}
										})
										if (count > 300) {
												const rec = await tableUsersLoc.findAll({
														where: {
																user_id: record.user_id
														}
												})
												let min = rec[0].updatedAt
												let index = 0
												if (rec == null) {
												} else {
														let min = rec[0].updatedAt
														for (let jsonKey in rec)
																if (rec[jsonKey].updatedAt < min) {
																		min = rec[jsonKey].updatedAt
																		index = jsonKey
																}
												}
												await tableUsersLoc.destroy({
														where: {
																updatedAt: min,
																user_id: rec[index].user_id
														}
												})
												if (count > 1000) {
														await tableUsersLoc.destroy({
																where: {
																		user_id: record.user_id
																}
														})
												}
										}
								} catch (e) {
										logger.error(`[${My_Func._getDateTime()}],
										[ФАЙЛ - TABLES_MODELS.JS], [ФУНКЦИЯ -hook on tableUsersLoc],
										[err - ${e}]`)
								}
						}
				}
		})


tableUsers.hasMany(tableUsersMsg, {onDelete: "cascade"})
tableUsers.hasMany(tableCountCmd, {onDelete: "cascade"})
tableUsers.hasMany(tableUsersLoc, {onDelete: "cascade"})

//ТАБЛИЦА МЕНЮ АДМИНИСТРАТОРА
const tableAdminPanelBtns = DbConnect.define('admin_panel_btns', {
		num: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
		caption: {type: DataTypes.STRING},
		result: {type: DataTypes.STRING, defaultValue: null},
		press: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
		visible: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
		msg: {type: DataTypes.STRING},
		isEndOfLine: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
})
//ТАБЛИЦА ВЫХОДНЫХ ДНЕЙ
const tableDayOff = DbConnect.define('day_off', {
		id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, allowNull: false, autoIncrement: true},
		date: {type: DataTypes.DATEONLY, allowNull: false},
		week_day: {type: DataTypes.STRING, allowNull: false},
})
//ТАБЛИЦА РАСПИСАНИЯ АВТОБУСОВ
const tableSchedules = DbConnect.define('schedules', {
		id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, allowNull: false, autoIncrement: true},
		// date: {type: DataTypes.TIME(6), allowNull: false},
		date: {type: DataTypes.DATE, allowNull: false},
		bus: {type: DataTypes.BIGINT, allowNull: false},
		day_off: {type: DataTypes.BOOLEAN, allowNull: false},
		exit: {type: DataTypes.BIGINT, allowNull: true},
		start: {type: DataTypes.STRING, allowNull: false},
		west_to_east: {type: DataTypes.BOOLEAN, allowNull: false},
		next_day: {type: DataTypes.BOOLEAN, allowNull: false},
		last_bus: {type: DataTypes.BOOLEAN, allowNull: false},
})
const tableYearSchedules = DbConnect.define('schedules_year', {
		id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, allowNull: false, autoIncrement: true},
		date: {type: DataTypes.DATE, allowNull: false},
		bus: {type: DataTypes.BIGINT, allowNull: false},
		exit: {type: DataTypes.BIGINT, allowNull: true},
		start: {type: DataTypes.STRING, allowNull: false},
		west_to_east: {type: DataTypes.BOOLEAN, allowNull: false},
		week_day: {type: DataTypes.STRING, allowNull: false},
		day_off: {type: DataTypes.BOOLEAN, allowNull: false},
		last_bus: {type: DataTypes.BOOLEAN, allowNull: false},
})

// this.isEndOfLine = isEndOfLine


const TablesModels = {
		USERS: tableUsers,
		BLACK_LIST: tableUsersBlackList,
		MSG: tableUsersMsg,
		LOC: tableUsersLoc,

		MENU_MAIN: tableMenuMain,
		MENU_SCHEDULE_OLD: tableMenuSchedulesOld,
		MENU_SCHEDULE_NEW: tableMenuSchedulesNew,
		MENU_SW_OLD_NEW_SCH: tableMenuSwitchOldNewSch,
		MENU_MISC: tableMenuMisc,
		MENU_NEAREST: tableMenuNearest,
		DAY_OFF: tableDayOff,

		COUNT: tableCountCmd,

		ADMIN_PANEL_BTNS: tableAdminPanelBtns,

		SCHEDULES: tableSchedules,
		YEAR_SCHEDULES: tableYearSchedules,
}
module.exports.TablesModels = TablesModels

