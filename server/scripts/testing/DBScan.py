#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-09-28 21:55:13
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# 描述      : DBScan 处理函数， 从文件读取用户降维后数据进行聚类并画图显示

import os
import numpy as np
import matplotlib.pyplot as plt
import math	
import time

UNCLASSIFIED = False
NOISE = 0

def loadDataSet(fileName, splitChar=',', lat=0, lng=1, dayIndex=2, dayType = 'all'):
	"""
	输入：文件名
	输出：数据集
	描述：从文件读入数据集
	"""
	dataSet = []
	with open(fileName) as fr:
		for line in fr.readlines():
			curline = line.strip().replace('"', '').split(splitChar)
			if curline[dayIndex] == dayType or dayType == 'all':
				fltline = list(map(float, [curline[lat], curline[lng]]))
				dataSet.append(fltline)
	return dataSet

def dist(a, b):
	"""
	输入：向量A, 向量B
	输出：两个向量的欧式距离
	"""
	return math.sqrt(np.power(a - b, 2).sum())

def eps_neighbor(a, b, eps):
	"""
	输入：向量A, 向量B
	输出：是否在eps范围内
	"""
	return dist(a, b) < eps

def region_query(data, pointId, eps):
	"""
	输入：数据集, 查询点id, 半径大小
	输出：在eps范围内的点的id
	"""
	nPoints = data.shape[1]
	seeds = []
	for i in range(nPoints):
		if eps_neighbor(data[:, pointId], data[:, i], eps):
			seeds.append(i)
	return seeds

def expand_cluster(data, clusterResult, pointId, clusterId, eps, minPts):
	"""
	输入：数据集, 分类结果, 待分类点id, 簇id, 半径大小, 最小点个数
	输出：能否成功分类
	"""
	seeds = region_query(data, pointId, eps)
	if len(seeds) < minPts: # 不满足minPts条件的为噪声点
		clusterResult[pointId] = NOISE
		return False
	else:
		clusterResult[pointId] = clusterId # 划分到该簇
		for seedId in seeds:
			clusterResult[seedId] = clusterId

		while len(seeds) > 0: # 持续扩张
			currentPoint = seeds[0]
			queryResults = region_query(data, currentPoint, eps)
			if len(queryResults) >= minPts:
				for i in range(len(queryResults)):
					resultPoint = queryResults[i]
					if clusterResult[resultPoint] == UNCLASSIFIED:
						seeds.append(resultPoint)
						clusterResult[resultPoint] = clusterId
					elif clusterResult[resultPoint] == NOISE:
						clusterResult[resultPoint] = clusterId
			seeds = seeds[1:]
		return True

def dbscan(data, eps, minPts):
	"""
	输入：数据集, 半径大小, 最小点个数
	输出：分类簇id
	"""
	clusterId = 1
	nPoints = data.shape[1]
	clusterResult = [UNCLASSIFIED] * nPoints
	for pointId in range(nPoints):
		point = data[:, pointId]
		if clusterResult[pointId] == UNCLASSIFIED:
			if expand_cluster(data, clusterResult, pointId, clusterId, eps, minPts):
				clusterId = clusterId + 1
	return clusterResult, clusterId - 1

def plotFeature(data, clusters, clusterNum):
	"""输入数据集及类别个数，进行散点图绘制
	
	Args:
	    data (TYPE): Description
	    clusters (TYPE): Description
	    clusterNum (TYPE): Description
	"""
	nPoints = data.shape[1]
	matClusters = np.mat(clusters).transpose()
	fig = plt.figure()
	scatterColors = ['black', 'blue', 'green', 'yellow', 'red', 'orange']
	ax = fig.add_subplot(111)
	pltscatter = []
	for i in range(clusterNum + 1):
		colorSytle = scatterColors[i % len(scatterColors)]
		subCluster = data[:, np.nonzero(matClusters[:, 0].A == i)]
		ax.scatter(subCluster[0, :].flatten().A[0], subCluster[1, :].flatten().A[0], c=colorSytle, s=6, lw=0, label= "noise" if i==0 else i)

	ax.legend(loc=1, scatterpoints=1, ncol=3, fontsize=8)

def main():
	mode = [{
		"name": "holiday",
		"minPts": 3
	}, {
		"name": "workday",
		"minPts": 8
	}]
	mode2 = [{
		"name": "holiday",
		"minPts": 3
	}, {
		"name": "workday",
		"minPts": 8
	}, {
		"name": "all",
		"minPts": 14
	}],
	mode3 = [{
		'name': 'all',
		'minPts': 20
	}]

	for x in mode3:
		
		dataSet = loadDataSet('../../data/init/2D-ScatterData_1-in-10_tsne-workday.csv', ',', 0, 1, 2, x["name"])
		dataSet = np.mat(dataSet).transpose()

		epsValue = 0.0001
		minPtsValue = x["minPts"]
		# for x in xrange(1,10):
		# 	clusters, clusterNum = dbscan(dataSet, epsValue * x, minPtsValue)
		#	print("eps = %f, minPts = %i, cluster Numbers = %i" % (epsValue * x, minPtsValue, clusterNum))
		clusters, clusterNum = dbscan(dataSet, epsValue, minPtsValue)
		print("eps = %f, minPts = %i, cluster Numbers = %i" % (epsValue, minPtsValue, clusterNum))
		# print(clusters)
		plotFeature(dataSet, clusters, clusterNum)

if __name__ == '__main__':
	start = time.clock()
	main()
	end = time.clock()
	print('finish all in %s' % str(end - start))
	plt.show()