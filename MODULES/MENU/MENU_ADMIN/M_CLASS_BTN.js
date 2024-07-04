class clBtnMenuAdmin {
		constructor() {
				this.num = 0//номер кнопки
				this.caption = null//подпись кнопки
				this.result = null//присвоение результата нажатия на кнопку
				this._toDoSomething = null//функция которую кнопка будет выполнять
				this.press = false
				this.visible = true
				this.msg = 'Введи текст для кнопки'
				this.isEndOfLine = true

				this.getAccessToOtherBtns = new Map()
		}
}

module.exports.clBtnMenuAdmin = clBtnMenuAdmin