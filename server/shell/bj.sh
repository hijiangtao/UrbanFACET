#

cd /home/tao.jiang/git/living-modes-visual-comparison/server/scripts

python ./augmentRawData.py -c beijing -d /home/tao.jiang/datasets/JingJinJi/records -n 9999

python ./entropyMatrixCalModule.py -c beijing

python ./entropySupCalModule.py -c beijing