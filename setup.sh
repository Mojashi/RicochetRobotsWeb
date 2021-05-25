#!/bin/sh
mkdir ./userPics
cd front/ricochetrobots-redux
npm install
npm run build
cd ../../api
go build
cd ../solve
make all
