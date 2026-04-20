#!/bin/bash
# IPA Translator Test Runner
# Usage:
#   ./run-tests.sh              - Run all tests
#   ./run-tests.sh zh           - Run tests in test/zh/
#   ./run-tests.sh yue          - Run tests in test/yue/
#   ./run-tests.sh file         - Run a specific test file

set -e

TEST_DIR="test"
TOTAL_PASS=0
TOTAL_FAIL=0

run_test() {
    local file="$1"
    echo "========================================"
    echo "Running: $(basename "$file")"
    echo "----------------------------------------"
    if node "$file" 2>&1; then
        :
    fi
    echo ""
}

parse_results() {
    # Extract passed/failed from output if available
    local output="$1"
}

if [ -z "$1" ]; then
    # Run all tests recursively
    echo "Running all tests in $TEST_DIR/"
    echo ""
    for test_file in $(find "$TEST_DIR" -name "*.test.js" -type f | sort); do
        run_test "$test_file"
    done
elif [ -f "$1" ]; then
    # Run specific file
    run_test "$1"
else
    # Run all tests in specified directory
    if [ -d "$TEST_DIR/$1" ]; then
        echo "Running tests in $TEST_DIR/$1/"
        echo ""
        for test_file in $(find "$TEST_DIR/$1" -name "*.test.js" -type f | sort); do
            run_test "$test_file"
        done
    else
        echo "Error: Directory '$1' not found in $TEST_DIR/"
        exit 1
    fi
fi

echo "========================================"
echo "Test run completed"
echo "========================================"
