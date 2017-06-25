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
	getOverviewVal: {
		'sum': "SELECT id, ?? AS 'eval', ?? AS 'dval' FROM ?? WHERE ?? >= 0 AND ?? > 0;",
		'ave': "SELECT id, ??/?? AS 'eval', ?? AS 'dval' FROM ?? WHERE ?? >= 0 AND ?? > 0;"
	},
	getAoiVal: "SELECT ?? AS 'num', lat, lng, dis FROM ?? WHERE dis != 0;",
	getDistribute: function (mtype, sMax) {
		if (mtype === 'sum') {
			return `SELECT ROUND(LOG(??+1)*100/LOG(${sMax+1})) AS 'k', COUNT(1) AS 'v' FROM ?? WHERE ?? >= 0 AND ?? > 0 GROUP BY ROUND(LOG(??+1)*100/LOG(${sMax+1}));`;
		} else if (mtype === 'ave') {
			return `SELECT ROUND(LOG(??/??+1)*100/LOG(${sMax+1})) AS 'k', COUNT(1) AS 'v' FROM ?? WHERE ?? >= 0 AND ?? > 0 GROUP BY ROUND(LOG(??/??+1)*100/LOG(${sMax+1}));`;
			// return `SELECT ROUND(100*??/??/${sMax}) AS 'k', COUNT(1) AS 'v' FROM ?? WHERE ?? >= 0 AND ?? >= 0 GROUP BY ROUND(100*??/??/${sMax});`
		}
	},
	getValidPoints: "SELECT COUNT(*) AS 'num', gridid AS 'id' from validrecs GROUP BY gridid;"
};

module.exports = mapping;