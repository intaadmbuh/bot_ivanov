const {logger} = require("../../LOGGER/LOGGER");
const {My_Func} = require("../../FUNC/MY_FUNC");
const {Op} = require("sequelize");
const Menu_Func = {
		_delElemFromArr,
		_findAndReplaceElArr,
		_removeBtnFromStack,
		_renderMenu,
		_putKeyboardToStack,
		_getKeyboardFromStack,
		_arrZero,
		_canBtnPress,
		_getArrMenuFromTable,
		_getAllRowsFromTable,
}

async function _getAllRowsFromTable(tableMenu) {
		const {count, rows} = await tableMenu.findAndCountAll()
		return rows
}

async function _getArrMenuFromTable(tableMenu) {
		try {
				const rec = await tableMenu.findAll({
						where:{
								code: {[Op.ne]: 200}// код 200 это для публикации записей. запись есть, но на еще не опубликована
						},
						order: [["num", "ASC"]]//сортировка по возрастанию
				})

//	const arrTMP = JSON.parse(JSON.stringify(rows))
				const out = []
				const arrTMP = []
				for (let i = 0; i < rec.length; i++)
						arrTMP[i] = rec[i].cmd
				arrTMP.reverse()
				const l = Math.ceil(arrTMP.length / 2)
				for (let i = 0; i < l; i++) {
						const inner = []
						for (let k = 0; k < 2; k++)
								if (arrTMP.length != 0)
										inner.push(arrTMP.pop())
						if (inner.length != 0) out.push(inner)
				}
				return out
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_getArrMenuFromTable],
				[err - ${e}]`)
		}
}

function _removeBtnFromStack(arrStack, btn) {
		try {
				_putKeyboardToStack(
						arrStack,
						_delElemFromArr(
								_getKeyboardFromStack(arrStack),
								btn)
				)
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_removeBtnFromStack],
				[ПРОИЗОШЛА ОШИБКА В ФУНКЦИИ УДАЛЕНИЯ КНОПКИ НИЖНЕГО МЕНЮ ИЗ СТЭКА],
				[err - ${e}]`)
		}
}

function _arrZero(arr) {
		arr.length = 0
}

function _putKeyboardToStack(arrStack, keyArr) {
		try {
				const arr = JSON.parse(JSON.stringify(keyArr))
				arrStack.push(arr)
				// return arr
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
		[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_putKeyboardToStack],
		err - ${e}`)
		}
}

function _getKeyboardFromStack(arrStack) {
		try {
				return arrStack.pop()
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_getKeyboardFromStack],
				[НЕ СМОГ ПОЛУЧИТЬ КЛАВИАТУРУ ИЗ СТЭКА],
				[err - ${e}]`)
		}
}

function _delElemFromArr(keyArr, searchElem = null) { //поиск и удаление элемента из массива
		try {
				const arr = JSON.parse(JSON.stringify(keyArr))
				let index = arr.findIndex(x => x.includes(searchElem))
				if (index >= 0) {
						let index1 = arr[index].findIndex(x => x.includes(searchElem))
						arr[index].splice(index1, 1)
						if (arr[index].length === 0) arr.splice(index, 1)
						return arr
				}
				return [-1]
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
		[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_delElemFromArr],
		err - ${e}`)
		}
}

function _renderMenu(arrStack) {
		try {
				if (arrStack.length) {
						if (arrStack.at(-1).length === 1) {
								arrStack.pop()
								_renderMenu(arrStack)//если в менюхе ничего не осталось удаляем ей из стэка
						}
				}
				return arrStack.length
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
		[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_renderMenu],
		err - ${e}`)
		}
}


function _findAndReplaceElArr(arrKey, searchElem, newElem) {
		try {
				const arr = JSON.parse(JSON.stringify(arrKey))
				let index = arr.findIndex(x => x.includes(searchElem))
				if (index >= 0) {
						let index1 = arr[index].findIndex(x => x.includes(searchElem))
						arr[index].splice(index1, 1, newElem)
						return arr
				}
				return [-1]
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
		[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_findAndReplaceElArr],
		err - ${e}`)
		}
}

function _canBtnPress(arrStack, searchElem, ctx) {
		try {
				const arr = arrStack.at(-1)
				if (typeof (arr) === 'undefined') {
						ctx.reply(`Меню устарело. Вызовите "Меню" снова или нажмите /${process.env.COMMAND_MENU} `
								, {reply_markup: {remove_keyboard: true}},)
						return false
				}
				let index = arr.findIndex(x => x.includes(searchElem))
				if (index === -1) {
						ctx.reply(`Меню устарело. Вызовите "Меню" снова или нажмите /${process.env.COMMAND_MENU} `
								, {reply_markup: {remove_keyboard: true}},)
						return false
				}
				return true
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
		[ФАЙЛ - KEYBOARD_FUNC.JS], [ФУНКЦИЯ -_canBtnPress],
		err - ${e}`)
		}
}


module.exports.Menu_Func = Menu_Func
