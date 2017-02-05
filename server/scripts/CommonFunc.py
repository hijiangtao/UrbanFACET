#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 18:47:13
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, pymongo, math, MySQLdb, sys, logging
import numpy as np
# from scipy import stats
# import geopy.distance  # https://pypi.python.org/pypi/geopy/1.11.0

def connectMongo(dbname):
	"""Connect MongoDB
	
	Returns:
		TYPE: Client, database
	"""
	try:
		conn = pymongo.MongoClient('192.168.1.42', 27017)
		mdb = conn[dbname]
		print "Connected successfully!!!"
	except pymongo.errors.ConnectionFailure, e:
		print "Could not connect to MongoDB: %s" % e

	return conn, mdb

def connectMYSQL(dbname):
	"""Connect MySQL
	
	Returns:
	    TYPE: db, cursor
	"""
	db = MySQLdb.connect(host="192.168.1.42",    	# your host, usually localhost
						user="root",         	# your username
						passwd="vis_2014",  	# your password
						db=dbname)		# name of the data base
	cur = db.cursor()

	return db, cur

def matrixtoarray(origin, row, col):
	"""Change a matrix array to an array (each of the element is an 1D array)
	
	Args:
		origin (array): in the array, each element is one user's behavior feature matrix
	
	Returns:
		array: in the array, each element is one user's behavior feature array
	"""
	originD = np.asarray(origin['data'])
	data = []
	colnum, rownum = len(np.asarray(originD[0][0])), len(originD[0])
	print 'Start to deal with matrix to array converting work.'

	for x in originD:
		tmparray = np.asarray(x).reshape(len(x) * len(x[0]))
		# print tmparray
		data.append( tmparray )

	filterdata = []
	for each in data:
		tmparray = []
		for erow in row:
			for ecol in col:
				tmparray.append( each[erow*colnum + ecol] )
		filterdata.append( tmparray )

	print 'Matrix to array converting work complete!'

	return {
		'id': origin['id'],
		'data': filterdata
	}

def dotstomatrix(data, base, num, interval):
	"""Change 2D space dots to a density based matrix, in which every grid stores the number of dots belonged to thsi grid
	
	Args:
		data (array): Dots array, each of the element is consists of a list (x, y)
		base (int): The base number that should added to current axix location 
		num (int): Number of one axis's grid number
		interval (float): Interval of axis
	
	Returns:
		array: Heatmap matrix
	"""
	result = [[0 for col in xrange(0, num)] for row in xrange(0, num)]

	for each in data:
		# print getMatrixIndex(each[1], base, 1/interval), getMatrixIndex(each[0], base, 1/interval)
		result[ getMatrixIndex(each[1], base, 1/interval) ][ getMatrixIndex(each[0], base, 1/interval) ] += 1.0

	# for x in len(result):
	# 	for each in len(x):
	# 		result[x][each] = math.log(result[x][each]+2, 2 )

	return result

def getMatrixIndex(x, base, num):
	return int(math.floor((base + x) * num))

def matrixtofile(data, filename):
	"""Store density based matrix to csv file
	
	Args:
		data (array): Description
		filename (string): output file name
	
	Returns:
		NULL: Description
	"""
	result = []
	for each in data:
		result.append( ','.join( [str(x) for x in each] ) )

	print '%s lines data are wrote into %s.' % (str(len(result)), filename)

	with open(filename, 'w') as target:
		target.writelines( '\n'.join(result) )
	target.close()

def filetoMatrix(filename):
	result = []
	with open(filename, 'rb') as target:
		for each in target:
			result.append( each.split(',') )

	return result

def frange(x, y, jump):
	while x < y:
		yield x
		x += jump

