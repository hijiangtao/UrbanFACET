#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-28 17:24:32
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, csv, gc
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import CommonFunc as func
import matplotlib.patches as mpatches

def kmeans():
	pass

def getMatrixfromFile(file):
	feature, idlist = [], []
	with open(file, 'rb') as csvfile:
		for row in csvfile.readlines():
			tmparr = np.array( row.split(',') )
			feature.append( tmparr[: len(tmparr)-1].astype(float) )
			idlist.append( int(tmparr[-1]) )

	csvfile.close()
	return np.asarray(feature), np.asarray(idlist)

def getMatrixfromMongo(dbname, collectname, queryrate):
	conn, db = func.connectMongo(dbname)

	rawdata = list(db[collectname].find({'_id': { '$mod' : [queryrate, 0] }}, {'vec': 1}).sort([ ("_id", 1) ]))

	feature, idlist = [], []
	for each in rawdata:
		tmparr = []
		for x in xrange(0, 6):
			tmparr = np.concatenate((tmparr,each['vec'][x]), axis=0)
		feature.append( tmparr )
		idlist.append( each['_id'] )

	conn.close()
	return np.asarray(feature), np.asarray(idlist)

def combineArrs(a, b):
	if len(a) != len(b):
		return 0

	a, b = np.asarray(a), np.asarray(b)
	return [[a[x], b[x]] for x in xrange(0,len(a))]

if __name__ == '__main__':
	dbname = 'tdBJ'
	collectname = 'beijing_features'
	plotsize = 1
	baseurl = '/home/taojiang/datasets/tdBJ/decomp-data/Feature-Decompose-with-TimeDisColor'
	# files = ['1-in-10-tsne-label-deftype-1', '1-in-10-tsne-label-deftype-2', '1-in-2-tsne-deftype3-recnum-1', '1-in-2-tsne-deftype3-recnum-2', '1-in-2-tsne-origin-recnum']
	files = ['1-in-10-tsne-label-deftype-1']

	for each in files:
		feature, idlist = getMatrixfromFile(os.path.join(baseurl, 'ScatterData-%s.csv' % each))
		feature2, idlist2 = getMatrixfromMongo('tdBJ', 'beijing_features', 10)

		for x in xrange(3, 14):
			lablist = [i for i in xrange(0,x)]

			Y = KMeans(n_clusters=x, random_state=0).fit(feature2)
			y_predict = Y.predict(feature2)
			plt.figure()
			
			plt.scatter(feature[:,0], feature[:,1], s=plotsize, c=Y.labels_, edgecolors='none', cmap=plt.cm.coolwarm)
			plt.title("%s(k=%s) KMeans cluster(origin)" % (each, str(x)))
			
			recs = []
			colorlist = [plt.cm.coolwarm(i) for i in xrange(0, x)]
			norm = plt.Normalize(0, x-1)

			for i in range(0,len(lablist)):
				recs.append(mpatches.Rectangle((0,0),1,1,color=plt.cm.coolwarm(norm(i))))
			plt.legend(recs,lablist,
				scatterpoints=1,
				loc='lower right',
				ncol=4,
				fontsize=6)

			img = plt.gcf()
			img.savefig('KMeans-%s[k-%s].png' % (each, x), dpi=400)



			result = combineArrs(idlist, Y.labels_)
			func.matrixtofile(result, 'KMeans-%s-[k-%s].csv' % (each, x))
		gc.collect()


	