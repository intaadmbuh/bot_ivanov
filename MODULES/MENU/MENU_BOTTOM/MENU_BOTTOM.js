const {Menu_Func} = require("./MENU_FUNC");
const {File_Func} = require("../../FILES/FILES_FUNC");
const {Keyboard, InputFile} = require("grammy");
const {logger} = require("../../LOGGER/LOGGER");
const {My_Func} = require("../../FUNC/MY_FUNC");


class clMenu {
		constructor(table) {
				this.TABLE = table
				this.MAP_BTNS = new Map()
				this.MAP_JUMP = new Map()
				this.MAP_REDEFINE_ACT = new Map()
				// this.KEYBOARD_STACK.length = 0
				// this.KEYBOARD.length = 0
		}

		TABLE
		KEYBOARD_STACK = []
		KEYBOARD = []
		BTN_EXIT = ['❌ Закрыть меню']
		BTN_EXIT_TEXT = 'Закрыл текущее меню'

		// https://learn.javascript.ru/map-set
		redefineBtn(btn) {
				this.MAP_REDEFINE_ACT.set(btn, true)
		}

		hasRedefineBtn(btn) {
				return this.MAP_REDEFINE_ACT.has(btn)
		}

		cancelRedefineBtn(btn) {
				this.MAP_REDEFINE_ACT.delete(btn)
		}

		async init() {
				try {
						this.KEYBOARD.length = 0
						this.KEYBOARD_STACK.length = 0
						this.MAP_JUMP.clear()
						this.MAP_BTNS.clear()
						this.MAP_REDEFINE_ACT.clear()
						const {count, rows} = await this.TABLE.findAndCountAll({
								order: [["num", "ASC"]]//сортировка по возрастанию
						})

						for (let i = 0; i < count; i++)
								this.MAP_BTNS.set(rows[i].cmd, rows[i])

						this.MAP_BTNS.set(this.BTN_EXIT.at(-1), 'BTN_EXIT')

						this.KEYBOARD = await Menu_Func._getArrMenuFromTable(this.TABLE)
						this.KEYBOARD.push(this.BTN_EXIT)

						if (count === 0) return false

				} catch (e) {
						logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - MENU_BOTTOM.JS], [ФУНКЦИЯ -init() класса clMenu],
				[ОШИБКА ПРИ ПОДСЧЕТЕ СТРОК В ТАБЛИЦЕ МЕНЮ]
				[err - ${e}]`)
				}
				return true
		}

		async register(keyJump, menuObj) {
				this.KEYBOARD_STACK = menuObj.KEYBOARD_STACK

				for (let i of menuObj.MAP_BTNS.keys())
						if (this.MAP_BTNS.has(i) === false)
								this.MAP_BTNS.set(i, menuObj.MAP_BTNS.get(i))

				this.MAP_JUMP.set(keyJump, menuObj.KEYBOARD)
		};

//можно поставить свой обработчик на кнопку в обход стандартного  табличного
		//или выполнить свой обработчик после стандартного табличного
		async hear(ctx) {

				const msg = ctx.message.text
				if (this.MAP_BTNS.has(msg) === false)
						return 0//если не наши кнопки - сразу выход
				const arrStack = this.KEYBOARD_STACK
				if (Menu_Func._canBtnPress(arrStack, msg, ctx) === true) {//кнопка есть. Ок, но можно ли ей нажать
						if (this.MAP_REDEFINE_ACT.has(msg)) {//если кнопка переопределена выполняем код и выходим
								const btn = this.MAP_BTNS.get(msg)
								Menu_Func._removeBtnFromStack(arrStack, msg)
								Menu_Func._renderMenu(arrStack)
								// await ctx.reply(msg, {
								await ctx.reply(btn.msg_text, {
										reply_markup: arrStack.length === 0 ? {remove_keyboard: true} : Keyboard.from(arrStack.at(-1)).resized(),
								})
								return msg//если поймали переопределение кнопки
						}
						if (this.MAP_JUMP.has(msg)) {//если кнопка перехода выполняем переход и выходим
								const btn = this.MAP_BTNS.get(msg)
								Menu_Func._removeBtnFromStack(arrStack, msg)
								Menu_Func._putKeyboardToStack(arrStack, this.MAP_JUMP.get(msg))
								await ctx.reply(btn.msg_text,
										{reply_markup: Keyboard.from(arrStack.at(-1)).resized(),})
								return 2//если поймали кнопку перехода
						}
						if (msg === this.BTN_EXIT.at(-1)) {//если попали на кнопку ВЫХОД
								Menu_Func._getKeyboardFromStack(arrStack)
								Menu_Func._renderMenu(arrStack)
								await ctx.reply(this.BTN_EXIT_TEXT,
										{
												reply_markup: arrStack.length === 0 ? {remove_keyboard: true} : Keyboard.from(arrStack.at(-1)).resized(),
										})
								return 3//если поймали кнопку ВЫХОД
						} else {//ну а если дошли до сюда - значит это обычная кнопка меню
								const btn = this.MAP_BTNS.get(msg)
								Menu_Func._removeBtnFromStack(arrStack, msg)
								Menu_Func._renderMenu(arrStack)
								if (await File_Func._sendPhotoFromFile(arrStack, btn.file_intro, ctx))
										await File_Func._sendMsgFromFile(btn.file_text, ctx)
								return 4//если поймали рабочие кнопки меню
						}
				} else return 5//кнопка есть но нажать её еще нельзя
		};

		setActive() {
				this.KEYBOARD_STACK.length = 0
				Menu_Func._putKeyboardToStack(this.KEYBOARD_STACK, this.KEYBOARD)
		}
};
module.exports.clMenu = clMenu



