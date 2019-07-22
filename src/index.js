'use strict';

const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const { exec } = require('child_process');

const express = require('express');
const ServerlessWebpack = require('serverless-webpack');

class OfflineExpress {

    constructor(serverless, options) {
        this.serverless = serverless;
        this.service = serverless.service;
        this.serverlessLog = serverless.cli.log.bind(serverless.cli);
        this.options = options;
        this.exitCode = 0;

        this.commands = {
            express: {
                usage: 'Running offline multiple Express request/response based Serverless functions',
                lifecycleEvents: ['start']
            },

        };

        this.hooks = {
            'express:start': this.start.bind(this),
        };
    }

    async buildServer() {
        var webpackPlugin = new ServerlessWebpack(this.serverless, this.options);
        await webpackPlugin.validate();
        await webpackPlugin.compile();
        var app = express();
        const functionsBasePath = webpackPlugin.webpackOutputPath;
        console.log();
        webpackPlugin.entryFunctions.forEach(functionObject => {
            console.debug(functionObject);
            var handler = require(path.join(functionsBasePath, functionObject.funcName, functionObject.handlerFile));
            
            functionObject.func.events.forEach((event) => {
                if (event && typeof event.http === 'object') {
                    var method = 'get';
                    var path = '/';
                    if (typeof event.http.method === 'string') {
                        method = event.http.method.toLowerCase();
                        if(method === '*') {
                            method = 'all';
                        }
                    }
                    if (typeof event.http.path === 'string') {
                        path += event.http.path;
                    }
                    this.serverlessLog('Assign function:' + functionObject.funcName + ' to ' + method.toUpperCase() + ' ' + path);
                    var handlerFunctionName = functionObject.funcName;
                    if(functionObject.func.handler.includes('.')) {
                        handlerFunctionName = functionObject.func.handler.split('.')[1];
                    }
                    
                    app[method](path, handler[handlerFunctionName]);
                }
            })

        });

        return app;
    }

    async start() {
        process.env.IS_OFFLINE = true;
        const PORT = (process.env.EXPRESS_PORT) ? process.env.EXPRESS_PORT : 3000;
        const HOST = (process.env.EXPRESS_HOST) ? process.env.EXPRESS_HOST : 'localhost';
        var server = await this.buildServer();
        var logger = this.serverlessLog;
        server.listen(PORT, function () {
            console.log();
            logger('Offline Express server started at http://' + HOST + ':' + PORT);
        })
        return new Promise(() => { });
    }

    end() {
    }

}
process.removeAllListeners('unhandledRejection');

module.exports = OfflineExpress;
