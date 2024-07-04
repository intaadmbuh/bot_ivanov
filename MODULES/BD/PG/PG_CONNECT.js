// https://sequelize.org/docs/v6/getting-started/
//5043082800 Лехин айдишник
require('dotenv').config()
// const env = require('dotenv').config()
const {Sequelize} = require('sequelize')
const {logger} = require("../../LOGGER/LOGGER");

//ЦЕПЛЯЕМСЯ К БД SUMMARY
//НО СПЕРВА ЕЁ НАДО ЛОКАЛЬНО СДЕЛАТЬ РУКАМИ. ТАБЛИЦУ СДЕЛАЕМ УЖЕ АВТОМАТОМ ИЗ МОДЕЛЕЙ

const DbConnect = new Sequelize(process.env.DATABASE_URL,
    {
        timezone: '+03:00',
    })

//https://sequelize.org/docs/v6/getting-started/
module.exports.DbConnect = DbConnect

