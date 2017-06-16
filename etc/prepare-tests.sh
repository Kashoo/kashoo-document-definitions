#!/bin/sh -e

cd "$(dirname "$0")"/..

mkdir -p build/test-reports/

etc/make-sync-functions.sh
