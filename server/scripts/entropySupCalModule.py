#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-16 14:13:50
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import time
import logging
import sys
import getopt
import gc
import numpy as np
import scipy.stats as sc
from CommonFunc import getTimePeriod, getCityLocs
from CommonFunc import addTwoArray
from CommonFunc import getCityDisInfo
from CommonFunc import connectMongo
from multiprocessing import Process, Manager, Value, Array, Lock
from entropy.grids import getGridsFromMongo, getPeopleEntropyFromFile

class entropySupCalModule(object):
	"""docstring for entropySupCalModule"""
	def __init__(self, PROP, DATA):
		super(entropySupCalModule, self).__init__()
		self.FILENUM = PROP['FILENUM'] #records 文件数量
		self.INDEX = PROP['INDEX'] #进程编号
		self.DIRECTORY = PROP['DIRECTORY'] #JingJinJi 基础文件夹路径
		self.gridsData = DATA['gridsData'] #网格 probability 数组数据
		self.validIDs = DATA['validIDs'] #POI 有效数据
		self.record = DATA['record'] #从文件恢复的不同设备档案信息
		self.GRIDSNUM = PROP['GRIDSNUM'] #网格数量
		self.CITY = PROP['CITY'] #城市名称
		self.CITYDISNUM = PROP['CITYDISNUM'] #行政区划数量
		self.CITYDISIND = PROP['CITYDISIND'] #行政区划起始索引编号
		self.starttime = time.time()
		
		self.EMATRIX = np.array([np.array([x, 0.0, 0.0, 0.0, 0.0, 0.0]) for x in xrange(0, PROP['GRIDSNUM'])]) #此进程始终维护的网格 entropy 数据

	def run(self):
		print 'TASK-%d running in %s' % (self.INDEX, (time.time()-self.starttime))

		ofilename = 'recres-%03d' % self.INDEX
		idcoldir = os.path.join(self.DIRECTORY, 'records/idcollection', self.CITY )
		entropyfile = os.path.join(self.DIRECTORY, 'entropy/matrix', self.CITY, ofilename)

		for x in xrange(0,10000):
			number = self.INDEX + 20 * x
			if number > self.FILENUM:
				break

			ifilename = 'res-%05d' % number
			logging.info('TASK-%d operates file %s' % (self.INDEX, ifilename))
			# 维护当前文件中 ID 的所有记录并更新至 EMATRIX
			self.updateRecordEntropy(os.path.join(idcoldir, ifilename))

		print 'Finished calculate function in %s' % (time.time()-self.starttime)
		# 处理完数据，将 EMATRIX 信息写入文件
		with open(entropyfile, 'ab') as res:
			res.write(self.ematrixToStr(self.EMATRIX))
		res.close()

		# 打印任务处理结束信息
		print "Task-%s finished in %s" % (str(self.INDEX), time.time()-self.starttime)

	def updateRecordEntropy(self, inputfile):
		recNumList, validRecNumList = {}, {}
		entropyList = []
		with open(inputfile, 'rb') as stream:
			for line in stream:
				dictlist = line.strip('\n').split(',')
				devid = dictlist[0]
				devday = dictlist[3]
				devperiod = int( dictlist[4] )
				devdis = int(dictlist[5])
				devStrGID = dictlist[6]
				devIntGID = int( devStrGID )

				# 
				if devid in recNumList:
					recNumList[devid] += 1
				else:
					recNumList[devid] = 1
					validRecNumList[devid] = 0

				# 如果 ID 在网格内则更新 valid 网格信息, 且加入熵数组
				if devIntGID >= 0 and devIntGID < self.GRIDSNUM:

					# 处理 POI 熵
					q = self.gridsData[devid]
					p = self.record[devid]['t1']
					t1 = -1
					if devid in validIDs:
						validRecNumList[devid] += 1
						t1 = sum([0.0 if p[x]==0.0 else -q[x]*np.log(p[x]) for x in xrange(0,11)])
					 
					# 处理 TimePeriod 熵
					dayIndex = 0
					p = self.record[devid]['t2']
					if devday == '0' or devday == '6':
						dayIndex = 7
					pji = p[ dayIndex+devperiod ]
					t2 = 0.0
					if pji != 0.0:
						t2 = -np.log(pji)
					
					# 处理 行政区划 熵
					p = self.record[devid]['t3']
					t3 = 0.0
					pji = p[ devdis-self.CITYDISIND ]
					if pji != 0.0:
						t3 = -np.log(pji)

					entropyList.append([devid,devIntGID,t1,t2,t3])
		stream.close()

		recordslen = len(entropyList)
		for x in xrange(0, recordslen):
			# 遍历 record
			# 维护本进程最大的 entropy-matrix 熵值更新
			devid, devIntGID = entropyList[x][0], entropyList[x][1]
			t1 = entropyList[x][2]
			t2 = entropyList[x][3]
			t3 = entropyList[x][4]

			self.EMATRIX[ devIntGID ][1] += 1
			if t1 != -1:
				self.EMATRIX[ devIntGID ][2] += 1
				self.EMATRIX[ devIntGID ][3] += t1 / validRecNumList[devid]
			self.EMATRIX[ devIntGID ][4] += t2 / recNumList[devid]
			self.EMATRIX[ devIntGID ][5] += t3 / recNumList[devid]

	def ematrixToStr(self, data):
		datalen = self.GRIDSNUM
		resStr = []
		for x in xrange(0, datalen):
			t1 = -1
			if data[x][2] != 0.0:
				t1 = data[x][3]/data[x][2]
			t2 = data[x][4]/data[x][1]
			t3 = data[x][5]/data[x][1]

			resStr.append( ','.join(str(int(data[x][e])) for e in xrange(0,3)) + ',' + str(t1) + ',' + str(t2) + ',' + str(t3) )

		return '\n'.join(resStr)
def processTask(PROP, DATA):
	file = os.path.join(PROP['DIRECTORY'], 'entropy/distribution', PROP['CITY'], 'res-%03d' % PROP['INDEX'])
	disArrayNum = getCityDisInfo(PROP['CITY'])
	DATA['record'] = getPeopleEntropyFromFile(file, disArrayNum)

	task = entropySupCalModule(PROP, DATA)
	task.run()

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:d:n:", ["help", "city=", 'directory=', 'number='])
	except getopt.GetoptError as err:
		print str(err)
		usage()
		sys.exit(2)

	# 处理输入参数
	city, directory, number = 'zhangjiakou', '/home/tao.jiang/datasets/JingJinJi', 999
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

	# cunchu
	STARTTIME = time.time()
	print "Start approach at %s" % STARTTIME

	conn, db = connectMongo('tdnormal')
	GRIDSNUM = db['grids_%s' % city].count()
	gridsData, validIDs = getGridsFromMongo(city, db)
	conn.close()

	CITYDISIND, CITYDISNUM = getCityDisInfo(city)

	# @多进程运行程序 START
	manager = Manager()
	jobs = []

	for x in xrange(0,1):
		# time.sleep(random.random()*2)
		PROP = {
			'INDEX': x,
			'DIRECTORY': directory,
			'GRIDSNUM': GRIDSNUM,
			'CITY': city,
			'CITYDISIND': CITYDISIND,
			'CITYDISNUM': CITYDISNUM,
			'FILENUM': number
		}

		DATA = {
			'gridsData': gridsData,
			'validIDs': validIDs
		}

		jobs.append( Process(target=processTask, args=(PROP, DATA)) )
		jobs[x].start()

	# 等待所有进程结束
	for job in jobs:
	    job.join()

if __name__ == '__main__':
	logging.basicConfig(filename='logger-entropysupcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])