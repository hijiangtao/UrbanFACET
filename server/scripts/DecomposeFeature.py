#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-22 11:08:13
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import math, heatmap, gc, pp, time
from sklearn.manifold import TSNE, MDS
from sklearn.feature_selection import VarianceThreshold
import matplotlib.pyplot as plt
import CommonFunc as func
from CommonCla import TimeConsuming
import numpy as np
from sklearn.decomposition import PCA, KernelPCA
import matplotlib.patches as mpatches
# import plotly.plotly as py
# import plotly.graph_objs as go

def getUsers(thre):
	db, cur = func.connectMYSQL("tsu_explore")

	cur.execute("select tdid, count(1) AS num from cbeijing group by tdid HAVING num>%s;" % str(thre))
	res = []
	for each in cur.fetchall():
		res.append(each[0])

	return res

def queryUserMatrix(dbname, collectname, queryrate, recordsthre = 0):
	"""Query user matrix from database and return it as a matrix
	
	Args:
		dbname (string): Database name
		collectname (string): Collection name
		queryrate (int): Query rate, for example: 5 means 1/5 in whole data
	
	Returns:
		TYPE: Description
	"""
	conn, db = func.connectMongo(dbname)

	if recordsthre != 0:
		# bug
		qresult = list(db[collectname].find({ '$and': [ { '_id': { '$mod' : [queryrate, 0] } }, { 'recnum': { '$gt': recordsthre } } ] }, {'vec': 1, 'gt11sim': 1, 'whlsim': 1, 'recnum': 1}).sort([ ("_id", 1) ]))
	else:
		qresult = list(db[collectname].find({'_id': { '$mod' : [queryrate, 0] }}, {'vec': 1, 'gt11sim': 1, 'whlsim': 1, 'recnum': 1}).sort([ ("_id", 1) ]))
	
	print "User query result: %s people." % str(len(qresult))
	data = {
		'id': [],
		'data': []
	}
	featureDict = {}

	for x in qresult:
		data['data'].append( x['vec'] )
		data['id'].append( str(x['_id']) )
		featureDict[ str(x['_id']) ] = {
			'_id': int(x['_id']),
			'gt11sim': float(x['gt11sim']),
			'whlsim': float(x['whlsim']),
			'recnum': int(x['recnum'])
		}

	conn.close()
	return data, featureDict

def queryFeatureDistribution(db, collectname, findex):
	qresult = list(db[collectname].aggregate([ {'$project': {'vec': { '$slice': ['$vec', findex, 1]  } }}, {'$match': {'vec': [0,0,0,0,0,0,0,0,0,0,0] } }, {'$group': {'_id': 1, 'total': {'$sum': 1}}} ]))

	for each in qresult:
		print "%d position has %s zero element." % (findex, str(each['total']))

def calColorbyNum(num):
	numcolormap = [{
		'value': 5,
		'color': '#000000'
	}, {
		'value': 10,
		'color': '#1924B1'
	}, {
		'value': 200,
		'color': '#37B6CE'
	}, {
		'value': 800,
		'color': '#25D500'
	}, {
		'value': 2000,
		'color': '#FFC700'
	}, {
		'value': 4000,
		'color': '#FF8E00'
	}, {
		'value': 8500,
		'color': '#FF1300'
	}]



	for x in xrange(0, len(numcolormap)):
		if num < numcolormap[x]['value']:
			return numcolormap[x]['color']

