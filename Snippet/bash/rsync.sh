#!/usr/bin/env bash
# 写法一
set -euxo pipefail

# 写法二
set -eux
set -o pipefail

## 指定目录
src=$1
dest=$2
if [ -z "$src" ]; then
  echo "请指定src的目录"
  exit -1
fi
if [ -z "$dest" ]; then
  echo "请指定dest的目录"
  exit -1
fi

commonList=(
  node_modules
  public
  lib
)

rmList=(
  ${commonList[@]}
  app
)

for item in ${rmList[@]}
do
  rmCommand="${rmCommand} ${item}"
done

rm -rf $rmCommand

exclude=(
  ${commonList[@]}
  .git
)

dExclude=(
  ${commonList[@]}
  migrate.sh
)

for name in ${exclude[@]}
do
  excludeCommand="$excludeCommand --exclude=$name"
done

for name in ${dExclude[@]}
do
  dExcludeCommand="$dExcludeCommand --exclude=$name"
done

rsync -av --progress --delete $dExcludeCommand $src/ $dest/ $excludeCommand

# example
# ./migrate.sh ../hisense/hisense-mobile ./
