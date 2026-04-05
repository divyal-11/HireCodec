#!/bin/sh
echo "$CODE" | base64 -d > /sandbox/Solution.java
javac /sandbox/Solution.java && echo "$STDIN" | timeout ${TIME_LIMIT:-10} java -cp /sandbox Solution
