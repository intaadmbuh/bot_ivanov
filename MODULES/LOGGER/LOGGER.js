const {transports, format, createLogger} = require('winston');
const TelegramLogger = require('winston-telegram')
const {
		combine,
		timestamp,
		printf,
		colorize,
		align,
		json,
		errors,
		prettyPrint,
} = format;

//https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
require('winston-daily-rotate-file')
const {Logger_Func} = require('./LOGGER_FUNC')


const fileRotateError = new transports.DailyRotateFile({
		filename: './LOG/error-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '14d',
		level: 'error',
		format: combine(
				Logger_Func._errorFilter(),
				colorize({all: true}),
				errors({stack: true}),
				timestamp({
						format: 'YYYY-MM-DD hh:mm:ss.SSS A',
				}),
				json(),
				prettyPrint(),
		),


});
const fileRotateInfo = new transports.DailyRotateFile({
		filename: './LOG/info-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '14d',
		level: 'info',
		format: combine(
				Logger_Func._infoFilter(),
				colorize({all: true}),
				errors({stack: true}),
				timestamp({
						format: 'YYYY-MM-DD hh:mm:ss.SSS A',
				}),
				json(),
				prettyPrint(),
				// align(),
				// printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
		),

});
const fileRotateCombined = new transports.DailyRotateFile({
		level: 'info',
		filename: './LOG/combined-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '14d',
		format: combine(
				colorize({all: true}),
				errors({stack: true}),
				timestamp({
						format: 'YYYY-MM-DD hh:mm:ss.SSS A',
				}),
				json(),
				prettyPrint(),
		),
});

const fileRotateExceptions = new transports.DailyRotateFile({
		level: 'info',
		filename: './LOG/Exceptions-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '14d',
		format: combine(
				json(),
				prettyPrint(),
		),
});
const fileRotateRejections = new transports.DailyRotateFile({
		level: 'info',
		filename: './LOG/Rejections-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '14d',
		format: combine(
				json(),
				prettyPrint(),
		),

});

//https://www.npmjs.com/package/winston-telegram?activeTab=code
//examples
//https://github.com/ivanmarban/winston-telegram/tree/master/examples
const telegramLog = new TelegramLogger({
		name: 'info-channel',
		token: process.env.BOT_API_KEY,
		chatId: process.env.BOT_ADMIN_ID_1,
		level: 'error',
		unique: true,
		disableNotification: true,
		batchingDelay: 1000,
		format:timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A',}),
})

//https://github.com/winstonjs/winston
const logger = createLogger({
		// exitOnError: false,
		format: combine(errors({stack: true}), timestamp(), json()),
		transports: [
				new transports.Console({
						level: 'info',
						format: combine(errors({stack: true}), timestamp(), json()),
				}),
				fileRotateError,
				fileRotateInfo,
				fileRotateCombined,
				telegramLog,
		],
		exceptionHandlers: [
				fileRotateExceptions,
		],
		rejectionHandlers: [
				fileRotateRejections,
		],
})


module.exports.logger = logger

// {
// 		emerg: 0,
// 				alert: 1,
// 		crit: 2,
// 		error: 3,
// 		warning: 4,
// 		notice: 5,
// 		info: 6,
// 		debug: 7
// }