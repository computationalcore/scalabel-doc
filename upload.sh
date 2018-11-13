#!/usr/bin/env bash

aws s3 sync _build/html s3://www.scalabel.ai/doc --exclude ".DS_Store" --acl public-read
aws s3 sync instructions s3://www.scalabel.ai/doc/instructions --exclude ".DS_Store" --acl public-read
aws s3 sync demo s3://www.scalabel.ai/doc/demo --exclude ".DS_Store" --acl public-read
