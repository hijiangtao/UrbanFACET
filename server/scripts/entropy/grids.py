#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-02-16 14:43:00
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import numpy as np

def getGridsFromMongo(city, db):
	res = list( db['newgrids_%s' % city].find({"properties.vecvalid": True }, {"properties.uid": 1, "properties.vec": 1}) )
	gridsData, validIDs = {}, []
	reslen = len(res)
	for x in xrange(0, reslen):
		id = str(res[x]['properties']['uid'])
		vec = np.array(res[x]['properties']['vec'], dtype='f')
		gridsData[ id ] = vec
		validIDs.append(id)

	return gridsData, validIDs

def getPeopleEntropyFromFile(file, disnum):
	"""从 distribution 文件恢复 tdid Entropy 分布, 用于计算 record entropy (全量数据)
	
	Args:
	    file (TYPE): Description
	    disnum (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	res, disEndInd = {}, 31 + disnum
	with open(file, 'rb') as stream:
		for each in stream:
			line = each.split(',')
			res[ line[0] ] = {
				't1': np.array([float(line[x]) for x in xrange(6,17)]),
				't2': np.array([float(line[x]) for x in xrange(17,31)]),
				't3': np.array([float(line[x]) for x in xrange(31, disEndInd)]),
				'prop': {
					'wnum': int(line[5]),
					'vnum': int(line[4])
				}
			}
	stream.close()

	return res

def getFullPeopleEntropyFromFile(file, disnum):
	"""从 distribution 文件恢复 tdid Entropy 分布, 用于计算 record entropy (全量数据, 包含 entropy values)
	
	Args:
	    file (TYPE): Description
	    disnum (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	res, disEndInd = {}, 31 + disnum
	with open(file, 'rb') as stream:
		for each in stream:
			line = each.split(',')
			res[ line[0] ] = {
				't1': np.array([float(line[x]) for x in xrange(6,17)]),
				't2': np.array([float(line[x]) for x in xrange(17,31)]),
				't3': np.array([float(line[x]) for x in xrange(31, disEndInd)]),
				'prop': {
					'wnum': 0,
					'vnum': 0
				},
				'val': {
					't1': float( line[1] ),
					't2': float( line[2] ),
					't3': float( line[3] )
				}
			}
	stream.close()

	return res

def getPeopleTPEnpFromFile(file, disnum):
	"""从 distribution 文件恢复 tdid Entropy 分布, 用于计算 record entropy (timeperiod 数据)
	
	Args:
	    file (TYPE): Description
	    disnum (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	res, disEndInd = {}, 16 + disnum
	with open(file, 'rb') as stream:
		for each in stream:
			line = each.split(',')
			res[ line[0] ] = {
				't1': np.array([float(line[x]) for x in xrange(5,16)]),
				't3': np.array([float(line[x]) for x in xrange(16, disEndInd)]),
				'prop': {
					'wnum': int(line[4]),
					'vnum': int(line[3])
				}
			}
	stream.close()

	return res

def getPeopleDTEnpFromFile(file, disnum):
	"""从 distribution 文件恢复 tdid Entropy 分布, 用于计算 record entropy (daytype 数据)
	
	Args:
	    file (TYPE): Description
	    disnum (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	res, disEndInd = {}, 24 + disnum
	with open(file, 'rb') as stream:
		for each in stream:
			line = each.split(',')
			res[ line[0] ] = {
				't1': np.array([float(line[x]) for x in xrange(6,17)]),
				't2': np.array([float(line[x]) for x in xrange(17,24)]),
				't3': np.array([float(line[x]) for x in xrange(24, disEndInd)]),
				'prop': {
					'wnum': int(line[5]),
					'vnum': int(line[4])
				}
			}
	stream.close()

	return res

def filterByDaytype(val, type, tpVal=0):
	"""根据 daytype 值判断当前记录是否符合 filter 条件,返回 Boolean 值, 7表示工作日, 8表示周末
	
	Args:
	    val (TYPE): Description
	    type (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	if type == 7:
		if val == 0 or val == 6:
			return True
		else:
			return False
	elif type == 8:
		if val > 0 and val < 6:
			return True
		else:
			return False
	elif type <= 6:
		if type === tpVal:
			return True
		else:
			return False