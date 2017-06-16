#!/bin/bash -e

# Have Greenkeeper upload/push the project's updated npm lockfile to the git origin
NPM_VERSION=$(npm --version)

# Lockfiles are only supported on npm 5+
IFS='.' read -ra NPM_VERSION_COMPONENTS <<< "$NPM_VERSION"
if [[ "${NPM_VERSION_COMPONENTS[0]}" -ge 5 ]]; then
  echo "INFO: npm version $NPM_VERSION supports lockfiles. Using Greenkeeper to push the lockfile update..."
  greenkeeper-lockfile-upload
else
  echo "WARN: npm version $NPM_VERSION DOES NOT support lockfiles. Skipping lockfile update..."
fi
