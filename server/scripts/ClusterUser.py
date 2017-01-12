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
	rawdata, feature, idlist = [], [], []
	with open(file, 'rb') as csvfile:
		for row in csvfile.readlines():
			tmparr = np.array( row.strip('\n').split(',') )
			feature.append( tmparr[1:3].astype(float) )
			idlist.append( int(tmparr[0]) )
			rawdata.append( tmparr )

	csvfile.close()
	return np.asarray(rawdata), np.asarray(feature), np.asarray(idlist)

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

def kmeans(rawdata, feature, idlist, txt, prop):
	# feature is read from file, contains 2D dimension
	# feature, idlist = getMatrixfromFile(filename)
	# feature2 is read from mongoDB, contains origin multi-dimension information
	# feature2, idlist2 = getMatrixfromMongo(prop['dbname'], prop['featurecolname'], prop['queryrate'])

	for x in xrange(2, 20):
		lablist = [i for i in xrange(0,x)]

		Y = KMeans(n_clusters=x, random_state=0).fit(feature)
		y_predict = Y.predict(feature)
		txtCluster = "KMeansCluster-%s(k=%s)" % (txt, str(x))
		labels = Y.labels_

		drawScatterPlot({
			'rawdata': rawdata,
			'feature': feature, 
			'idlist': idlist	
		}, prop, labels, lablist, txtCluster, x)
	gc.collect()

def dbscan(rawdata, feature, idlist, txt, prop, eps = 0.0, minpts = 0):
	# feature2 is read from mongoDB, contains origin multi-dimension information
	# feature2, idlist2 = getMatrixfromMongo(prop['dbname'], prop['featurecolname'], prop['queryrate'])

	# print "eps: %s, minpts: %s" % (eps, minpts)

	if eps != 0.0 and minpts != 0:
		minpts = minpts
		db = DBSCAN(eps=eps, min_samples=minpts).fit(feature)
		core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
		core_samples_mask[db.core_sample_indices_] = True
		labels = db.labels_

		# Number of clusters in labels, ignoring noise if present.
		n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
		lablist = [i-1 for i in xrange(0 if -1 in labels else 1,n_clusters_+1)]

		txtCluster = "DBScanCluster-%s(eps=%s,minpts=%s)" % (txt, str(eps), str(minpts))
		# if n_clusters_ < 4:
		# 	print "n_clusters_ shouldn't be smaller than 4"
		resultfilename = drawScatterPlot({
			'rawdata': rawdata,
			'feature': feature, 
			'idlist': idlist,
			'core_samples_mask': core_samples_mask	
		}, prop, labels, lablist, txtCluster, n_clusters_, "dbscan")

		return resultfilename
	else:
		for minpts in xrange(20, 80, 5):
			for x in xrange(0,20):
				eps = 0.10 + 0.01 * x
				db = DBSCAN(eps=eps, min_samples=minpts).fit(feature)
				core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
				core_samples_mask[db.core_sample_indices_] = True
				labels = db.labels_

				# Number of clusters in labels, ignoring noise if present.
				n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
				lablist = [i-1 for i in xrange(0 if -1 in labels else 1,n_clusters_+1)]

				txtCluster = "DBScanCluster-%s(eps=%s,minpts=%s)" % (txt, str(eps), str(minpts))
				# if n_clusters_ < 4:
				# 	print "n_clusters_ shouldn't be smaller than 4"
				drawScatterPlot({
					'rawdata': rawdata,
					'feature': feature, 
					'idlist': idlist,
					'core_samples_mask': core_samples_mask	
				}, prop, labels, lablist, txtCluster, n_clusters_, "dbscan")

			gc.collect()

		return True
	
