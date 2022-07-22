#!/bin/bash

# build
npm run build

# copy dist to testnet S3
aws s3 sync ./dist/ s3://scan-testnet.meter/ --delete --acl public-read

# invalidate testnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E3SX1H5GDFV16U --paths "/*"

