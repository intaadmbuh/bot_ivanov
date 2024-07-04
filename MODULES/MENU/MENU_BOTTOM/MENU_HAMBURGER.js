//СОЗДАЕМ И ИНИЦИАЛИЗИРУЕМ МЕНЮ БУРГЕР
// const {BtnsUnit1} = require("../BTN_KEYBORDS/BUTTONS_UNIT_C&I");

const MenuHamburger = [
		{
				command: '/' + process.env.COMMAND_MENU,
				description: 'Начать работу'
		},
		{
				command: '/' + process.env.COMMAND_HELP,
				description: 'Как пользоваться'
		},
		{
				command: '/' + process.env.COMMAND_SHARE,
				description: 'Поделиться ботом'
		},
		{
				command: '/' + process.env.COMMAND_START,
				description: 'Расскажу, что я умею'
		},
]
module.exports.MenuHamburger = MenuHamburger