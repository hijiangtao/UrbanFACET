#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-06 14:16:11
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import threading
import os
import time
import pp
import logging
import sys
import getopt
import gc
from CommonFunc import getTimePeriod, getCityLocs
from CommonFunc import getAdminNumber as formatAdmin

class augmentRawData (threading.Thread):
	def __init__(self, INDEX, CITY, FILENUM, DIRECTORY ):
		threading.Thread.__init__(self)
		self.INDEX = INDEX
		self.CITY= CITY
		self.FILENUM = FILENUM
		self.DIRECTORY = DIRECTORY

	def augment(self, inputfile, outputfile, CITY, FILENUM = 1000):
		reslist = ['' for i in range(FILENUM)]
		with open(inputfile, 'rb') as stream:
			for line in stream:
				linelist = line.split(',')
				index = int(linelist[0]) % FILENUM

				reslist[ index ] += linelist[0] + ',' + formatTime(linelist[1]) + ',' + formatAdmin(linelist[5]) + ',' + formatGridID(getCityLocs(CITY), [linelist[3], linelist[2]]) + '\n'
		stream.close()
		gc.collect()

		for i in range(FILENUM):
			threading.Lock().acquire()
			
			with open('%s/%05d' % (outputfile, i), 'ab') as res:
				res.write( reslist[i] )
			res.close()

			# 释放锁
			threading.Lock().release()

	def run(self):
		logging.info('TASK %d running...' % self.INDEX)
		rawdatadir = os.path.join(self.DIRECTORY, 'rawdata' )
		idcoldir = os.path.join(self.DIRECTORY, 'idcollection' )
		for x in xrange(0, 10000000):
			number = self.INDEX + 20 * x
			if number > self.FILENUM:
				break

			logging.info('TASK %d - FILE part-%05d operating...' % (self.INDEX, number))
			self.augment(os.path.join(rawdatadir, self.CITY, 'part-%05d' % number), os.path.join(idcoldir, self.CITY), self.CITY, 1000)

def formatTime(timestr):
	"""Summary
	
	Args:
		timestr (TYPE): Description
	
	Returns:
		TYPE: Description
	"""
	dateObj = time.localtime( int(timestr)/1000.0 )
	
	date = time.strftime("%m-%d", dateObj)
	hourmin = time.strftime("%H:%M", dateObj)
	day = time.strftime("%w", dateObj)
	period = str( getTimePeriod( time.strftime("%H", dateObj) ) )

	return date + ',' + hourmin + ',' + day + ',' + period

def formatGridID(locs, point):
	"""Summary
	
	Args:
		locs (TYPE): Description
		point (TYPE): [lng, lat]
	
	Returns:
		TYPE: Description
	"""
	SPLIT = 0.001
	# LATNUM = int((locs['north'] - locs['south']) / SPLIT + 1)
	LNGNUM = int((locs['east'] - locs['west']) / SPLIT + 1)
	lngind = ( (float(point[0]) - locs['west']) / SPLIT )
	latind = ( (float(point[1]) - locs['south']) / SPLIT )

	return str(lngind + latind * LNGNUM)

def usage():
	pass

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:d:n:", ["help", "city=", 'directory=', 'number='])
	except getopt.GetoptError as err:
		# print help information and exit:
		print str(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	# 处理输入参数
	city, directory, number = 'zhangjiakou', '/home/tao.jiang/datasets/JingJinJi/records', 264
	for opt, arg in opts:
		if opt == '-h':
			usage()
			sys.exit()
		elif opt in ("-c", "--city"):
			city = arg
		elif opt in ("-d", "--directory"):
			directory = arg
		elif opt in ('-n', '--number'):
			number = int(arg)

	# 多线程运行程序
	for x in xrange(0,20):
		thread = augmentRawData(x, city, number, directory)
		thread.start()

if __name__ == '__main__':
	logging.basicConfig(filename='logger-augmentrawdata.log', level=logging.DEBUG)
	main(sys.argv[1:])