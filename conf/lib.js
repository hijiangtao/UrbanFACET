/**
 * lib.js in backend
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 12:31:51
 * @version $Id$
 */

'use strict'
let fs = require('fs');
let path = require('path');

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';
let pool = require('./db');
let $sql = require('../controllers/apis/mysqlMapping');

let ArrayContains = function(obj, val) {
    var i = obj.length;
    while (i--) {
        if (obj[i] == val) {
            return true;
        }
    }
    return false;
}

let MatrixAdd = function(a, b, times, dim) {
    let result = [];

    if (dim == 1) {
        for (let i = 0; i < a.length; i++) {
            result.push(parseFloat(a[i]) + parseFloat(b[i]));
        }
        return result
    }

    for (let i = 0; i < a.length; i++) {

        let arr = []; // 一般矩陣
        for (let j = 0; j < a[i].length; j++) {
            let sum = (parseFloat(a[i][j]) + parseFloat(b[i][j])) * times;
            arr.push(sum);
        }
        result.push(arr);
    }

    return result
}

let checkDirectory = function(directory) {  
    if (fs.existsSync(directory)) {
        return true
    }

    return false
}

let connectMongo = function() {
     let promise = new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                reject(err)
            } else {
                resolve(db)
            }
        })
     })

     return promise
}

let connectMySQL = function() {
    let promise = new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err)
            } else {
                resolve(connection)
            }
        })
    })

    return promise
}

let getDatafromFile = function(filename) {
    let promise = new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })

    return promise
}

let readIdlistMySQL = function(conn, table) {
    let promise = new Promise(function(resolve, reject) {
        let sql = $sql.areaidlistquery,
            param = [table]
        conn.query(sql, param, function(err, res) {
            if(err) {
                reject(err)
            } else {
                let idlist = []
                console.log('get idlist result')
                for (let i = res.length - 1; i >= 0; i--) {
                    idlist.push( Number.parseInt(res[i]['id']) )
                }

                resolve(idlist)
            }
        })
    })

    return promise
}

module.exports = {
    ArrayContains: ArrayContains,
	MatrixAdd: MatrixAdd,
    checkDirectory: checkDirectory,
    connectMongo: connectMongo,
    connectMySQL: connectMySQL,
    readIdlistMySQL: readIdlistMySQL,
    getDatafromFile: getDatafromFile
}