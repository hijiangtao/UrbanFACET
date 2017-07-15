#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-07-15 11:29:29
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
from CommonFunc import connectMongo

def getUIDList(file):
	uid = []

	with open(file, 'rb') as f:
		for line in f:
			onerec = line.strip('\n')
			if onerec == '':
				continue
			reclist = onerec.split(',')
			uid.append(int(reclist[1]))

	return uid

def accuPOI(arg, dbname):
	res = [0 for x in xrange(0, 11)]

	conn, mdb = connectMongo(dbname)
	poiDisRes = list(mdb['newgrids_beijing'].find({ 
		'properties.uid': {
			'$in': arg
		}
	}, { 'properties.vec': True }))
	conn.close()

	for each in poiDisRes:
		vec = each['properties']['vec']
		for x in xrange(0, 11):
			res[x] += vec[x]

	return res

def main():
	inpath = '/enigma/tao.jiang/datasets/JingJinJi/records/filter'
	arr = getUIDList(os.path.join(inpath, 'bjEmatrixTop'))
	res = accuPOI(arr, 'tdnormal')
	print res

if __name__ == '__main__':
	main()