def getMatrixSumbyDim(data, mode):
	"""Sum results by given dimension name
	
	Args:
	    data (MATRIX): Description
	    mode (STRING): Description
	
	Returns:
	    TYPE: Sum array
	"""
	inputData = np.matrix(data)
	pVecSum = inputData.sum(dtype='float')
	arrayList = []
	if pVecSum == 0.0:
		return -1

	if mode == 'row':
		arrayList = np.sum(inputData, axis=1) 
		# inputData.sum(axis=1, dtype='float')[0]
	elif mode == 'column':
		arrayList = np.sum(inputData, axis=0)  
		# inputData.sum(axis=0, dtype='float')[0]
		# print pVecSum
		
	return np.asarray([each/pVecSum for each in np.nditer(arrayList)])

def getCityLocs(city):
	# 城市边界信息列表
	citylocslist = {
		'beijing': {
			'north': 40.7348,
			'south': 39.5337,
			'west': 115.5597,
			'east': 117.2159
		},
		'tianjin': {
			'north': 39.8718,
			'south': 38.6104,
			'west': 116.7929,
			'east': 117.9767
		},
		'zhangjiakou': {
			'north': 41.4551,
			'south': 40.0991,
			'west': 114.1534,
			'east': 115.7959
		},
		'tangshan': {
			'north': 40.466,
			'south': 38.964,
			'west': 117.603,
			'east': 119.185
		}
	}

	return citylocslist[city]

def calFeatureType(data):
	"""Calculate feature type and return it's represented index number, 1-11 is available features, 12 is the abandoned type
	
	Args:
		data (Object): One POI's properties
	
	Returns:
		Int: index number
	"""
	amen_sustenance = ['bar', 'bbq', 'biergarten', 'cafe', 'drinking_water', 'fast_food', 'food_court', 'ice_cream', 'pub', 'restaurant' ]
	amen_education = ['college', 'kindergarten', 'library', 'public_bookcase', 'school', 'music_school', 'driving_school', 'language_school', 'university']
	amen_transportation = ['bicycle_parking', 'bicycle_repair_station', 'bicycle_rental', 'boat_sharing', 'bus_station', 'car_rental', 'car_sharing', 'car_wash', 'charging_station', 'ferry_terminal', 'fuel', 'grit_bin', 'motorcycle_parking', 'parking', 'parking_entrance', 'parking_space', 'taxi']
	amen_financial = ['atm', 'bank', 'bureau_de_change']
	amen_healthcare = ['baby_hatch', 'clinic', 'dentist', 'doctors', 'hospital', 'nursing_home', 'pharmacy', 'social_facility', 'veterinary', 'blood_donation']
	amen_eac = ['arts_centre', 'brothel', 'casino', 'cinema', 'community_centre', 'fountain', 'gambling', 'nightclub', 'planetarium', 'social_centre', 'stripclub', 'studio', 'swingerclub', 'theatre']
	build_accommodation = ['apartments', 'farm', 'hotel', 'house', 'detached', 'residential', 'dormitory', 'terrace', 'houseboat', 'bungalow', 'static_caravan']
	build_commercial = ['commercial', 'industrial', 'retail', 'warehouse']
	build_civic = ['cathedral', 'chapel', 'church', 'mosque', 'temple', 'synagogue', 'shrine', 'civic', 'stadium', 'train_station', 'transportation', 'public']
	build_civic_hc = ['hospital']
	build_civic_edu = ['school', 'university']

	datakeyset = data.keys()
	if "amenity" in datakeyset:
		featurekey = data["amenity"]
		if featurekey in amen_sustenance:
			return 1
		elif featurekey in amen_eac:
			return 2
		elif featurekey in amen_education:
			return 3
		elif featurekey in amen_transportation:
			return 4
		elif featurekey in amen_healthcare:
			return 5
		elif featurekey in amen_financial:
			return 6
		else:
			return 12
	elif "building" in datakeyset:
		featurekey = data["building"]
		if featurekey in build_accommodation:
			return 7
		elif featurekey in build_commercial:
			return 6
		elif featurekey in build_civic:
			return 4
		elif featurekey in build_civic_edu:
			return 3
		elif featurekey in build_civic_hc:
			return 5
		else:
			return 12
	elif "emergency" in datakeyset:
		return 5
	elif "office" in datakeyset:
		return 8
	elif "leisure" in datakeyset or "shop" in datakeyset or "tourism" in datakeyset:
		return 2
	elif "natural" in datakeyset:
		return 9
	elif "craft" in datakeyset:
		return 10
	elif "historic" in datakeyset:
		return 11
	
	return 12

