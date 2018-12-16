/* global __dirname, require, module */

const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');

let libraryName = pkg.name;

let mode;
let fileTemplate;

if (env === 'build') {
    mode = 'production';
    fileTemplate = '[name].min.js';
} else {
    mode = 'development';
    fileTemplate = '[name].js';
}

const config = {
    mode: mode,
    entry: {
        wasync: path.join(__dirname, '/src/index.js'),
        debounce: path.join(__dirname, '/src/debounce.js'),
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: fileTemplate,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this",
    },
    module: {
        rules: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /(\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.json', '.js'],
    },
};

module.exports = config;
