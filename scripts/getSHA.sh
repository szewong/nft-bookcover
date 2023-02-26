#!/bin/bash
# NOTE : Quote it else use array to avoid problems #
FILES="../eBook/*"
for f in $FILES
do
  echo "Processing $f file..."
  shasum -a 256 $f 
  #echo $file_name
done