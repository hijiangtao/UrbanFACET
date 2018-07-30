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
	columnStr, numOfBins, directory, entropy_file, city = '1', 1000, '/enigma/tao.jiang/datasets/JingJinJi', 'respeo-', 'beijing'
	new_entropy_file = 'newrespeo-'
	
	
	starttime = time.time()
	print "Start processing at %s" % starttime
		
	for fileIndex in range(20):
		
		inputfile = os.path.join(directory, 'entropy/distribution', city, entropy_file+'%03d'%(fileIndex))
		outputfile = os.path.join(directory, 'entropy/distribution', city, new_entropy_file+'%03d'%(fileIndex))
		
		idSet = set([])
		numOfLines = 0;
		
		output = open(outputfile, 'wb')
		
		with open(inputfile, 'rb') as stream:
			for line in stream:
				entrylist = line.strip('\n').split(',')
				if len(entrylist) > 0:
					userId = entrylist[0];
					if userId not in idSet:
						idSet.add(userId)
						output.write(line)
				
				numOfLines = numOfLines + 1
				if (numOfLines%10000)==0:
					print 'Process to line %d for file %d in %s' % (numOfLines, fileIndex, time.time()-starttime )
			
		stream.close()
		output.close()
	

if __name__ == '__main__':
# 	logging.basicConfig(filename='logger-entropymatrixcalmodule.log', level=logging.DEBUG)
	main(sys.argv[1:])