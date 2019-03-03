#!/usr/bin/env bash

command=$1
dll_manifest='./public/dll-manifest.json'

if [ -f "$dll_manifest" ]; then
  $command
else
  npm run dll && $command
fi
