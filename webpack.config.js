const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
module.exports = {
    target: 'node',
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx'
        ]
    },
    mode: 'production',
    output: {
        libraryTarget: 'commonjs',
        filename: '[name].js',
        path: path.resolve('.express')
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
            }
        ]
    }
};