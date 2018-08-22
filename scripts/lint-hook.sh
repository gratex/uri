#!/bin/bash

files="$(git diff --name-only --cached --diff-filter=d | grep -E '^(src|test).*\.js$')"
if [[ $files ]];then
  eslint --max-warnings 0 $files
fi
