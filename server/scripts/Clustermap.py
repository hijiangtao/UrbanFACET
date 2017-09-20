import numpy as np
from sklearn.cluster import KMeans, DBSCAN
from CommonFunc import connectMongo, connectMYSQL
from Util import func
import json
import math
from collections import defaultdict, deque

def kmeans(data):
    feature = []
    for each in data:
        feature.append(data[each][6:10])
    features = np.array(feature)
    features = features.reshape((-1, 4))
    features[features < 0] = 0

    result = KMeans(15).fit(features)
    labels = result.labels_

    splited = [[] for i in range(labels.max()+1)]

    for a, each in enumerate(data):
        data[each].append(float(labels[a]))
        splited[labels[a]].append(data[each])

    for i in range(labels.max()+1):
        print i, sum(labels == i)

    result = {}
    for each in range(15):
        result[each] = []
        result[each] += splited[each]

    return result

def dbscan(s, data):

    print s
    feature = []
    for each in data:
        feature.append(each[11:13])
    features = np.array(feature)
    features = features.reshape((-1, 2))
    #print features

    #print len(features)
    #print len(data)

    result = DBSCAN(eps = 0.015, min_samples = s).fit(features)
    core_samples_mask = np.zeros_like(result.labels_, dtype=bool)
    core_samples_mask[result.core_sample_indices_] = True
    labels = result.labels_

    #print labels.max()

    splited = [[] for i in range(labels.max() + 1)]
    #print splited

    for a, each in enumerate(data):
        if labels[a] < 0:
            continue
        each.append(labels[a])
        #print a
        splited[labels[a]].append(each)

    #for i in range(labels.max()+1):
     #   print i, sum(labels == i)
    #print splited
    return splited
