# 

cd /home/taojiang/tools

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations building=* --write-xml bj-b.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations amenity=* --write-xml bj-a.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations craft=* --write-xml bj-c.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations emergency=* --write-xml bj-e.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations leisure=* --write-xml bj-l.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations historic=* --write-xml bj-h.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations natural=* --write-xml bj-n.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations office=* --write-xml bj-o.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations shop=* --write-xml bj-s.osm

osmosis/bin/osmosis --read-xml beijing_china.osm --tf accept-nodes --tf accept-ways --tf accept-relations tourism=* --write-xml bj-t.osm

osmosis/bin/osmosis --rx bj-a.osm --rx bj-b.osm --rx bj-c.osm --rx bj-e.osm --rx bj-h.osm --rx bj-l.osm --rx bj-n.osm --rx bj-o.osm --rx bj-s.osm --rx bj-t.osm --merge --merge --merge --merge --merge --merge --merge --merge --merge --wx beijing_china_fPOI.osm

osmtogeojson beijing_china_fPOI.osm > beijing_china_fPOI.geojson