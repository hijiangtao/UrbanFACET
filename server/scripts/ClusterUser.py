#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-28 17:24:32
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, csv, gc, getopt, sys, logging
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN 
import CommonFunc as func
import matplotlib.patches as mpatches

def getMatrixfromFile(file):
	feature, idlist = [], []
	with open(file, 'rb') as csvfile:
		for row in csvfile.readlines():
			tmparr = np.array( row.split(',') )
			feature.append( tmparr[1:3].astype(float) )
			idlist.append( int(tmparr[0]) )

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

def kmeans(feature, idlist, txt, prop):
	# feature is read from file, contains 2D dimension
	# feature, idlist = getMatrixfromFile(filename)
	# feature2 is read from mongoDB, contains origin multi-dimension information
	# feature2, idlist2 = getMatrixfromMongo(prop['dbname'], prop['featurecolname'], prop['queryrate'])

	for x in xrange(4, 20):
		lablist = [i for i in xrange(0,x)]

		Y = KMeans(n_clusters=x, random_state=0).fit(feature)
		y_predict = Y.predict(feature)
		txtCluster = "KMeansCluster-%s(k=%s)" % (txt, str(x))
		labels = Y.labels_

		drawScatterPlot(feature, idlist, prop, labels, lablist, txtCluster, x)
	gc.collect()

def dbscan(feature, idlist, txt, prop):
	# feature2 is read from mongoDB, contains origin multi-dimension information
	# feature2, idlist2 = getMatrixfromMongo(prop['dbname'], prop['featurecolname'], prop['queryrate'])

	for x in xrange(0,20):
		eps = 0.3 + 0.01 * x
		db = DBSCAN(eps=eps, min_samples=10).fit(feature)
		labels = db.labels_

		# Number of clusters in labels, ignoring noise if present.
		n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
		lablist = [i for i in xrange(0,n_clusters_)]

		txtCluster = "DBScanCluster-%s(dis=%s)" % (txt, str(eps))
		drawScatterPlot(feature, idlist, prop, labels, lablist, txtCluster, n_clusters_)
	
def drawScatterPlot(feature, idlist, prop, labels, lablist, txtCluster, x):
	plt.figure()
	plt.scatter(feature[:,0], feature[:,1], s=prop['plotsize'], c=labels, edgecolors='none', cmap=plt.cm.coolwarm)
	plt.title(txtCluster)
	
	recs = []
	norm = plt.Normalize(0, x-1)

	for i in range(0, x):
		recs.append(mpatches.Rectangle((0,0),1,1,color=plt.cm.coolwarm(norm(i))))
	plt.legend(recs, lablist,
		scatterpoints=1,
		loc='lower left',
		ncol=4,
		fontsize=5)

	img = plt.gcf()
	img.savefig('%s.png' % txtCluster, dpi=400)
	plt.close()

	result = combineArrs(idlist, labels)
	func.matrixtofile(result, '%s.csv' % txtCluster)

def usage():
	print 'python FeatureConstruction.py -c <city> -d <work direcotry> -s <split length> -t <tasks number>'

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:m:p:", ["help", "city=", "method=", "plotsize="])
	except getopt.GetoptError as err:
		# print help information and exit:
		print str(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	city, method = 'beijing', ['km']
	files = ['1-in-10_tsne-workday']
	prop = {
		'dbname': 'tdVC',
		'featurecolname': 'features_%s' % city,
		'baseurl': '/home/taojiang/datasets/tdVC/decomp-data/Feature-Decompose-in-2D',
		'plotsize': 1.0,
		'queryrate': 10
	}

	for opt, arg in opts:
		if opt == '-h':
			usage()
			sys.exit()
		elif opt in ("-c", "--city"):
			city = arg
			prop['featurecolname'] = 'features_%s' % city
		elif opt in ("-m", "--method"):
			method = [arg]
		elif opt in ("-p", "--plotsize"):
			prop['plotsize'] = float(arg)

	print """--- Cluster Mode ---
Please enter the clustering method you want to use: 
km: kmeans
db: DBScan"""
	method = raw_input().split(',')
	
	# kmeans situation
	for each in files:
		filename = os.path.join(prop['baseurl'], '2D-ScatterData_%s.csv' % each)
		feature, idlist = getMatrixfromFile(filename)
		if len(method) == 1:
			if method == 'km':
				kmeans(feature, idlist, each, prop)
			else:
				dbscan(feature, idlist, each, prop)
		else:
			kmeans(feature, idlist, each, prop)
			dbscan(feature, idlist, each, prop)
		

if __name__ == '__main__':
	logging.basicConfig(filename='logger-clusteruser.log', level=logging.DEBUG)
	main(sys.argv[1:])
