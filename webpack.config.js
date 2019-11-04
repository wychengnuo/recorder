const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        // host: '192.168.199.224',
        port: 9000,
        proxy: {
            '/api/test': {
                // target: 'http://192.168.199.227:9800/',
                target: 'http://192.168.199.227:9000/',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/test': 'm/v1/test'
                // }
            }
        }
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: '[name].[ext]',
                            publicPath: 'images',
                            // outputPath: 'images'
                        }
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            // limit: 8192,
                            name: '[name].[ext]',
                            publicPath: 'images',
                            outputPath: 'images'
                        }
                    }
                ]
            },
            {
                test: '/\.js$/',
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
    ]
}