'''
def DFS(line, num, tree, visit, data):
    nums = [num]
    visit[nums[0]] = 1
    while(len(nums)>0):
        num = nums[0]
        for i in line[num]:
            if visit[i] == 0:
                tree.append(data[i])
                visit[i] = 1
                nums.append(i)
        del(nums[0])

def drawflower(data):
    boundary = {}
    boundary['type'] = 'Feature'
    boundary['properties'] = {}
    boundary['geometry'] = {}
    boundary['geometry']['type'] = 'MultiLineString'
    boundary['geometry']['coordinates'] = []
    bound = defaultdict(list)

    de_sum = pp_sum = ap_sum = pr_sum = ar_sum = longitude = latitude = 0

    for a, each in enumerate(data):
        de_sum += each[0]
        pp_sum += each[1]
        ap_sum += each[2]
        if (pr_sum < 0):
            pr_sum += 0
        else:
            pr_sum += each[3]
        ar_sum += each[4]
        longitude += each[6]
        latitude += each[7]
        addr = each[8]
        for i in range(4):
            p1 = (addr[i][0], addr[i][1])
            p2 = (addr[i + 1][0], addr[i + 1][1])
            bound[(min(p1, p2), max(p1, p2))].append(a)

    line = defaultdict(list)
    for each in bound:
        if len(bound[each]) == 2:
            line[bound[each][0]].append(bound[each][1])
            line[bound[each][1]].append(bound[each][0])

    dict = []
    visit = [0 for _ in range(max(line.keys())+1)]
    #for i in range(len(line)):
    #    visit[i] = 0
    for each in xrange(len(line)):
        if visit[each] == 0:
            tree = []
            tree.append(data[each])
            DFS(line, each, tree, visit, data)

            # while len(line[each]) > 0:
            #    for a in line[each]:
            #        if len(line[each] > 1):
            #            line[each].remove(a)
            #        else:
            #            del line[each]
            #        if len(line[a] > 1):
            #            if line[a] not in tree:
            #                tree.append(line[a])
            #            line[a].remove(each)
            #            line[each] = line[a]
            #         else:
            #            del line[a]

            if len(tree) >= 100:
                dict.append(tree)
                print len(tree)
            #print tree
    for each in dict:
        boundary['geometry']['coordinates'] += drawmap(each)

    boundary['properties']['ad'] = de_sum / len(data)
    boundary['properties']['pp'] = pp_sum / len(data)
    boundary['properties']['ap'] = ap_sum / len(data)
    boundary['properties']['pr'] = pr_sum / len(data)
    boundary['properties']['ar'] = ar_sum / len(data)
    boundary['properties']['cp'] = [longitude / len(data), latitude / len(data)]

    #print boundary
    return boundary

def drawmap(data):
    set = []
    bound = {}
    for each in data:
        addr = each[8]
        for i in range(4):
            a = (addr[i][0], addr[i][1])
            b = (addr[i+1][0], addr[i+1][1])
            if bound.has_key((min(a,b), max(a,b))):
                bound[(min(a,b), max(a,b))] += 1
            else:
                bound[(min(a,b), max(a,b))] = 1
    m = 0
    for each in bound:
        if bound[each] == 1:

            # if [each[0][0], each[0][1]] in  boundary['geometry']['coordinates'] and [each[1][0], each[1][1]] in  boundary['geometry']['coordinates']:
            #    continue
            # elif [each[0][0], each[0][1]] not in  boundary['geometry']['coordinates']:
            #    boundary['geometry']['coordinates'].append([each[0][0], each[0][1]])
            # elif [each[1][0], each[1][1]] not in  boundary['geometry']['coordinates']:
            #    boundary['geometry']['coordinates'].append([each[1][0], each[1][1]])
            # else:
            #    boundary['geometry']['coordinates'].append([each[0][0], each[0][1]])
            #    boundary['geometry']['coordinates'].append([each[1][0], each[1][1]])

            coordinates = []
            coordinates.append([each[0][0], each[0][1]])
            coordinates.append([each[1][0], each[1][1]])
            set.append(coordinates)
        #print m
        m += 1


    #         if addr[i] < addr[i+1]:
    #            if  bound.has_key(addr[i]):
    #                if bound[addr[i]].has_key(addr[i+1]):
    #                    bound[addr[i]][addr[i+1]] += 1
    #                else:
    #                    bound[addr[i]][addr[i+1]] = 1
    #             else:
    #                bound[addr[i]] = {}
    #                bound[addr[i]][addr[i+1]] = 1
    #         else:
    #            if  bound.has_key(addr[i+1]):
    #                if bound[addr[i+1]].has_key(addr[i]):
    #                    bound[addr[i+1]][addr[i]] += 1
    #                else:
    #                    bound[addr[i+1]][addr[i]] = 1
    #             else:
    #                bound[addr[i+1]] = {}
    #                bound[addr[i+1]][addr[i]] = 1
    # for coodinates in bound:
    #    for coodinate in coodinates:
    #        if bound[coodinates][coodinate] == 1:
    #            boundary['coordinates'].append((coodinates, coodinate))


    return set
'''
'''
def DFS(line, num, tree, boundary, c, result):
    visit = {}
    tree.append(num)
    #nums = deque()
    #nums.append(num)
    length = 1
    visit[num] = length
    while len(line[num]) > 0:
        for each in line[num]:
            #print each
            #print line[each]
            if each not in tree:
                length += 1
                tree.append(each)
                visit[each] = length
            else:
                begin = visit[each]
                end = length
                tree1 = []
                tree1 = tree[begin - 1:length]
                tree1.append(each)
                del tree[begin:length]
                if len(tree1) > c:
                    end_boundary = boundary
                    longitude = 0
                    latitude = 0
                    pointset = []
                    point = []
                    for i in tree1:
                        pointset.append([i[0], i[1]])
                        longitude += i[0]
                        latitude += i[1]
                    #point.append(pointset)
                    end_boundary['geometry']['coordinates'].append(pointset)
                    end_boundary['properties']['c'] = [longitude / len(tree1), latitude / len(tree1)]
                    result.append(end_boundary)
                for i in tree1:
                    visit[i] = 0
                visit[each] = begin
                length = begin
            line[each].remove(num)
            line[num].remove(each)
            num = each
            break

    # while len(nums) > 0:
    #     if len(line[num]) == 2:
    #         num = nums.pop()
    #         for each in line[num]:
    #             if len(line[each] == 4):
    #                 nums.append(each)
    #             if each not in tree:
    #                 length += 1
    #                 tree.append(each)
    #                 visit[each] = length
    #                 line[each].remove(num)
    #                 line[num].remove(each)
    #                 num = each
    #             else:
    #                 begin = visit[each]
    #                 end = length
    #                 tree1 = []
    #                 tree1 = tree[begin-1:length]
    #                 tree1.append(each)


def drawflower(c, data, result):
    boundary = {}
    boundary['type'] = 'Feature'
    boundary['properties'] = {}
    boundary['geometry'] = {}
    boundary['geometry']['type'] = 'Polygon'
    boundary['geometry']['coordinates'] = []
    bound = {}

    de_sum = pp_sum = ap_sum = pr_sum = ar_sum = 0

    for a, each in enumerate(data):
        de_sum += each[0]
        pp_sum += each[1]
        ap_sum += each[2]
        if (pr_sum < 0):
            pr_sum += 0
        else:
            pr_sum += each[3]
        ar_sum += each[4]
        # longitude += each[6]
        # latitude += each[7]
        addr = each[8]
        for i in range(4):
            p1 = (addr[i][0], addr[i][1])
            p2 = (addr[i + 1][0], addr[i + 1][1])
            if bound.has_key((min(p1, p2), max(p1, p2))):
                bound[(min(p1, p2), max(p1, p2))] += 1
            else:
                bound[(min(p1, p2), max(p1, p2))] = 1

    boundary['properties']['ad'] = de_sum
    boundary['properties']['pp'] = pp_sum / len(data)
    boundary['properties']['ap'] = ap_sum / len(data)
    boundary['properties']['pr'] = pr_sum / len(data)
    boundary['properties']['ar'] = ar_sum / len(data)
    #boundary['properties']['cp'] = [longitude / len(data), latitude / len(data)]

    line = defaultdict(list)
    for each in bound:
        if bound[each] == 1:
            line[each[0]].append(each[1])
            line[each[1]].append(each[0])

    for each in line:
        i = 0
        print i
        if len(line[each]) != 0:
            i += 1
            tree = []
            DFS(line, each, tree, boundary, c, result)

    # print boundary
    # return boundary

'''

