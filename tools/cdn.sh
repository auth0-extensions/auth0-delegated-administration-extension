#!/bin/bash

CURRENT_VERSION=$(node tools/get_version.js)
EXTENSION_NAME="auth0-delegated-admin"
REGION="us-west-1"
S3_PATH="s3://assets.us.auth0.com/extensions/$EXTENSION_NAME"

file_exists_in_s3() {
  local bucket_path=$1
  local file_name=$2

  aws s3 ls "$bucket_path/$file_name" --region "$REGION" | grep -q "$file_name"
}

upload_to_s3() {
  local local_file=$1
  local s3_path=$2
  local cache_control=$3

#  if [ -z "$cache_control" ]; then
#    aws s3 cp "$local_file" "$s3_path" --region "$REGION" --acl public-read
#  else
#    aws s3 cp "$local_file" "$s3_path" --region "$REGION" --acl public-read --cache-control "$cache_control"
#  fi

  echo "aws s3 cp $local_file $s3_path --region $REGION --acl public-read --cache-control $cache_control"

  echo "$local_file uploaded to the cdn"
}

upload_bundle() {
  local bundle="$EXTENSION_NAME-$CURRENT_VERSION.js"

  if ! file_exists_in_s3 "$S3_PATH" "$bundle"; then
    local bundle_local_path="dist/$bundle"
    local bundle_s3_path="$S3_PATH/$bundle"

    upload_to_s3 "$bundle_local_path" "$bundle_s3_path" ""
  else
    echo "There is already a $bundle in the cdn. Skipping cdn publish..."
  fi
}

upload_assets() {
  local assets=(
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.js"
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.css"
    "$EXTENSION_NAME.ui.vendors.$CURRENT_VERSION.js"
    "manifest.json"
  )

  for asset in "${assets[@]}"; do
    local asset_local_path="dist/client/$asset"
    local asset_s3_path="$S3_PATH/assets/$asset"

    if ! file_exists_in_s3 "$S3_PATH/assets" "$asset"; then
      upload_to_s3 "$asset_local_path" "$asset_s3_path" "max-age=86400"
    else
      echo "There is already a $asset in the cdn. Skipping cdn publish..."
    fi
  done
}

aws s3 ls "$S3_PATH"
upload_bundle
upload_assets
