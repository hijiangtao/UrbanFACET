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

	file = open(file, 'rb')
	while 1:
		lines = file.readlines(100000)
		if not lines:
			break
		for line in lines:
			line = line.split(',')
			gridID = (float(line[4]) + float(line[5]) * 10) / 3

	endtime = datetime.datetime.now()
	return str( (endtime - starttime).seconds )

def linebyLineReadfromFile(file):

	starttime = datetime.datetime.now()

	with open(filename, 'rb') as target:
		for each in target:
			line = each.split(',')
			gridID = (float(line[4]) + float(line[5]) * 10) / 3

	target.close()
	endtime = datetime.datetime.now()
	return str( (endtime - starttime).seconds )

def main():
	file='/home/taojiang/datasets/beijingTop.txt'
	print 'Multilines read time: %s' % multiLinesReadfromFile(file)
	print 'LinebyLine read time: %s' % linebyLineReadfromFile(file)
	gc.collect()


if __name__ == '__main__':
	main()