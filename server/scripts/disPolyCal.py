#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-01-13 14:00:09
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

# import os

# def readDisPolyFile(path, filename):
# 	"""Summary
	
# 	Args:
# 	    path (TYPE): Description
# 	    filename (TYPE): Description
	
# 	Returns:
# 	    TYPE: Description
# 	"""
# 	with open(os.path.join(path, filename), 'rb') as target:
# 		for each in target:
# 			line = each.split("\t")
# 			coordinates = line[2].split(';')
# 			obj = {
# 				"type": "Polygon",
# 				"coordinates": [
# 					[  ]
# 				]
# 			}
# 			result.append( obj )


# if __name__ == '__main__':
# 	for i in range(10):
# 		with open('/home/joe/Documents/git/living-modes-visual-comparison/test-'+str(i), 'ab') as res:
# 			res.write( '中国' + 'we\n' )
# 		res.close()
# 		

	
import time
import random
from multiprocessing import Process, Manager, Value, Array, Lock
from sys import getsizeof
from ctypes import c_wchar_p

lock = Lock() 

def foo(data, name=''):
	global lock
	with lock:
	# with data[0].get_lock():
		time.sleep(random.random())
		data[0].value += '中国as大大所大多大大大所大大所多所撒多撒'
		print data[0].value

if __name__ == "__main__":
	manager = Manager()
	x = manager.Value('i', 0)
	y = Value('i', 0)
	# z = Array(c_wchar_p, 10)
	z = [] 

	y.value += 1
	print getsizeof(z)
	for i in xrange(0,10):
		z.append( manager.Value(c_wchar_p, "") )

	for i in range(5):
		# Process(target=foo, args=(x, 'x')).start()
		# Process(target=foo, args=(y, 'y')).start()
		Process(target=foo, args=(z, 'z')).start()

	# print 'Before waiting: '
	# print 'x = {0}'.format(x.value)
	# print 'y = {0}'.format(y.value)

	time.sleep(5.0)
	# print 'After waiting: '
	# print 'x = {0}'.format(x.value)
	# print 'y = {0}'.format(y.value)
	print z[0].value
	print getsizeof(z)