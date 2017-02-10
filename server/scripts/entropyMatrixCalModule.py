#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-08 18:55:01
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import time
import logging
import sys
import getopt
import gc
from CommonFunc import getTimePeriod, getCityLocs
from CommonFunc import getAdminNumber as formatAdmin
from multiprocessing import Process, Manager, Value, Array, Lock
from ctypes import c_wchar_p
pLock = Lock()

class EntropyMatrixModule(object):
	"""docstring for EntropyMatrixModule"""
	def __init__(self, PROP, DATA):
		super(EntropyMatrixModule, self).__init__()
		self.FILENUM = PROP['FILENUM']
		self.INDEX = PROP['INDEX']
		self.DIRECTORY = PROP['DIRECTORY']
		self.gridsData = DATA['gridsData']
		self.validIDs = DATA['validIDs']
		self.EMATRIX = DATA['EMATRIX']

	def run(self):
		logging.info('TASK-%d running...' % self.INDEX)

		idcoldir = os.path.join(self.DIRECTORY, 'idcollection' )
		for x in xrange(0, 10000):
			number = self.INDEX + 20 * x
			if number > self.FILENUM:
				break

			logging.info('TASK-%d operates file part-%05d' % (self.INDEX, number))
			self.calculate()

		print "Task-%s finished at %s" % (str(self.INDEX), time.time())

	def calculate(inputfile):
		# 读取文件，遍历每行，获得包含 id 和 grid ID 编号的数组 records、存储每个 id entropy 信息的对象集合 eobjs、设备列表 idlist
		records, eobjs, idlist = [], {}, []
		with open(inputfile, 'rb') as stream:
			for line in stream:
				dictlist = line.strip('\n').split(',')
				devid = dictlist[0]
				devday = dictlist[3]
				devperiod = dictlist[4]
				devdis = dictlist[5]
				devStrGID = dictlist[6]
				devIntGID = int( devStrGID )

				# Update entropy matrix prop - records number
				self.EMATRIX[ devIntGID ][1] += 1

				if devid not in idlist:
					# initial customer entropy calculating model object
					# type1: POI Types
					# type2: Time Periods
					# type3: Administrative Dimensions
					eobjs[ devid ] = self.genSingleEntropyObj()
					idlist.append( devid )

				# 处理 POI 熵
				if devGID in self.validIDs:
					eobjs[ devStrGID ][ 'plist' ] = addTwoArray()
					
				# 处理 TimePeriod 熵
				# 
				# 处理 行政区划 熵
		
		stream.close()


	def aggregate():
		pass

	def genSingleEntropyObj():
		return {
			't1': {
				'val': -1,
				'plist': [0 for x in xrange(0,11)]
			},
			't2': {

			},
			't3': {

			}
		}

def processTask(file, number):
	task = EntropyMatrixModule(file)
	task.run()

def help():
	print "Not Yet."

def main(argv):
	FILENUM = 1000
	# 输入参数对照列表
	try:
		opts, args = getopt.getopt(argv, "hc:d:n:", ["help", "city=", 'directory=', 'number='])
	except getopt.GetoptError as err:
		print str(err)
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

	STARTTIME = time.time()
	print "Start approach at %s" % STARTTIME

	# @多进程运行程序 START
	manager = Manager()
	jobs = []

if __name__ == '__main__':
	logging.basicConfig(filename='logger-entropymatrixcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])