def DFS(line, num, tree, boundary, c, result):
    visit = {}
    tree.append(num)
    #nums = deque()
    #nums.append(num)
    length = 1
    visit[num] = length
    while len(line[num]) > 0:
        for each in line[num]:
            #print each
            #print line[each]
            if each not in tree:
                length += 1
                tree.append(each)
                visit[each] = length
            else:
                begin = visit[each]
                end = length
                tree1 = []
                tree1 = tree[begin - 1:length]
                tree1.append(each)
                del tree[begin:length]
                if len(tree1) > c:
                    end_boundary = boundary
                    longitude = 0
                    latitude = 0
                    pointset = []
                    for i in tree1:
                        pointset.append([i[0], i[1]])
                    end_boundary['geometry']['coordinates'].append(pointset)
                    result.append(end_boundary)
                for i in tree1:
                    visit[i] = 0
                visit[each] = begin
                length = begin
            line[each].remove(num)
            line[num].remove(each)
            num = each
            break

def drawflower(c, data, result):
    boundary = {}
    boundary['type'] = 'Feature'
    boundary['properties'] = {}
    boundary['geometry'] = {}
    boundary['geometry']['type'] = 'Polygon'
    boundary['geometry']['coordinates'] = []
    bound = {}

    de_sum = pp_sum = ap_sum = pr_sum = ar_sum = color_num = dbs_num = 0
    min_dist = 1024000

    for a, each in enumerate(data):
        de_sum += each[0]
        pp_sum += each[1]
        ap_sum += each[2]
        if (each[3] < 0):
            pr_sum += 0
        else:
            pr_sum += each[3]
        ar_sum += each[4]
        color_num = each[14]
        dbs_num = each[15]
        addr = each[13]
        for i in range(4):
            p1 = (addr[i][0], addr[i][1])
            p2 = (addr[i + 1][0], addr[i + 1][1])
            if bound.has_key((min(p1, p2), max(p1, p2))):
                bound[(min(p1, p2), max(p1, p2))] += 1
            else:
                bound[(min(p1, p2), max(p1, p2))] = 1
        dist = 0
        for i in data:
            dist += math.sqrt((each[11] - i[11]) * (each[11] - i[11]) + (each[12] - i[12]) * (each[12] - i[12]))
        if dist < min_dist:
            min_dist = dist
            longitude = each[11]
            latitude = each[12]

    boundary['properties']['ad'] = de_sum
    boundary['properties']['d'] = de_sum / len(data) / 0.08517
    boundary['properties']['pp'] = pp_sum / len(data)
    boundary['properties']['ap'] = ap_sum / len(data)
    boundary['properties']['pr'] = pr_sum / len(data)
    boundary['properties']['ar'] = ar_sum / len(data)
    boundary['properties']['color'] = float(color_num)
    boundary['properties']['db_num'] = float(dbs_num)
    boundary['properties']['c'] = [longitude, latitude]

    line = defaultdict(list)
    for each in bound:
        if bound[each] == 1:
            line[each[0]].append(each[1])
            line[each[1]].append(each[0])

    for each in line:
        i = 0
        #print i
        if len(line[each]) != 0:
            i += 1
            tree = []
            DFS(line, each, tree, boundary, c, result)

