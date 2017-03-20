#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-03-19 12:03:31
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import sys
import getopt
import json
from shapely.geometry import shape, Point
from CommonFunc import getCityLocs, connectMongo, matrixtofile, getAbbName, getDisIndex

# 计算城市 grids 中存在的 POI 数量以及各自类别的数量统计,包含经纬度等信息
def calGridAoiDis(city):
	# 初始化网格,构建 POI 类别档案
	locs = getCityLocs(city)
	grids = []

	split = 0.05
	centerincrement = 0.025 # round(split / 2.0, 4)
	latnum = int((locs['north'] - locs['south']) / split + 1)
	lngnum = int((locs['east'] - locs['west']) / split + 1)

	conn, db = connectMongo('tdnormal')
	POIs = db['pois_%s' % city]

	# 构建栅栏数组
	disobjs = []
	with open(os.path.join('/home/taojiang/git/living-modes-visual-comparison/conf/data', getAbbName(city)+'.json')) as f:
		stream = json.load(f)
		features = stream['features']

		for each in features:
			disobjs.append({
				'name': each['properties']['name'],
				'geo': shape(each['geometry'])
			})
	f.close()
		
	# 遍历查询网格周围 POI 并更新
	for latind in xrange(0, latnum):
		for lngind in xrange(0, lngnum):
			# 前11元素均为分类别统计数量,最后一个元素为POI总量
			tmpGrid = [0 for x in xrange(0,15)]
			vaildGrid = False

			lat = round(locs['south'] + latind * split, 3)
			lng = round(locs['west'] + lngind * split, 3)
			lnginc = round(lng+split, 3)
			latinc = round(lat+split, 3)
			lngcen = round(lng+centerincrement, 4)
			latcen = round(lat+centerincrement, 4)
			
			# 一个正方形 geojson 对象，代表当前方块对应的地理边界
			coordsarr = [ [lng, lat], [lnginc, lat], [lnginc, latinc], [lng, latinc], [lng, lat] ]

			featurelistarray = [0]*11
			typevalid = False

			# query all the POIs less than maxQRadius
			nearPOIList = list(POIs.find({
				"properties.center": {
					'$near': {
						'$geometry': { 'type': "Point", 'coordinates': [ lngcen, latcen ] },
						'$minDistance': 0,
						'$maxDistance': 2500 * (2 ** 0.5)
					}
				}
			}, {'properties': 1}))
			
			# construct vector with POIs types info
			poilen = len(nearPOIList)
			if poilen != 0:
				vaildGrid = True

				# POI list is not null
				for each in nearPOIList:
					curPInd = each['properties']['ftype']-1
					tmpGrid[curPInd] += 1
					tmpGrid[11] += 1

			if vaildGrid:
				
				tmpGrid[12] = lngcen
				tmpGrid[13] = latcen

				point = Point(lngcen, latcen)
				index = getDisIndex(point, disobjs)
				tmpGrid[14] = index
				if index == -1:
					print 'Invalid Grid Found.'

				grids.append(tmpGrid)	


	print "%s City with valid grids %s" % (city, str(len(grids)))
	return grids

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

	grids = calGridAoiDis(city)
	matrixtofile(grids, os.path.join(dic, 'gridsCount'))

if __name__ == '__main__':
	main(sys.argv[1:])