def gaussian2D(source, target, sigma):
	"""Gaussian distribution function
	
	Args:
	    source (object): A geojson object
	    target (object): A geojson object
	    sigma (float): sigma parameter
	
	Returns:
	    float: Distance between two points
	"""
	from scipy import stats
	from geopy.distance import great_circle
	d = great_circle(source, target).meters
	X = stats.norm(loc=0, scale=sigma**2)
	
	return (1-X.cdf(d)) * 2

def sep4Citylocs(citylocs, midLat, midLng, split):
	return [{
		'north': midLat,
		'south': citylocs['south'],
		'west': citylocs['west'],
		'east': midLng
	},{
		'north': midLat,
		'south': citylocs['south'],
		'west': midLng + split,
		'east': citylocs['east']
	},{
		'north': citylocs['north'],
		'south': midLat + split,
		'west': midLng + split,
		'east': citylocs['east']
	},{
		'north': citylocs['north'],
		'south': midLat + split,
		'west': citylocs['west'],
		'east': midLng
	}]

def initTimePeriods():
	tpVectors = { 
		'workdayM': {
			'num': 0,
			'vec': [0]*11
		},
		'workdayF': {
			'num': 0,
			'vec': [0]*11
		},
		'workdayN': {
			'num': 0,
			'vec': [0]*11
		},
		'workdayA': {
			'num': 0,
			'vec': [0]*11
		},
		'workdayE': {
			'num': 0,
			'vec': [0]*11
		},
		'workdayI': {
			'num': 0,
			'vec': [0]*11
		},
		'holidayM': {
			'num': 0,
			'vec': [0]*11
		},
		'holidayF': {
			'num': 0,
			'vec': [0]*11
		},
		'holidayN': {
			'num': 0,
			'vec': [0]*11
		},
		'holidayA': {
			'num': 0,
			'vec': [0]*11
		},
		'holidayE': {
			'num': 0,
			'vec': [0]*11
		},
		'holidayI': {
			'num': 0,
			'vec': [0]*11
		}
	}

	tpNames = ['workdayM', 'workdayF', 'workdayN', 'workdayA', 'workdayE', 'workdayI', 'holidayM', 'holidayF', 'holidayN', 'holidayA', 'holidayE', 'holidayI']

	return {
		'tpVectors': tpVectors,
		'tpNames': tpNames
	}

def judFeatureTP(daytype, timesegid):
	# vector attributes
	# workday, weekend with both morning, forenoon, noon, afternoon, evening, night 6 periods
	# morning: 5:00-9:00
	# forenoon: 8:00-12:00
	# noon: 11:00-14:00
	# afternoon: 13:00-19:00
	# evening: 18:00-24:00
	# night: 23:00-6:00
	vecInd = []
	if daytype == "workday":
		if timesegid >= 5 and timesegid < 9:
			vecInd.append('workdayM')
		if timesegid >= 8 and timesegid < 12:
			vecInd.append('workdayF')
		if timesegid >= 11 and timesegid < 14:
			vecInd.append('workdayN')
		if timesegid >= 13 and timesegid < 19:
			vecInd.append('workdayA')
		if timesegid >= 18:
			vecInd.append('workdayE')
		if timesegid >= 23 or timesegid < 6:
			vecInd.append('workdayI')
	else:
		if timesegid >= 5 and timesegid < 9:
			vecInd.append('holidayM')
		if timesegid >= 8 and timesegid < 12:
			vecInd.append('holidayF')
		if timesegid >= 11 and timesegid < 14:
			vecInd.append('holidayN')
		if timesegid >= 13 and timesegid < 19:
			vecInd.append('holidayA')
		if timesegid >= 18:
			vecInd.append('holidayE')
		if timesegid >= 23 or timesegid < 6:
			vecInd.append('holidayI')

	return vecInd

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