// userSqlMapping.js
// CRUD SQL
let mapping = {
	randomOverview: 'select tdid, lat, lng from ?? WHERE (timeID < 12 OR timeID > 138) AND dayType = ? ORDER BY rand() LIMIT 10000',
	randomQuery: "select tdid, lat, lng from ?? WHERE tdid = ? and dayType IN (?);",
	randomDevList: 'SELECT tdid AS name, tdid AS value from idrecords_list where usertype = ? and coverday > 1 ORDER BY rand() LIMIT 10;',
	queryRecords: 'select tdid, lat, lng from ?? WHERE timeID > ? AND timeID < ? AND dayType = "workday"',
	queryStats: ';'
};
 
module.exports = mapping;