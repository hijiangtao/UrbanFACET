#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-22 11:08:13
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import math, heatmap, gc, pp, time, logging, sys, getopt
from sklearn.manifold import TSNE, MDS
from sklearn.feature_selection import VarianceThreshold
import matplotlib.pyplot as plt
import CommonFunc as func
from CommonCla import TimeConsuming
import numpy as np
from sklearn.decomposition import PCA, KernelPCA
import matplotlib.patches as mpatches

# def getUsers(thre):
# 	db, cur = func.connectMYSQL("tsu_explore")

# 	cur.execute("select tdid, count(1) AS num from cbeijing group by tdid HAVING num>%s;" % str(thre))
# 	res = []
# 	for each in cur.fetchall():
# 		res.append(each[0])

# 	return res

def queryUserMatrix(dbname, collectname, queryrate, recordsthre = 0, entropytype = 'col', entropymin = 0, entropymax = 100):
	"""Query user matrix from database and return it as a matrix
	
	Args:
		dbname (string): Database name
		collectname (string): Collection name
		queryrate (int): Query rate, for example: 5 means 1/5 in whole data
	
	Returns:
		TYPE: Description
	"""
	conn, db = func.connectMongo(dbname)
	entropyprop = 'entropy.%s' % entropytype

	if recordsthre != 0:
		# bug
		qresult = list(db[collectname].find({ '$and': [ 
			{ '_id': { '$mod' : [queryrate, 0] } }, 
			{ 'totalNum': { '$gt': recordsthre } }, 
			{ entropyprop: { '$gte': float(entropymin), '$lte': float(entropymax) } } 
		] }, 
		{
			'pVec': 1, 
			'gt11sim': 1, 
			'whlsim': 1, 
			'totalNum': 1
		}).sort([ ("_id", 1) ]))
	else:
		qresult = list(db[collectname].find({ '$and': [
			{'_id': { '$mod' : [queryrate, 0] }},
			{ entropyprop: { '$gte': float(entropymin), '$lte': float(entropymax) } } 
		]}, 
		{
			'pVec': 1, 
			'gt11sim': 1, 
			'whlsim': 1, 
			'totalNum': 1
		}).sort([ ("_id", 1) ]))
	
	print "User query result: %s people." % str(len(qresult))
	data = {
		'id': [],
		'data': []
	}
	featureDict = {}

	for x in qresult:
		data['data'].append( x['pVec'] )
		data['id'].append( str(x['_id']) )
		featureDict[ str(x['_id']) ] = {
			'_id': int(x['_id']),
			'gt11sim': float(x['gt11sim']),
			'whlsim': float(x['whlsim']),
			'totalNum': int(x['totalNum'])
		}

	conn.close()
	return data, featureDict

def queryFeatureDistribution(db, collectname, findex):
	qresult = list(db[collectname].aggregate([ {'$project': {'vec': { '$slice': ['$vec', findex, 1]  } }}, {'$match': {'vec': [0,0,0,0,0,0,0,0,0,0,0] } }, {'$group': {'_id': 1, 'total': {'$sum': 1}}} ]))

	for each in qresult:
		print "%d position has %s zero element." % (findex, str(each['total']))


