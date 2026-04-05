#!/bin/sh
echo "$CODE" | base64 -d > /sandbox/solution.py
echo "$STDIN" | timeout ${TIME_LIMIT:-5} python /sandbox/solution.py
