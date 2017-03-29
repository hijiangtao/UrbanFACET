-- 计算 radar chart 所需数据
-- 根据城市分类
-- 先计算城市四个metric总量的平均值
-- 每个城市四类 metric, 按照 dis 计算分类结果

-- beijing
SELECT SUM(apsval)/SUM(wpnumber) AS 'ap' FROM bjEmatrix WHERE wpnumber != 0;
SELECT SUM(ppsval)/SUM(vpnumber) AS 'pp' FROM bjEmatrix WHERE vpnumber != 0;
SELECT SUM(arsval)/SUM(wrnumber) AS 'ar' FROM bjEmatrix WHERE wrnumber != 0;
SELECT SUM(prsval)/SUM(vrnumber) AS 'pr' FROM bjEmatrix WHERE vrnumber != 0;
-- tianjin
SELECT SUM(apsval)/SUM(wpnumber) AS 'ap' FROM tjEmatrix WHERE wpnumber != 0;
SELECT SUM(ppsval)/SUM(vpnumber) AS 'pp' FROM tjEmatrix WHERE vpnumber != 0;
SELECT SUM(arsval)/SUM(wrnumber) AS 'ar' FROM tjEmatrix WHERE wrnumber != 0;
SELECT SUM(prsval)/SUM(vrnumber) AS 'pr' FROM tjEmatrix WHERE vrnumber != 0;
-- zhangjiakou
SELECT SUM(apsval)/SUM(wpnumber) AS 'ap' FROM zjkEmatrix WHERE wpnumber != 0;
SELECT SUM(ppsval)/SUM(vpnumber) AS 'pp' FROM zjkEmatrix WHERE vpnumber != 0;
SELECT SUM(arsval)/SUM(wrnumber) AS 'ar' FROM zjkEmatrix WHERE wrnumber != 0;
SELECT SUM(prsval)/SUM(vrnumber) AS 'pr' FROM zjkEmatrix WHERE vrnumber != 0;
-- tangshan
SELECT SUM(apsval)/SUM(wpnumber) AS 'ap' FROM tsEmatrix WHERE wpnumber != 0;
SELECT SUM(ppsval)/SUM(vpnumber) AS 'pp' FROM tsEmatrix WHERE vpnumber != 0;
SELECT SUM(arsval)/SUM(wrnumber) AS 'ar' FROM tsEmatrix WHERE wrnumber != 0;
SELECT SUM(prsval)/SUM(vrnumber) AS 'pr' FROM tsEmatrix WHERE vrnumber != 0;

SELECT SUM(wpnumber) FROM bjEmatrix;

-- beijing
SELECT SUM(wpnumber) AS 'density', SUM(apsval) AS 'total', SUM(apsval)/SUM(wpnumber) AS 'ap', dis AS 'dis' FROM bjEmatrix WHERE wpnumber != 0 GROUP BY dis;
SELECT SUM(vpnumber) AS 'density', SUM(ppsval) AS 'total', SUM(ppsval)/SUM(vpnumber) AS 'pp', dis FROM bjEmatrix WHERE vpnumber != 0 GROUP BY dis;
SELECT SUM(wrnumber) AS 'density', SUM(arsval) AS 'total', SUM(arsval)/SUM(wrnumber) AS 'ar', dis AS 'dis' FROM bjEmatrix WHERE wrnumber != 0 GROUP BY dis;
SELECT SUM(vrnumber) AS 'density', SUM(prsval) AS 'total', SUM(prsval)/SUM(vrnumber) AS 'pr', dis AS 'dis' FROM bjEmatrix WHERE vrnumber != 0 GROUP BY dis;

-- tianjin
SELECT SUM(wpnumber) AS 'density', SUM(apsval) AS 'total', SUM(apsval)/SUM(wpnumber) AS 'ap', dis AS 'dis' FROM tjEmatrix WHERE wpnumber != 0 GROUP BY dis;
SELECT SUM(vpnumber) AS 'density', SUM(ppsval) AS 'total', SUM(ppsval)/SUM(vpnumber) AS 'pp', dis FROM tjEmatrix WHERE vpnumber != 0 GROUP BY dis;
SELECT SUM(wrnumber) AS 'density', SUM(arsval) AS 'total', SUM(arsval)/SUM(wrnumber) AS 'ar', dis AS 'dis' FROM tjEmatrix WHERE wrnumber != 0 GROUP BY dis;
SELECT SUM(vrnumber) AS 'density', SUM(prsval) AS 'total', SUM(prsval)/SUM(vrnumber) AS 'pr', dis AS 'dis' FROM tjEmatrix WHERE vrnumber != 0 GROUP BY dis;

-- tangshan
SELECT SUM(wpnumber) AS 'density', SUM(apsval) AS 'total', SUM(apsval)/SUM(wpnumber) AS 'ap', dis AS 'dis' FROM tsEmatrix WHERE wpnumber != 0 GROUP BY dis;
SELECT SUM(vpnumber) AS 'density', SUM(ppsval) AS 'total', SUM(ppsval)/SUM(vpnumber) AS 'pp', dis FROM tsEmatrix WHERE vpnumber != 0 GROUP BY dis;
SELECT SUM(wrnumber) AS 'density', SUM(arsval) AS 'total', SUM(arsval)/SUM(wrnumber) AS 'ar', dis AS 'dis' FROM tsEmatrix WHERE wrnumber != 0 GROUP BY dis;
SELECT SUM(vrnumber) AS 'density', SUM(prsval) AS 'total', SUM(prsval)/SUM(vrnumber) AS 'pr', dis AS 'dis' FROM tsEmatrix WHERE vrnumber != 0 GROUP BY dis;

-- zhangjiakou
SELECT SUM(wpnumber) AS 'density', SUM(apsval) AS 'total', SUM(apsval)/SUM(wpnumber) AS 'ap', dis AS 'dis' FROM zjkEmatrix WHERE wpnumber != 0 GROUP BY dis;
SELECT SUM(vpnumber) AS 'density', SUM(ppsval) AS 'total', SUM(ppsval)/SUM(vpnumber) AS 'pp', dis FROM zjkEmatrix WHERE vpnumber != 0 GROUP BY dis;
SELECT SUM(wrnumber) AS 'density', SUM(arsval) AS 'total', SUM(arsval)/SUM(wrnumber) AS 'ar', dis AS 'dis' FROM zjkEmatrix WHERE wrnumber != 0 GROUP BY dis;
SELECT SUM(vrnumber) AS 'density', SUM(prsval) AS 'total', SUM(prsval)/SUM(vrnumber) AS 'pr', dis AS 'dis' FROM zjkEmatrix WHERE vrnumber != 0 GROUP BY dis;