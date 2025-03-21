#!/bin/bash

resolve_s3_path() {
    local env="$1"
    local s3_path="s3://assets.us.auth0.com/extensions"

    case "$env" in
        dev)
            echo "$s3_path/develop/$EXTENSION_NAME"
            ;;
        prod)
            echo "$s3_path/$EXTENSION_NAME"
            ;;
        *)
            echo "Invalid environment. Use 'prod' or 'develop'." >&2
            exit 1
            ;;
    esac
}

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

  if [[ "$MODE" != "dev" ]]; then
    if file_exists_in_s3 "$S3_PATH" "$bundle"; then
      echo "There is already a $bundle in the cdn. Bundle upload skipped..."
      return
    fi
  fi

  upload_to_s3 "$bundle_local_path" "$bundle_s3_path" ""
}

upload_assets() {
  local assets=(
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.js"
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.css"
    "$EXTENSION_NAME.ui.vendors.$CURRENT_VERSION.js"
    "manifest.json"
  )

  if [[ "$MODE" != "dev" ]]; then
    if file_exists_in_s3 "$S3_PATH/assets" "${assets[0]}"; then
      echo "There is already a ${assets[0]} in the cdn. Frontend assets upload skipped..."
      return
    fi
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

MODE="$1" # dev or prod
CURRENT_VERSION=$(node tools/get_version.js)
EXTENSION_NAME="auth0-delegated-admin"
REGION="us-west-1"
S3_PATH=$(resolve_s3_path "$MODE")

upload_bundle
upload_assets
