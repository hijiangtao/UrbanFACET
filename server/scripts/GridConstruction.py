#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-15 10:15:49
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, math, sys, time
import numpy as np
from scipy import stats
import pymongo
# https://pypi.python.org/pypi/geopy/1.11.0
from geopy.distance import great_circle

class CityGrid(object):
	"""docstring for CityGrid"""
	def __init__(self, defaultRadius):
		super(CityGrid, self).__init__()
		self.citylocs = {'north': 40.412, 'south': 39.390, 'west': 115.642, 'east': 117.153}
		self.defaultRadius = defaultRadius

	def gridGeneration(self, split, gridname, poiname, locs={}):
		"""Generate City Grid sets
		
		Args:
		    split (float): distance interval of lat and lng, the unit is degree
		    gridname (string): grid collection name in mongoDB
		    poiname (string): POI collection name in mongoDB
		    locs (dict, optional): city grids' location region, in four directions
		
		Returns:
		    NULL: Description
		"""
		print "CityGrid generation is starting..."

		if locs != {}:
			self.citylocs = locs

		count = 100000
		tmparray = []
		latnum = int((self.citylocs['north'] - self.citylocs['south']) / split + 1)
		lngnum = int((self.citylocs['east'] - self.citylocs['west']) / split + 1)

		client = pymongo.MongoClient('localhost', 27017)
		db = client.tdBJ
		grid = db[gridname]
		POIs = db[poiname]

		for latind in xrange(0, latnum):
			for lngind in xrange(0, lngnum):
				lat = self.citylocs['south'] + latind * split
				lng = self.citylocs['west'] + lngind * split
				coordsarr = [ [lng, lat], [lng + 0.001, lat], [lng + 0.001, lat + 0.001], [lng, lat + 0.001], [lng, lat] ]

				featurelistarray = [0]*11
				typevalid = False

				# query all the POIs less than 2000 meters
				nearPOIList = list(POIs.find({
									"properties.center": {
										'$near': {
											'$geometry': { 'type': "Point", 'coordinates': [ lng+0.0005, lat+0.0005 ] },
											'$minDistance': 0,
											'$maxDistance': 2000
										}
									}
								}))
				
				# construct vector with POIs types info
				if len(nearPOIList) != 0:
					typevalid = True

					# POI list is not null
					for each in nearPOIList:
						cpoint = each["properties"]["center"]["coordinates"]
						radius = each["properties"]["radius"]
						if radius > 0:
							p = self.gaussian2D([lng+0.0005, lat+0.0005], cpoint, radius*2 )
						else:
							p = self.simple2D([lng+0.0005, lat+0.0005], cpoint)
						
						curPInd = each["properties"]["ftype"] - 1
						abbP = featurelistarray[ curPInd ] + p

						if abbP > 1:
							featurelistarray[ curPInd ] = 1
						else:
							featurelistarray[ curPInd ] = abbP

				# single feature format
				# uid: to locate grid index according to it's lat and lng
				# vec: feature type
				# center: center position of current feature
				tmparray.append({
					"type": "Feature",
					"_id": "BJ-%s-%s" % (str(lat), str(lng)),
					"properties": {
						"id": "BJ-%s-%s" % (str(lat), str(lng)),
						"type": "Polygon",
						"typevalid": typevalid,
						"center": {"type": "Point", "coordinates": [lng + 0.0005, lat + 0.0005]},
						"uid": int(lngind + latind * lngnum),
						"vec": featurelistarray
					},
					"geometry": {
						"type": "Polygon",
						"coordinates": [ coordsarr ]
					}
				})

				if len( tmparray ) == 100000:
					grid.insert( tmparray )
					tmparray = []
					print "100000 features has been inserted into mongoDB."

		if len( tmparray ) != 0:
			grid.insert( tmparray )

		try:
			grid.createIndex({
				"properties.typevalid": 1,
				"properties.vec": 1
			})
			grid.createIndex({
				"properties.center": "2dsphere"
			})
		except Exception as e:
			raise e
		

		print "Grid generation complete!"
		client.close()

	def simple2D(self, source, target):
		"""Simple 2D possibility function, gaussian distribution with scale as default radius
		
		Args:
		    source (object): A geojson object
		    target (object): A geojson object
		
		Returns:
		    float: Distance between two points
		"""
		d = great_circle(source, target).meters
		X = stats.norm(loc=0, scale=self.defaultRadius**2)

		return (1-X.cdf(d)) * 2

	def gaussian2D(self, source, target, sigma):
		"""Gaussian distribution function
		
		Args:
		    source (object): A geojson object
		    target (object): A geojson object
		    sigma (float): sigma parameter
		
		Returns:
		    float: Distance between two points
		"""
		d = great_circle(source, target).meters
		X = stats.norm(loc=0, scale=sigma**2)
		
		return (1-X.cdf(d)) * 2

if __name__ == "__main__":
	start_time = time.time()

	bjGrid = CityGrid(10)
	bjGrid.gridGeneration(0.001, "beijing_grids", 'POIs', {'north': 40.412, 'south': 39.390, 'west': 115.642, 'east': 117.153})

	# ppservers = ()

	# job_server = pp.Server(ppservers=ppservers)
	# print "The number of working kernel threads that can be used is %s." % job_server.get_ncpus()
	# jobs, index = [], 0
	# for sublist in userlist:
	# 	jobs.append( (index, job_server.submit(self.aggregateVector, (sublist, falseuidlist, truegridobj, ), (self.connectMYSQL, self.connectMongo, self.vecAdd), ('MySQLdb', 'pymongo'))) )
	# 	index += 1

	# for index, job in jobs:
	#     job()
	# job_server.print_stats()

	print "City grid construction consumption: %s s" % str(time.time() - start_time)