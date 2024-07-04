// работа с файлами
// https://www.youtube.com/watch?v=uCEfa6JX0-k

// ТУТ КАК ПОЛУЧАТЬ ФАЙЛЫ В ГРАММИ https://grammy.dev/guide/files
const fs = require('fs')
const axios = require('axios')
const {logger} = require("../LOGGER/LOGGER");
const {My_Func} = require("../FUNC/MY_FUNC");
const {InputFile, Keyboard} = require("grammy");
const {writeFile} = require('node:fs');

// https://grammy.dev/plugins/files подключение плагина описал в ридми
//функция нормально работает только если файл имеет расширение jpg (картинка, видео)
async function _saveFile(ctx, pathFile) {
		try {
				const file = await ctx.getFile()
				// console.log(file)
				const q = await file.download(pathFile)
				return true
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_saveFile],
				[USER ID - ${ctx.chat.id}]
				[err - ${e}]`)
				return false
		}
}


async function _downloadImage(url, filename) {
		try {
				const response = await axios.get(url, {responseType: 'arraybuffer'});
				await fs.writeFile(filename, response.data, (err) => {
						if (err) throw err;
				})
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_downloadImage],
				[URL - ${url}],
				[FILE NAME - ${filename}],
				[err - ${e}]`)
		}
}


async function _sendMsgFromFile(path, ctx) {
		try {
				await fs.readFile(path, function (error, data) {
						if (error) {  // если возникла ошибка
								ctx.reply(`Не смог загрузить подпись к файлу. Возможно меню уже устарело. Вызови "Меню" снова или нажми /${process.env.COMMAND_MENU} `
										, {reply_markup: {remove_keyboard: true}},)
						} else {
								ctx.reply(data.toString()
										, {
												parse_mode: 'HTML',
												// disable_notification: true,//убираем звук в сообщении
												disable_web_page_preview: true//убираем превью
										})
						}
				})
				return true
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_sendMsgFromFile],
				[USE ID - ${ctx.chat.id}],
				[FILE NAME - ${path}],
				[err - ${e}]`)
				return false
		}
}

async function _sendPhotoFromFile(arrStack, path, ctx) {
		try {
				await ctx.replyWithPhoto(new InputFile(path), {
						reply_markup: arrStack.length === 0 ? {remove_keyboard: true} : Keyboard.from(arrStack.at(-1)).resized(),
				})
				return true
		} catch (e) {
				ctx.reply(`Не смог загрузить файл. Возможно меню уже устарело. Вызови "Меню" снова или нажми /${process.env.COMMAND_MENU} `
						, {reply_markup: {remove_keyboard: true}},)
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_sendPhotoFromFile],
				[USE ID - ${ctx.chat.id}],
				[err - ${e}]`)
				return false
		}
}

const _removeDataFromFile = async (fromFileName, toFileName) => {
		try {
				await fs.rename(fromFileName, toFileName, (e) => {
				})
				return true
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ОШИБКА ЗАПИСИ В ФАЙЛ]
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_removeDataFromFile],
				[err - ${e}]`)
				return false
		}
}

const _createTxtFile = async (filePath, content) => {
		// await fs.unlink(filePath, (err) => {
		// 		if (err) return false
		// })
		try {
				await fs.writeFile(filePath,
						content,
						'utf8',
						(err) => {
								if (err) return false
						})
				return true
		} catch (e) {
				logger.error(`[${My_Func._getDateTime()}],
				[ФАЙЛ - FILES_FUNC.JS], [ФУНКЦИЯ -_createTxtFile],
				[err - ${e}]`)
				return false
		}
}

function _isValidFileExtension(filename, allowedExtensions) {
		// Разделяем имя файла на части по точке
		const parts = filename.split('.');

		// Если в имени файла нет точки, возвращаем false
		if (parts.length === 1) return false;

		// Получаем последнее слово после последней точки
		const extension = parts[parts.length - 1];

		// Проверяем, содержится ли расширение в массиве разрешённых расширений
		return allowedExtensions.includes(extension);
}



		const File_Func = {
				_sendMsgFromFile,
				_sendPhotoFromFile,
				_removeDataFromFile,
				_createTxtFile,
				_downloadImage,
				_saveFile,
				_isValidFileExtension,
		}


		module.exports.File_Func = File_Func

// СИНХРОННОЕ ЧТЕНИЕ ФАЙЛА
// const dataCommandStartText = fs.readFileSync(pathCommandStartText, {encoding: 'utf8', flag: 'r'})
//скопировать массив
//let cloneSheeps = JSON.parse(JSON.stringify(sheeps))




