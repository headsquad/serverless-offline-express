# Serverless Offline Express

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Serverless v1.x plugin to run HTTP functions with [Express](https://github.com/expressjs/express).

This plugin is for you if you want to run offline multiple NodeJS functions, which use request and response Express framework.

Some of serverless services like Google Gloud Functions or Firebase Function use standard Express requests and response on HTTP function invocation, 
and this plugin allow to run them together offline and keep compatible develoment all Express based functions.

## Highlights

* Configuration possibilities range from zero-config to fully customizable
* Combine in same running process all HTTP handlers based on Express request/response.
* Express 4 support
* Support NPM and Yarn for packaging

## Install

```bash
$ npm install serverless-offline-express --save-dev
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-offline-express
```

## Configure

Plugin not support yet any configuration.

## Run Express server

### Configure function

Thi plugin compatible with AWS Serverless functions configuration:

```yaml
# serverless.yml
functions:
  myFunction:
    handler: handlers/myHandlerFile.myFunctionName
    events:
      - http: 
          path: myHttpUrlPath
          method: GET|PUT|POST|DELETE
```

### Run

```bash
$ serverless express
```