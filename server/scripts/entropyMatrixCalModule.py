#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-08 18:55:01
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# 描述     ： 考虑全时段数据的 people entropy 计算

import os
import time
import logging
import sys
import getopt
import gc
import numpy as np
import scipy.stats as sc
from CommonFunc import getTimePeriod, getCityLocs
from CommonFunc import getCityDisInfo
from CommonFunc import connectMongo
from multiprocessing import Process, Manager, Value, Array, Lock
from ctypes import c_wchar_p
from entropy.grids import getGridsFromMongo

class EntropyMatrixModule(object):
	"""EntropyMatrixModule 类
	
	Attributes:
	    CITY (TYPE): Description
	    CITYDISIND (TYPE): Description
	    CITYDISNUM (TYPE): Description
	    DIRECTORY (TYPE): Description
	    EMATRIX (TYPE): 当前城市全量 ID 的信息数组，每一个元素包含用户 ID 以及 entropy 相关信息
	    FILENUM (TYPE): Description
	    gridsData (TYPE): Description
	    GRIDSNUM (TYPE): Description
	    INDEX (TYPE): Description
	    starttime (TYPE): Description
	    validIDs (TYPE): Description
	"""
	def __init__(self, PROP, DATA):
		super(EntropyMatrixModule, self).__init__()
		self.FILENUM = PROP['FILENUM']
		self.INDEX = PROP['INDEX']
		self.DIRECTORY = PROP['DIRECTORY']
		self.gridsData = DATA['gridsData'] # should be numpy array
		self.validIDs = DATA['validIDs']
		self.GRIDSNUM = PROP['GRIDSNUM']
		self.CITY = PROP['CITY']
		self.CITYDISNUM = PROP['CITYDISNUM']
		self.CITYDISIND = PROP['CITYDISIND']
		self.starttime = time.time()
		
		# all string in EMATRIX
		self.EMATRIX = np.array([np.array([x, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) for x in xrange(0, PROP['GRIDSNUM'])])

	def run(self):
		logging.info('TASK-%d running in %s' % (self.INDEX, (time.time()-self.starttime)))
		# print 'TASK-%d running in %s' % (self.INDEX, (time.time()-self.starttime))
		# 输出文件名
		ofilename = 'respeo-%03d' % self.INDEX

		idcoldir = os.path.join(self.DIRECTORY, 'records/idcollection', self.CITY )
		entropyfile = os.path.join(self.DIRECTORY, 'entropy/matrix', self.CITY, ofilename)
		
		# 文件遍历 (进程编号： self.INDEX )
		for x in xrange(0, 10000):
			number = self.INDEX + 20 * x
			if number > self.FILENUM:
				break

			ifilename = 'res-%05d' % number
			logging.info('TASK-%d operates file %s' % (self.INDEX, ifilename))

			# 抽取文件计算所涉及 ID 的 entropy 值
			self.calculate(os.path.join(idcoldir, ifilename), os.path.join(self.DIRECTORY, 'entropy/distribution', self.CITY, ofilename))

		# print 'Finished calculate function in %s' % (time.time()-self.starttime)
		
		# 处理完数据，将 EMATRIX 信息写入文件
		with open(entropyfile, 'ab') as res:
			res.write(self.ematrixToStr(self.EMATRIX))
		res.close()

		# 打印任务处理结束信息
		print "Task-%s finished in %s" % (str(self.INDEX), time.time()-self.starttime)

	def calculate(self, inputfile, outputfile):
		"""计算当前文件各个 ID 的 Entropy 信息并更新至 EMATRIX, 同时将该 ID 的档案信息存入 outputfile
		
		Args:
		    inputfile (TYPE): Description
		    outputfile (TYPE): Description
		
		Returns:
		    TYPE: Description
		"""

		# 读取文件，遍历每行，获得包含 id 和 grid ID 编号的数组 records、存储每个 id entropy 信息的对象集合 eobjs、设备列表 idlist
		records, eobjs, idlist = [], {}, []
		# 临时 GRIDLIST records number 存放数组
		enumlist = [0 for x in xrange(0, self.GRIDSNUM)]
		einvalidnumlist = [0 for x in xrange(0, self.GRIDSNUM)]
		
		# 每个文件存取一次的简要版 IDList 档案
		idInfoStr = ''

		# 文件读取
		with open(inputfile, 'rb') as stream:
			for line in stream:
				dictlist = line.strip('\n').split(',')
				devid = dictlist[0]
				devday = dictlist[3]
				devperiod = int( dictlist[4] )
				devdis = int(dictlist[5])
				devStrGID = dictlist[6]
				devIntGID = int( devStrGID )

				if devid not in idlist:
					# 初始化设备的熵计算对象
					# type1: POI Types
					# type2: Time Periods
					# type3: Administrative Dimensions
					eobjs[ devid ] = self.genSingleEntropyObj()
					idlist.append( devid )

				# 当 GridID 符合范围才处理 POI 熵
				if devIntGID >= 0 and devIntGID < self.GRIDSNUM:
					# 更新 ID 定位记录数数组，格式 array[ID] = recordNumber
					enumlist[ devIntGID ] += 1
					records.append([devid, devIntGID])

					
					if devStrGID in self.validIDs:
						eobjs[ devid ][ 't1' ][ 'plist' ] = np.add(eobjs[ devid ][ 't1' ][ 'plist' ], self.gridsData[ devStrGID ]) 
						eobjs[ devid ][ 't1' ][ 'vsum' ] += 1
					
				# 处理 TimePeriod 熵
				dayIndex = 0
				if devday == '0' or devday == '6':
					dayIndex = 7
				eobjs[ devid ][ 't2' ][ 'nlist' ][ dayIndex+devperiod ] += 1
				eobjs[ devid ][ 't2' ][ 'nsum' ] += 1

				# 处理 行政区划 熵
				eobjs[ devid ][ 't3' ][ 'nlist' ][ devdis-self.CITYDISIND ] += 1
		stream.close()
		print 'Finished file reading line by line in %s' % (time.time()-self.starttime)

		# 概率向量的归一化处理, EOBJ 的更新计算, 熵计算与更新
		for each in idlist:
			eobjs[ each ][ 't1' ][ 'psum' ] = np.sum(eobjs[ each ][ 't1' ][ 'plist' ])
			if eobjs[ each ][ 't1' ][ 'psum' ] != 0.0:
				eobjs[ each ][ 't1' ][ 'plist' ] = np.divide(eobjs[ each ][ 't1' ][ 'plist' ], eobjs[ each ][ 't1' ][ 'psum' ])

			eobjs[ each ][ 't2' ][ 'nsum' ] = np.sum(eobjs[ each ][ 't2' ][ 'nlist' ])
			eobjs[ each ][ 't2' ][ 'nlist' ] = np.divide(eobjs[ each ][ 't2' ][ 'nlist' ], float(eobjs[ each ][ 't2' ][ 'nsum' ]))

			eobjs[ each ][ 't3' ][ 'nlist' ] = np.divide(eobjs[ each ][ 't3' ][ 'nlist' ], float(eobjs[ each ][ 't2' ][ 'nsum' ]))

			# POI
			if eobjs[ each ][ 't1' ][ 'psum' ] != 0.0:
				eobjs[each]['t1']['val'] = sc.entropy( eobjs[ each ][ 't1' ][ 'plist' ] )
			# TIME PERIODS
			eobjs[each]['t2']['val'] = sc.entropy( eobjs[ each ][ 't2' ][ 'nlist' ] )
			# ADMIN
			eobjs[each]['t3']['val'] = sc.entropy( eobjs[ each ][ 't3' ][ 'nlist' ] )

			# 
			idInfoStr += self.aggregate(each, eobjs[each])

		recordslen = len(records)
		print "%d lines data and entropy are aggregated in %s" % (recordslen, (time.time()-self.starttime))

		for x in xrange(0, recordslen):
			# 遍历 record
			# 维护本进程最大的 entropy-matrix 熵值更新
			
			# 设备 ID, 记录所属 GridID
			devid, devIntGID = records[x][0], records[x][1]
			
			# 检查 POI 熵是否有必要算入当前 EMATRIX 的更新逻辑
			t1Val = eobjs[ devid ]['t1']['val']
			if t1Val == -1:
				einvalidnumlist[ devIntGID ] += 1
			else:
				self.EMATRIX[ devIntGID ][3] += eobjs[ devid ]['t1']['val']
			self.EMATRIX[ devIntGID ][4] += eobjs[ devid ]['t2']['val']
			self.EMATRIX[ devIntGID ][5] += eobjs[ devid ]['t3']['val']

		# entropy-matrix 记录数更新
		for x in xrange(0, self.GRIDSNUM):
			self.EMATRIX[x][1] += enumlist[x]
			self.EMATRIX[x][2] += (enumlist[x]-einvalidnumlist[x])
		print 'Finished EMATRIX update in %s' % (time.time()-self.starttime)

		# 写入 idInfoStr
		with open(outputfile, 'ab') as res:
			res.write( idInfoStr )
		res.close()

	def aggregate(self, id, obj):
		"""idInfo 信息聚合成字符串
		
		Args:
		    id (TYPE): Description
		    obj (TYPE): Description
		
		Returns:
		    TYPE: Description
		"""
		valStr = id + ',' + str(obj['t1']['val']) + ',' + str(obj['t2']['val']) + ',' + str(obj['t3']['val']) + ',' + str(obj['t1']['vsum']) + ',' + str(obj['t2']['nsum'])
		tArrStr = ','.join([str(each) for each in obj['t1']['plist']]) + ',' + ','.join([str(each) for each in obj['t2']['nlist']]) + ',' + ','.join([str(each) for each in obj['t3']['nlist']])
		return valStr + ',' + tArrStr + '\n'

	def ematrixToStr(self, data):
		datalen = self.GRIDSNUM
		resStr = []
		for x in xrange(0, datalen):
			resStr.append( ','.join(str(int(data[x][e])) for e in xrange(0,3)) + ',' + ','.join(str(data[x][e]) for e in xrange(3,9)) )

		return '\n'.join(resStr)

	# 生成存放单个 ID 档案的对象
	def genSingleEntropyObj(self):
		return {
			't1': {
				'val': -1, # 地点分类熵
				'plist': np.array([0.0 for x in xrange(0,11)]), # 存储 POI 下各类型分布概率
				'psum': 0, # POI 概率分布总和
				'vsum': 0 # 有效的记录数 (以 valid grid 为准)
			},
			't2': {
				'val': -1, # 时段划分熵
				# 'plist': [0 for x in xrange(0,14)],
				'nlist': np.array([0 for x in xrange(0,14)]), #不同时间段的定位次数
				# 'psum': 0,
				'nsum': 0 # 总记录数
			},
			't3': {
				'val': -1, # 行政区划熵
				# 'plist': [0 for x in xrange(0, self.CITYDISNUM)],
				'nlist': np.array([0 for x in xrange(0, self.CITYDISNUM)]), # 不同区划的定位次数
				# 'psum': 0,
				# 'nsum': 0
			}
		}

def processTask(PROP, DATA):
	task = EntropyMatrixModule(PROP, DATA)
	task.run()

def mergeDistributionFiles(city, directory):
	"""将不同 ID 的熵信息以及其他档案合并至一个文件,简单追加即并没有涉及复杂操作
	
	Args:
	    city (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	baseurl = os.path.join(directory, 'entropy/distribution') 
	file = os.path.join(baseurl, city, 'respeo-xxx')
	number = 0

	with open(file, 'ab') as res:
		for x in xrange(0,20):
			# 
			onefile = []
			with open(os.path.join(baseurl, city, 'respeo-%03d' % x), 'rb') as stream:
				for each in stream:
					onefile.append(each + '\n')
			stream.close()
			res.write(''.join(onefile))
			number += len(onefile)
	res.close()

	print "%d lines into distribution respeo-xxx file" % (number)

def mergeMatrixFiles(city, GRIDSNUM, directory):
	"""合并 CityGrids 信息,分别读取文件,最后需将叠加的信息处理存入一个合并的文件
	
	Args:
	    city (TYPE): Description
	    GRIDSNUM (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	ematrix = np.array([np.array([x, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) for x in xrange(0, GRIDSNUM)])
	baseurl = os.path.join(directory, 'entropy/matrix', city)

	for x in xrange(0,20):
		with open(os.path.join(baseurl, 'respeo-%03d' % x), 'rb') as stream:
			for each in stream:
				line = np.array(each.split(','), dtype='f')
				id = int(line[0])
				line[0] = 0
				ematrix[ id ] = np.add(line, ematrix[id])
		stream.close()

	resString = ''
	for x in xrange(0,GRIDSNUM):
		if ematrix[x][1] == 0:
			ematrix[x][4] = -1
			ematrix[x][5] = -1
			ematrix[x][7] = -1
			ematrix[x][8] = -1
		else:
			ematrix[x][7] = ematrix[x][4] / ematrix[x][1]
			ematrix[x][8] = ematrix[x][5] / ematrix[x][1]

		# 处理 POI 熵
		if ematrix[x][2] == 0.0:
			ematrix[x][3] = -1
			ematrix[x][6] = -1
		else:
			ematrix[x][6] = ematrix[x][3] / ematrix[x][2]

		linestr = ','.join([str(int(ematrix[x][e])) for e in xrange(0,3)]) + ',' + ','.join([str(ematrix[x][e]) for e in xrange(3,9)]) + '\n'
		resString += linestr


	with open(os.path.join(baseurl, 'respeo-xxx'), 'ab') as res:
		res.write(resString)
	res.close()

	print "%d lines into matrix res-xxx file" % GRIDSNUM

def help():
	print "Not Yet."

def main(argv):
	# 输入参数对照列表
	try:
		opts, args = getopt.getopt(argv, "hc:d:n:", ["help", "city=", 'directory=', 'number='])
	except getopt.GetoptError as err:
		print str(err)
		usage()
		sys.exit(2)

	# 处理输入参数
	city, directory, number = 'beijing', '/enigma/tao.jiang/datasets/JingJinJi', 999
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

	# 连接数据获取网格信息，包括总数，具有有效POI的网格
	conn, db = connectMongo('tdnormal')
	GRIDSNUM = db['newgrids_%s' % city].count()
	gridsData, validIDs = getGridsFromMongo(city, db)
	conn.close()

	# 获取城市起始区划下标，城市行政区划数目
	CITYDISIND, CITYDISNUM = getCityDisInfo(city)

	# @多进程运行程序 START
	manager = Manager()
	jobs = []

	for x in xrange(0,20):
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

	# 合并结果文件
	MERGE = time.time()
	print "Start merge at %s" % MERGE
	mergeMatrixFiles(city, GRIDSNUM, directory)
	mergeDistributionFiles(city, directory)
	print "End merge in %s" % str(time.time() - MERGE)

	# 结束
	ENDTIME = time.time()
	print "End approach at %s" % ENDTIME

if __name__ == '__main__':
	logging.basicConfig(filename='logger-entropymatrixcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])