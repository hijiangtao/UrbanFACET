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
	file = open(file, 'rb')
	while 1:
		lines = file.readlines(100000)
		if not lines:
			break
		for line in lines:
			linesNumber += 1
			line = line.split(',')
			gridID = (float(line[4]) + float(line[5]) * 10) / 3

	endtime = datetime.datetime.now()
	return str( linesNumber ), str( (endtime - starttime).seconds )

def linebyLineReadfromFile(file):

	starttime = datetime.datetime.now()

	linesNumber = 0
	with open(file, 'rb') as target:
		for each in target:
			linesNumber += 1
			line = each.split(',')
			gridID = (float(line[4]) + float(line[5]) * 10) / 3

	target.close()
	endtime = datetime.datetime.now()
	return str( linesNumber ), str( (endtime - starttime).seconds )

def main():
	file='/home/taojiang/datasets/beijingTop.txt'
	lines, times = multiLinesReadfromFile(file)
	print 'Multilines read time: %s seconds' % (lines, times)
	gc.collect()
	lines, times = linebyLineReadfromFile(file)
	print 'LinebyLine read time: %s seconds' % (lines, times)


if __name__ == '__main__':
	main()