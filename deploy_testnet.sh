#!/bin/bash

# build
npm run build

# copy dist to testnet S3
aws s3 sync ./dist/ s3://scan-testnet/ --delete --acl public-read

# invalidate testnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E1R5FZY087SFDR --paths "/*"

