const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const midwareDev = require('webpack-dev-middleware')

module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    watch: true,
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx'
        ]
    },
    mode: 'development',
    output: {
        publicPath: './.webpack'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
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