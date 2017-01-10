#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-01-06 22:52:45
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import numpy as np
import scipy.stats as sc
from CommonFunc import connectMongo, getMatrixSumbyDim

def aggregateEntropy(type, dbName, collectionName, data):
	conn, db = connectMongo(dbName)

	rawData = list(db[collectionName].find({}, {'_id': 1, 'vec': 1}))
	if type == 'temporal':
		pass
	elif type == 'spatial':
		pass

	conn.close()

def calUsersEntropy(dbName, collectionName):
	conn, db = connectMongo(dbName)
	# get all user features
	rawData = list(db[collectionName].find({}, {'pVec': 1}))
	print 'Query %s data in %s' % (str(len(rawData)), collectionName)

	# update entropy values
	bulk = db[collectionName].initialize_ordered_bulk_op()
	for item in rawData:
		pVec = [each[:-1] for each in item['pVec']]
		
		# Calculate sum results by columns and rows
		# pVecSum = np.matrix(pVec).sum(dtype='float')
		pVecColSum, pVecRowSum = getMatrixSumbyDim(pVec, 'column'), getMatrixSumbyDim(pVec, 'row')

		

		if type(pVecColSum) is not int:
			# Calculates entropy results by temporal or spatial mode
			colEntropy = sc.entropy(pVecColSum)
			rowEntropy = sc.entropy(pVecRowSum)

			bulk.find({'_id': int(item['_id'])}).update({'$set': {
				'entropy' : {
					'col': colEntropy,
					'row': rowEntropy
				}  
			}})
		else:
			bulk.find({'_id': int(item['_id'])}).update({'$set': {
				'entropy' : {
					'col': -1,
					'row': -1
				}  
			}})
	
	# insert them all into mongoDB
	result = bulk.execute()
	print result

	conn.close()

if __name__ == '__main__':
	calUsersEntropy('tdVC', 'features_beijing')