const {format} = require("winston");
const {My_Func} = require("../FUNC/MY_FUNC");
const {logger} = require("./LOGGER");

const _errorFilter = format((info, opts) => {
		return info.level === 'error' ? info : false;
});

const _infoFilter = format((info, opts) => {
		return info.level === 'info' ? info : false;
});




const Logger_Func = {
		_infoFilter,
		_errorFilter,
}
module.exports.Logger_Func = Logger_Func