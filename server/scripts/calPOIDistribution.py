#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-03-30 09:02:11
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import sys
import json
import getopt
import gc
import logging
from CommonFunc import connectMYSQL, connectMongo, getCityDistricts

def getValidGrids(city, dic):
	conn, mdb = connectMongo('tdnormal')
	collectname = 'newgrids_%s' % city

	citynames = {
		'beijing': 'bj',
		'tianjin': 'tj',
		'zhangjiakou': 'zjk',
		'tangshan': 'ts'
	}
	
	# 获取poi分布网格信息
	poiDisRes = list(mdb[collectname].find({ 
		'properties.vecvalid': True
	}, {
		'properties.vec': 1,
		'properties.uid': 1
	}))
	conn.close()

	# 获取density信息以及行政区划信息
	db, cur = connectMYSQL('tdnormal')
	cur.execute("SELECT id, dis, wpnumber AS 'num' from %sEmatrix WHERE wpnumber > 0;" % citynames[city])
	
	denarr = {}
	disarr = []
	for each in cur.fetchall():
		# print each
		dis = str(each[1])
		denarr[str(each[0])] = {
			'dis': dis,
			'num': long(each[2])
		}

		if dis not in disarr:
			disarr.append(dis)

	cur.close()
	db.close()

	print "sql ready"

	res = {
		'total': [0.0]*11
	}
	# 初始化各区划及城市总值对象
	for each in disarr:
		res[each] = [0.0]*11
	
	# 遍历poi网格更新对象
	# 
	for each in poiDisRes:
		id = str(each['properties']['uid'])
		if id in denarr:
			# print 'here'
			for x in xrange(0,11):
				increment = denarr[id]['num']*each['properties']['vec'][x]
				dis = denarr[id]['dis']
				if dis in res:
					res[ dis ][x] += increment
				else:
					res[ dis ] = [0.0]*11 
					res[ dis ][x] += increment
				res[ 'total' ][x] += increment
	
	# 存储对象进文件
	

	# output = {}
	# for k in res:
	# 	if k == 'total':
	# 		output[k] = res[k]
	# 	else:
	
	with open(os.path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data/tmp', '%s_poidis.json' % citynames[city]), 'w+') as target:
		json.dump(res, target)
	target.close()


def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:d:", ["help", "city=", "direcotry="])
	except getopt.GetoptError as err:
		# print help information and exit:
		print str(err) 
		sys.exit(2)

	city, dic = 'beijing', '/home/taojiang/git/'
	for opt, arg in opts:
		if opt == '-h':
			print 'No usage now.'
			sys.exit()
		elif opt in ("-c", "--city"):
			city = arg
		elif opt in ("-d", "--direcotry"):
			dic = arg

	# getValidGrids('beijing', dic)
	getValidGrids('tianjin', dic)
	getValidGrids('zhangjiakou', dic)
	getValidGrids('tangshan', dic)
	

if __name__ == '__main__':
	main(sys.argv[1:])