#!/bin/sh

uglifyjs --compress --mangle -- dm.js > bundle.js
stat -f"%z bytes" bundle.js