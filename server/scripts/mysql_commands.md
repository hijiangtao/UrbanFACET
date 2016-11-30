### filter huilongguan living people

SELECT DISTINCT(tdid) FROM cbeijing WHERE (timeID < 49 OR timeID > 120) AND lat > 40.0562 AND lat < 40.0890 AND lng > 116.3026 AND lng < 116.3714
INTO OUTFILE '/root/data/jiangtao/datasets/huilongguan_idlist.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

SELECT a.tdid, a.dayType, a.dateID, a.timeID, a.lat, a.lng, a.timeSegID 
FROM cbeijing a 
INNER JOIN huilonggguan_idlist b
ON a.tdid = b.id
WHERE 1
INTO OUTFILE '/tmp/huilongguan_records.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';