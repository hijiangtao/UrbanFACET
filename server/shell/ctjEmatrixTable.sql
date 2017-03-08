CREATE TABLE `tdnormal`.`tjEmatrix` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `wpnumber` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `vpnumber` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `wrnumber` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `vrnumber` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `poinum` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `prsval` float NOT NULL DEFAULT '-1',
  `trsval` float NOT NULL DEFAULT '-1',
  `arsval` float NOT NULL DEFAULT '-1',
  `ppsval` float NOT NULL DEFAULT '-1',
  `tpsval` float NOT NULL DEFAULT '-1',
  `apsval` float NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER  TABLE `tdnormal`.`tjEmatrix` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/respeo-xxx" INTO TABLE tjEmatrix COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9) set id=@col1,wpnumber=@col2,vpnumber=@col3,ppsval=@col4,tpsval=@col5,apsval=@col6;

CREATE TEMPORARY TABLE tmp LIKE tjEmatrix;
LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/resrec-xxx" INTO TABLE tmp COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9) set id=@col1,wrnumber=@col2,vrnumber=@col3,prsval=@col4,trsval=@col5,arsval=@col6;

UPDATE tjEmatrix
INNER JOIN tmp on tjEmatrix.id=tmp.id
SET tjEmatrix.wrnumber = tmp.wrnumber, tjEmatrix.vrnumber = tmp.vrnumber, tjEmatrix.prsval = tmp.prsval, tjEmatrix.trsval = tmp.trsval, tjEmatrix.arsval = tmp.arsval;

DROP TEMPORARY TABLE tmp;

