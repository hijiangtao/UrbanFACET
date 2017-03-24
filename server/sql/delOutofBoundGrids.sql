
-- delete all grids out of bounds in whole records table
DELETE FROM `bjEmatrix` WHERE dis=0;
DELETE FROM `tjEmatrix` WHERE dis=0;
DELETE FROM `tsEmatrix` WHERE dis=0;
DELETE FROM `zjkEmatrix` WHERE dis=0;

-- DELETE w 
-- FROM `tjF0mat` w
-- INNER JOIN `tjEmatrix` e
--   ON w.id=e.id
-- WHERE e.dis = 0;

ALTER TABLE `tjF0mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF1mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF2mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF3mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF4mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF5mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF6mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF7mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tjF8mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF0mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF1mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF2mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF3mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF4mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF5mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF6mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF7mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `bjF8mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF0mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF1mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF2mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF3mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF4mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF5mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF6mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF7mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `zjkF8mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF0mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF1mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF2mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF3mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF4mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF5mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF6mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF7mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;
ALTER TABLE `tsF8mat` ADD `dis` TINYINT UNSIGNED NOT NULL DEFAULT '0' AFTER `apsval`;

CREATE TABLE `tdnormal`.`tempDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tempDis` ADD INDEX( `id`, `dis`);
-- Beijing
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/beijing/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE bjF0mat
INNER JOIN tempDis on bjF0mat.id=tempDis.id
SET bjF0mat.dis = tempDis.dis;
UPDATE bjF1mat
INNER JOIN tempDis on bjF1mat.id=tempDis.id
SET bjF1mat.dis = tempDis.dis;
UPDATE bjF2mat
INNER JOIN tempDis on bjF2mat.id=tempDis.id
SET bjF2mat.dis = tempDis.dis;
UPDATE bjF3mat
INNER JOIN tempDis on bjF3mat.id=tempDis.id
SET bjF3mat.dis = tempDis.dis;
UPDATE bjF4mat
INNER JOIN tempDis on bjF4mat.id=tempDis.id
SET bjF4mat.dis = tempDis.dis;
UPDATE bjF5mat
INNER JOIN tempDis on bjF5mat.id=tempDis.id
SET bjF5mat.dis = tempDis.dis;
UPDATE bjF6mat
INNER JOIN tempDis on bjF6mat.id=tempDis.id
SET bjF6mat.dis = tempDis.dis;
UPDATE bjF7mat
INNER JOIN tempDis on bjF7mat.id=tempDis.id
SET bjF7mat.dis = tempDis.dis;
UPDATE bjF8mat
INNER JOIN tempDis on bjF8mat.id=tempDis.id
SET bjF8mat.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;

CREATE TABLE `tdnormal`.`tempDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tempDis` ADD INDEX( `id`, `dis`);
-- Tianjin
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/tianjin/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE tjF0mat
INNER JOIN tempDis on tjF0mat.id=tempDis.id
SET tjF0mat.dis = tempDis.dis;
UPDATE tjF1mat
INNER JOIN tempDis on tjF1mat.id=tempDis.id
SET tjF1mat.dis = tempDis.dis;
UPDATE tjF2mat
INNER JOIN tempDis on tjF2mat.id=tempDis.id
SET tjF2mat.dis = tempDis.dis;
UPDATE tjF3mat
INNER JOIN tempDis on tjF3mat.id=tempDis.id
SET tjF3mat.dis = tempDis.dis;
UPDATE tjF4mat
INNER JOIN tempDis on tjF4mat.id=tempDis.id
SET tjF4mat.dis = tempDis.dis;
UPDATE tjF5mat
INNER JOIN tempDis on tjF5mat.id=tempDis.id
SET tjF5mat.dis = tempDis.dis;
UPDATE tjF6mat
INNER JOIN tempDis on tjF6mat.id=tempDis.id
SET tjF6mat.dis = tempDis.dis;
UPDATE tjF7mat
INNER JOIN tempDis on tjF7mat.id=tempDis.id
SET tjF7mat.dis = tempDis.dis;
UPDATE tjF8mat
INNER JOIN tempDis on tjF8mat.id=tempDis.id
SET tjF8mat.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;

CREATE TABLE `tdnormal`.`tempDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tempDis` ADD INDEX( `id`, `dis`);
-- Beijing
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/zhangjiakou/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE zjkF0mat
INNER JOIN tempDis on zjkF0mat.id=tempDis.id
SET zjkF0mat.dis = tempDis.dis;
UPDATE zjkF1mat
INNER JOIN tempDis on zjkF1mat.id=tempDis.id
SET zjkF1mat.dis = tempDis.dis;
UPDATE zjkF2mat
INNER JOIN tempDis on zjkF2mat.id=tempDis.id
SET zjkF2mat.dis = tempDis.dis;
UPDATE zjkF3mat
INNER JOIN tempDis on zjkF3mat.id=tempDis.id
SET zjkF3mat.dis = tempDis.dis;
UPDATE zjkF4mat
INNER JOIN tempDis on zjkF4mat.id=tempDis.id
SET zjkF4mat.dis = tempDis.dis;
UPDATE zjkF5mat
INNER JOIN tempDis on zjkF5mat.id=tempDis.id
SET zjkF5mat.dis = tempDis.dis;
UPDATE zjkF6mat
INNER JOIN tempDis on zjkF6mat.id=tempDis.id
SET zjkF6mat.dis = tempDis.dis;
UPDATE zjkF7mat
INNER JOIN tempDis on zjkF7mat.id=tempDis.id
SET zjkF7mat.dis = tempDis.dis;
UPDATE zjkF8mat
INNER JOIN tempDis on zjkF8mat.id=tempDis.id
SET zjkF8mat.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;

CREATE TABLE `tdnormal`.`tempDis` ( `id` MEDIUMINT NOT NULL , `dis` TINYINT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `tempDis` ADD INDEX( `id`, `dis`);
-- Beijing
LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/records/disinfo/tangshan/grids" INTO TABLE tempDis COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,dis=@col2;
UPDATE tsF0mat
INNER JOIN tempDis on tsF0mat.id=tempDis.id
SET tsF0mat.dis = tempDis.dis;
UPDATE tsF1mat
INNER JOIN tempDis on tsF1mat.id=tempDis.id
SET tsF1mat.dis = tempDis.dis;
UPDATE tsF2mat
INNER JOIN tempDis on tsF2mat.id=tempDis.id
SET tsF2mat.dis = tempDis.dis;
UPDATE tsF3mat
INNER JOIN tempDis on tsF3mat.id=tempDis.id
SET tsF3mat.dis = tempDis.dis;
UPDATE tsF4mat
INNER JOIN tempDis on tsF4mat.id=tempDis.id
SET tsF4mat.dis = tempDis.dis;
UPDATE tsF5mat
INNER JOIN tempDis on tsF5mat.id=tempDis.id
SET tsF5mat.dis = tempDis.dis;
UPDATE tsF6mat
INNER JOIN tempDis on tsF6mat.id=tempDis.id
SET tsF6mat.dis = tempDis.dis;
UPDATE tsF7mat
INNER JOIN tempDis on tsF7mat.id=tempDis.id
SET tsF7mat.dis = tempDis.dis;
UPDATE tsF8mat
INNER JOIN tempDis on tsF8mat.id=tempDis.id
SET tsF8mat.dis = tempDis.dis;
TRUNCATE TABLE `tempDis`;