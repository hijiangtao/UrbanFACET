#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-26 14:30:44
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# 描述     ： 考虑时间段 timeperiod 筛选的 record entropy 计算

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
from entropy.grids import getGridsFromMongo, getPeopleTPEnpFromFile

class tpEnpSupCalModule(object):
	"""docstring for tpEnpSupCalModule"""
	def __init__(self, PROP, DATA):
		super(tpEnpSupCalModule, self).__init__()
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
		self.TIMEPERIOD = PROP['TIMEPERIOD']
		self.starttime = time.time()
		
		self.EMATRIX = np.array([np.array([x, 0.0, 0.0, 0.0, 0.0]) for x in xrange(0, PROP['GRIDSNUM'])]) #此进程始终维护的网格 entropy 数据

	def run(self):
		print 'TASK-%d running in %s' % (self.INDEX, (time.time()-self.starttime))

		ofilename = 't%d-resrec-%03d' % (self.TIMEPERIOD, self.INDEX)
		idcoldir = os.path.join(self.DIRECTORY, 'records/idcollection', self.CITY )
		entropyfile = os.path.join(self.DIRECTORY, 'entropy/matrix', self.CITY, ofilename)

		for x in xrange(0,10000):
			number = self.INDEX + 20 * x
			if number > self.FILENUM:
				break

			ifilename = 'res-%05d' % number
			logging.info('TASK-%d operates file %s' % (self.INDEX, ifilename))
			# 从 idcollection 中读取文件, 维护当前文件中 ID 的所有记录并更新至 EMATRIX
			self.updateRecordEntropy(os.path.join(idcoldir, ifilename))

		print 'Finished calculate function in %s' % (time.time()-self.starttime)
		# 处理完数据，将 EMATRIX 信息写入文件
		with open(entropyfile, 'ab') as res:
			res.write(self.ematrixToStr(self.EMATRIX))
		res.close()

		# 打印任务处理结束信息
		print "Task-%s finished in %s" % (str(self.INDEX), time.time()-self.starttime)

	def updateRecordEntropy(self, inputfile):
		# recNumList 维护的是所有 ID 的定位次数, validRecNumList 维护的是所有 ID 对应 gridID 有效的定位次数, 如果该信息从 distribution 文件读取, 则不需要此变量去维护该信息
		# recNumList, validRecNumList = {}, {}
		entropyList = []
		with open(inputfile, 'rb') as stream:
			for line in stream:
				dictlist = line.strip('\n').split(',')
				devperiod = int( dictlist[4] )
				# 如果当天时间段没有对上则跳过该记录
				if devperiod != self.TIMEPERIOD:
					continue

				devid = dictlist[0]
				devday = dictlist[3]
				devdis = int(dictlist[5])
				devStrGID = dictlist[6]
				devIntGID = int( devStrGID )

				# 如果 ID 在网格内则更新 valid 网格信息, 且加入熵数组
				if devIntGID >= 0 and devIntGID < self.GRIDSNUM:

					# 处理 POI 熵
					t1 = -1
					if devStrGID in self.validIDs:
						q = self.gridsData[devStrGID]
						p = self.record[devid]['t1']
						# validRecNumList[devid] += 1
						t1 = sum([0.0 if p[x]==0.0 else -q[x]*np.log(p[x]) for x in xrange(0,11)])
					
					# 处理 行政区划 熵
					p = self.record[devid]['t3']
					t3 = 0.0
					pji = p[ devdis-self.CITYDISIND ]
					if pji != 0.0:
						t3 = -np.log(pji)

					entropyList.append([devid,devIntGID,t1,t3])
		stream.close()

		recordslen = len(entropyList)
		for x in xrange(0, recordslen):
			# 遍历 record
			# 维护本进程最大的 entropy-matrix 熵值更新
			devid, devIntGID = entropyList[x][0], entropyList[x][1]
			t1 = entropyList[x][2]
			t3 = entropyList[x][3]

			# 维护 ematrix number 和 entropy 字段
			self.EMATRIX[ devIntGID ][1] += 1
			if t1 != -1:
				self.EMATRIX[ devIntGID ][2] += 1
				self.EMATRIX[ devIntGID ][3] += t1 / self.record[devid]['prop']['vnum']
			self.EMATRIX[ devIntGID ][4] += t3 / self.record[devid]['prop']['wnum']

	def ematrixToStr(self, data):
		datalen = self.GRIDSNUM
		resStr = []
		for x in xrange(0, datalen):
			resStr.append( ','.join(str(int(data[x][e])) for e in xrange(0,3)) + ',' + ','.join(str(data[x][e]) for e in xrange(3,5)) )

		return '\n'.join(resStr)

