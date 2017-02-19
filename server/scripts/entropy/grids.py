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
	res, disEndInd = {}, 29 + disnum
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