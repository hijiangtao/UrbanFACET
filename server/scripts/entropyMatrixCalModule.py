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
import numpy as np
import scipy.stats as sc
from CommonFunc import getTimePeriod, getCityLocs
from CommonFunc import addTwoArray
from CommonFunc import getCityDisInfo
from CommonFunc import connectMongo
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
		self.gridsData = DATA['gridsData'] # should be numpy array
		self.validIDs = DATA['validIDs']
		self.GRIDSNUM = PROP['GRIDSNUM']
		self.CITY = PROP['CITY']
		self.CITYDISNUM = PROP['CITYDISNUM']
		self.CITYDISIND = PROP['CITYDISIND']
		self.starttime = time.time()
		
		# self.EMATRIX = DATA['EMATRIX']
		# all string in EMATRIX
		self.EMATRIX = np.array([np.array([x, 0, 0, 0.0, 0.0, 0.0]) for x in xrange(0, PROP['GRIDSNUM'])])

	def run(self):
		logging.info('TASK-%d running in %s' % (self.INDEX, (time.time()-self.starttime)))
		print 'TASK-%d running in %s' % (self.INDEX, (time.time()-self.starttime))
		ofilename = 'res-%03d' % self.INDEX

		idcoldir = os.path.join(self.DIRECTORY, 'records/idcollection', self.CITY )
		entropyfile = os.path.join(self.DIRECTORY, 'entropy/matrix', self.CITY, ofilename)
		for x in xrange(0, 10000):
			number = self.INDEX + 20 * x
			if number > self.FILENUM:
				break

			ifilename = 'res-%05d' % number
			logging.info('TASK-%d operates file %s' % (self.INDEX, ifilename))
			self.calculate(os.path.join(idcoldir, ifilename), os.path.join(self.DIRECTORY, 'entropy/distribution', self.CITY, ofilename))

		print 'Finished calculate function in %s' % (time.time()-self.starttime)
		# 处理完数据，将 EMATRIX 信息写入文件
		with open(entropyfile, 'ab') as res:
			res.write(self.ematrixToStr(self.EMATRIX))
		res.close()

		# 打印任务处理结束信息
		print "Task-%s finished in %s" % (str(self.INDEX), time.time()-self.starttime)

	def calculate(self, inputfile, outputfile):
		"""计算当前文件各个设备的 Entropy 信息并更新至 EMATRIX, 同时将该设备的档案信息存入 outputfile
		
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
					# initial customer entropy calculating model object
					# type1: POI Types
					# type2: Time Periods
					# type3: Administrative Dimensions
					eobjs[ devid ] = self.genSingleEntropyObj()
					idlist.append( devid )

				if devIntGID >= 0 and devIntGID < self.GRIDSNUM:
					# Update entropy matrix prop - records number
					enumlist[ devIntGID ] += 1
					records.append([devid, devIntGID])

					# 处理 POI 熵
					if devStrGID in self.validIDs:
						eobjs[ devid ][ 't1' ][ 'plist' ] = np.add(eobjs[ devid ][ 't1' ][ 'plist' ], self.gridsData[ devStrGID ]) 
					
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

		# P 列表的归一化处理, EOBJ 的更新计算, 熵计算与更新
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
		valStr = id + ',' + str(obj['t1']['val']) + ',' + str(obj['t2']['val']) + ',' + str(obj['t3']['val'])
		tArrStr = ','.join([str(each) for each in obj['t1']['plist']]) + ',' + ','.join([str(each) for each in obj['t2']['nlist']]) + ',' + ','.join([str(each) for each in obj['t3']['nlist']])
		return valStr + ',' + tArrStr + '\n'

	def ematrixToStr(self, data):
		datalen = self.GRIDSNUM
		resStr = []
		for x in xrange(0, datalen):
			resStr.append( ','.join(str(int(data[x][e])) for e in xrange(0,3)) + ',' + ','.join(str(data[x][e]) for e in xrange(3,6)) )

		return '\n'.join(resStr)

	# 生成存放单个 ID 档案的对象
	def genSingleEntropyObj(self):
		return {
			't1': {
				'val': -1,
				'plist': np.array([0.0 for x in xrange(0,11)]),
				'psum': 0
			},
			't2': {
				'val': -1,
				# 'plist': [0 for x in xrange(0,14)],
				'nlist': np.array([0 for x in xrange(0,14)]),
				# 'psum': 0,
				'nsum': 0
			},
			't3': {
				'val': -1,
				# 'plist': [0 for x in xrange(0, self.CITYDISNUM)],
				'nlist': np.array([0 for x in xrange(0, self.CITYDISNUM)]),
				# 'psum': 0,
				# 'nsum': 0
			}
		}

def processTask(PROP, DATA):
	task = EntropyMatrixModule(PROP, DATA)
	task.run()

def getGridsFromMongo(city, db):
	res = list( db['grids_%s' % city].find({"properties.vecvalid": True }, {"properties.uid": 1, "properties.vec": 1}) )
	gridsData, validIDs = {}, []
	reslen = len(res)
	for x in xrange(0, reslen):
		id = str(res[x]['properties']['uid'])
		vec = np.array(res[x]['properties']['vec'], dtype='f')
		gridsData[ id ] = vec
		validIDs.append(id)

	return gridsData, validIDs

def mergeDistributionFiles(city):
	baseurl = '/home/tao.jiang/datasets/JingJinJi/entropy/distribution'
	file = os.path.join(baseurl, city, 'res-xxx')
	number = 0

	with open(file, 'ab') as res:
		for x in xrange(0,20):
			# 
			onefile = []
			with open(os.path.join(baseurl, city, 'res-%03d' % x), 'rb') as stream:
				for each in stream:
					onefile.append(each + '\n')
			stream.close()
			res.write(''.join(onefile))
			number += len(onefile)
	res.close()

	print "%d lines into distribution res-xxx file" % (number)

def mergeMatrixFiles(city, GRIDSNUM):
	ematrix = np.array([np.array([x, 0, 0, 0.0, 0.0, 0.0]) for x in xrange(0, GRIDSNUM)])
	baseurl = os.path.join('/home/tao.jiang/datasets/JingJinJi/entropy/matrix', city)

	for x in xrange(0,20):
		with open(os.path.join(baseurl, 'res-%03d' % x), 'rb') as stream:
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
		else:
			ematrix[x][4] /= ematrix[x][1]
			ematrix[x][5] /= ematrix[x][1]

		if ematrix[x][2] == 0.0:
			ematrix[x][3] = -1
		else:
			ematrix[x][3] /= ematrix[x][2]

		linestr = ','.join([str(int(ematrix[x][e])) for e in xrange(0,3)]) + ',' + ','.join([str(ematrix[x][e]) for e in xrange(3,6)]) + '\n'
		resString += linestr


	with open(os.path.join(baseurl, 'res-xxx'), 'ab') as res:
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
	city, directory, number = 'zhangjiakou', '/home/tao.jiang/datasets/JingJinJi', 1000
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

	conn, db = connectMongo('tdnormal')
	GRIDSNUM = db['grids_%s' % city].count()
	gridsData, validIDs = getGridsFromMongo(city, db)
	conn.close()

	# CITYDISIND, CITYDISNUM = getCityDisInfo(city)

	# # @多进程运行程序 START
	# manager = Manager()
	# jobs = []

	# for x in xrange(0,20):
	# 	# time.sleep(random.random()*2)
	# 	PROP = {
	# 		'INDEX': x,
	# 		'DIRECTORY': directory,
	# 		'GRIDSNUM': GRIDSNUM,
	# 		'CITY': city,
	# 		'CITYDISIND': CITYDISIND,
	# 		'CITYDISNUM': CITYDISNUM,
	# 		'FILENUM': number
	# 	}

	# 	DATA = {
	# 		'gridsData': gridsData,
	# 		'validIDs': validIDs
	# 	}

	# 	jobs.append( Process(target=processTask, args=(PROP, DATA)) )
	# 	jobs[x].start()

	# # 等待所有进程结束
	# for job in jobs:
	#     job.join()

	# Start to merge result files
	mergeMatrixFiles(city, GRIDSNUM)
	mergeDistributionFiles(city)

	ENDTIME = time.time()
	print "End approach at %s" % ENDTIME

if __name__ == '__main__':
	logging.basicConfig(filename='logger-entropymatrixcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])