def drawFigure(data, featureDict, prop):
	"""Figures' drawing and saving
	
	Args:
		data (list): Dots list
		plotsize (TYPE): Description
		queryrate (TYPE): Description
	
	Returns:
		TYPE: Description
	"""

	# Init transformation
	plotsize, queryrate, fthre = prop['plotsize'], str(prop['queryrate']), str(prop['text'])
	
	# matrixData 用于存储降维后点值的二维位置与对应 ID 信息
	matrixDataRaw = np.asarray( np.array(data['data'])[:, 0:2] )
	matrixDataRes = []
	
	# 相似度对应的 colormap 取值表
	simcolormap = {
		'4': '#1924B1',
		'5': '#37B6CE',
		'6': '#25D500',
		'7': '#FFC700',
		'8': '#FF8E00',
		'9': '#FF1300'
	}

	# Scatter plot 
	X, Y = data['data'][:,0], data['data'][:,1]
	whlC, gt11C, numC = [], [], []
	for x in xrange(0, len(data['id'])):
		whlSimVal = int(math.floor( featureDict[ str(data['id'][x]) ]['whlsim']*10 ))
		gt11SimVal = int(math.floor( featureDict[ str(data['id'][x]) ]['gt11sim']*10 ))
		whlC.append( simcolormap[ str( whlSimVal ) ] )
		gt11C.append( simcolormap[ str( gt11SimVal ) ] )

		totalNum = featureDict[ str(data['id'][x]) ]['totalNum']
		numC.append( func.calColorbyNum( int(totalNum) ) )
		matrixDataRes.append( [ data['id'][x], matrixDataRaw[x][0], matrixDataRaw[x][1], totalNum, whlSimVal, gt11SimVal ] )

	textRecNum = '2D-ScatterData_1-in-%s_%s(byRecNum)' % (queryrate, fthre)
	textAveSim = '2D-ScatterData_1-in-%s_%s(byAveSim)' % (queryrate, fthre)

	func.matrixtofile(matrixDataRes, '%s/2D-ScatterData_1-in-%s_%s.csv' % (prop['dic'], queryrate, fthre))

	scatterTC = TimeConsuming(textRecNum)
	plt.figure()
	plt.title(textRecNum)
	plt.scatter(X, Y, s=plotsize, c=numC, lw=0)

	classes = ['5', '10', '200', '800', '2000', '4000', '8500']
	class_colours = ['#000000', '#1924B1', '#37B6CE', '#25D500', '#FFC700', '#FF8E00', '#FF1300']
	recs = []
	for i in range(0,len(class_colours)):
		recs.append(mpatches.Rectangle((0,0),1,1,fc=class_colours[i]))
	plt.legend(recs,classes,
		scatterpoints=1,
		loc='lower left',
		ncol=4,
		fontsize=5)
	img = plt.gcf()
	img.savefig( '%s/%s.png' % (prop['imgdic'], textRecNum), dpi=400)
	plt.close()
	scatterTC.end()

	scatterTC2 = TimeConsuming(textAveSim)
	plt.figure()
	plt.title(textAveSim)
	plt.scatter(X, Y, s=plotsize, c=whlC, lw=0)

	whlClasses = [float(x)/10 for x in simcolormap]
	whlClassColours = [simcolormap[x] for x in simcolormap]
	whlRecs = []
	for i in range(0,len(whlClassColours)):
		whlRecs.append(mpatches.Rectangle((0,0),1,1,fc=whlClassColours[i]))
	plt.legend(whlRecs,whlClasses,
		scatterpoints=1,
		loc='lower left',
		ncol=3,
		fontsize=5)

	img2 = plt.gcf()
	img2.savefig('%s/%s.png' % (prop['imgdic'], textAveSim), dpi=400)
	plt.close()
	scatterTC2.end()

def selectFeature(data, threshold, typestr):
	"""Feature selection, ABANDONED
	
	Args:
		data (TYPE): Description
		threshold (TYPE): Description
		typestr (TYPE): Description
	
	Returns:
		TYPE: Description
	"""
	if typestr == 'low-variance':
		print 'In threshold %s\nbefore feature selection: %s features' % (str(threshold), str(len(data[0])))
		sel = VarianceThreshold(threshold=threshold)
		result = sel.fit_transform(data)
		print 'after feature selection: %s features' % str(len(result[0]))
		return result

