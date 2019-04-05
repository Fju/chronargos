#!/bin/bash

SIZES=(16 32 48 64 256)

for size in ${SIZES[*]}; do
	echo "Generating PNG of size $size"
	convert -background transparent -resize "${size}x${size}" chronargos_logo.svg "icon_${size}x${size}.png"
done

echo "Generating .ico"
convert -background transparent icon_*.png icon.ico

# TODO: add .icns


