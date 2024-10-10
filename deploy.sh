#!/usr/bin/env bash
set -e

if [[ "$1" != "prod" ]] && [[ "$1" != "dev" ]] && [[ "$1" != "sandbox" ]]; then
  echo "ERROR: please provide the environment to run (sandbox,dev,prod)"
  exit 1
fi

function run() {
  echo "******** RUNNING ON ENVIRONMENT: $1 ********"
  echo "******** cleaning up ********"
  # yarn clean
  echo "********  building   ********"
  yarn build"-$1"
  echo "********  uploading  ********"

  bucket=s3://app."$1".growloc.farm/
  if [[ $1 == "prod" ]]; then
      bucket=s3://app.growloc.farm/
  fi


  aws s3 sync dist "$bucket" --delete --exclude "*.map" --exclude "index.html" --metadata-directive REPLACE --cache-control public,max-age=31556926
  aws s3 cp dist/index.html  "$bucket" --metadata-directive REPLACE --cache-control max-age=0
}

run "$1"
