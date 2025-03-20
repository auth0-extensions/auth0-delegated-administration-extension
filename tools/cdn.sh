#!/bin/bash

CURRENT_VERSION=$(node tools/get_version.js)
EXTENSION_NAME="auth0-authz"
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

  if [ -z "$cache_control" ]; then
    aws s3 cp "$local_file" "$s3_path" --region "$REGION" --acl public-read
  else
    aws s3 cp "$local_file" "$s3_path" --region "$REGION" --acl public-read --cache-control "$cache_control"
  fi

  echo "$local_file uploaded to the cdn"
}

upload_bundle() {
  local bundle="$EXTENSION_NAME.extension.$CURRENT_VERSION.js"
  local bundle_local_path="dist/$bundle"
  local bundle_s3_path="$S3_PATH/$bundle"

  if [[ ! -f "$bundle_local_path" ]]; then
      echo "Error: Missing asset - $bundle"
      exit 1
  fi

  if ! file_exists_in_s3 "$S3_PATH" "$bundle"; then
    upload_to_s3 "$bundle_local_path" "$bundle_s3_path" ""
  else
    echo "There is already a $bundle in the cdn. Bundle upload skipped..."
  fi
}

upload_assets() {
  local assets=(
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.js"
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.css"
    "$EXTENSION_NAME.ui.vendors.$CURRENT_VERSION.js"
    "manifest.json"
  )

  if file_exists_in_s3 "$S3_PATH/assets" "${assets[0]}"; then
    echo "There is already a ${assets[0]} in the cdn. Frontend assets upload skipped..."
    return
  fi

  for asset in "${assets[@]}"; do
    local asset_local_path="dist/client/$asset"
    local asset_s3_path="$S3_PATH/assets/$asset"

    if [[ ! -f "$asset_local_path" ]]; then
        echo "Error: Missing asset - $asset"
        exit 1
    fi

    upload_to_s3 "$asset_local_path" "$asset_s3_path" "max-age=86400"
  done
}

aws s3 cp "$S3_PATH/assets/manifest.json" -

#upload_bundle
#upload_assets
