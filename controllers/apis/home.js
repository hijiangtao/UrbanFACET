/**
 * index.js in apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 16:22:50
 * @version $Id$
 */
'use strict'

let fs = require('fs');
let path = require('path');

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

const lib = require('../../conf/lib');
const DATA = require('../../conf/data')

const shell = require('shelljs');

// mongoDB 回调函数
let mongoCallback = function(err, result) {
    if (err) {
        console.log(err);
    } else if (result.length) {
    	for (var i = 0; i < clalist.length; i++) {
    		// clalist[i]
    		let matrixsum = {},
	            recnumdata = {}; // 存的所有人 matrix 集合加和, 以及分时段的定位次数加和

	        // 计算每个类别下的累积 matrix 和分时段定位 array
	        for (let i = 0; i < result.length; i++) {
	        	let id = result[i]['_id'].toString(), pVec = result[i]['pVec'], tpNumVec = result[i]['tpNumVec'], totalNum = result[i]['totalNum'], cla = claidRelation[ id ];

	            if ( !lib.ArrayContains(matrixsum, cla) ) {
	                matrixsum[cla] = lib.MatrixAdd(result[i]['pVec'], result[i]['pVec'], 0.5, 2)
	                recnumdata[cla] = result[i]['tpNumVec']
	            } else {
	                matrixsum[cla] = lib.MatrixAdd(result[i]['pVec'], matrixsum[id], 1, 2)
	                recnumdata[cla] = lib.MatrixAdd(recnumdata[id], result[i]['tpNumVec'], 1, 1)
	            }
	        }

	        // 
    	}
    } else {
        console.log('No document(s) found with defined "find" criteria!');
    }

    let data=[]
    for (let x = 0; x < clalist.length; x++) {
    	// 统计档案
    	let cla = clalist[x]
	    let tmpresult = {}, poicolsum = [], poiwholesum = 0, recsum = recnumdata[cla].reduce( (a,b)=>a+b, 0 )

	    // 删除 matrix 最后一栏 POI
	    for (let i = 0; i < 12; i++) {
	    	matrixsum[cla][i].splice(10, 1);
	    	poicolsum.push( matrixsum[cla][i].reduce( (a,b)=> a+b, 0 ) )
	    }
	    poiwholesum = poicolsum.reduce( (a,b)=> a+b, 0 )

	    tmpresult['userid'] = idstr
	    tmpresult['_id'] = cla
	    tmpresult['poisum'] = poiwholesum
	    tmpresult['recsum'] = recsum
	    tmpresult['matrix'] = matrixsum[cla]


	    // POI Types
	    for (let i = 0; i < 9; i++) {
	    	// Time periods 0-5
	    	for (let j = 0; j < 6; j++) {
	    		tmpresult[`POI-${i}-t${j}`] = Number.parseFloat(matrixsum[cla][j][i] + matrixsum[cla][j+6][i]) / (poicolsum[j] + poicolsum[j+6])
	    	}
	    	// specific time periods 6-
	    	// 
	    	tmpresult[`POI-${i}-t6`] = sixcolsum(i, 0, 'matrixsum')/sixcolsum(i, 0, 'poicolsum')
	    	tmpresult[`POI-${i}-t7`] = sixcolsum(i, 1, 'matrixsum')/sixcolsum(i, 1, 'poicolsum')
	    	tmpresult[`POI-${i}-t8`] = (matrixsum[cla][1][i] + matrixsum[cla][2][i] + matrixsum[cla][3][i] + matrixsum[cla][7][i] + matrixsum[cla][8][i] + matrixsum[cla][9][i]) / (poicolsum[1] + poicolsum[2] + poicolsum[3] + poicolsum[7] + poicolsum[8] + poicolsum[9])

	    	function sixcolsum(poi, index, type) {
	    		let result = 0.0
	    		if (type === 'matrixsum') {
	    			for (let i = 0; i < 6; i++) {
		    			result += matrixsum[cla][i+index*6][poi]
		    		}
	    		} else {
	    			for (let i = 0; i < 6; i++) {
		    			result += poicolsum[i+index*6]
		    		}
	    		}
	    		
	    		return result
	    	}
	    }

	    data.push(tmpresult)
    }

    // 插入统计档案数据,以便之后查询
    db.collection('tmp').deleteMany({'userid': idstr}, function(err, res) {
    	db.collection('tmp').insertMany(data, function(err, result) {
    		if (err) {
    			console.log(err)
    		} else {
    			console.log("Inserted documents into the document collection");
				res.json({ 'scode': 1, 'filename': datadir + oupfile, 'id': idstr, 'recomdData': data })	
    		}

			db.close()
		});
    })    
}

