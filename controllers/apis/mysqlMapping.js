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
	randomQuery: "select tdid, lat, lng from ?? WHERE tdid = ? and dayType IN (?);"
};
 
module.exports = mapping;