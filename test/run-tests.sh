#!/bin/bash
# IPA Translator Test Runner
# Run from project root: ./test/run-tests.sh [path]

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEST_DIR="$BASE_DIR/test"

show_help() {
    echo "IPA Translator - Test Runner"
    echo ""
    echo "Usage:"
    echo "  ./test/run-tests.sh              - Run all tests"
    echo "  ./test/run-tests.sh zh           - Run all tests in test/zh/"
    echo "  ./test/run-tests.sh yue          - Run all tests in test/yue/"
    echo "  ./test/run-tests.sh file.js      - Run a specific test file"
    echo ""
    echo "Examples:"
    echo "  ./test/run-tests.sh test/zh/mandarin-basic-test.test.js"
    echo "  ./test/run-tests.sh test/yue/formatters.test.js"
}

run_test() {
    local file="$1"
    local rel_path="${file#$BASE_DIR/}"
    echo "========================================"
    echo "Running: $rel_path"
    echo "----------------------------------------"
    node "$file"
    echo ""
}

if [ -z "$1" ]; then
    # Run all tests recursively
    echo "Running all tests in $TEST_DIR/"
    echo ""
    find "$TEST_DIR" -name "*.test.js" -type f | sort | while read -r file; do
        run_test "$file"
    done
elif [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
elif [ -f "$BASE_DIR/$1" ]; then
    # Direct file path
    run_test "$BASE_DIR/$1"
elif [ -d "$TEST_DIR/$1" ]; then
    # Directory name
    echo "Running tests in $TEST_DIR/$1/"
    echo ""
    find "$TEST_DIR/$1" -name "*.test.js" -type f | sort | while read -r file; do
        run_test "$file"
    done
else
    echo "Error: '$1' not found"
    echo ""
    show_help
    exit 1
fi
