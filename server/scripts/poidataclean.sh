# Beijing
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

# tianjin

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations building=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-b.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations amenity=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-a.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations craft=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-c.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations emergency=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-e.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations leisure=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-l.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations historic=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-h.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations natural=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-n.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations office=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-o.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations shop=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-s.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tianjin.osm --tf accept-nodes --tf accept-ways --tf accept-relations tourism=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-t.osm

osmosis/bin/osmosis --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-a.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-b.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-c.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-e.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-h.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-l.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-n.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-o.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-s.osm --rx /home/taojiang/datasets/JingJinJi/pois/tianjin/tj-t.osm --merge --merge --merge --merge --merge --merge --merge --merge --merge --wx /home/taojiang/datasets/JingJinJi/pois/tianjin/tianjin.fPOI.osm

osmtogeojson /home/taojiang/datasets/JingJinJi/pois/tianjin/tianjin.fPOI.osm > /home/taojiang/datasets/JingJinJi/pois/tianjin/tianjin.fPOI.geojson

# zhangjiakou

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations building=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-b.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations amenity=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-a.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations craft=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-c.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations emergency=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-e.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations leisure=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-l.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations historic=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-h.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations natural=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-n.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations office=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-o.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations shop=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-s.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou.osm --tf accept-nodes --tf accept-ways --tf accept-relations tourism=* --write-xml /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-t.osm

osmosis/bin/osmosis --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-a.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-b.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-c.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-e.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-h.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-l.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-n.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-o.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-s.osm --rx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zjk-t.osm --merge --merge --merge --merge --merge --merge --merge --merge --merge --wx /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zhangjiakou.fPOI.osm

osmtogeojson /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zhangjiakou.fPOI.osm > /home/taojiang/datasets/JingJinJi/pois/zhangjiakou/zhangjiakou.fPOI.geojson

# tangshan

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations building=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-b.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations amenity=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-a.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations craft=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-c.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations emergency=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-e.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations leisure=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-l.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations historic=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-h.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations natural=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-n.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations office=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-o.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations shop=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-s.osm

osmosis/bin/osmosis --read-xml /home/taojiang/datasets/JingJinJi/pois/tangshan.osm --tf accept-nodes --tf accept-ways --tf accept-relations tourism=* --write-xml /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-t.osm

osmosis/bin/osmosis --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-a.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-b.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-c.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-e.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-h.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-l.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-n.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-o.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-s.osm --rx /home/taojiang/datasets/JingJinJi/pois/tangshan/ts-t.osm --merge --merge --merge --merge --merge --merge --merge --merge --merge --wx /home/taojiang/datasets/JingJinJi/pois/tangshan/tangshan.fPOI.osm

osmtogeojson /home/taojiang/datasets/JingJinJi/pois/tangshan/tangshan.fPOI.osm > /home/taojiang/datasets/JingJinJi/pois/tangshan/tangshan.fPOI.geojson