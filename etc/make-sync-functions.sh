#!/bin/sh -e

cd "$(dirname "$0")"/.. || exit 1

# Create a sync function from each document definitions file
databasesDir="$(pwd)/databases"
for bucketPath in "$databasesDir"/*; do
  # Skip files and directories that don't contain document definitions
  if [ ! -d "$bucketPath" ]; then continue; fi
  if [ ! -e "$bucketPath/doc-definitions.js" ]; then continue; fi

  bucketName=$(basename "$bucketPath")

  outputDir="build/sync-functions/$bucketName"
  syncFuncFile="$outputDir/sync-function.js"

  mkdir -p "$outputDir"

  node_modules/synctos/make-sync-function "$databasesDir/$bucketName/doc-definitions.js" "$syncFuncFile"

  echo "Linting generated $bucketName sync function\n"
  node_modules/jshint/bin/jshint "$syncFuncFile"
done
