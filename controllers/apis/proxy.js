"use strict"

var Http = require('http');
var fs = require('fs');
var path = require('path');

class ProxyMethod {
	constructor(method, path, port=8080, hostname="172.30.118.1") {
		this.opt = {
			"hostname": hostname,
			"port": port,
			"path": path,
			"method": method,
			"headers": {'Content-Type': 'application/json; charset=UTF-8'}
		}
	}

	static callback(res, sender) {
		let tmpdata = [];
		res.on('data', function (data) {
	        tmpdata.push(data);
	    });
	    res.on('end', function() {
            try {
            	tmpdata = JSON.parse(tmpdata.join(''));
                sender.json(tmpdata);
            } catch (err) {
                console.error('Unable to parse response as JSON', err);
            }
        });
	}
}

let proxyQuery = {
	initPage(req, res, next) {
		"use strict"
		let params = req.params,
			pageid = params.page;

		if (pageid === "socialmap" || pageid === "zhuoyue") {
			res.send({});
			return ;
		}

		let proxyins = new ProxyMethod('GET', `/init/${pageid}`);
		
		let proxyreq = Http.request(proxyins.opt, function(result) {
			ProxyMethod.callback(result, res);
		});

		proxyreq.end();
	}
}

module.exports = proxyQuery;