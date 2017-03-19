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
from CommonFunc import getCityLocs, connectMongo, matrixtofile

def upDotsBlongedDis(city):
	# 获得 grids 
	grids = [] # 存储结果
	conn, db = connectMongo('tdnormal')
	GRID = db['newgrids_%s' % city]

	grids = list( GRID.find({}, {"properties.uid": 1, "properties.center": 1}) )

	for each in grids:
		coords = each.properties.center.coordinates
		point = Point(coords[0], coords[1])
		index = calDistrictIndex(point)

	return grids

def calDistrictIndex():
	pass

def main(argv):
	# 初始化参数
	try:
		opts, args = getopt.getopt(argv, "c:d:", ["city=", "direcotry="])
	except getopt.GetoptError as err:
		print str(err)
		sys.exit(2)

	city, dic = 'beijing', '/enigma/tao.jiang/datasets/JingJinJi/pois/beijing'
	for opt, arg in opts:
		if opt == '-h':
			usage()
			sys.exit()
		elif opt in ("-c", "--city"):
			city = arg
		elif opt in ("-d", "--direcotry"):
			dic = os.path.join(arg, city)

	upDotsBlongedDis(city)

if __name__ == '__main__':
	main(sys.argv[1:])