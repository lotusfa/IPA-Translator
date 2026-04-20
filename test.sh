#!/bin/bash
# IPA Translator - Quick Test Runner
# Usage: ./test.sh [path]

case "$1" in
    "")
        # Run all tests
        echo "=== Running All Tests ==="
        find test -name "*.test.js" -type f | sort | while read f; do
            echo "--- $f ---"
            node "$f" 2>&1 | grep -E "^(✓|✗|===)" || true
            echo ""
        done
        ;;
    test/*)
        # Run specific file
        node "$1"
        ;;
    *)
        # Run directory (e.g., ./test.sh zh)
        if [ -d "test/$1" ]; then
            echo "=== Tests in test/$1/ ==="
            find "test/$1" -name "*.test.js" -type f | sort | while read f; do
                echo "--- $f ---"
                node "$f" 2>&1 | grep -E "^(✓|✗|===)" || true
            done
        else
            echo "Usage: ./test.sh [path]"
            echo "  No args     - Run all tests"
            echo "  zh          - Run test/zh/"
            echo "  yue         - Run test/yue/"
            echo "  file.js     - Run specific test file"
        fi
        ;;
esac
