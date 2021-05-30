#!/bin/sh

if [ $# -ne 1 ]; then
  echo "you need to specify build-type" 1>&2
  exit 1
fi
if [ $1 = dev ]; then
  cp .env_showcase_dev .env
else
  cp .env_showcase .env
fi
echo -e DB=$MARIADB_DATABASE >> .env
echo -e DB_USER=$MARIADB_USERNAME >> .env
echo -e DB_PASS=$MARIADB_PASSWORD >> .env
echo -e DB_HOST=$MARIADB_HOSTNAME >> .env

rm -rf /usr/local/go
rm -rf /usr/sbin/go
# if [ ! -e go1.16.4.linux-amd64.tar.gz ];then
rm go1.16.4.linux-amd64.tar.gz
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
