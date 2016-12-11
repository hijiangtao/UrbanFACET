# 

cd /home/taojiang/git/socialgroupVisualComparison/server/scripts

python ./POIExtraction.py -c beijing -d /home/taojiang/tools

cd /home/taojiang/tools

# ./jq-linux64 --compact-output '.features' beijing_china_fPOI_with_area_prop.geojson > beijing_china_fPOI_with_area_prop_for_mongo.geojson 

mongoimport --db tdVC -c pois_beijing --file '/home/taojiang/tools/beijing_china_POIExtraction.geojson' --jsonArray -batchSize 1