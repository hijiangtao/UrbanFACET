/**
 * mysqlMapping.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-25 13:44:20
 * @version $Id$
 */

// CRUD SQL
let mapping = {
	tpqueryrecords: "select tdid AS id, lat, lng from cbeijing WHERE tdid in (?) AND dayType = ? AND timeSegID >= ? AND timeSegID < ?;",
	spetpqueryrecords: "select tdid AS id, lat, lng from cbeijing WHERE tdid in (?) AND dayType in (?);",
	tpqueryrecordsNight: "select tdid AS id, lat, lng from cbeijing WHERE tdid in (?) AND dayType = ? AND (timeSegID >= ? OR timeSegID < ?);",
	
	madisplayquery: "SELECT tdid AS id, timeSegID div 10 AS 'group', lat, lng from cbeijing WHERE dayType = ? AND (timeSegID >= ? AND timeSegID < ?) LIMIT 20000;",
	madisplayqueryNight: "SELECT tdid AS id, timeSegID div 10 AS 'group', lat, lng from cbeijing WHERE dayType = ? AND (timeSegID >= ? OR timeSegID < ?) LIMIT 20000;",

	areaidlistquery: "SELECT id from ??;",
	arearecordsquery: "SELECT lat, lng from ?? WHERE timeSegID >= ? AND timeSegID < ? AND dayType = ? LIMIT 10000",
	arearecordsquerynight: "SELECT lat, lng from ?? WHERE (timeSegID >= ? OR timeSegID < ?) AND dayType = ?",

	getValScale: "SELECT MAX(??) AS 'eval', MAX(LOG2(??)) AS 'dval' FROM ??;",
	getOverviewVal: "SELECT id, ?? AS 'eval', LOG2(??) AS 'dval' FROM ?? WHERE ?? >= 0 AND ?? > 0;"
};
 
module.exports = mapping;