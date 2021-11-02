#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 拉取 npm 包
npm install

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
echo 'tama.wiki' > CNAME

gitUrl=https://mifengjun:${GITHUB_TOKEN}@github.com/mifengjun/mifengjun.github.io.git

git init
git add -A
git commit -m 'deploy'
git config --global user.name "mifengjun"
git config --global user.email "522622782@qq.com"

# 如果发布到 https://<USERNAME>.github.io
git push -f $gitUrl master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
