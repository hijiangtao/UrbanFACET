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

		drawScatterPlot({
			'feature': feature, 
			'idlist': idlist	
		}, prop, labels, lablist, txtCluster, x)
	gc.collect()

def dbscan(feature, idlist, txt, prop):
	# feature2 is read from mongoDB, contains origin multi-dimension information
	# feature2, idlist2 = getMatrixfromMongo(prop['dbname'], prop['featurecolname'], prop['queryrate'])

	for x in xrange(0,2):
		eps = 0.1 + 0.02 * x
		db = DBSCAN(eps=eps, min_samples=50).fit(feature)
		core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
		core_samples_mask[db.core_sample_indices_] = True
		labels = db.labels_

		# Number of clusters in labels, ignoring noise if present.
		n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
		lablist = [i-1 for i in xrange(0,n_clusters_)]

		txtCluster = "DBScanCluster-%s(dis=%s)" % (txt, str(eps))
		# if n_clusters_ < 4:
		# 	print "n_clusters_ shouldn't be smaller than 4"
		drawScatterPlot({
			'feature': feature, 
			'idlist': idlist,
			'core_samples_mask': core_samples_mask	
		}, prop, labels, lablist, txtCluster, n_clusters_, "dbscan")
	
def drawScatterPlot(data, prop, labels, lablist, txtCluster, x, type = 'kmeans'):
	feature, idlist = data['feature'], data['idlist']

	plt.figure()
	
	if type == 'kmeans':
		plt.scatter(feature[:,0], feature[:,1], s=prop['plotsize'], c=labels, edgecolors='none', cmap=plt.cm.prism)
	elif type == 'dbscan':
		# Black removed and is used for noise instead.
		core_samples_mask = data['core_samples_mask']
		unique_labels = set(labels)
		colors = plt.cm.Spectral(np.linspace(0, 1, len(unique_labels)))

		for k, col in zip(unique_labels, colors):
			if k == -1:
				# Black used for noise.
				col = '#D9D1C9'

			class_member_mask = (labels == k)

			xy = feature[class_member_mask & core_samples_mask]
			plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=col,
					 markeredgecolor='none', markersize=prop['plotsize'])

			xy = feature[class_member_mask & ~core_samples_mask]
			plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=col,
					 markeredgecolor='none', markersize=prop['plotsize'] * 0.6)

	plt.title(txtCluster)

	print "%s clusters are detected." % str(x)
	
	ncolnum = int(x/4)
	if ncolnum == 0:
		ncolnum = 4

	recs = []
	norm = plt.Normalize(0, x-1)
	if type == 'dbscan':
		recs = []
		recs.append(mpatches.Rectangle((0,0),1,1,color='gray'))
		norm = plt.Normalize(1, x)

		for i in colors:
			recs.append(mpatches.Rectangle((0,0),1,1,color=i))
	elif type == 'kmeans':
		for i in xrange(0, x):
			recs.append(mpatches.Rectangle(0,0),1,1,color=plt.cm.hsv(norm(i)))
	
	plt.legend(recs, lablist,
		scatterpoints=1,
		loc='lower left',
		ncol=int(ncolnum),
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
	files = [
		# '1-in-10_tsne-workday', '1-in-10_tsne-weekend', '1-in-10_tsne-daytime', 
		# '1-in-10_tsne-evening', '1-in-10_tsne-wodaytime', '1-in-10_tsne-weevening', 
		'1-in-3_tsne-workday'#, '1-in-3_tsne-weekend', '1-in-3_tsne-daytime',
		# '1-in-3_tsne-evening', '1-in-3_tsne-wodaytime', '1-in-3_tsne-weevening'
	]
	prop = {
		'dbname': 'tdVC',
		'featurecolname': 'features_%s' % city,

		'baseurl': '/home/joe/Downloads/DecomposeResult-Specific-in-some-tp',
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
km: Kmeans
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
