const mysql = require('mysql')
require("dotenv").config()
const urlDB=`mysql://root:5Ef3Gefb3f2--CGa4HGgEf4Cddhe5ebD@monorail.proxy.rlwy.net:50643/railway`
const connection = mysql.createConnection(urlDB)
// moeez
// host:'localhost',
// database:'dbs',
// user:'root',
// password:'moeez.200317'


//taha
// host:'localhost',
//     database:'dbs',
//     user:'root',
//     password:'root'
module.exports = connection
