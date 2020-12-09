#!/bin/bash

VUE_APP_API_ENDPOINT=http://bridge-api.meter.io:5000/api yarn build
# copy the build result to s3
aws s3 cp ./dist/ s3://mainnet-scanv2/ --recursive --acl public-read
# invalidate cloudfront cache to refelct the currect deployment
aws cloudfront create-invalidation --distribution-id E11QMMPTF4I2LE --paths "/*"