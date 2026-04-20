#!/bin/bash
# IPA Translator - Test Runner
# Run from project root

set -e

run_test() {
    echo "========================================"
    echo "Running: $1"
    echo "----------------------------------------"
    node "$1" || true
    echo ""
}

if [ -z "$1" ]; then
    echo "Running all tests..."
    echo ""
    find test -name "*.test.js" -type f | sort | while read -r f; do run_test "$f"; done
elif [ -d "test/$1" ]; then
    echo "Running tests in test/$1/"
    echo ""
    find "test/$1" -name "*.test.js" -type f | sort | while read -r f; do run_test "$f"; done
elif [ -f "$1" ]; then
    run_test "$1"
else
    echo "Usage: ./test-all.sh [path]"
    echo "  No args    - Run all tests"
    echo "  zh         - Run test/zh/"
    echo "  yue        - Run test/yue/"
    echo "  file.js    - Run specific test"
fi
