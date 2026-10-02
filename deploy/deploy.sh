#!/usr/bin/env bash
# Build the static export and publish it to S3 + CloudFront.
#
# Required env vars:
#   NEXT_PUBLIC_API_URL         deployed backend base URL (https://...)
#   S3_BUCKET                   bucket name, without s3://
#   CLOUDFRONT_DISTRIBUTION_ID  distribution in front of the bucket
set -euo pipefail

: "${NEXT_PUBLIC_API_URL:?set NEXT_PUBLIC_API_URL}"
: "${S3_BUCKET:?set S3_BUCKET}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?set CLOUDFRONT_DISTRIBUTION_ID}"

cd "$(dirname "$0")/.."

# Shell env wins over .env.local, so the build always uses the API URL above
npm ci
npm run build

# Hashed assets first, cached for a year; HTML that references them goes up after
aws s3 sync out/_next/static "s3://$S3_BUCKET/_next/static" \
  --cache-control "public,max-age=31536000,immutable"

# Everything else must revalidate so new deploys show up immediately.
# Old _next/static chunks are kept for tabs still running the previous build.
aws s3 sync out "s3://$S3_BUCKET" --delete \
  --exclude "_next/static/*" \
  --cache-control "public,max-age=0,must-revalidate"

aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --query "Invalidation.Id" --output text
