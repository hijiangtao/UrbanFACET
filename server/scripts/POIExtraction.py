#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-09 20:13:28
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, json, csv, math
from area import area
import pymongo
import numpy as np
from geojson_utils import centroid

class POICollection(object):
	"""docstring for POICollection"""
	def __init__(self, city, citylocs, type, baseurl):
		"""Initialization
		
		Args:
		    city (String): City code, such as "BJ"
		    citylocs (Object): Store the four direction locations of current city (region)
		    type (String): Define the processed data type, "POI"
		    baseurl (String): the basic path of POI files
		"""
		super(POICollection, self).__init__()
		self.city = city
		self.citylocs = citylocs
		self.type = type
		self.baseurl = baseurl
		
	def readFiletoJson(self, name):
		"""Read file and return the POIs object (not null or way objects)
		
		Args:
		    name (String): File name
		
		Returns:
		    Object: POI Collection
		"""
		with open(os.path.join(self.baseurl, name)) as f:
			# 
			count = {}
			typelist = list()
			landusecount = 0

			data = json.load(f)
			if data["type"] == "FeatureCollection":
				notnulldata = {
					"type": "FeatureCollection",
					"features": list()
				}
				for each in data["features"]:
					# if name is not null and geometry type is not Way
					if "id" in each.keys() and "name" in each["properties"].keys() and each["geometry"]["type"] != "LineString":
						notnulldata["features"].append(each)

						# count type
						poitype = each["geometry"]["type"]
						if poitype in typelist:
							count[poitype] += 1
						else:
							typelist.append(poitype)
							count[poitype] = 1

						# 
						if "landuse" in each["properties"]:
							# print "Landuse POI: %s" % each["properties"]["name"]
							landusecount += 1

				print "Construct a list contains %d POIs from file:%s" % (len(notnulldata["features"]), name)
				for key, value in count.items():
					print "POI type: %s, number: %d" % (key, value)

				print "Landuse Feature Number: %d" % landusecount
				return notnulldata
			else:
				return {}

	def formatPOI(self, name):
		"""Read POI file and transfer it into POI list
		
		Args:
		    name (String): File name
		
		Returns:
		    List: POI list
		"""
		# store POI list
		data = list()

		# options for transfer GEO-ID to id in geojson object
		options = {
			"N": "node/",
			"W": "way/",
			"R": "relation/"
		}
		count = {
			"N": 0,
			"R": 0
		}

		with open(os.path.join(self.baseurl, name)) as f:
			spamreader = f.readlines()
			print "Total POI number is %d" % len(spamreader)

			for row in spamreader:
				row = row.split(',')
				rawid = row[1]
				ptype = rawid[0:1]
				if ptype != "W":
					data.append(options[ptype] + rawid[1:])
					count[ptype] += 1

		print "Extract %d Nodes and %d Relations from results." % (count["N"], count["R"])
		return data

	def filterObj(self, filterlist, objset):
		"""Filter object according to given list
		
		Args:
		    filterlist (List): Description
		    objset (Object): Description
		
		Returns:
		    List: Filtered POI list
		"""
		data = list()
		for x in objset:
			if x[id] in filterlist:
				data.append(x)

		return data

	def writeFile(self, data, name):
		"""Write object to json file
		
		Args:
		    data (Object): Description
		    name (String): Description
		
		Returns:
		    NULL: Description
		"""
		with open(os.path.join(self.baseurl, name), 'wb') as outfile:
			json.dump(data, outfile)
		outfile.close()

	def appendAttr(self, data):
		"""Append feature attributes, input and output are both featurecollection
		
		Args:
		    data (Object): POI Collection Object
		
		Returns:
		    Object: POI Collection Object with attributes' appended into each of single POI
		"""
		print "Atrributes appending starting..."
		result = {"type": "FeatureCollection", "features": []}

		features = data["features"]
		featurelen = len(features)
		for i in xrange(featurelen):
			currentObj = data["features"][i]
			geotype = currentObj['geometry']['type']
			areaval = self.calArea(currentObj["geometry"])
			if areaval >= 0:
				radius = math.sqrt(areaval / math.pi)
			else:
				radius = 0
			featureType = self.calFeatureType(currentObj["properties"])

			if featureType != 12:
				currentObj["properties"]["area"] = areaval
				currentObj["properties"]["radius"] = radius
				currentObj["properties"]["ftype"] = featureType
				
				if geotype == 'Point':
					currentObj["properties"]["center"] = currentObj["geometry"]
				elif geotype == 'Polygon':
					currentObj["properties"]["center"] = centroid( currentObj["geometry"] )
				else:
					currentObj['properties']['center'] = { "type": "Point", "coordinates": [0,0] }
					# judge if polygon coordinates loop is closed
					# if not np.array_equal( np.array(currentObj["geometry"]["coordinates"][0][0]), np.array(currentObj["geometry"]["coordinates"][0][-1]) ):
					# 	currentObj["geometry"]["coordinates"][0].append( currentObj["geometry"]["coordinates"][0][0] )

				result["features"].append(currentObj)
			
		print "Atrributes appending complete!"
		return result

	def calFeatureType(self, data):
		"""Calculate feature type and return it's represented index number
		
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
				return 11
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
				return 11
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

	def calArea(self, data):
		"""Calculate feature area and return it
		
		Args:
		    data (Object): Geojson object
		
		Returns:
		    Float: area value
		"""
		areaval = area(data)
		if areaval < 0:
			return 0

		return areaval

	def extractLanduse(self, data, name):
		"""Extract features of landuse type and write the data into csv file
		
		Args:
		    data (Object): FeatureCollection
		    name (String): File name
		
		Returns:
		    NULL: Description
		"""
		with open(os.path.join(self.baseurl, name), 'wb') as outfile:
			for each in data["features"]:
				if "landuse" in each["properties"].keys():
					item = each["properties"]
					outfile.write(item["id"].encode('utf-8') + "," + item["name"].encode('utf-8') + "," + item["landuse"].encode('utf-8') + "," + each["geometry"]["type"].encode('utf-8') + "\n")

		outfile.close()

	def gridGeneration(self, split):
		"""Generate city grids data and store them into mongoDB, collection: beijing_grid
		
		Args:
		    split (Float): Divide interval
		
		Returns:
		    NULL: Description
		"""
		# print self.citylocs['north']
		print "Grid generation starting..."

		count = 100000
		tmparray = []
		latnum = int((self.citylocs['north'] - self.citylocs['south']) / split + 1)
		lngnum = int((self.citylocs['east'] - self.citylocs['west']) / split + 1)

		client = pymongo.MongoClient('localhost', 27017)
		db = client.tdBJ
		grid = db.beijing_grid

		for latind in xrange(0, latnum):
			for lngind in xrange(0, lngnum):
				lat = self.citylocs['south'] + latind * split
				lng = self.citylocs['west'] + lngind * split
				coordsarr = [ [lng, lat], [lng + 0.001, lat], [lng + 0.001, lat + 0.001], [lng, lat + 0.001], [lng, lat] ]

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
						"center": {"type": "Point", "coordinates": [lng + 0.0005, lat + 0.0005]},
						"uid": int(lngind + latind * lngnum),
						"vec": [0]*11
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

		grid.createIndex({
			"geometry": "2dsphere"
		})

		print "Grid generation complete!"

if __name__ == "__main__":
	# 抽取 POI 并添加半径、面积、中心点等信息，存入文件
	bj = POICollection("BJ", {
				'north': 40.412,
				'south': 39.390,
				'west': 115.642,
				'east': 117.153
			}, "POI", "/home/taojiang/tools")

	# 建立 POI 列表
	pois = bj.readFiletoJson("beijing_china_fPOI.geojson")
	# 向 POI 完善附加信息并存入文件
	bj.writeFile(bj.appendAttr(pois), "beijing_china_fPOI_with_area_prop.geojson")
	# 生成城市网格依据数据初始化数据库：在本脚本不使用
	# bj.gridGeneration(0.001)