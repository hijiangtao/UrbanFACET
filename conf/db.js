// conf/db.js
// 
// MySQL数据库联接配置
var mysql = require('mysql');

var localhost = mysql.createPool({
	host    : 'localhost', 
	user    : 'root',
	password: 'iscas',
	database: 'tdnormal',
	port    : 3306,
	timezone: 'GMT',
	debug	: false,
	multipleStatements: true 
});

var server = mysql.createPool({
	host    : 'localhost', 
	user    : 'root',
	password: 'vis_2014',
	database: 'tdnormal',
	port    : 3306,
	timezone: 'GMT',
	debug	: false,
	multipleStatements: true 
});

module.exports = localhost;
