#!/bin/sh

terser --toplevel --compress toplevel=true -m reserved=['b','l','o','v'] -- src/dm.js > build/bundle.js
stat -f"%z bytes" build/bundle.js