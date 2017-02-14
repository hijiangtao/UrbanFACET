// conf/db.js
// 
// MySQL数据库联接配置
var mysql = require('mysql');

var mysqlpool = mysql.createPool({
	host    : 'localhost', 
	user    : 'root',
	password: 'iscas',
	database: 'tdnormal',
	port    : 3306,
	timezone: 'GMT',
	debug	: false,
	multipleStatements: true 
})

module.exports = mysqlpool;
