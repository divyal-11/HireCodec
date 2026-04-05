#!/bin/sh
echo "$CODE" | base64 -d > /sandbox/solution.cpp
g++ -O2 -std=c++17 -o /sandbox/solution /sandbox/solution.cpp && echo "$STDIN" | timeout ${TIME_LIMIT:-5} /sandbox/solution
