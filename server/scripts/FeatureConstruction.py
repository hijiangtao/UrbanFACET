#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-16 22:13:18
# @Author  : Joe Jiang (hijiangtao@gmail.com)
# @Link    : https://hijiangtao.github.io/
# @Version : $Id$

import os, time
import numpy as np
import MySQLdb
import pymongo
import pp

class UserFeature(object):
	"""docstring for UserFeature"""
	def __init__(self, city, split, citylocs):
		super(UserFeature, self).__init__()
		self.city = city
		self.split = split
		self.citylocs = citylocs

	def connectMYSQL(self):
		"""Connect MySQL
		
		Returns:
		    TYPE: db, cursor
		"""
		db = MySQLdb.connect(host="localhost",    	# your host, usually localhost
							user="root",         	# your username
							passwd="vis_2014",  	# your password
							db="tsu_explore")		# name of the data base
		cur = db.cursor()

		return db, cur

	def connectMongo(self):
		"""Connect MongoDB
		
		Returns:
		    TYPE: Client, database
		"""
		try:
		    conn = pymongo.MongoClient('localhost', 27017)
		    mdb = conn.tdBJ
		    print "Connected successfully!!!"
		except pymongo.errors.ConnectionFailure, e:
		   	print "Could not connect to MongoDB: %s" % e

		return conn, mdb

	def getUserList(self, subtasknum):
		"""Get user list, sperate it into N sublists, N equals to subtasknum
		
		Args:
		    subtasknum (int): Sub task number
		
		Returns:
		    array: sperated userlist 
		"""
		db, cur = self.connectMYSQL()
		cur.execute("SELECT id from tdid_link")
		res = []
		for each in cur.fetchall():
			res.append(each[0])
		reslen = len(res)
		userlist = []

		print "%s id has be selected from database." % reslen

		for x in xrange(0,subtasknum):
			userlist.append( res[int(reslen*x/subtasknum):int(reslen*(x+1)/subtasknum)] )

		# print res
		cur.close()
		db.close()
		return userlist

	def enumUserRecords(self, split, jobID, userlist, colname):
		"""Enumerate users with all their records, matching with grid and store them into mongoDB
		
		Args:
		    split (float): distance interval of lat and lng, the unit is degree
		    jobID (int): Job Number
		    userlist (array): userlist is consists of many tdid strings
		    colname (string): Collection name in MongoDB
		
		Returns:
		    NULL: Description
		"""
		
		# initialize database connections and data structure
		db, cur = self.connectMYSQL()
		conn, mdb = self.connectMongo()
		users = mdb[colname]

		userrecords, usernum = [], 0

		# enum user in userlist
		for user in userlist:
			usernum += 1
			# execute the query and get records result
			cur.execute("SELECT dayType, dateID, timeSegID, lat, lng FROM cbeijing WHERE tdid = %s", (user, ))
			res = cur.fetchall()
			tmprecords = []

			# each (tuple) format:
			# 0: dayType
			# 1: dateID
			# 2: timeSegID
			# 3: lat
			# 4: lng
			for each in res:
				# if the record is not in region grid, then we don't consider it as a valid record
				dayType, dateID, timeSegID, lat, lng = each[0], int(each[1]), int(each[2]), float(each[3]), float(each[4])
				if lat < self.citylocs['south'] or lat >= self.citylocs['north'] or lng < self.citylocs['west'] or lng >= self.citylocs['east']:
					continue
				
				lngnum = int((self.citylocs['east'] - self.citylocs['west']) / split + 1)
				latind = int((lat - self.citylocs['south']) / split)
				lngind = int((lng - self.citylocs['west']) / split)
				uid = int(lngind + latind * lngnum)
				tmprecords.append({
					'_id': '%s-%s-%s' % (user, dateID, timeSegID),
					'id': int(user),
					'geometry': {
						'type': 'Point',
						'coordinates': [lng, lat]
					},
					'type': 'Feature',
					'properties': {
						'gridUID': uid,
						'daytype': dayType,
						'dateid': dateID,
						'timesegid': timeSegID
					}
				})

			userrecords.extend(tmprecords)
			
			# insert into mongoDB
			if usernum == 300:
				print "Job %s inserted 300 records into database." % jobID 
				users.insert(userrecords)
				userrecords = []
				usernum = 0

		# there are still some users in the array
		if usernum != 0:
			users.insert(userrecords)
			
		cur.close()
		db.close()
		conn.close()

	def sepUserTaskes(self, userlist, usercolname):
		"""Seperate all users query and matching work into N subtask, N equals to userlist's length
		
		Args:
		    userlist (array): array to store userlist
		    usercolname (string): collection name that to store users' records
		
		Returns:
		    NULL: Description
		"""
		ppservers = ()
		
		# Creates jobserver with automatically detected number of workers
		job_server = pp.Server(ppservers=ppservers)
		print "pp 可以用的工作核心线程数 %s workers" % job_server.get_ncpus()
		start_time = time.time()
		jobs, index = [], 0
		for sublist in userlist:
			jobs.append( (index, job_server.submit(self.enumUserRecords, (0.001, index, sublist, usercolname, ), (self.connectMYSQL, self.connectMongo), ('MySQLdb', 'pymongo'))) )
			index += 1

		for index, job in jobs:
		    job()
		print "多线程下执行耗时: ", time.time() - start_time, "s"
		job_server.print_stats()

	def getGridList(self, collection):
		"""connect to mongoDB and get gridlist results
		
		Args:
		    collection (string): collection name that stored city grid set
		
		Returns:
		    TYPE: false grid uid list, true grid object collection
		"""
		conn, mdb = self.connectMongo()
		grid = mdb[collection]

		falseuidlist = []
		truegridobj = {}

		gridlists = list( grid.find({}, {"properties.typevalid": 1, "properties.uid": 1, "properties.vec": 1}) )

		for gridlist in gridlists:
			typevalid, uid, vec = gridlist['properties']['typevalid'], str(gridlist['properties']['uid']), gridlist['properties']['vec']

			if typevalid == False:
				falseuidlist.append( uid )
			else:
				truegridobj[ uid ] = vec

		conn.close()
		return falseuidlist, truegridobj

	def sepFeatureTaskes(self, falseuidlist, truegridobj, userlist):
		"""seperate getting feature work into different subtasks
		
		Args:
		    falseuidlist (array): false grid uid list
		    truegridobj (object): true grid object collection
		    userlist (array): user list
		
		Returns:
		    NULL: Description
		"""
		ppservers = ()

		# remove all documents in beijing_features collection
		conn, mdb = self.connectMongo()
		mdb['beijing_features'].remove({})
		conn.close()

		job_server = pp.Server(ppservers=ppservers)
		print "The number of working kernel threads that can be used is %s." % job_server.get_ncpus()
		start_time = time.time()
		jobs, index = [], 0
		for sublist in userlist:
			jobs.append( (index, job_server.submit(self.aggregateVector, (sublist, falseuidlist, truegridobj, ), (self.connectMYSQL, self.connectMongo, self.vecAdd), ('MySQLdb', 'pymongo'))) )
			index += 1

		for index, job in jobs:
		    job()
		print "Multi-threaded time-consuming: ", time.time() - start_time, "s"
		job_server.print_stats()

	def aggregateVector(self, userlist, invalidlist, validobj):
		"""aggregate user behavior vector, according to given userlist
		
		Args:
		    userlist (array): user list
		    invalidlist (array): false grid uid list
		    validobj (object): true grid object collection
		
		Returns:
		    NULL: Description
		"""
		conn, mdb = self.connectMongo()
		features, users = mdb['beijing_features'], mdb["beijing_users"]

		userveclist = [] # used to store user vectors

		# enum users, aggreate each user's records in an average strategy
		for user in userlist:
			# used to store current user's unaggreated sub-vector sets
			tmpvecs = { 
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
			typearr = ['workdayM', 'workdayF', 'workdayN', 'workdayA', 'workdayE', 'workdayI', 'holidayM', 'holidayF', 'holidayN', 'holidayA', 'holidayE', 'holidayI']

			# user: user ID
			user = int(user)
			reclists = list( users.find({"id": user}, {"properties.gridUID": 1, "properties.timesegid": 1, "properties.daytype": 1}) )

			# vector attributes
			# workday, weekend with both morning, forenoon, noon, afternoon, evening, night 6 periods
			# morning: 5:00-9:00
			# forenoon: 8:00-12:00
			# noon: 11:00-14:00
			# afternoon: 13:00-19:00
			# evening: 18:00-24:00
			# night: 23:00-6:00
			for x in reclists:
				uid = str(x['properties']['gridUID'])

				# if the grid is invalid, then we just jump over this record
				if uid in invalidlist:
					continue
				else:
					vec = validobj[ uid ]
					daytype = str(x['properties']['daytype'])
					timesegid = int(x['properties']['timesegid'] / 10)

					# judge which type of feature it is
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

					for eachvecInd in vecInd:
						tmpvecs[eachvecInd]['num'] += 1
						tmpvecs[eachvecInd]['vec'] = self.vecAdd(tmpvecs[eachvecInd]['vec'], vec)
					
			# used to be a template for generating one's feature vector 
			vectmpl = { 
				'_id': user,
				'vec': [],
				'num': []
			}

			# aggreate vector
			notallnull = False
			for x in typearr:
				if tmpvecs[x]['num'] != 0:
					notallnull = True
					vectmpl['vec'].append( [tmpvecs[x]['vec'][i] / float(tmpvecs[x]['num']) for i in xrange(len(tmpvecs[x]['vec'])) ] ) 
					vectmpl['num'].append( int(tmpvecs[x]['num']) )
				else:
					vectmpl['vec'].append( [0] * len(tmpvecs[x]['vec']) )
					vectmpl['num'].append(0) 

			if notallnull:
				userveclist.append( vectmpl )

			if len(userveclist) == 300:
				features.insert( userveclist )
				userveclist = []

		if len(userveclist) != 0:
			features.insert( userveclist )
		
		conn.close()

	def vecAdd(self, first, second):
		"""add two array with same length
		
		Args:
		    first (array): An array
		    second (array): Another array
		
		Returns:
		    array: calculated array
		"""
		return [first[i]+second[i] for i in xrange(len(first))]

if __name__ == "__main__":
	ufeature = UserFeature("BJ", 0.001, {'north': 40.412, 'south': 39.390, 'west': 115.642, 'east': 117.153})
	# 20 threads to split the whole task
	ulist = ufeature.getUserList(22)

	# Enum user records and assign them with region grid UID
	# ufeature.sepUserTaskes(ulist, "beijing_users")

	# Filter out region grid UID list and aggreate user feature vector
	flist, tobj = ufeature.getGridList('beijing_grids')
	ufeature.sepFeatureTaskes( flist, tobj, ulist )