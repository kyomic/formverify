const polyfill = []
const os = require('os');
const glob = require('glob')
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


/*
let files = glob.sync('./src/lib/ui/**.js');

entry = {};
files = files.filter(res=>{
  return /react/.exec(res)
})

files.map(res=>{
  let name = res;
  name = name.replace(".js",'')
  name = name.replace("./src/lib/ui/",'')
  entry[ name ] = res;
})
console.log(entry)
*/
let makeconfig = function( type ){
  let entry = './src/lib/ui/'+type+'/index.js';  
  let config = {
    entry: entry,
    output:{
      path:`${__dirname}/lib`,
      filename:"index-"+ type +".js",
      library: 'formverify-' + type,
      libraryTarget: 'umd',
      //umdNamedDefine: true,globalObject: 'this'
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
        'framework': JSON.stringify( type ),
        'dev':JSON.stringify(process.env.NODE_ENV)
      }),
      new HtmlWebpackPlugin( { filename: "mvvm.html", template: path.join(__dirname, "./src/mvvm.html") } ),
      //new MiniCssExtractPlugin({filename: 'style.css',})
      
    ],
    optimization: {
      minimize: false
    },
    //关闭 webpack 的性能提示
      //performance: {
      //  hints:false
      //}

      //或者

      //警告 webpack 的性能提示
    performance: {
      hints:'warning',
      //入口起点的最大体积
      maxEntrypointSize: 50000000,
      //生成文件的最大体积
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    }
  }

  config.plugins.push(new VueLoaderPlugin())
  return config;
}


module.exports = [ makeconfig('react'), makeconfig('vue')];
