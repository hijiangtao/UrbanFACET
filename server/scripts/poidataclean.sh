# 

cd /home/taojiang/tools

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations building=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-b.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations amenity=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-a.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations craft=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-c.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations emergency=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-e.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations leisure=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-l.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations historic=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-h.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations natural=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-n.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations office=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-o.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations shop=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-s.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/beijing.osm --tf accept-nodes --tf accept-ways --tf accept-relations tourism=* --write-xml /home/taojiang/datasets/JingJinJi/pois/beijing/bj-t.osm

osmosis/bin/osmosis --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-a.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-b.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-c.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-e.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-h.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-l.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-n.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-o.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-s.osm --rx /home/taojiang/datasets/JingJinJi/pois/beijing/bj-t.osm --merge --merge --merge --merge --merge --merge --merge --merge --merge --wx /home/taojiang/datasets/JingJinJi/pois/beijing/beijing.fPOI.osm

osmtogeojson /home/taojiang/datasets/JingJinJi/pois/beijing/beijing.fPOI.osm > /home/taojiang/datasets/JingJinJi/pois/beijing/beijing.fPOI.geojson