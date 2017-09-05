for import json
#import sys
#reload(sys)
#sys.setdefaultencoding('utf-8')
# -*- coding: utf-8 -*-


if __name__ == "__main__":
    file = open('./metrics_init.json', 'rb')
    datas = json.load(file)
    file.close()

    #print datas

    result = {}

    for data in datas:
        result[data] = []
        for dat in datas[data]:
            a = dat
            a["ad"] = dat["d"]
            print dat["s"]
            a["name"] = dat["name"].encode('gb2312')
            a["d"] = '%.2f' % (dat["d"] / dat["s"])
            result[data].append(a)
    print result

    #file = open('./metrics.json', 'w')
    #file.write(json.dumps(result))
    #file.close()
