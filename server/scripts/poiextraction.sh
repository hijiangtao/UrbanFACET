# 

cd /home/taojiang/git/socialgroupVisualComparison/server/scripts

python ./POIExtraction.py

cd /home/taojiang/tools

./jq-linux64 --compact-output '.features' beijing_china_fPOI_with_area_prop.geojson > beijing_china_fPOI_with_area_prop_for_mongo.geojson 

mongoimport --db tdBJ -c POIs --file '/home/taojiang/tools/beijing_china_fPOI_with_area_prop_for_mongo.geojson' --jsonArray -batchSize 1