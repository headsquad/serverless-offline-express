# Serverless Offline Express

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Serverless v1.x plugin to run HTTP and PubSub functions with [Express](https://github.com/expressjs/express).

This plugin is for you if you want to run offline multiple NodeJS/TypeScript functions, which use request and response Express framework.

Some of serverless services like Google Gloud Functions or Firebase Function use standard Express requests and response on HTTP function invocation, 
and this plugin allow to run them together offline and keep compatible develoment all Express based functions.

## Highlights

* Configuration possibilities range from zero-config 
* Combine in same running Express process all HTTP and PubSub handlers.
* Support TypeScript functions execution
* Express 4 support
* Support NPM and Yarn for packaging
* Hot Module Reload support

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

## Configure function

```yaml
# serverless.yml

# Accessible by URL: /myFunction
functions:
  myFunction:
    handler: handlers/myHandlerFile.myFunctionName
    events:
      - http: 
          path: myHttpUrlPath
          method: GET|PUT|POST|DELETE

# Accessible by URL: /pubsub/myPubSubFunction
  myPubSubFunction:
    handler: handlers/anotherHandlerFile.myPubSubFunctionName
    events:
      - pubsub: 
          topic: myPubSubMessageTopic
```

## Run Express server

```bash
$ serverless express
```

## Environment variables
EXPRESS_HOST - Host name where Express will start
EXPRESS_PORT - Port where Express will start