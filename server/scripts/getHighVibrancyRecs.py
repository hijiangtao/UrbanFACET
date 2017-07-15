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
vibaim = {
	'north': 40.6108,
	'south': 40.4166,
	'east': 116.6762,
	'west': 116.1832
}
SPLIT = 0.003

disaim = [{
	'name': 'shenjiaying',
	'locs': {
		'north': 40.5368,
		'south': 40.4344,
		'west': 115.9222,
		'east': 116.0321
	}
},{
	'name': 'huairou',
	'locs': {
		'north': 40.4637,
		'south': 40.2502,
		'west': 116.5787,
		'east': 116.7462
	}
},{
	'name': 'shunyi',
	'locs': {
		'north': 40.1936,
		'south': 40.0823,
		'west': 116.5787,
		'east': 116.7545
	}
},{
	'name': 'changping',
	'locs': {
		'north': 40.2774,
		'south': 40.1411,
		'west': 116.1200,
		'east': 116.3150
	}
},{
	'name': 'fivering',
	'locs': {
		'north': 40.0255,
		'south': 39.7684,
		'west': 116.1996,
		'east': 116.5430
	}
}]


def judInBox(index, aim):
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
					needToSave = judInBox(int(reclist[6]), vibaim)
	
	return ids, recs

def countRecords(arg):
	file = arg['file']
	aim = arg['aim']
	count = 0

	with open(file, 'rb') as f:
		for line in f:
			onerec = line.strip('\n')
			if onerec == '':
				continue
			reclist = onerec.split(',')

			if judInBox(int(reclist[6]), aim['locs']):
				count += 1

	return count


def main():
	# 逻辑一
	# inpath = '/enigma/tao.jiang/datasets/JingJinJi/records/idcollection/beijing'
	# outpath = '/enigma/tao.jiang/datasets/JingJinJi/records/filter'
	# # 遍历文件获得 ID 以及记录，并写入文件
	# for i in range(0, 4):
	# 	print 'Scaning file res-%05d' % i
	# 	ids, recs = scanRecords(os.path.join(inpath, 'res-%05d' % i))
	# 	with open(os.path.join(outpath, 'res-%05d' % i), 'ab') as stream:
	# 		stream.write('\n'.join(recs))

	# 逻辑二
	count = [0 for x in xrange(0, 5)]
	inpath = '/enigma/tao.jiang/datasets/JingJinJi/records/filter'
	for i in xrange(0, 4): # file name
		print 'Counting file res-%05d' % i

		for x in xrange(0, 5): # area name
			count[x] += countRecords({
				'file': os.path.join(inpath, 'res-%05d' % i), 
				'aim': disaim[x]
				})

	for x in xrange(0, 5):
		print '%s area: %d records' (disaim[x]['name'], count[x])

if __name__ == '__main__':
	main()