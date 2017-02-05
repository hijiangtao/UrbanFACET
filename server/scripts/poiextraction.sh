# 

cd /home/taojiang/git/living-modes-visual-comparison/server/scripts
python ./POIExtraction.py -c beijing -d /home/taojiang/datasets/pois
# python ./POIExtraction.py -c tianjin -d /home/taojiang/datasets/pois
# python ./POIExtraction.py -c zhangjiakou -d /home/taojiang/datasets/pois
# python ./POIExtraction.py -c tangshan -d /home/taojiang/datasets/pois

# mongoimport --db tonormal -c pois_beijing --file '/home/taojiang/datasets/pois/beijing/beijing.aPOI.geojson' --jsonArray -batchSize 1