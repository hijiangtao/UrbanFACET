/**
 * MySQL数据库联接配置
 * 本地/服务器
 */
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
	host    : '192.168.1.42', 
	user    : 'root',
	password: 'vis_2014',
	database: 'tdnormal',
	port    : 3306,
	timezone: 'GMT',
	debug	: false,
	multipleStatements: true 
});

module.exports = server;
