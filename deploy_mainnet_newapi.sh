#!/bin/bash

# build
NODE_ENV=production npm run build

# copy dist to mainnet S3
aws s3 cp ./dist/ s3://scanv2-main-newapi/ --recursive --acl public-read

# invalidate mainnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E2BSH8388R89SO --paths "/*"

