#!/bin/bash

go build -o ./binary/mainARM
GOOS=linux GOARCH=amd64 go build -o ./binary/mainAMD