// conf/db.js
// 
// MySQL数据库联接配置
var mysql = require('mysql');

var mysqlpool = mysql.createPool({
	host    : '192.168.1.42', 
	user    : 'root',
	password: 'vis_2014',
	database: 'tsu_explore',
	port    : 3306,
	timezone: 'GMT',
	debug	: false,
	multipleStatements: true 
})

module.exports = mysqlpool;
