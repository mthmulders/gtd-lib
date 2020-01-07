#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Supply the version number to publish, e.g. 0.0.3"
    exit 1
fi

version=$1

npm run package
npm publish gtd-lib-${version}.tgz

git tag -a -s -m "Release version ${version}" gtd-lib-${version}
git push origin --tags