#!/bin/sh

terser --toplevel --compress toplevel=true -m reserved=['b','l','o','v'] -- dm.js > bundle.js
stat -f"%z bytes" bundle.js