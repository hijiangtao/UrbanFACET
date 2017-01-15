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
	madisplayqueryNight: "SELECT tdid AS id, timeSegID div 10 AS 'group', lat, lng from cbeijing WHERE dayType = ? AND (timeSegID >= ? OR timeSegID < ?) LIMIT 20000;"
};

let test = {
	huilongguan_idlist: "SELECT DISTINCT(tdid) from cbeijing WHERE lat >40.0581 AND lat<40.0933 AND lng >116.2917 AND lng <116.3694 INTO OUTFILE '/tmp/huilongguan-idlist.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	huilongguan_records: "SELECT * from cbeijing WHERE lat >40.0581 AND lat<40.0933 AND lng >116.2917 AND lng <116.3694 INTO OUTFILE '/tmp/huilongguan-records.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	tiantongyuan_idlist: "SELECT DISTINCT(tdid) from cbeijing WHERE lat >40.0565 AND lat<40.0782 AND lng >116.3991 AND lng <116.4360 INTO OUTFILE '/tmp/tiantongyuan-idlist.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	tiantongyuan_records: "SELECT * from cbeijing WHERE lat >40.0565 AND lat<40.0782 AND lng >116.3991 AND lng <116.4360 INTO OUTFILE '/tmp/tiantongyuan-records.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	beihang_idlist: "SELECT DISTINCT(tdid) from cbeijing WHERE lat >39.9759 AND lat<39.9848 AND lng >116.3353 AND lng <116.3474 INTO OUTFILE '/tmp/beihang-idlist.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	beihang_records: "SELECT * from cbeijing WHERE lat >39.9759 AND lat<39.9848 AND lng >116.3353 AND lng <116.3474 INTO OUTFILE '/tmp/beihang-records.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	xizhimen_idlist: "SELECT DISTINCT(tdid) from cbeijing WHERE lat >39.9272 AND lat<39.9555 AND lng >116.3198 AND lng <116.3604 INTO OUTFILE '/tmp/xizhimen-idlist.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	xizhimen_records: "SELECT * from cbeijing WHERE lat >39.9272 AND lat<39.9555 AND lng >116.3198 AND lng <116.3604 INTO OUTFILE '/tmp/xizhimen-records.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	bjxizhan_idlist: "SELECT DISTINCT(tdid) from cbeijing WHERE lat >39.8924 AND lat<39.8958 AND lng >116.3103 AND lng <116.3199 INTO OUTFILE '/tmp/bjxizhan-idlist.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	bjxizhan_records: "SELECT * from cbeijing WHERE lat >39.8924 AND lat<39.8958 AND lng >116.3103 AND lng <116.3199 INTO OUTFILE '/tmp/bjxizhan-records.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';",
	gugong_idlist: "SELECT DISTINCT(tdid) from cbeijing WHERE lat >39.9119 AND lat<39.9215 AND lng >116.3858 AND lng <116.3958 INTO OUTFILE '/tmp/gugong-idlist.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';"
}




// huilongguan
// Query OK, 4957 rows affected (14.13 sec)
// Query OK, 124985 rows affected (14.16 sec)

// tiantongyuan
// Query OK, 2467 rows affected (9.06 sec)
// Query OK, 51228 rows affected (9.13 sec)

// beihang
// Query OK, 887 rows affected (10.09 sec)
// Query OK, 9224 rows affected (8.24 sec)

// xizhimen
// Query OK, 7306 rows affected (4 min 59.70 sec)
// Query OK, 87186 rows affected (2.94 sec)

// bjxizhan
// Query OK, 1457 rows affected (6.34 sec)
// Query OK, 4179 rows affected (5.47 sec)

 
module.exports = mapping;