-- 添加 dis 字段于表属性最后,
ALTER TABLE `bjEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsEmatrix` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;

-- Temp Table
CREATE TABLE `tdnormal`.`tempDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tempDis` ADD INDEX( `id`, `dis`);
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

-- 新建四城 POI Tables
CREATE TABLE `tdnormal`.`bjCPOI` ( `id` MEDIUMINT NOT NULL AUTO_INCREMENT , `poi0` INT NOT NULL , `poi1` INT NOT NULL , `poi2` INT NOT NULL , `poi3` INT NOT NULL , `poi4` INT NOT NULL , `poi5` INT NOT NULL , `poi6` INT NOT NULL , `poi7` INT NOT NULL , `poi8` INT NOT NULL , `poi9` INT NOT NULL , `poi10` INT NOT NULL , `total` INT NOT NULL , `lng` DOUBLE NOT NULL , `lat` DOUBLE NOT NULL , `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' , PRIMARY KEY (`id`)) ENGINE = InnoDB;
CREATE TABLE `tdnormal`.`tjCPOI` ( `id` MEDIUMINT NOT NULL AUTO_INCREMENT , `poi0` INT NOT NULL , `poi1` INT NOT NULL , `poi2` INT NOT NULL , `poi3` INT NOT NULL , `poi4` INT NOT NULL , `poi5` INT NOT NULL , `poi6` INT NOT NULL , `poi7` INT NOT NULL , `poi8` INT NOT NULL , `poi9` INT NOT NULL , `poi10` INT NOT NULL , `total` INT NOT NULL , `lng` DOUBLE NOT NULL , `lat` DOUBLE NOT NULL , `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' , PRIMARY KEY (`id`)) ENGINE = InnoDB;
CREATE TABLE `tdnormal`.`zjkCPOI` ( `id` MEDIUMINT NOT NULL AUTO_INCREMENT , `poi0` INT NOT NULL , `poi1` INT NOT NULL , `poi2` INT NOT NULL , `poi3` INT NOT NULL , `poi4` INT NOT NULL , `poi5` INT NOT NULL , `poi6` INT NOT NULL , `poi7` INT NOT NULL , `poi8` INT NOT NULL , `poi9` INT NOT NULL , `poi10` INT NOT NULL , `total` INT NOT NULL , `lng` DOUBLE NOT NULL , `lat` DOUBLE NOT NULL , `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' , PRIMARY KEY (`id`)) ENGINE = InnoDB;
CREATE TABLE `tdnormal`.`tsCPOI` ( `id` MEDIUMINT NOT NULL AUTO_INCREMENT , `poi0` INT NOT NULL , `poi1` INT NOT NULL , `poi2` INT NOT NULL , `poi3` INT NOT NULL , `poi4` INT NOT NULL , `poi5` INT NOT NULL , `poi6` INT NOT NULL , `poi7` INT NOT NULL , `poi8` INT NOT NULL , `poi9` INT NOT NULL , `poi10` INT NOT NULL , `total` INT NOT NULL , `lng` DOUBLE NOT NULL , `lat` DOUBLE NOT NULL , `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' , PRIMARY KEY (`id`)) ENGINE = InnoDB;

ALTER TABLE `bjCPOI` ADD INDEX( `total`, `dis`);
ALTER TABLE `tjCPOI` ADD INDEX( `total`, `dis`);
ALTER TABLE `zjkCPOI` ADD INDEX( `total`, `dis`);
ALTER TABLE `tsCPOI` ADD INDEX( `total`, `dis`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/pois/beijing/gridsCount" INTO TABLE bjCPOI COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11,@col12,@col13,@col14,@col15) set poi0=@col1,poi1=@col2,poi2=@col3,poi3=@col4,poi4=@col5,poi5=@col6,poi6=@col7,poi7=@col8,poi8=@col9,poi9=@col10,poi10=@col11,total=@col12,lng=@col13,lat=@col14,dis=@col15;
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/pois/tianjin/gridsCount" INTO TABLE tjCPOI COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11,@col12,@col13,@col14,@col15) set poi0=@col1,poi1=@col2,poi2=@col3,poi3=@col4,poi4=@col5,poi5=@col6,poi6=@col7,poi7=@col8,poi8=@col9,poi9=@col10,poi10=@col11,total=@col12,lng=@col13,lat=@col14,dis=@col15;
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/pois/zhangjiakou/gridsCount" INTO TABLE zjkCPOI COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11,@col12,@col13,@col14,@col15) set poi0=@col1,poi1=@col2,poi2=@col3,poi3=@col4,poi4=@col5,poi5=@col6,poi6=@col7,poi7=@col8,poi8=@col9,poi9=@col10,poi10=@col11,total=@col12,lng=@col13,lat=@col14,dis=@col15;
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/pois/tangshan/gridsCount" INTO TABLE tsCPOI COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11,@col12,@col13,@col14,@col15) set poi0=@col1,poi1=@col2,poi2=@col3,poi3=@col4,poi4=@col5,poi5=@col6,poi6=@col7,poi7=@col8,poi8=@col9,poi9=@col10,poi10=@col11,total=@col12,lng=@col13,lat=@col14,dis=@col15;


-- 城市 Dis 属性备份表
-- Beijing
CREATE TABLE `tdnormal`.`bjDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `bjDis` ADD INDEX( `id`, `dis`);
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/beijing/grids" INTO TABLE bjDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;

-- Tianjin
CREATE TABLE `tdnormal`.`tjDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tjDis` ADD INDEX( `id`, `dis`);
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/tianjin/grids" INTO TABLE tjDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;

-- Zhangjiakou
CREATE TABLE `tdnormal`.`zjkDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `zjkDis` ADD INDEX( `id`, `dis`);
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/zhangjiakou/grids" INTO TABLE zjkDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;

-- Tangshan
CREATE TABLE `tdnormal`.`tsDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tsDis` ADD INDEX( `id`, `dis`);
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/tangshan/grids" INTO TABLE tsDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
