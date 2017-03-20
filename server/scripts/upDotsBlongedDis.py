#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-03-19 16:48:56
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import sys
import getopt
import json
from shapely.geometry import shape, Point
from CommonFunc import getCityLocs, connectMongo, matrixtofile, getAbbName, getDistrictsNum, getDisIndex

def upDotsBlongedDis(city, dic):
	# 获得 grids 
	grids = [] # 存储结果
	count, validcount = 0, 0
	conn, db = connectMongo('tdnormal')
	GRID = db['newgrids_%s' % city]

	# 获取所有 grids 结果
	dbgrids = list( GRID.find({}, {"properties.uid": 1, "properties.center": 1}) )

	# 构建栅栏数组
	disobjs = []
	with open(os.path.join(dic, getAbbName(city)+'.json')) as f:
		data = json.load(f)
		features = data['features']

		for each in features:
			disobjs.append({
				'name': each['properties']['name'],
				'geo': shape(each['geometry'])
			})
		# 处理围栏数据

	for each in dbgrids:
		try:
			coords = each['properties']['center']['coordinates']
			point = Point(coords[0], coords[1])
			index = getDisIndex(point, disobjs)
			count += 1
			if index != -1:
				validcount += 1
				if validcount % 10000 == 0:
					print 'Valid Grids num: %d, Total Grids num: %d' % (validcount, count)

				grids.append([each['properties']['uid'], index])
		except Exception as e:
			print each
			print e
			continue
		finally:
			pass

	print "City %s owns valid distict grids %d" % (city, len(grids))
	return grids

def main(argv):
	# 初始化参数
	try:
		opts, args = getopt.getopt(argv, "c:d:", ["city=", "direcotry="])
	except getopt.GetoptError as err:
		print str(err)
		sys.exit(2)

	city, poifiles, dic = 'beijing', '/home/taojiang/git/living-modes-visual-comparison/conf/data', '/enigma/tao.jiang/datasets/JingJinJi/records/disinfo'
	for opt, arg in opts:
		if opt == '-h':
			print 'No Doc Now.'
			sys.exit()
		elif opt in ("-c", "--city"):
			city = arg
		elif opt in ("-d", "--direcotry"):
			dic = os.path.join(arg, city)

	grids = upDotsBlongedDis(city, poifiles)
	matrixtofile(grids, os.path.join(dic, 'grids'))

if __name__ == '__main__':
	main(sys.argv[1:])