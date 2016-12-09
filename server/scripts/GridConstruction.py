#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-15 10:15:49
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, math, sys, getopt, logging, time, pymongo
import numpy as np
from scipy import stats
from geopy.distance import great_circle # https://pypi.python.org/pypi/geopy/1.11.0
from CommonFunc import connectMongo, getCityLocs

class CityGrid(object):
	"""docstring for CityGrid"""
	def __init__(self, city, citylocs, baseurl, defaultRadius):
		super(CityGrid, self).__init__()
		self.city = city
		self.citylocs = {'north': 40.412, 'south': 39.390, 'west': 115.642, 'east': 117.153}
		self.defaultRadius = defaultRadius
		self.maxQRadius = 500
		self.baseurl = baseurl
		self.db = {
			'url': '192.168.1.42',
			'port': 27017,
			'dbname': 'tdVC',
			'gridcolname': 'grids_%s' % city,
			'POIcolname': 'pois_%s' % city
		}

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
		logging.info("CityGrid generation is starting...")

		if locs != {}:
			self.citylocs = locs

		count = 100000
		tmparray = []
		latnum = int((self.citylocs['north'] - self.citylocs['south']) / split + 1)
		lngnum = int((self.citylocs['east'] - self.citylocs['west']) / split + 1)

		conn, db = connectMongo(self.db.dbname)
		grid = db[self.db.gridcolname]
		POIs = db[self.POIcolname]

		for latind in xrange(0, latnum):
			for lngind in xrange(0, lngnum):
				lat = self.citylocs['south'] + latind * split
				lng = self.citylocs['west'] + lngind * split
				# 一个正方形 geojson 对象，代表当前方块对应的地理边界
				coordsarr = [ [lng, lat], [lng + 0.001, lat], [lng + 0.001, lat + 0.001], [lng, lat + 0.001], [lng, lat] ]

				featurelistarray = [0]*11
				typevalid = False

				# query all the POIs less than maxQRadius
				nearPOIList = list(POIs.find({
					"properties.center": {
						'$near': {
							'$geometry': { 'type': "Point", 'coordinates': [ lng+0.0005, lat+0.0005 ] },
							'$minDistance': 0,
							'$maxDistance': self.maxQRadius
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
						sigma = self.defaultRadius * 2
						if radius > 0:
							sigma = radius * 2
						P = self.gaussian2D([lng+0.0005, lat+0.0005], cpoint, radius*2 )
						
						curPInd = each["properties"]["ftype"] - 1
						abbP = featurelistarray[ curPInd ] + P

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
					"_id": "%s-%s-%s" % (self.city, str(lat), str(lng)),
					"properties": {
						"id": "%s-%s-%s" % (self.city, str(lat), str(lng)),
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
					logging.debug("100000 features has been inserted into mongoDB.")

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
		

		logging.info("Grid generation complete!")
		conn.close()

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

def usage():
	# print 'python POIExtraction.py -c <city> -d <work direcotry>'

def main(argv):
	try:
		opts, args = getopt.getopt(argv, "hc:d:", ["help", "city=", "direcotry="])
	except getopt.GetoptError as err:
		# print help information and exit:
		print str(err)  # will print something like "option -a not recognized"
		usage()
		sys.exit(2)

	for opt, arg in opts:
		if opt == '-h':
			usage()
			sys.exit()
		# elif opt in ("-c", "--city"):
		# 	city = arg
		# elif opt in ("-d", "--direcotry"):
		# 	dic = arg
		
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

	logging.info("City grid construction consumption: %s s" % str(time.time() - start_time))

if __name__ == "__main__":
	logging.basicConfig(filename='logger.log', level=logging.DEBUG)
	main(sys.argv[1:])
