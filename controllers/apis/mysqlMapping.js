/**
 * mysqlMapping.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-25 13:44:20
 * @version $Id$
 */

// CRUD SQL
let mapping = {
	getValScale: {
		'sum': "SELECT MAX(??) AS 'eval', MAX(??) AS 'dval' FROM ??;",
		'ave': "SELECT MAX(??/??) AS 'eval', MAX(??) AS 'dval' FROM ??;"
	},
	/*
	getOverviewVal: {
		'sum': "SELECT id, ?? AS 'eval', ?? AS 'dval' FROM ?? WHERE ?? >= 0 AND ?? > 0;",
		'ave': "SELECT id, ??/?? AS 'eval', ?? AS 'dval' FROM ?? WHERE ?? >= 0 AND ?? > 0;"
	},
	*/
	getOverviewValE:{
		'sum': "SELECT id, ?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 ORDER BY ??;",
		'ave': "SELECT id, ??/?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 ORDER BY ??/??;"
	},
	getOverviewValD:{
		'sum': "SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 ORDER BY ??;",
		'ave': "SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 ORDER BY ??;"
	},
	getCompareValTimeE:{
		'sum': "SELECT id, ?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"ORDER BY val;",
		'ave': "SELECT id, ??/?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM ?? WHERE ?? >= 0 AND ?? > 0 " +
				"ORDER BY val;"
	},
	getCompareValTimeD:{
		'sum': "SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"ORDER BY val;",
		'ave': "SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM ?? WHERE ?? > 0 " +
				"ORDER BY val;"
	},
	getCompareValCityE:{
		'sum': "SELECT id, ?? AS 'val' FROM bjEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM tsEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM tjEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM zjkEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"ORDER BY val;",
		'ave': "SELECT id, ??/?? AS 'val' FROM bjEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM tsEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM tjEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"UNION SELECT id, ??/?? AS 'val' FROM zjkEmatrix WHERE ?? >= 0 AND ?? > 0 " +
				"ORDER BY val;"
	},
	getCompareValCityD:{
		'sum': "SELECT id, ?? AS 'val' FROM bjEmatrix WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM tsEmatrix WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM tjEmatrix WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM zjkEmatrix WHERE ?? > 0 " +
				"ORDER BY val;",
		'ave': "SELECT id, ?? AS 'val' FROM bjEmatrix WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM tsEmatrix WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM tjEmatrix WHERE ?? > 0 " +
				"UNION SELECT id, ?? AS 'val' FROM zjkEmatrix WHERE ?? > 0 " +
				"ORDER BY val;"
	},
	getAoiVal: "SELECT ?? AS 'num', lat, lng, dis FROM ?? WHERE dis != 0;",
	getDistribute: function(mtype, sMax) {
		if (mtype === 'sum') {
			return `SELECT ROUND(LOG(??+1)*100/LOG(${sMax+1})) AS 'k', COUNT(1) AS 'v' FROM ?? WHERE ?? >= 0 AND ?? > 0 GROUP BY ROUND(LOG(??+1)*100/LOG(${sMax+1}));`;
		} else if (mtype === 'ave') {
			return `SELECT ROUND(LOG(??/??+1)*100/LOG(${sMax+1})) AS 'k', COUNT(1) AS 'v' FROM ?? WHERE ?? >= 0 AND ?? > 0 GROUP BY ROUND(LOG(??/??+1)*100/LOG(${sMax+1}));`;
			// return `SELECT ROUND(100*??/??/${sMax}) AS 'k', COUNT(1) AS 'v' FROM ?? WHERE ?? >= 0 AND ?? >= 0 GROUP BY ROUND(100*??/??/${sMax});`
		}
	},
};
 
module.exports = mapping;