def drawFigure(data, featureDict, plotsize, queryrate, fthre):
	"""Figures' drawing and saving
	
	Args:
		data (list): Dots list
		plotsize (TYPE): Description
		queryrate (TYPE): Description
	
	Returns:
		TYPE: Description
	"""

	# Init transformation
	matrixData = np.asarray( np.array(data['data'])[:, 0:2] )
	matrixData2 = []
	queryrate, fthre = str(queryrate), str(fthre)
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
		numC.append( calColorbyNum( int(featureDict[ str(data['id'][x]) ]['recnum']) ) )
		# matrixData[x].append( data['id'][x] )
		matrixData2.append( [ matrixData[x][0], matrixData[x][1], data['id'][x] ] )

	func.matrixtofile(matrixData2, 'ScatterData-1-in-%s-%s.csv' % (queryrate, fthre))

	scatterTC = TimeConsuming('Scatter Plot-1-in-%s-%s(recNum)' % (queryrate, fthre))
	plt.figure()
	plt.title('Scatter Plot-1-in-%s-%s(recNum)' % (queryrate, fthre))
	sca = plt.scatter(X, Y, s=plotsize, c=numC, lw=0)

	classes = ['5', '10', '200', '800', '2000', '4000', '8500']
	class_colours = ['#000000', '#1924B1', '#37B6CE', '#25D500', '#FFC700', '#FF8E00', '#FF1300']
	recs = []
	for i in range(0,len(class_colours)):
		recs.append(mpatches.Rectangle((0,0),1,1,fc=class_colours[i]))
	plt.legend(recs,classes,
		scatterpoints=1,
		loc='lower right',
		ncol=4,
		fontsize=6)
	img = plt.gcf()
	img.savefig('Scatter-figure-1-in-%s-%s(recNum).png' % (queryrate, fthre), dpi=400)
	scatterTC.end()

	scatterTC2 = TimeConsuming('Scatter Plot-1-in-%s-%s(whlRec)' % (queryrate, fthre))
	plt.figure()
	plt.title('Scatter Plot-1-in-%s-%s(whlRec)' % (queryrate, fthre))
	plt.scatter(X, Y, s=plotsize, c=whlC, lw=0)

	whlClasses = [x for x in simcolormap]
	whlClassColours = [simcolormap[x] for x in simcolormap]
	whlRecs = []
	for i in range(0,len(whlClassColours)):
		whlRecs.append(mpatches.Rectangle((0,0),1,1,fc=whlClassColours[i]))
	plt.legend(whlRecs,whlClasses,
		scatterpoints=1,
		loc='lower right',
		ncol=3,
		fontsize=6)

	img2 = plt.gcf()
	img2.savefig('Scatter-figure-1-in-%s-%s(whlRec).png' % (queryrate, fthre), dpi=400)
	scatterTC2.end()

	# Heatmap matrix
	# hmatrixTC = TimeConsuming('Heatmap Matrix-1-in-%s-%s' % (queryrate, fthre))
	# plt.figure()
	# dmatrix = func.dotstomatrix(data['data'], 15, 310, 0.1 )
	# plt.imshow(dmatrix, cmap='seismic', interpolation='nearest')
	# img = plt.gcf()
	# img.savefig('heatmap-matrix-1-in-%s-%s.png' % (queryrate, fthre), dpi=300)
	# hmatrixTC.end()

	# heatmap matrix saved to file
	# func.matrixtofile(dmatrix, 'matrix-1-in-%s-%s.csv' % (queryrate, fthre))

	# hm = heatmap.Heatmap()
	# heatmapimg = hm.heatmap(data, scheme='pbj')
	# heatmapimg.save('heatmap-1-in-%s-%s.png' % (queryrate, fthre))

	# try:
	# 	py.sign_in('shaonian', 'tCr57ESYSnmQN5wDfl6y')

	# 	data = [
	# 	    go.Heatmap(
	# 	        z=dmatrix
	# 	    )
	# 	]
	# 	py.iplot(data, filename='basic-heatmap-%s' % str(queryrate))
	# 	fig = go.Figure(data=data)
	# 	py.image.save_as(fig, filename='a-simple-plot.png')
	# except Exception as e:
	# 	raise e

