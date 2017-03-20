CREATE TABLE `tdnormal`.`bjF0mat` (
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
ALTER  TABLE `tdnormal`.`bjF0mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t0-ressql-xxx" INTO TABLE bjF0mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF1mat` (
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
ALTER  TABLE `tdnormal`.`bjF1mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t1-ressql-xxx" INTO TABLE bjF1mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF2mat` (
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
ALTER  TABLE `tdnormal`.`bjF2mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t2-ressql-xxx" INTO TABLE bjF2mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF3mat` (
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
ALTER  TABLE `tdnormal`.`bjF3mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t3-ressql-xxx" INTO TABLE bjF3mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF4mat` (
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
ALTER  TABLE `tdnormal`.`bjF4mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t4-ressql-xxx" INTO TABLE bjF4mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF5mat` (
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
ALTER  TABLE `tdnormal`.`bjF5mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t5-ressql-xxx" INTO TABLE bjF5mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF6mat` (
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
ALTER  TABLE `tdnormal`.`bjF6mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t6-ressql-xxx" INTO TABLE bjF6mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF7mat` (
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
ALTER  TABLE `tdnormal`.`bjF7mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t7-ressql-xxx" INTO TABLE bjF7mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`bjF8mat` (
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
ALTER  TABLE `tdnormal`.`bjF8mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing/t8-ressql-xxx" INTO TABLE bjF8mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;
