#!/bin/bash

# build
NODE_ENV=production npm run build

# copy dist to mainnet S3
aws s3 sync ./dist/ s3://scan-standby.meter/ --delete --acl public-read

# invalidate mainnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E2JNEV0TMML8NR --paths "/*"

