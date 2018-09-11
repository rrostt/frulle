# Frulle

## Create slack app

Create slack app. Add bot user. Copy bot oath token and paste into serverless.yml env variable.

Deploy bot and set urls for Event api, and interactive components.

Subscribe to bot events: app_mention, member_joined_channel, member_left_channel

Add a bot user and add scope channels:read.

## Run local, requires Java (because of dynamodb-local)

> npm i
> serverless dynamodb install
> serverless offline start

## Deploy

> serverless deploy
