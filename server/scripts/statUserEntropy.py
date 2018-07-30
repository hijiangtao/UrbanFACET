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

def help():
	print "Not Yet."

def main(argv):
	# 输入参数对照列表
	try:
		opts, args = getopt.getopt(argv, "hi:b:d:e:c:", ["help", "columns=", 'bin=', 'directory=', 'entropy_file=', 'city='])
	except getopt.GetoptError as err:
		print str(err)
		help()
		sys.exit(2)

	# 处理输入参数
	columnStr, numOfBins, directory, entropy_file, city = '1', 1000, '/enigma/tao.jiang/datasets/JingJinJi', 'respeo-xxx', 'beijing'
	for opt, arg in opts:
		if opt == '-h':
			help()
			sys.exit()
		elif opt in ("-i", "--columns"):
			columnStr = arg
		elif opt in ("-b", "--bin"):
			numOfBins = arg
		elif opt in ('-d', '--directory'):
			directory = arg
		elif opt in ('-e', '--entropy_file'):
			entropy_file = arg
		elif opt in ('-c', '--city'):
			city = arg

	starttime = time.time()
	print "Start processing at %s" % starttime
	
	columnStrs = columnStr.split(',')
	columnIndices = []
	outputfiles = []
	maxEntropy = []
	distEntropy = []
	numOfLines = 0
	
	inputfile = os.path.join(directory, 'entropy/distribution', city, entropy_file)
	
	for column in columnStrs:
		columnIndices.append(int(column))
		outputfiles.append(os.path.join(directory, 'entropy/distribution', city, entropy_file+'_stat_column_'+column))
		maxEntropy.append(0)
		dist = [];
		for index in range(numOfBins):
			dist.append(0);
		distEntropy.append(dist);

	# compute max of entropy
	with open(inputfile, 'rb') as stream:
		for line in stream:
			entrylist = line.strip('\n').split(',')
			for index, columnIndex in enumerate(columnIndices):
				if columnIndex < len(entrylist):
					entropy = float(entrylist[columnIndex])
					if entropy > maxEntropy[index]:
						maxEntropy[index] = entropy
			
			if len(entrylist) > 0:
				numOfLines = numOfLines + 1
			
			if (numOfLines%10000)==0:
				print '1: Process to line by line %d in %s' % (numOfLines, time.time()-starttime )
			
			
	stream.close()
	
	numOfLines = 0
	
	# compute distribution of entropy
	with open(inputfile, 'rb') as stream:
		for line in stream:
			entrylist = line.strip('\n').split(',')
			for index, columnIndex in enumerate(columnIndices):
				if columnIndex < len(entrylist):
					entropy = float(entrylist[columnIndex])
					if entropy<=0:
						loc = 0
					elif entropy >= maxEntropy[index]:
						loc = numOfBins - 1
					else:
						loc = int(entropy*numOfBins/maxEntropy[index])
					
					distEntropy[index][loc] = distEntropy[index][loc] + 1
					
			if len(entrylist) > 0:
				numOfLines = numOfLines + 1
			
			if (numOfLines%10000)==0:
				print '2: Process to line by line %d in %s' % (numOfLines, time.time()-starttime )
							
			
	stream.close()
	
	for index, columnIndex in enumerate(columnIndices):
		print 'MaxEntropy %d: %f' % (columnIndex, float(maxEntropy[index])) 		
		with open(outputfiles[index], 'wb') as stream:
			stream.write('MaxEntropy, %f' % (float(maxEntropy[index])) + '\n')
			for distIndex in range(numOfBins):
				stream.write('%d, %d' % (distIndex, distEntropy[index][distIndex]) + '\n')
			
		stream.close()

if __name__ == '__main__':
# 	logging.basicConfig(filename='logger-entropymatrixcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])