def selectFeature(data, threshold, typestr):
	"""Feature selection
	
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
	elif typestr == 'univariate':
		pass
	elif typestr == '':
		pass

def tsne(data, featureDict, x, queryrate, plotsize):
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
	X = np.array( data['data'] )
	model = TSNE(n_components=2, random_state=0)
	np.set_printoptions(suppress=True)
	print("Computing t-SNE embedding")
	t0 = time.clock()
	
	# list, each of them is formatted as (x,y)
	Y = model.fit_transform(X) 
	
	print "t-SNE embedding of the digits (time %.2fs)" % (time.clock() - t0)
	func.matrixtofile(Y, 'dots-position-1-in-%s-%s.csv' % (str(queryrate), str(x)))

	result = {
		'data': Y,
		'id': data['id']
	}
	drawFigure(result, featureDict, plotsize, queryrate, x )

def pca(data, featureDict, x, queryrate, plotsize):
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
	func.matrixtofile(X_pca, 'dots-position-1-in-%s-%s.csv' % (str(queryrate), str(x)))
	result = {
		'data': X_pca,
		'id': data['id']
	}
	drawFigure(result, featureDict, plotsize, queryrate, x )

	# kpca = KernelPCA(kernel="rbf", fit_inverse_transform=True, gamma=10)
	# X_kpca = kpca.fit_transform(data['data'])
	# X_back = kpca.inverse_transform(X_kpca)
	# func.matrixtofile(X_kpca, 'dots-position-1-in-Kernel-%s-%s.csv' % (str(queryrate), str(x)))
	# resultK = {
	# 	'data': X_kpca,
	# 	'id': data['id']
	# }
	# drawFigure(resultK, featureDict, plotsize, queryrate, 'Kernel-%s' % x)

	# Plot results
	# plt.figure()
	# plt.subplot(2,1,1)
	# plt.scatter(X_pca[:, 0], X_pca[:, 1], plotsize)
	# plt.title("Projection by PCA")
	# plt.xlabel("1st principal component")
	# plt.ylabel("2nd component")

	# plt.subplot(2,1,2)
	# plt.scatter(X_kpca[:, 0], X_kpca[:, 1], plotsize)
	# plt.title("Projection by KPCA")
	# plt.xlabel("1st principal component in space induced by $\phi$")
	# plt.ylabel("2nd component")

	# plt.subplots_adjust(bottom=0.1, top=0.3)
	# img = plt.gcf()
	# img.savefig('Scatter-1-in-%s-%s.png' % (str(queryrate), str(x)), dpi=400)

def mds(data, featureDict, x, queryrate, plotsize):
	x = 'MDS-%s' % x 

	print("Computing MDS embedding")
	t0 = time.clock()
	clf = MDS(n_components=2, n_init=1, max_iter=100)
	X_mds = clf.fit_transform(data['data'])
	print("Done. Stress: %f" % clf.stress_)

	print "MDS embedding of the digits (time %.2fs)" % (time.clock() - t0)
	func.matrixtofile(X_mds, 'dots-position-1-in-%s-%s.csv' % (str(queryrate), str(x)))
	result = {
		'data': X_mds,
		'id': data['id']
	}
	drawFigure(result, featureDict, plotsize, queryrate, x )

def decompose():
	pass

if __name__ == '__main__':
	# parameters' setting
	queryrate, queryrate2, queryrate3 = 10, 3, 2
	plotsize, plotsize2, plotsize3 = 1, 0.8, 0.8
	recnumthreshold = 11
	dbname = 'tdBJ'
	collectname = 'beijing_features'
	
	# feature rows and columns index arrays
	rowcollects = [ [1,2,3,4,9,10], [0,1,2,3,4,5], [6,7,8,9,10,11], [1,2,3,7,8,9], [4,10] ]
	colcollects = [ [0,1,2,4,5,6,7], [0,1,5,6,7] ]
	rowlist = [0,1,2,3,4,5,6,7,8,9,10,11]
	collist = [0,1,2,3,4,5,6,7,8,9,10]

	# # 统计不同时间段内用户feature vector全为0的情况
	# conn, db = func.connectMongo(dbname)
	# for x in xrange(0,12):
	# 	queryFeatureDistribution(db, collectname, x)
	# conn.close()
	
	# data, featureDict = queryUserMatrix(dbname, collectname, queryrate)
	# qdata = func.matrixtoarray(data, rowlist, collist)

	# # # # 全量feature数据的两种降维方法尝试
	# tsne(qdata, featureDict, 'origin', queryrate, plotsize)
	# pca(qdata, featureDict, 'origin', queryrate, plotsize)
	# mds(qdata, featureDict, 'origin', queryrate, plotsize)

	# # # # 按照方差，对全量feature进行筛选，后采用两种降维方法分别尝试
	# # # for x in list(func.frange(0, 0.21, 0.05)):
	# # # 	gc.collect()
	# # # 	sdata = selectFeature(qdata, x, 'low-variance')
	# # # 	tsne(sdata, featureDict, 'varthre-%s' % str(x), queryrate, plotsize)
	# # # 	pca(sdata, featureDict, 'varthre-%s' % str(x), queryrate, plotsize)
		
	# # # del qdata

	# # # # 六种不同的时间段feature方案
	# for x in xrange(0,5):
	# 	# only deal with the holiday and workday dataset
	# 	if x == 1 or x == 2:
	# 		gc.collect()
	# 		filterqdata = func.matrixtoarray(data, rowcollects[x], collist)
	# 		tsne(filterqdata, featureDict, 'label-deftype-%s' % str(x), queryrate, plotsize)
	# 		pca(filterqdata, featureDict, 'label-deftype-%s' % str(x), queryrate, plotsize)
	# 		mds(filterqdata, featureDict, 'label-deftype-%s' % str(x), queryrate, plotsize)

	# # # 两种不同的POI类型feature方案
	# # for x in xrange(0,2):
	# # 	gc.collect()
	# # 	filterqdata = func.matrixtoarray(data, rowlist, colcollects[x])
	# # 	tsne(filterqdata, featureDict, 'deftypePOI-%s' % str(x), queryrate, plotsize)
	# # 	pca(filterqdata, featureDict, 'deftypePOI-%s' % str(x), queryrate, plotsize)
	
	# # 1/3 rate
	# data2, featureDict2 = queryUserMatrix(dbname, collectname, queryrate2)
	# qdata2 = func.matrixtoarray(data2, rowlist, collist)

	# # tsne(qdata2, featureDict2, 'origin2', queryrate2, plotsize2)
	# pca(qdata2, featureDict2, 'origin2', queryrate2, plotsize2)
	# mds(qdata2, featureDict2, 'origin2', queryrate2, plotsize2)
	# del qdata2

	# for x in xrange(0,5):
	# 	if x == 1 or x == 2:
	# 		gc.collect()
	# 		filterqdata2 = func.matrixtoarray(data2, rowcollects[x], collist)
	# 		tsne(filterqdata2, featureDict2, 'deftype2-%s' % str(x), queryrate2, plotsize2)
	# 		pca(filterqdata2, featureDict2, 'deftype2-%s' % str(x), queryrate2, plotsize2)
	# 		mds(filterqdata2, featureDict2, 'deftype2-%s' % str(x), queryrate2, plotsize2)


	# only control the records number of one user
	data3, featureDict3 = queryUserMatrix(dbname, collectname, queryrate3, recnumthreshold)
	qdata3 = func.matrixtoarray(data3, rowlist, collist)

	tsne(qdata3, featureDict3, 'origin-recnum', queryrate3, plotsize3)
	pca(qdata3, featureDict3, 'origin-recnum', queryrate3, plotsize3)
	mds(qdata3, featureDict3, 'origin-recnum', queryrate3, plotsize3)
	del qdata3

	# for x in xrange(0,5):
	# 	if x == 1 or x == 2:
	# 		gc.collect()
	# 		filterqdata3 = func.matrixtoarray(data3, rowcollects[x], collist)
	# 		tsne(filterqdata3, featureDict3, 'deftype3-recnum-%s' % str(x), queryrate3, plotsize3)
	# 		pca(filterqdata3, featureDict3, 'deftype3-recnum-%s' % str(x), queryrate3, plotsize3)
	# 		mds(filterqdata3, featureDict3, 'deftype3-recnum-%s' % str(x), queryrate3, plotsize3)