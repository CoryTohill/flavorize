#! /bin/sh
git checkout -b gh-temp
gulp dist
echo '!dist' > .gitignore
git add -A
git commit -m "lib for gh-pages"
git subtree split --prefix dist -b gh-pages
git push origin gh-pages --force
git checkout master
git branch -D gh-temp
git branch -D gh-pages
