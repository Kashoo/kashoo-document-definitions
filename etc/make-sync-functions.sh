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
  docDefinitionsFile="$databasesDir/$bucketName/doc-definitions.js"
  syncFuncFile="$outputDir/sync-function.js"

  echo "Validating $bucketName document definitions"
  node_modules/.bin/synctos-validate "$docDefinitionsFile"

  mkdir -p "$outputDir"

  node_modules/.bin/synctos "$docDefinitionsFile" "$syncFuncFile"

  echo "Linting generated $bucketName sync function\n"
  node_modules/jshint/bin/jshint "$syncFuncFile"
done
