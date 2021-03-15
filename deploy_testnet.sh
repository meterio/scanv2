#!/bin/bash

# build
npm run build

# copy dist to testnet S3
aws s3 cp ./dist/ s3://scanv2-test/ --recursive --acl public-read

# invalidate testnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E21GDG24NQ5ZBW --paths "/*"
