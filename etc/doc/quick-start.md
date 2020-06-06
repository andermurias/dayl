
# First Steps

You have downloaded the code, thats great, bu youll need to do a few little things more...

## Requirements

The requirements to use this project are:

| Requirement       | Version   |
| -----------       | ------:   |
| PHP               | + 7.3     |
| NodeJS            | + 12      |
| Mysql/MariaBD     | + 5.7     | 

| Highly Recomended |
| ----------------- |
| Symfony Console   |
| Yarm              | 
| Yarm              | 

## Install dependencies

Instal Symfony CLI:
````bash
# https://symfony.com/download
curl -sS https://get.symfony.com/cli/installer | bash
````

PHP Dependencies:
```bash
composer install
```

Javascript Dependencies:
```bash
yarn install
# or
npm install
```

## Configure de enviroment

In this project there are two `.env` files, one for the front side, and another one for the backend part.

`.env` and `assets/js/.env`

The code is shipped with the `.env.dist` version of these files, so you need to fill the vars.

Some vars you may want to change:
```
# .env
DATABASE_URL
GOOGLE_API_KEY
GOOGLE_API_SECRET

# ./assets/js/.env
API_URL
GOOGLE_API_KEY
GOOGLE_API_SECRET
```

## Creating keys for JWT

_Documentation from jwt-authentication-bundle bundle_
````bash
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
````

## Preapare de databse

Create the databse
```bash
 ./bin/console doctrine:database:create
``` 

Run the migrations
```bash
 ./bin/console doctrine:migrations:migrate 
``` 

Run the fixtures
```bash
 ./bin/console doctrine:fixtures:load
``` 

## Run the project

Initialize Backend:
```bash
symfony serve --no-tls
```

Initialize Frontend:
````bash
yarn watch
````