def drawScatterPlot(data, prop, labels, lablist, txtCluster, x, type = 'kmeans'):
	rawdata, feature, idlist = data['rawdata'], data['feature'], data['idlist']
	baseurl = prop['baseurl']

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
		recs.append(mpatches.Rectangle((0,0),1,1,color='#D9D1C9'))
		norm = plt.Normalize(1, x)

		for i in colors:
			recs.append(mpatches.Rectangle((0,0),1,1,color=i))
	elif type == 'kmeans':
		for i in xrange(0, x):
			recs.append(mpatches.Rectangle((0,0),1,1,color=plt.cm.prism(norm(i))))
	
	plt.legend(recs, lablist,
		scatterpoints=1,
		loc='lower left',
		ncol=int(ncolnum),
		fontsize=5)

	img = plt.gcf()
	filesrc = os.path.join(os.getcwd(), '../../public/img/cluster', '%s.png' % txtCluster)
	# print 'getcwd', os.getcwd(), 'filesrc', filesrc
	img.savefig( filesrc, dpi=400)
	plt.close()

	# result = combineArrs(idlist, labels)

	result = []
	for x in xrange(0, len(rawdata)):
		result.append( np.append( rawdata[x], labels[x] ) )
	func.matrixtofile(result, os.path.join(baseurl, '../tmp', txtCluster+'.csv') )

	return  '%s.csv' % txtCluster

def usage():
	print 'python ClusterUser.py -d <direcotry> -c <city> -m <method> -p <plotsize>'

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:m:p:d:w:f:x:y:", ["help", "direcotry=", "city=", "method=", "plotsize=", "pipeway=", "file=", "eps=", "minpts="])
	except getopt.GetoptError as err:
		# print help information and exit:
		print str(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	city, method, pipeway, file = 'beijing', ['km'], 'default', ''
	eps, minpts = 0.0, 0
	files = [
		# '1-in-10_tsne-workday', '1-in-10_tsne-weekend', '1-in-10_tsne-daytime', 
		# '1-in-10_tsne-evening', '1-in-10_tsne-wodaytime', '1-in-10_tsne-weevening', 
		'1-in-3_tsne-workday', '1-in-3_tsne-weekend', '1-in-3_tsne-daytime',
		'1-in-3_tsne-evening', '1-in-3_tsne-wodaytime', '1-in-3_tsne-weevening'
	]
	prop = {
		'dbname': 'tdVC',
		'featurecolname': 'features_%s' % city,
		'baseurl': os.path.join(os.getcwd(), '../data/init'),
		'plotsize': 1.0,
		'queryrate': 3
	}

	print 'Python received params: ', opts

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
		elif opt in ("-d", "--direcotry"):
			prop['baseurl'] = arg
		elif opt in ("-w", "--pipeway"):
			pipeway = arg
		elif opt in ("-f", "--file"):
			file = arg
		elif opt in ("-x", "--eps"):
			eps = float(arg)
		elif opt in ("-y", "--minpts"):
			minpts = int(arg)

	if pipeway == 'default':
		filename = os.path.join(prop['baseurl'], '2D-ScatterData_%s.csv' % file)
		rawdata, feature, idlist = getMatrixfromFile(filename)
		resultfilename = dbscan(rawdata, feature, idlist, file, prop, eps, minpts)

		return resultfilename
	else:
		print """--- Cluster Mode ---
Please enter the clustering method you want to use: 
km: Kmeans
db: DBScan"""
		method = raw_input().split(',')
		
		# kmeans situation
		for each in files:
			filename = os.path.join(prop['baseurl'], '2D-ScatterData_%s.csv' % each)
			rawdata, feature, idlist = getMatrixfromFile(filename)
			if len(method) == 1:
				if method == 'km':
					kmeans(rawdata, feature, idlist, each, prop)
				else:
					dbscan(rawdata, feature, idlist, each, prop)
			else:
				kmeans(feature, idlist, each, prop)
				dbscan(feature, idlist, each, prop)
	
	return True

if __name__ == '__main__':
	logging.basicConfig(filename='logger-clusteruser.log', level=logging.DEBUG)
	result = main(sys.argv[1:])
	# print os.getcwd()