def tsne(data, featureDict, x, prop):
	"""t-SNE methods
	
	Args:
		data (TYPE): Description
		x (TYPE): Description
		queryrate (TYPE): Description
		plotsize (TYPE): Description
	
	Returns:
		TYPE: Description
	"""
	x = 'tsne-%s' % x 
	print "Computing t-SNE embedding"
	t0 = time.clock()
	
	X = np.array( data['data'] )
	model = TSNE(n_components=2, random_state=0)
	np.set_printoptions(suppress=True)
	# list, each of them is formatted as (x,y)
	Y = model.fit_transform(X) 
	
	print "t-SNE embedding of the digits (time %.2fs)" % (time.clock() - t0)
	func.matrixtofile(Y, '%s/PointsPosition-1-in-%s-%s.csv' % (prop['dic'], str(prop['queryrate']), str(x)))

	result = {
		'data': Y,
		'id': data['id']
	}
	prop['text'] = x
	drawFigure(result, featureDict, prop )

def pca(data, featureDict, x, prop):
	"""PCA methods
	
	Args:
		data (TYPE): Description
		x (TYPE): Description
		queryrate (TYPE): Description
		plotsize (TYPE): Description
	
	Returns:
		TYPE: Description
	"""
	x = 'PCA-%s' % x 
	print("Computing PCA projection")
	t0 = time.clock()

	pca = PCA(n_components=2)
	X_pca = pca.fit_transform(data['data'])
	
	print "Principal Components projection of the digits (time %.2fs)" %(time.clock() - t0)
	func.matrixtofile(X_pca, '%s/PointsPosition-1-in-%s-%s.csv' % (prop['dic'], str(prop['queryrate']), str(x)))
	result = {
		'data': X_pca,
		'id': data['id']
	}
	prop['text'] = x
	drawFigure(result, featureDict, prop )

	# kpca = KernelPCA(kernel="rbf", fit_inverse_transform=True, gamma=10)
	# X_kpca = kpca.fit_transform(data['data'])
	# X_back = kpca.inverse_transform(X_kpca)
	# func.matrixtofile(X_kpca, 'dots-position-1-in-Kernel-%s-%s.csv' % (str(queryrate), str(x)))
	# resultK = {
	# 	'data': X_kpca,
	# 	'id': data['id']
	# }
	# prop['text'] = 'Kernel%s' % x
	# drawFigure(resultK, featureDict, prop)

def mds(data, featureDict, x, prop):
	x = 'MDS-%s' % x 

	print "Computing MDS embedding"
	t0 = time.clock()
	clf = MDS(n_components=2, n_init=1, max_iter=100)
	X_mds = clf.fit_transform(data['data'])
	print("Done. Stress: %f" % clf.stress_)

	print "MDS embedding of the digits (time %.2fs)" % (time.clock() - t0)
	func.matrixtofile(X_mds, '%s/PointsPosition-1-in-%s-%s.csv' % (prop['dic'], str(prop['queryrate']), str(x)))
	result = {
		'data': X_mds,
		'id': data['id']
	}
	prop['text'] = x
	drawFigure(result, featureDict, prop )

def decompose(data, featureDict, rowstring, deapproaches, prop):
	collists = {
		'total': [0,1,2,3,4,5,6,7,8,9,10],
		'poi1': [0,1,2,4,5,6,7],
		'poi2': [0,1,5,6,7]
	}
	rowlists = {
		'total': [0,1,2,3,4,5,6,7,8,9,10,11],
		'workday': [0,1,2,3,4,5], 
		'weekend': [6,7,8,9,10,11],
		'daytime': [1,2,3,7,8,9],
		'evening': [4,10],
		'wodaytime': [1,2,3],
		'woevening': [4],
		'wedaytime': [7,8,9],
		'weevening': [10]
	}
	decomposelists = ['t-SNE', 'PCA', 'MDS']
	filterqdata = func.matrixtoarray(data, rowlists[rowstring], collists['total'])

	if '1' in deapproaches:
		tsne(filterqdata, featureDict, rowstring, prop)
	if '2' in deapproaches:
		pca(filterqdata, featureDict, rowstring, prop)
	if '3' in deapproaches:
		mds(filterqdata, featureDict, rowstring, prop)

