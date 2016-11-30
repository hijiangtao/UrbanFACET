#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-29 16:37:06
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, time

class TimeConsuming(object):
	"""docstring for TimeConsuming"""
	def __init__(self, name):
		super(TimeConsuming, self).__init__()
		self.name = name
		self.time = time.clock()

	def end(self):
		lastingtime = time.clock() - self.time

		return '%s Time Consume: %ss' % (str(self.name), str(lastingtime))