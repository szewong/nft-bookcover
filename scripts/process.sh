#!/bin/bash
# NOTE : Quote it else use array to avoid problems #
FILES="../output/webm/*.webm"
for f in $FILES
do
  echo "Processing $f file..."
  # take action on each file. $f store current file name
  file_name="../output/webp/$(basename -s .webm $f).webp"
  ../bin/ffmpeg -loglevel verbose -stream_loop -1 -c:v libvpx  -i $f $file_name 
  #echo $file_name
done