// 预测结果计算函数
let recomdCal = function(dir, file, idstr) {
    fs.readFile(path.join(dir, file), readfileCallback);

    function readfileCallback(err, data) {
        // body...
        if (err) {
            return console.error(err);
        }
        // rawdata stores all origin data rows, groupedData stores the people records grouped by their belonged classes, clalist stores the classes string array, idlist stores all id string array
        console.log('CSV file loaded.')
        let rawdata = data.toString().split('\r\n'), groupedData = {}, clalist = [], idlist = [], claidRelation = {}

        for (let i = 0; i < rawdata.length; i++) {
            let tmparr = rawdata[i].split(','),
                cla = tmparr[6].toString(),
                id = tmparr[0].toString();
            idlist.push(id);
            claidRelation[ id ] = cla;

            // noise group
            if (cla === '-1') {
                continue
            }

            if (groupedData.hasOwnProperty(cla)) {
                groupedData[cla].push(tmparr);
            } else {
                clalist.push(cla);
                groupedData[cla] = [tmparr];
            }
        }

        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                console.log('Connection established to', url);

                let collection = db.collection('features_beijing');

                collection.find({
                    '_id': {
                        "$in": idlist
                    }
                }, { 'pVec': 1, 'tpNumVec': 1, 'totalNum': 1 }).toArray(mongoCallback);
            }
        });
    }   
}

let home = {
    /**
     * [tsnetrain description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    tsnetrain(req, res, next) {
        let params = req.query,
            region = params.region,
            feature = params.feature,
            srate = params.srate,
            id = params.id;

        let file = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}.csv`
        console.log(path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data', file))
        if (lib.checkDirectory(path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data', file))) {
            res.json({ 'scode': 1 })
        } else {
            res.json({ 'scode': 0 })
        }
    },
    /**
     * [clustertrain description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    clustertrain(req, res, next) {
        let params = req.body,
            eps = params.eps,
            minpts = params.minpts,
            pkg = JSON.parse(params['pkg']),
            region = params.region,
            feature = params.feature,
            srate = params.srate,
            id = Date.parse(new Date());

        let ftypestr = DATA.getValue(feature, 'feature'),
            inpfile = `1-in-${srate}_tsne-${ftypestr}`,
            oupfile = `DBScanCluster-1-in-${srate}_tsne-${ftypestr}(eps=${eps},minpts=${minpts}).csv`,
            scriptdir = path.join(__dirname, '../../server/scripts/'),
            datadir = path.join(__dirname, '../../server/data')

        let clsrun;

        if (lib.checkDirectory(path.join(datadir + '/tmp', oupfile))) {
            console.log('I am already exist.')
            // res.json({ 'scode': 1, 'filename': datadir + oupfile })
            recomdCal(datadir + '/tmp', oupfile, id)
        } else {
            clsrun = shell.exec(`cd ${scriptdir} && python ./ClusterUser.py -d ${datadir} -f ${inpfile} -x ${eps} -y ${minpts}`).stdout;
            if (lib.checkDirectory(path.join(datadir, '/tmp', oupfile))) {
                recomdCal(datadir + '/tmp', oupfile, id)
            } else {
                res.json({ 'scode': 0 })
            }
        }
    },
    labeltrain(req, res, next) {
    	let params = req.query,
    		theme = params.theme,
    		rangeVal = Number.parseInt(params.rangeVal),
    		paramval = Number.parseInt(params.paramval),
            id = params.id;

        let poi = DATA.getValue(theme, 'theme')
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                console.log('Connection established to', url);

                let collection = db.collection('tmp'), sortstr = `POI-${poi}-t${paramval-1}`;

                collection.find({ 'userid': id }).sort({ sortstr: -1 }).toArray(function(err, res) {
                	if (err) {
                		console.log(err)
                	} else {
                		let clalist = [], matrixlist = {}, clalen = Number.parseInt(rangeVal / 100.0 * res.length)

                		if (clalen === 0) {
                			res.json({'scode': 0});
                		}

                		for (let i = 0; i < clalen; i++) {
                			clalist.push(res[i]['_id'])
                			matrixlist[ res[i]['_id'] ] = res[i]['matrix']
                		}

                		res.json({
                			'scode': 1,
                			'length': clalen,
                			'clalist': clalist,
                			'matrixlist': matrixlist
                		})
                	}
                });
            }
        });
    }
}

module.exports = home
