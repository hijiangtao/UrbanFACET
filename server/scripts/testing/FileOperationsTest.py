#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-04 14:13:09
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import datetime
import sys
import gc

def multiLinesReadfromFile(file):
	# File: readline-example-3.py
	starttime = datetime.datetime.now()

	linesNumber = 0
	with open(file, 'rb') as file:
		while 1:
			lines = file.readlines(100000)
			if not lines:
				break
			for line in lines:
				linesNumber += 1
				# if linesNumber % 2000000 == 0:
				# 	print 'multiLinesReadfromFile %s LINES\' reading consuming %s' % (str(linesNumber), str( datetime.datetime.now()-starttime ))
				line = line.split(',')
				gridID = (float(line[2]) + float(line[3]) * 10) / 3

	endtime = datetime.datetime.now()
	return str( linesNumber ), str( (endtime - starttime) )

def linebyLineReadfromFile(file):

	starttime = datetime.datetime.now()

	linesNumber = 0
	with open(file, 'rb') as target:
		for each in target:
			linesNumber += 1
			# if linesNumber % 2000000 == 0:
			# 	print 'linebyLineReadfromFile %s LINES\' reading consuming %s' % (str(linesNumber), str( datetime.datetime.now()-starttime ))
			line = each.split(',')
			gridID = (float(line[2]) + float(line[3]) * 10) / 3

	target.close()
	endtime = datetime.datetime.now()
	return str( linesNumber ), str( (endtime - starttime) )

def main():
	# file = '/home/joe/Downloads/ninetyFive.txt' # '/home/taojiang/datasets/beijingTop.txt'
	
	starttime = datetime.datetime.now()
	for x in xrange(0,1):
		file = '/media/tao/LaCie/TalkingData/Jingjinji/Tianjin-FilterRecords/test-000%s' % str(x).zfill(2)	
		lines, times = multiLinesReadfromFile(file)
		print 'File %s\nLinebyLine read time: %s lines / %s seconds' % (file, lines, times)

	endtime = datetime.datetime.now()
	print 'multiLinesReadfromFile all: %s seconds' % str(endtime-starttime)

	gc.collect()
	
	starttime = datetime.datetime.now()
	for x in xrange(0,1):
		file = '/media/tao/LaCie/TalkingData/Jingjinji/Tianjin-FilterRecords/test-000%s' % str(x).zfill(2)
		lines, times = linebyLineReadfromFile(file)
		print 'File %s\nLinebyLine read time: %s lines / %s seconds' % (file, lines, times)
	endtime = datetime.datetime.now()
	print 'multiLinesReadfromFile all: %s seconds' % str(endtime-starttime)

if __name__ == '__main__':
	main()