def usage():
	print 'python FeatureConstruction.py -c <city> -d <work direcotry> -s <split length> -t <tasks number>'

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:d:ps:nt:q:e:i:a:t:", ["help", "city=", "direcotry=", "plotsize=", "numthreshold=", "queryrate=", "entropytype=", "entropymin=", "entropymax=", "timeperiod="])
	except getopt.GetoptError as err:
		# print help information and exit:
		print str(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	city = 'beijing'
	prop = {
		'plotsize': 1,
		'numthreshold': 0,
		'queryrate': 10,
		'entropytype': 'row',
		'entropymin': 0,
		'entropymax': 100,
		'timeperiod': 'workday',
		# 'dic': '/home/taojiang/git/socialgroupVisualComparison/result',
		'dic': '/home/joe/Documents/git/living-modes-visual-comparison/server/data/decompose',
		'imgdic': '/home/joe/Documents/git/living-modes-visual-comparison/public/img/decompose'
	}
	print opts

	for opt, arg in opts:
		if opt == '-h':
			usage()
			sys.exit()
		elif opt in ("-c", "--city"):
			city = arg
		elif opt in ("-d", "--direcotry"):
			prop['dic'] = arg
		elif opt in ("-ps", "--plotsize"):
			prop['plotsize'] = float(arg)
		elif opt in ("-nt", "--numthreshold"):
			prop['numthreshold'] = int(arg)
		elif opt in ("-q", "--queryrate"):
			prop['queryrate'] = int(arg)
		elif opt in ("-e", "--entropytype"):
			prop['entropytype'] = str(arg)
		elif opt in ("-i", "--entropymin"):
			prop['entropymin'] = float(arg)
		elif opt in ("-a", "--entropymax"):
			prop['entropymax'] = float(arg)
		elif opt in ("-t", "--timeperiod"):
			prop['timeperiod'] = str(arg)

	dbname = 'tdVC'
	featurecolname = 'features_%s' % city

	# for node.js calling runtime
	feaData, attrDict = queryUserMatrix(dbname, featurecolname, prop['queryrate'], prop['numthreshold'], prop['entropytype'], prop['entropymin'], prop['entropymax'])
	decompose(feaData, attrDict, prop['timeperiod'], ['1'], prop)

	# for local environment runtime
# 	print "Inpuy your analysis mode. 1 stands for zero-vector statistics, 2 leads you to decomposing pipeline: "
# 	amode = int(raw_input())

# 	if amode == 1:
# 		conn, db = func.connectMongo(featurecolname)
# 		for x in xrange(0,12):
# 			queryFeatureDistribution(db, featurecolname, x)
# 		conn.close()
# 	else:
# 		print """--- Decomposing feature mode ---
# First choose time periods you want to include in your feature
# total: Total
# workday: workday
# weekend: weekend
# daytime: daytime
# evening: evening
# wodaytime: workdaydaytime
# woevening: workdayevening
# wedaytime: weekenddaytime
# weevening: weekendevening
# Multiple selections can be separated by comma, please enter your row selection strategy: """
# 		arows = str(raw_input()).split(',')


# 		print """
# All 11 POI types are included in our feature selection strategy by default.
# Please choose the decomposing approaches
# 1: t-SNE
# 2: PCA (Not include Kernel PCA)
# 3: MDS
# Multiple selections can be separated by comma, please enter your column selection strategy: """
# 		acols = str(raw_input()).split(',')

# 		print "Current queryrate is %s, you can input a new value or just leave it blank: " % prop['queryrate']
# 		aqrate = str(raw_input())
# 		if aqrate != '':
# 			prop['queryrate'] = int(aqrate)

# 		feaData, attrDict = queryUserMatrix(dbname, featurecolname, prop['queryrate'], prop['numthreshold'])
# 		for each in arows:
# 			decompose(feaData, attrDict, each, acols, prop)
# 			gc.collect()
			

if __name__ == '__main__':
	logging.basicConfig(filename='logger-decomposefeature.log', level=logging.DEBUG)
	main(sys.argv[1:])