#!/bin/bash -e

# Have Greenkeeper update the project's npm lockfile to match the new dependency versions
NPM_VERSION=$(npm --version)

# Lockfiles are only supported on npm 5+
IFS='.' read -ra NPM_VERSION_COMPONENTS <<< "$NPM_VERSION"
if [[ "${NPM_VERSION_COMPONENTS[0]}" -ge 5 ]]; then
  greenkeeper-lockfile-update
else
  echo "WARN: npm version $NPM_VERSION does not support lockfiles"
fi
