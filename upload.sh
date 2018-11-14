#!/usr/bin/env bash

./build.sh
aws s3 sync _doc s3://www.scalabel.ai/doc --exclude ".DS_Store" --acl public-read
