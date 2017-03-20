-- 添加 dis 字段于表属性最后,
-- ALTER TABLE `bjEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
-- ALTER TABLE `tjEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
-- ALTER TABLE `zjkEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
-- ALTER TABLE `tsEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;

-- Temp Table
-- CREATE TABLE `tdnormal`.`tempDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
-- ALTER TABLE `tempDis` ADD INDEX( `id`, `dis`);
-- Beijing
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/beijing/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE bjEmatrix
INNER JOIN tempDis on bjEmatrix.id=tempDis.id
SET bjEmatrix.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;
-- Tianjin
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/tianjin/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE tjEmatrix
INNER JOIN tempDis on tjEmatrix.id=tempDis.id
SET tjEmatrix.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;
-- Zhangjiakou
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/zhangjiakou/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE zjkEmatrix
INNER JOIN tempDis on zjkEmatrix.id=tempDis.id
SET zjkEmatrix.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;
-- Tangshan
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/tangshan/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE tsEmatrix
INNER JOIN tempDis on tsEmatrix.id=tempDis.id
SET tsEmatrix.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;

-- 导入数据更新 Ematrix
-- LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/respeo-xxx" INTO TABLE bjEmatrix COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9) set id=@col1,wpnumber=@col2,vpnumber=@col3,ppsval=@col4,tpsval=@col5,apsval=@col6;

-- 新建四城 POI Tables
