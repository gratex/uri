#!/bin/bash

files="$(git diff --name-only --cached | grep -E '^(src|test).*\.js$')"
if [[ $files ]];then
  eslint $files
fi