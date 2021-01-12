#!/bin/bash

# deploy testnet scanv2
VUE_APP_API_ENDPOINT=http://api.meter.io:4000/api yarn build
aws s3 cp ./dist/ s3://scanv2-test/ --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id E2BSH8388R89SO --paths "/*"

# deploy mainnet scanv2
VUE_APP_API_ENDPOINT=http://api.meter.io:5000/api yarn build
# copy the build for mainnet result to s3
aws s3 cp ./dist/ s3://scanv2-main/ --recursive --acl public-read
# invalidate cloudfront cache to refelct the currect deployment
aws cloudfront create-invalidation --distribution-id E21GDG24NQ5ZBW --paths "/*"

