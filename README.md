# Frulle

## Create and install Slack app

- Copy `config.template.json` to `config.dev.json`.

- Create slack app. Add bot user.

- Install app into workspace. Add a bot user and add scope channels:read.

- Copy bot oath token and paste into config.dev.json env variable for slack.token.

- Deploy bot and set urls for Event api, and interactive components.

- Subscribe to bot events: app_mention, member_joined_channel, member_left_channel, channel_left

## Run local, requires Java (because of dynamodb-local)

    > npm i
    > serverless dynamodb install
    > serverless offline start

## Deploy

    > serverless deploy

## Intgration test

First run `serverless dynamodb start --stage integration`.

Then run `npm run integration`.

The integation tests will mock out the slackAdapter, and use the locally running version of dynamodb started by the first command.

## Todo

