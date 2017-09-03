
cd /home/joe
rsync -P --rsh=ssh root@192.168.1.42:/enigma/tao.jiang/datasets/JingJinJi/records/rawdata/Beijing.tar.gz /media/joe/LaCie/TalkingData/Jingjinji/RawData/part-of-bj.tar.gz

cd /media/joe/LaCie/TalkingData/Jingjinji/Beijing-FilterRecords
rsync -P --rsh=ssh ../RawData/Beijing.zip root@192.168.1.42:/enigma/tao.jiang/datasets/JingJinJi/records/rawdata/Beijing.zip