#!/bin/sh
echo "$CODE" | base64 -d > /sandbox/solution.js
echo "$STDIN" | timeout ${TIME_LIMIT:-5} node /sandbox/solution.js