def processTask(PROP, DATA):
	file = os.path.join(PROP['DIRECTORY'], 'entropy/distribution', PROP['CITY'], 't%d-respeo-%03d' % (PROP['TIMEPERIOD'], PROP['INDEX']))
	# disArrayNum = getCityDisInfo(PROP['CITY'])
	DATA['record'] = getPeopleTPEnpFromFile(file, PROP['CITYDISNUM'])

	task = tpEnpSupCalModule(PROP, DATA)
	task.run()

def mergeMatrixFiles(city, GRIDSNUM, timeperiod, filename='resrec'):
	"""Summary
	
	Args:
	    city (TYPE): Description
	    GRIDSNUM (TYPE): Description
	    filename (TYPE): recres
	
	Returns:
	    TYPE: Description
	"""
	ematrix = np.array([np.array([x, 0, 0, 0.0, 0.0]) for x in xrange(0, GRIDSNUM)])
	baseurl = os.path.join('/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix', city)

	for x in xrange(0,20):
		with open(os.path.join(baseurl, 't%d-%s-%03d' % (timeperiod, filename, x)), 'rb') as stream:
			for each in stream:
				line = np.array(each.split(','), dtype='f')
				id = int(line[0])
				line[0] = 0
				ematrix[ id ] = np.add(line, ematrix[id])
		stream.close()

	resString = ''
	for x in xrange(0,GRIDSNUM):
		if ematrix[x][1] == 0.0:
			ematrix[x][4] = -1

		if ematrix[x][2] == 0.0:
			ematrix[x][3] = -1

		linestr = ','.join([str(int(ematrix[x][e])) for e in xrange(0,3)]) + ',' + ','.join([str(ematrix[x][e]) for e in xrange(3,5)]) + '\n'
		resString += linestr

	with open(os.path.join(baseurl, 't%d-%s-xxx' % (timeperiod, filename)), 'ab') as res:
		res.write(resString)
	res.close()

	print "%d lines into matrix %s-xxx file" % (GRIDSNUM, filename)

def usage():
	print "Not Yet."

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:d:n:m:t:", ["help", "city=", 'directory=', 'number=', 'mode=', 'timeperiod=', 'timeperiod='])
	except getopt.GetoptError as err:
		print str(err)
		usage()
		sys.exit(2)

	# 处理输入参数
	city, directory, number, timeperiod, mode = 'zhangjiakou', '/enigma/tao.jiang/datasets/JingJinJi', 999, 0, 'all'
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
		elif opt in ('-m', '--mode'):
			mode = arg
		elif opt in ('-t', '--timeperiod'):
			timeperiod = int(arg)

	# cunchu
	STARTTIME = time.time()
	print "Start approach at %s" % STARTTIME

	conn, db = connectMongo('tdnormal')
	GRIDSNUM = db['newgrids_%s' % city].count()
	gridsData, validIDs = getGridsFromMongo(city, db)
	conn.close()

	CITYDISIND, CITYDISNUM = getCityDisInfo(city)

	if mode == 'all':
		# @多进程运行程序 START
		manager = Manager()
		jobs = []

		for x in xrange(0,20):
			# time.sleep(random.random()*2)
			PROP = {
				'INDEX': x,
				'DIRECTORY': directory,
				'GRIDSNUM': GRIDSNUM,
				'CITY': city,
				'CITYDISIND': CITYDISIND,
				'CITYDISNUM': CITYDISNUM,
				'FILENUM': number,
				'TIMEPERIOD': timeperiod
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

	# Start to merge result files
	MERGE = time.time()
	print "Start merge at %s" % MERGE
	mergeMatrixFiles(city, GRIDSNUM, timeperiod)
	print "End merge in %s" % str(time.time() - MERGE)

	ENDTIME = time.time()
	print "End approach at %s" % ENDTIME

if __name__ == '__main__':
	logging.basicConfig(filename='logger-tpenpsupcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])
