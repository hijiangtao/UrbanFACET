#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-01-13 14:00:09
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os

def readDisPolyFile(path, filename):
	"""Summary
	
	Args:
	    path (TYPE): Description
	    filename (TYPE): Description
	
	Returns:
	    TYPE: Description
	"""
	with open(os.path.join(path, filename), 'rb') as target:
		for each in target:
			line = each.split("\t")
			coordinates = line[2].split(';')
			obj = {
				"type": "Polygon",
				"coordinates": [
					[  ]
				]
			}
			result.append( obj )


if __name__ == '__main__':
	for i in range(10):
		with open('/home/joe/Documents/git/living-modes-visual-comparison/test-'+str(i), 'ab') as res:
			res.write( '中国' + 'we\n' )
		res.close()