const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
    {
        mode: 'development',

        optimization: {
            usedExports: true
        },

        entry: {
            main: path.resolve(__dirname, './src/client/client.tsx')
        },

        output: {
            filename: '[name].min.js',
            environment: {
                arrowFunction: false
            },
            path: __dirname + '/docs/js/',
            publicPath: '/js/'
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },

        module: {
            rules: [
                { 
                    test: /\.tsx?$/, 
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' }
            ]
        }
    },

    {
        mode: 'development',

        optimization: {
            usedExports: true
        },

        entry: {
            main: path.resolve(__dirname, './src/client/css/main.scss')
        },

        output: {
            filename: '[name].ignore.min.js',
            environment: {
                arrowFunction: false
            },
            path: __dirname + '/docs/css/',
            publicPath: '/css/'
        },

        resolve: {
            extensions: ['.js'],
        },

        plugins: [new MiniCssExtractPlugin()],

        module: {
            rules: [
                {
                    test: /\.scss$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }
            ]
        }
    }
];