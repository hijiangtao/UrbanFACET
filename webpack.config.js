var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common', 'common.js');
var path = require('path');

var publicPath = 'http://localhost:1024/dist';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

// console.log(__dirname)

var devConfig = {
    // 插件项
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    // 页面入口文件配置
    entry: {
        home: ['./public/js/home.js', hotMiddlewareScript]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: publicPath
    },
    devtool: 'source-map',
    module: {
        loaders: [{ 
            test: /\.js$/, 
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            } 
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }, {
            test: /\.css$/,
            loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        }, { test: /\.ejs$/, loader: 'ejs-loader?variable=data' }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
    }
};

module.exports = devConfig;