def DFS_rectangle(link, num, tree, visit, data):
    nums = [num]
    visit[nums[0]] = 1
    while(len(nums)>0):
        num = nums[0]
        for i in link[num]:
            if visit[i] == 0:
                tree.append(data[i])
                visit[i] = 1
                nums.append(i)
        del(nums[0])

def drawmap(c, data, result):
    bound = defaultdict(list)
    for a, each in enumerate(data):
        addr = each[13]
        for i in range(4):
            p1 = (addr[i][0], addr[i][1])
            p2 = (addr[i + 1][0], addr[i + 1][1])
            bound[(min(p1, p2), max(p1, p2))].append(a)

    link = defaultdict(list)
    for each in bound:
        if len(bound[each]) == 2:
            link[bound[each][0]].append(bound[each][1])
            link[bound[each][1]].append(bound[each][0])
    if len(link) != 0:
        visit = [0 for _ in range(max(link.keys())+1)]

        for each in xrange(len(link)):
            if visit[each] == 0:
                tree = []
                tree.append(data[each])
                DFS_rectangle(link, each, tree, visit, data)
                if len(tree) > 10:
                    drawflower(c, tree, result)

def main(s, c, ct):
    '''
    db, cur = connectMYSQL('tdnormal')
    cur.execute("SELECT MAX(wpnumber) AS 'dmax', MAX(ppsval/wpnumber) AS 'amax', MAX(apsval/wpnumber) AS 'cmax', "
                "MAX(prsval/wpnumber) AS 'emax', MAX(arsval/wpnumber) AS 'fmax' from bjEmatrix WHERE wpnumber > 0; ")
    for each in cur.fetchall():
        maxmatrix = []
        maxmatrix.append(float(each[0]))
        for i in range(4):
            maxmatrix.append(each[i+1])
    #max = np.array(cur.fetchall()).max(0)

    cur.execute("SELECT id, wpnumber  AS 'd', ppsval / wpnumber AS 'a', apsval / wpnumber AS 'c',"
                "prsval / wpnumber AS 'e', arsval / wpnumber AS 'f' from bjEmatrix WHERE wpnumber > 0;")

    conn, db = func.connectMongo('tdnormal')
    data = {}
    m = 0
    for each in cur.fetchall():
        data[each[0]] = []
        for i in range(5):
            data[each[0]].append(each[i+1])
        for i in range(5):
            data[each[0]].append(each[i+1] / maxmatrix[i])
        tmp = db.newgrids_beijing.find({'properties.uid' : each[0]})[0]
        data[each[0]].append(tmp['_id'])
        data[each[0]].append(tmp['properties']['center']['coordinates'][0])
        data[each[0]].append(tmp['properties']['center']['coordinates'][1])
        data[each[0]].append(tmp['geometry']['coordinates'][0])
        print m
        m += 1

    file = open('./bj_initial_data.json', 'w')
    file.write(json.dumps(data))
    file.close()

    '''
    city = ['bj', 'tj', 'zjk', 'ts'][ct]

    # file = open('./' + city + '_initial_data.json', 'r')
    # data = json.load(file)
    # file.close()
    #
    # print  './' + city + '_initial_data.json'
    #
    # splits = kmeans(data)
    #
    # file = open('./' + city + '_initial_15kmeans_data.json', 'w')
    # file.write(json.dumps(splits))
    # file.close()

    file = open('./' + city + '_initial_15kmeans_data.json', 'r')
    splits = json.load(file)
    file.close()

    result = {}
    result['type'] = 'FeatureCollection'
    result['features'] = []

    for split in splits:
        splited = dbscan(s, splits[split])
        for da in splited:
            drawmap(c, da, result['features'])

    print '../../conf/data/' + city + '_cluster_' + str(s) + '_' + str(c) + '.json'

    #print result

    file = open('../../conf/data/' + city + '_cluster_' + str(s) + '_' + str(c) + '.json', 'w')
    file.write(json.dumps(result))
    file.close()
    

if __name__ == '__main__':
    s = 20
    c = 100
    ct = 0
    main(s, c, ct)