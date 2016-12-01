#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 18:47:13
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, pymongo, math, MySQLdb
import numpy as np

def connectMongo(dbname):
	"""Connect MongoDB
	
	Returns:
		TYPE: Client, database
	"""
	try:
		conn = pymongo.MongoClient('localhost', 27017)
		mdb = conn[dbname]
		print "Connected successfully!!!"
	except pymongo.errors.ConnectionFailure, e:
		print "Could not connect to MongoDB: %s" % e

	return conn, mdb

def connectMYSQL(dbname):
	"""Connect MySQL
	
	Returns:
	    TYPE: db, cursor
	"""
	db = MySQLdb.connect(host="localhost",    	# your host, usually localhost
						user="root",         	# your username
						passwd="vis_2014",  	# your password
						db=dbname)		# name of the data base
	cur = db.cursor()

	return db, cur

def matrixtoarray(origin, row, col):
	"""Change a matrix array to an array (each of the element is an 1D array)
	
	Args:
		origin (array): in the array, each element is one user's behavior feature matrix
	
	Returns:
		array: in the array, each element is one user's behavior feature array
	"""
	originD = np.asarray(origin['data'])
	data = []
	colnum, rownum = len(np.asarray(originD[0][0])), len(originD[0])
	print 'Start to deal with matrix to array converting work.'

	for x in originD:
		tmparray = np.asarray(x).reshape(len(x) * len(x[0]))
		# print tmparray
		data.append( tmparray )

	filterdata = []
	for each in data:
		tmparray = []
		for erow in row:
			for ecol in col:
				tmparray.append( each[erow*colnum + ecol] )
		filterdata.append( tmparray )

	print 'Matrix to array converting work complete!'

	return {
		'id': origin['id'],
		'data': filterdata
	}

def dotstomatrix(data, base, num, interval):
	"""Change 2D space dots to a density based matrix, in which every grid stores the number of dots belonged to thsi grid
	
	Args:
		data (array): Dots array, each of the element is consists of a list (x, y)
		base (int): The base number that should added to current axix location 
		num (int): Number of one axis's grid number
		interval (float): Interval of axis
	
	Returns:
		array: Heatmap matrix
	"""
	result = [[0 for col in xrange(0, num)] for row in xrange(0, num)]

	for each in data:
		# print getMatrixIndex(each[1], base, 1/interval), getMatrixIndex(each[0], base, 1/interval)
		result[ getMatrixIndex(each[1], base, 1/interval) ][ getMatrixIndex(each[0], base, 1/interval) ] += 1.0

	# for x in len(result):
	# 	for each in len(x):
	# 		result[x][each] = math.log(result[x][each]+2, 2 )

	return result

def getMatrixIndex(x, base, num):
	return int(math.floor((base + x) * num))

def matrixtofile(data, filename):
	"""Store density based matrix to csv file
	
	Args:
		data (array): Description
		filename (string): output file name
	
	Returns:
		NULL: Description
	"""
	result = []
	for each in data:
		result.append( ','.join( [str(x) for x in each] ) )

	print '%s lines data are wrote into file.' % str(len(result))

	with open(filename, 'w') as target:
		target.writelines( '\n'.join(result) )
	target.close()

def frange(x, y, jump):
	while x < y:
		yield x
		x += jump

def timeDisQuery(prop):
	pass