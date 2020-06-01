#!/bin/bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/dayl_rsa
cd ../
git pull
composer install
npm install
npm build
# rm -rf node_modules/