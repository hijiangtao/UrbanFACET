#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2017-03-25 09:39:38
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
from CommonFunc import getCityDistricts

def constructDistricts(city):
	dis = getCityDistricts(city)
	fmatDis = {}
	for key in dis.iterkeys():
		fmatDis[str(dis[key])] = key

	return fmatDis

def iterateMetricFiles(city):
	dis = constructDistricts(city)

def main():
	res = {
		'bj': [
			
		],
		'tj': [

		],
		'ts': [],
		'zjk': []
	}