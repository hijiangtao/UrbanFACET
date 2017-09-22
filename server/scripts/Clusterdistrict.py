from sklearn.cluster import KMeans, DBSCAN
import json
import numpy as np
from collections import OrderedDict

def kmeans(data, k):
    feature = []
    for each in data:
        feature.append(data[each][:4])
    features = np.array(feature)
    features = features.reshape((-1, 4))
    features[features < 0] = 0

    #print feature

    result = KMeans(k).fit(features)
    labels = result.labels_

    return labels

def main(k, ct):
    city = ['bj', 'tj', 'zjk', 'ts'][ct]

    file = open('../../conf/data/metrics.json', 'r')
    elements= json.load(file)
    file.close()

    data = OrderedDict()
    for each in elements[city]:
        data[each['english']] = []
        data[each['english']].append(each['pr'])
        data[each['english']].append(each['pp'])
        data[each['english']].append(each['ap'])
        data[each['english']].append(each['ar'])
        data[each['english']].append(each['d'])
        data[each['english']].append(each['ad'])

    print data.keys()

    cluster = kmeans(data, k)

    file = open('../../conf/data/' + city + '.json', 'r')
    map = json.load(file)
    file.close()

    result = {}
    result['type'] = 'FeatureCollection'
    result['features'] = []
    for i, each in enumerate(map['features']):
        each['properties']['color'] = float(cluster[i])
        result['features'].append(each)
        print each['properties']['english']

    print result

    file = open('../../conf/data/' + city + '_district_cluster_' + str(k) + '.json', 'w')
    file.write(json.dumps(result))
    file.close()


if __name__ == '__main__':
    k = 6
    city = 0
    main(k, city)