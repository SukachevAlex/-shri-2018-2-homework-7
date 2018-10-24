const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./client/src/index.js"),
        video: path.resolve(__dirname, "./client/src/monitoring.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    devServer: {
        contentBase: "./dist",
        port: 9000
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(sa|c)ss$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers: ['ie >= 8', 'last 4 version']
                                })
                            ],
                            minimize: true,
                            sourceMap: true,
                        },
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img'
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                exclude: [/src\/fonts/],
                use: [{
                    loader: 'image-webpack-loader',
                    options: {
                        outputPath: 'img',
                        optipng: {
                            enabled: false
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                    },
                }]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin("dist", {}),
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new HtmlWebpackPlugin({
            template: "./client/src/index.html",
            filename: "index.html",
            inject: false
        }),
        new HtmlWebpackPlugin({
            template: "./client/src/video_monitoring.html",
            filename: "video_monitoring.html",
            inject: false
        }),
        new CopyWebpackPlugin([
            { from: './client/src/img', to: 'img' },
            { from: './client/src/data', to: 'data' }
        ])
    ]
}