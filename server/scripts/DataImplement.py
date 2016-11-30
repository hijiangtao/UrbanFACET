#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-29 23:32:00
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import csv
import numpy as np
from numpy import linalg as la
import CommonFunc as func
from pprint import pprint

def euclidSimilar(inA, inB):
	"""Calculate euclidean distance between two vectors 
	
	Args:
		inA (array): Description
		inB (array): Description
	
	Returns:
		float: Distance
	"""
	return 1.0 / (1.0 + la.norm(np.asarray(inA) - np.asarray(inB)))

def basevecFromFile(filename):
	mydict = [0] * 24
	with open(filename, mode='r') as infile:	
		reader = csv.reader(infile)
		for rows in reader:
			k = int(rows[0])
			v = float(rows[3])
			mydict[k] = v

	infile.close()
	return mydict


def getData(dbname, divnum):
	db, cur = func.connectMYSQL( dbname )

	# 获取每个ID总定位次数统计
	cur.execute("SELECT id, recnum FROM tdid_link")
	recnumres = {}
	for each in cur.fetchall():
		recnumres[str(each[0])] = int(each[1])

	# 获取用户分ID，分小时的定位记录数统计
	cur.execute("SELECT tdid AS 'tdid', timeSegID div %s AS 'time', COUNT(1) AS 'num' FROM cbeijing GROUP BY tdid, time;" % (str(divnum), ))
	timedisres = {}
	for x in xrange(1,100001):
		tmp = []
		for hour in xrange(0,24):
			tmp.append(0.0)
		timedisres[str(x)] = tmp

	# print len(cur.fetchall())
	for each in cur.fetchall():
		tdid, time, num = str(each[0]), int(each[1]), float(each[2])
		timedisres[tdid][time] = num / float(recnumres[tdid])


	cur.close()
	return timedisres, recnumres

def impleAttr(disdata, numdata):
	basevec = {
		'gt11': basevecFromFile('/home/taojiang/datasets/tdBJ/rec-24h-dis/users-gt-11-24hours-distribution.csv'),
		'whole': basevecFromFile('/home/taojiang/datasets/tdBJ/rec-24h-dis/users-whole-24hours-distribution.csv')
	}
	conn, db = func.connectMongo('tdBJ')
	tmpArr, count = {}, 0
	maxWSim, minWSim, maxGSim, minGSim = 0, 1, 0, 1

	for key in disdata:
		count += 1
		dis = euclidSimilar(disdata[key], basevec['whole'])
		dis2 = euclidSimilar(disdata[key], basevec['gt11'])

		if dis>maxWSim:
			maxWSim = dis
		if dis<minWSim:
			minWSim = dis
		if dis2>maxGSim:
			maxGSim = dis2
		if dis2<minGSim:
			minGSim = dis2

		tmpArr[key] = { 
			'whlsim'	: dis,
			'gt11sim'	: dis2
		}

		# if count == 10000:
		# 	print '10000 lines data are inserting into mongoDB.'
		# 	db['beijing_features'].update_many({}, {
		# 		'tdisvec'	: disdata['$_id'],
		# 		'whlsim'	: tmpArr['$_id']['whlsim'],
		# 		'gt11sim'	: tmpArr['$_id']['gt11sim'],
		# 		'recnum'	: numdata['$_id']
		# 	})
		# 	tmpArr = {}
		# 	count = 0

	bulk = db['beijing_features'].initialize_ordered_bulk_op()
	for key in disdata:
		bulk.find({'_id': int(key)}).update({'$set': {
			'tdisvec'	: disdata[key],
			'whlsim'	: tmpArr[key]['whlsim'],
			'gt11sim'	: tmpArr[key]['gt11sim'],
			'recnum'	: numdata[key]
			# 
			# 'tdisvec'	: '',
			# 'whlsim'	: '',
			# 'gt11sim'	: '',
			# 'recnum'	: ''
		}})

	# db['beijing_features'].update_many({}, {
	# 	'tdisvec'	: disdata['$_id'],
	# 	'whlsim'	: tmpArr['$_id']['whlsim'],
	# 	'gt11sim'	: tmpArr['$_id']['gt11sim'],
	# 	'recnum'	: numdata['$_id']
	# })
	
	print "WHOLE RECORDS\nMAX: %s MIN: %s\nGT11\nMAX: %s MIN: %s" % (maxWSim, minWSim, maxGSim, minGSim)
	
	result = bulk.execute()
	pprint(result)
	conn.close()

def main():
	dbname = 'tsu_explore'
	divnum = 10
	
	timedisres, recnumres = getData(dbname, divnum)
	impleAttr(timedisres, recnumres)

if __name__ == '__main__':
	main()