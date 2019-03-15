#!/usr/bin/env bash

command=$1
dll_manifest='./public/dll/manifest.json'

if [ -f "$dll_manifest" ]; then
  eval $command
else
  eval "npm run dll && $command"
fi
