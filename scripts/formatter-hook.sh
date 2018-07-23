#!/bin/bash

files="$(git diff --name-only --cached | grep -E '^(src|test).*\.js$')"
if [[ $files ]];then
  formatDiff="$(esformatter --diff --color $files)"
  if [[ $formatDiff ]];then
    echo "!!!!!Files are not formatted correctly (formatting returned a diff):"
    echo "--------------------------------------------------------------------"
    echo "$formatDiff"
    echo "--------------------------------------------------------------------"
    exit 1
  fi
fi
