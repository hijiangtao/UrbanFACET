#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-03-29 08:40:36
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import fs
import gc, getopt, sys, logging
import numpy as nu
from CommonFunc import matrixtofile

def getMongoRes(city):
	pass

def getMySQLRes(city):
	pass

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:m:d:", ["help", "city=", "method=", "directory"])
	except getopt.GetoptError as err:
		print str(err)
		sys.exit(2)

	city, method, directory = 'beijing', 'stats', '/enigma/tao.jiang/datasets/JingJinJi/entropy/distribution'

	# 构建不同次数对应统计数组
	arr = [0]*2501

	# 遍历文件统计定位次数
	with open(os.path.join(directory, city, 'respeo-xxx'), 'rb') as stream:
		for line in stream:
			plist = line.strip('\n').split(',')
			rec = int(plist[5]) / 3
			if rec < 2501:
				arr[rec] += 1

	stream.close()

	arr.pop(0)
	res = []
	for index, val in enumerate(arr):
    	res.append(str(index)+','+str(val))

	with open(os.path.join(directory, city, 'recnum-stats.csv'), 'w') as target:
		target.writelines( '\n'.join( res ) )


if __name__ == '__main__':
	logging.basicConfig(filename='logger-recnumstats.log', level=logging.DEBUG)
	result = main(sys.argv[1:])