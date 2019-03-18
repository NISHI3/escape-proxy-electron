const path = require('path');

module.exports = {
    mode: 'development', // "production" | "development" | "none"
    target: 'electron-main',
    entry: path.join(__dirname, 'src', 'index'),
    cache: true,
    devtool: 'source-map',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /.ts?$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ],
            loader: 'ts-loader',
        }]
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
};