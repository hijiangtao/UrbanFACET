#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-28 17:24:32
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import CommonFunc as func

def kmeans():
	pass

if __name__ == '__main__':
	dbname = 'tdBJ'
	collectname = 'beijing_features'
	queryrate = 10
	rowlist = [0,1,2,3,4,5,6,7,8,9,10,11]
	collist = [0,1,2,3,4,5,6,7,8,9,10]

	data = queryUserMatrix(dbname, collectname, queryrate)
	qdata, filterqdata = func.matrixtoarray(data, rowlist, collist)

	for x in list(func.frange(0, 0.21, 0.05)):
		sdata = selectFeature(qdata, x, 'low-variance')
		kmeans = KMeans(n_clusters=2, random_state=0).fit_predict(sdata)


		gc.collect()


	