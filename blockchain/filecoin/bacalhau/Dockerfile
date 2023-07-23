FROM ubuntu:latest

RUN apt-get update
RUN apt-get install ca-certificates -y
RUN update-ca-certificates

WORKDIR /
ADD main ./main
ADD success.jpeg ./success.jpeg
ADD fail.jpeg ./fail.jpeg
ADD score.env ./score.env

ENTRYPOINT ./main