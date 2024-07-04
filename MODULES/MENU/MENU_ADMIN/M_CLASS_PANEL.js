class clMenuBtnsTogether {
		constructor() {
				this.mapMenuAll = new Map()
				this.mapBtnsAll = new Map()
				this.mapStack = new Map()
		}

		_clearAllData() {
				this.mapMenuAll.clear()
				this.mapBtnsAll.clear()
				this.mapStack.clear()
		}

		arrStackMenu = []

		__stackRemoveMenu() {
				const key = this.__mapLastKey(this.mapStack)
				if (this.mapStack.has(key))
						this.mapStack.delete(key)
		}

		__stackPutMenu(numBtn) {
				this.mapStack.set(numBtn, this.mapMenuAll.get(numBtn).arrCurrentMenu)
		}

		__stackGetMenu() {
				return this.__mapLastVal(this.mapStack)
		}

		__stackGetSize() {
				return this.mapStack.size
		}

		__mapLastKey(map) {
				let k, v
				for ([k, v] of map) {
				}
				return k
		}

		__mapLastVal(map) {
				let k, v
				for ([k, v] of map) {
				}
				return v
		}

		_stackMenuUpdate(numBtn = 0) {
				if (this.__stackGetSize()) {
						if (numBtn === 200) {//если кнопка выхода
								this.__stackRemoveMenu()
								// if (this.__stackGetSize() === 0) return null
						} else if (this.mapMenuAll.has(numBtn)) {//Если кнопка перехода
								this.__stackPutMenu(numBtn)
						}
						this.__renderAllMenus()
						this.__stackRewrite()
				} else if (numBtn === 0) {// эта ветка нужно что бы инициализировать меню в команде /adminMenu
						this.mapStack.clear()
						this.__stackPutMenu(0)
				}

				return this.__stackGetMenu()
		}

		__stackRewrite() {
				let stackKeys = [...this.mapStack.keys()]
				this.mapStack.clear()
				let localMenuLength = 0
				for (let i of stackKeys) {
						localMenuLength = this.mapMenuAll.get(i).arrCurrentMenu.length
						if (localMenuLength)
								this.mapStack.set(i, this.mapMenuAll.get(i).arrCurrentMenu)
				}
		}


		_init(...menus) {
				for (let i = 0; i < menus.length; i++) {
						if (i === 0) this.mapMenuAll.set(0, menus[i]) //тут будет лежать начальное меню
						else
								this.mapMenuAll.set(menus[i].numJumpBtn, menus[i])
						for (let [k, v] of menus[i].mapBtns) {
								this.mapBtnsAll.set(k, v)
								v.getAccessToOtherBtns = this.mapBtnsAll
						}
				}
		}

		__renderAllMenus() {
				for (let [k, v] of this.mapMenuAll)
						v._renderArrMenu()
		}
}


class clMenuBtns {
		constructor() {
				this.numJumpBtn = 0
				this.mapBtns = new Map()//локальный список кнопок

				this.getAccessToOtherBtns = new Map()
		}

		_clearAllData() {
				this.numJumpBtn = 0
				this.mapBtns.clear()
				this.arrCurrentMenu.length = 0
		}

		numJumpBtn
		arrCurrentMenu = []

		_setJumpBtn(btn) {
				this.numJumpBtn = btn.num
		}

		_registerBtns(...btns) {
				for (let i = 0; i < btns.length; i++) {
						this.mapBtns.set(btns[i].num, btns[i])
				}

				//сортируем сразу мар кнопок
				let sortedKeys = [...this.mapBtns.keys()].sort(function (a, b) {
						return a - b;
				});
				const sortedMap = new Map()

				for (let i of sortedKeys)
						sortedMap.set(i, this.mapBtns.get(i))

				this.mapBtns.clear()

				for (let i of sortedKeys)
						this.mapBtns.set(i, sortedMap.get(i))
				this._renderArrMenu()
		}

		_renderArrMenu() {
				const arrKeyboard = []
				const tmpMap = new Map()
				for (let [k, v] of this.mapBtns) {
						if (v.visible) {
								tmpMap.set(v.result ? '✔️' + v.caption : v.caption, k.toString())//помечаем кнопку при нахождении в ней результата выполнения
								if (v.isEndOfLine) {
										const arrTmp = Array.from(tmpMap, ([text, callback_data]) => ({text, callback_data}));
										arrKeyboard.push(arrTmp)
										tmpMap.clear()
								}
						}
				}
				const arrTmp = Array.from(tmpMap, ([text, callback_data]) => ({text, callback_data}));
				if (arrTmp.length)
						arrKeyboard.push(arrTmp)
				if (arrKeyboard.length === 1)//осталась одна клавиша-выкидываем её
						arrKeyboard.pop()
				this.arrCurrentMenu = arrKeyboard
		}
}


module.exports.clMenuBtns = clMenuBtns
module.exports.clMenuBtnsTogether = clMenuBtnsTogether