#!/bin/sh

terser --toplevel --compress toplevel=true -m reserved=['l','o'] -- dm.js > bundle.js
stat -f"%z bytes" bundle.js