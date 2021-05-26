#!/bin/sh
rm -rf /usr/local/go
rm -rf /usr/sbin/go
# if [ ! -e go1.16.4.linux-amd64.tar.gz ];then
rm https://golang.org/dl/go1.16.4.linux-amd64.tar.gz
wget https://golang.org/dl/go1.16.4.linux-amd64.tar.gz
# fi
tar -C /usr/local -xzf go1.16.4.linux-amd64.tar.gz
echo "export PATH=\$PATH:/usr/local/go/bin" >> /etc/profile
source /etc/profile

mkdir -p ./userPics
cd front/ricochetrobots-redux
npm install
npm run build
cd ../../api
go build
cd ../solve
make all
