#!/bin/bash

# build
NODE_ENV=production npm run build

# copy dist to testnet S3
aws s3 cp ./dist/ s3://scanv2-test/ --recursive --acl public-read

# copy dist to mainnet S3
aws s3 cp ./dist/ s3://scanv2-main/ --recursive --acl public-read

# invalidate testnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E2BSH8388R89SO --paths "/*"

# invalidate mainnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E21GDG24NQ5ZBW --paths "/*"

