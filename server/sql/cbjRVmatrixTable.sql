-- /enigma/tao.jiang/datasets/JingJinJi/entropy/matrix/beijing

CREATE TABLE `tdnormal`.`bjRV0matrix` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `wpnumber` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER  TABLE `tdnormal`.`bjRV0matrix` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_1` (`wpnumber`)

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy_range/matrix/beijing/respeo-00-xxx" INTO TABLE bjRV0matrix COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,wpnumber=@col2;


CREATE TABLE `tdnormal`.`bjRV1matrix` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `wpnumber` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER  TABLE `tdnormal`.`bjRV1matrix` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_1` (`wpnumber`)

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy_range/matrix/beijing/respeo-01-xxx" INTO TABLE bjRV1matrix COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,wpnumber=@col2;


CREATE TABLE `tdnormal`.`bjRV2matrix` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `wpnumber` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
ALTER  TABLE `tdnormal`.`bjRV2matrix` ADD PRIMARY KEY (`id`), ADD KEY `wpnumber_1` (`wpnumber`)

LOAD DATA LOCAL INFILE "/enigma/tao.jiang/datasets/JingJinJi/entropy_range/matrix/beijing/respeo-02-xxx" INTO TABLE bjRV2matrix COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' ESCAPED BY '"' LINES TERMINATED BY '\n' (@col1,@col2) set id=@col1,wpnumber=@col2;


