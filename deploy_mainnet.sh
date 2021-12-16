#!/bin/bash

# build
NODE_ENV=production npm run build

# copy dist to mainnet S3
aws s3 sync ./dist/ s3://scan-mainnet/ --delete --acl public-read

# invalidate mainnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E2UTVRTVATZB96 --paths "/*"

