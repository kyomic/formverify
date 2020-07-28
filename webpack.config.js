const polyfill = []
const os = require('os');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const resolve = dir => path.resolve(__dirname, dir);
const webpack = require('webpack')

const isDev = process.env.NODE_ENV == 'development'
const WEB_ENV = process.env.WEB_ENV;

let productionDir = `${__dirname}/dist`;
if( os.type() !='Windows_NT'){
  productionDir = `/mnt/market/html5video/`
}

let entry = '';
if( WEB_ENV == 'react'){
  entry = './src/index.react.js'
}else{
  entry = './src/index.vue.js'
}
const config = {
  entry: entry,
  output: {
    path: isDev ? `${__dirname}/dist`:productionDir,
    filename: 'index.js',
  },
  resolve: {
    // 设置别名
    extensions: ['.js', '.jsx'],
    alias: {
      '@': resolve('src')// 这样配置后 @ 可以指向 src 目录
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      { 
        test:/\.styl(us)?$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
            //选项的作用使用来提高效率的。
          },
          'stylus-loader'
        ]
      },
      { 
        test:/\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
            //选项的作用使用来提高效率的。
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.(jsx)$/, exclude: /node_modules/, loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader', query: {compact: false}
      }, 
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test:/\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.(png|jpe?g|gif|psd|svg|icon)$/,
　　　　loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      }
    ]
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'framework': JSON.stringify(process.env.WEB_ENV),
      'dev':JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin( { filename: "mvvm.html", template: path.join(__dirname, "./src/mvvm.html") } ),
    //new MiniCssExtractPlugin({filename: 'style.css',})
    new webpack.HotModuleReplacementPlugin()
    
  ],
  devServer: {   
    //contentBase: false, // boolean | string | array, static file location
    contentBase:"./dist",
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    host:"0.0.0.0"
    // ...
  },
  optimization: {
    minimize: false
  }
}

config.plugins.push(new VueLoaderPlugin())

module.exports = config;
