#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-06-24
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# 描述      : 

import os

# Beijing mountain area
# {
#     'north': 40.6108,
#     'south': 40.4166,
#     'east': 116.6762,
#     'west': 116.1832
# }

locs = {
	'north': 41.055,
	'south': 39.445,
	'west': 115.422,
	'east': 117.515
}
aim = {
	'north': 40.6108,
	'south': 40.4166,
	'east': 116.6762,
	'west': 116.1832
}
SPLIT = 0.003


def judInBox(index):
	LNGNUM = int((locs['east'] - locs['west']) / SPLIT + 1)
	latind = int(index / LNGNUM)
	lngind = index - latind * LNGNUM
	lat = locs['south'] + latind * SPLIT + SPLIT/2
	lng = locs['west'] + lngind * SPLIT + SPLIT/2
	if lat > aim['south'] and lat < aim['north'] and lng > aim['west'] and lng < aim['east']:
		return True
	
	return False

def scanRecords(arg):
	ids, recs = [], []
	# recsdict = {}
	tmpstr, needToSave, lastid = '', False, ''
	with open(arg, 'rb') as f:
		for line in f:
			onerec = line.strip('\n')
			reclist = onerec.split(',')
			
			# 新的 id
			if lastid != reclist[0]:
				if needToSave:
					recs.append(tmpstr)
					ids.append(lastid)
				lastid = reclist[0]
				tmpstr = onerec + '\n'
				needToSave = False

			# 延续旧 id 的记录
			else:
				tmpstr += onerec + '\n'
				if not needToSave:
					needToSave = judInBox(int(reclist[6]))
	
	return ids, recs

def main():
	inpath = '/enigma/tao.jiang/datasets/JingJinJi/records/idcollection/beijing'
	outpath = '/enigma/tao.jiang/datasets/JingJinJi/records/filter'
	# 遍历文件获得 ID 以及记录，并写入文件
	for i in range(0, 100):
		print 'Scaning file res-%05d' % i
		ids, recs = scanRecords(os.path.join(inpath, 'res-%05d' % i))
		with open(os.path.join(outpath, 'res-%05d' % i), 'ab') as stream:
			stream.write('\n'.join(recs))

if __name__ == '__main__':
	main()