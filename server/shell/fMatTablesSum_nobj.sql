
USE tdnormal;

CREATE TABLE `tdnormal`.`tjF0mat` (
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
ALTER  TABLE `tdnormal`.`tjF0mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t0-ressql-xxx" INTO TABLE tjF0mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF1mat` (
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
ALTER  TABLE `tdnormal`.`tjF1mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t1-ressql-xxx" INTO TABLE tjF1mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF2mat` (
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
ALTER  TABLE `tdnormal`.`tjF2mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t2-ressql-xxx" INTO TABLE tjF2mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF3mat` (
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
ALTER  TABLE `tdnormal`.`tjF3mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t3-ressql-xxx" INTO TABLE tjF3mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF4mat` (
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
ALTER  TABLE `tdnormal`.`tjF4mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t4-ressql-xxx" INTO TABLE tjF4mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF5mat` (
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
ALTER  TABLE `tdnormal`.`tjF5mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t5-ressql-xxx" INTO TABLE tjF5mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF6mat` (
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
ALTER  TABLE `tdnormal`.`tjF6mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t6-ressql-xxx" INTO TABLE tjF6mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF7mat` (
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
ALTER  TABLE `tdnormal`.`tjF7mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t7-ressql-xxx" INTO TABLE tjF7mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tjF8mat` (
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
ALTER  TABLE `tdnormal`.`tjF8mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tianjin/t8-ressql-xxx" INTO TABLE tjF8mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF0mat` (
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
ALTER  TABLE `tdnormal`.`tsF0mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t0-ressql-xxx" INTO TABLE tsF0mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF1mat` (
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
ALTER  TABLE `tdnormal`.`tsF1mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t1-ressql-xxx" INTO TABLE tsF1mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF2mat` (
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
ALTER  TABLE `tdnormal`.`tsF2mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t2-ressql-xxx" INTO TABLE tsF2mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF3mat` (
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
ALTER  TABLE `tdnormal`.`tsF3mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t3-ressql-xxx" INTO TABLE tsF3mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF4mat` (
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
ALTER  TABLE `tdnormal`.`tsF4mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t4-ressql-xxx" INTO TABLE tsF4mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF5mat` (
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
ALTER  TABLE `tdnormal`.`tsF5mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t5-ressql-xxx" INTO TABLE tsF5mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF6mat` (
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
ALTER  TABLE `tdnormal`.`tsF6mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t6-ressql-xxx" INTO TABLE tsF6mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF7mat` (
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
ALTER  TABLE `tdnormal`.`tsF7mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t7-ressql-xxx" INTO TABLE tsF7mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`tsF8mat` (
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
ALTER  TABLE `tdnormal`.`tsF8mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/tangshan/t8-ressql-xxx" INTO TABLE tsF8mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF0mat` (
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
ALTER  TABLE `tdnormal`.`zjkF0mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t0-ressql-xxx" INTO TABLE zjkF0mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF1mat` (
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
ALTER  TABLE `tdnormal`.`zjkF1mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t1-ressql-xxx" INTO TABLE zjkF1mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF2mat` (
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
ALTER  TABLE `tdnormal`.`zjkF2mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t2-ressql-xxx" INTO TABLE zjkF2mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF3mat` (
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
ALTER  TABLE `tdnormal`.`zjkF3mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t3-ressql-xxx" INTO TABLE zjkF3mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF4mat` (
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
ALTER  TABLE `tdnormal`.`zjkF4mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t4-ressql-xxx" INTO TABLE zjkF4mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF5mat` (
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
ALTER  TABLE `tdnormal`.`zjkF5mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t5-ressql-xxx" INTO TABLE zjkF5mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF6mat` (
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
ALTER  TABLE `tdnormal`.`zjkF6mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t6-ressql-xxx" INTO TABLE zjkF6mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF7mat` (
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
ALTER  TABLE `tdnormal`.`zjkF7mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t7-ressql-xxx" INTO TABLE zjkF7mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;

CREATE TABLE `tdnormal`.`zjkF8mat` (
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
ALTER  TABLE `tdnormal`.`zjkF8mat` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_3` (`wpnumber`,`vpnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber` (`wrnumber`,`vrnumber`,`prsval`,`ppsval`), ADD KEY `wrnumber_2` (`wrnumber`,`vrnumber`,`trsval`,`tpsval`), ADD KEY `wrnumber_3` (`wrnumber`,`vrnumber`,`arsval`,`apsval`), ADD KEY `wpnumber` (`wpnumber`,`vpnumber`,`trsval`,`tpsval`), ADD KEY `wpnumber_2` (`wpnumber`,`vpnumber`,`arsval`,`apsval`);

LOAD DATA LOCAL INFILE "/home/tao.jiang/datasets/JingJinJi/entropy/matrix/zhangjiakou/t8-ressql-xxx" INTO TABLE zjkF8mat COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2,@col3,@col4,@col5,@col6,@col7,@col8,@col9,@col10,@col11) set id=@col1,wpnumber=@col2,vpnumber=@col3,wrnumber=@col4,vrnumber=@col5,ppsval=@col6,tpsval=@col7,apsval=@col8,prsval=@col9,trsval=@col10,arsval=@col11;
