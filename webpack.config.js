const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    
    plugins : [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject : "body"
        })
    ],
    mode: 'production',
    entry: "./src/index.js", // bundle's entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // output directory
        filename: "[name].js" // name of the generated bundle
    },
    devtool: 'source-map',
    devServer: {
        port: 8080,
        compress: true,
        contentBase: path.join(__dirname, 'dist')
    }
};