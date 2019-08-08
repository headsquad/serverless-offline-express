'use strict';

const express = require('express');
const webpack = require('webpack');
const BbPromise = require('bluebird');
const webpackConfig = require('../webpack.config');

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
            }
        };

        this.hooks = {
            'express:before:start': BbPromise.resolve(),
            'express:start': this.start.bind(this),
        };
    }

    async buildServer() {

        var entries = {};
        this.serverless.service.getAllFunctions().forEach((functionName) => {
            var functionObject = this.serverless.service.getFunction(functionName);
            entries[functionName] = './'+functionObject.handler.split('.')[0]+'.ts';
        });
        webpackConfig.entry = entries;
        var app = express();
        const compiler = webpack(webpackConfig).watch({},(err, stats)=>{
                stats.toJson().chunks.forEach((chunk)=>{
                var Module = module.constructor;
                var handlerModule = new Module();
                handlerModule._compile(chunk.modules[0].source, 'express');
                var handler = handlerModule.exports;
                var functionObject = this.serverless.service.getFunction(chunk.id);
                functionObject.events.forEach((event) => {
                    if (event && typeof event.http === 'object') {
                        var method = 'get';
                        var path = '/';
                        if (typeof event.http.method === 'string') {
                            method = event.http.method.toLowerCase();
                            if (method === '*') {
                                method = 'all';
                            }
                        }
                        if (typeof event.http.path === 'string') {
                            path += event.http.path;
                        }
                        this.serverlessLog('Assign function:' + functionObject.name + ' to ' + method.toUpperCase() + ' ' + path);
                        var handlerFunctionName = functionObject.name;
                        if (functionObject.handler.includes('.')) {
                            handlerFunctionName = functionObject.handler.split('.')[1];
                        }
                        app[method](path, handler[handlerFunctionName]);
                    }
                })
            });
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
            logger('Offline Express started at http://' + HOST + ':' + PORT);
        })
        return new Promise(() => { });
    }

    end() {
    }

}
process.removeAllListeners('unhandledRejection');

module.exports = OfflineExpress;
