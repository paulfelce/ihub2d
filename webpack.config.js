const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    devtool: 'source-map',
    devServer: {
        port: 8080,
        compress: true,
        contentBase: path.join(__dirname, 'dist')
    }
};
