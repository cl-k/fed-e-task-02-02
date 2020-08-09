# Webpack 打包 vue 项目思路

## 配置打包的公共部分

在 webpack.common.js 中需要使用 loader 去处理各种文件，使用插件去生成 html 页面

```js
const webpack = require('webpack')
const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pathRoot = process.cwd()

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /.(less|css)$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }, {
      test: /\.(png|gif|svg|jpg|jpeg)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          esModules: false,
          name: '[name].[hash:8].[ext]'
        }
      }]
    }, {
      test: /.vue$/,
      use: 'vue-loader',
    }, {
      test: /.js$/,
      include: [path.join(__dirname, 'src')],
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /.(js)$/,
      use: 'eslint-loader',
      enforce: 'pre'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: '"./"'
    }),
    new HtmlWebpackPlugin({
      title: 'vue-app',
      name: 'index.html',
      template: './public/index.html'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      '@': `${pathRoot}/src`,
    },
    extensions: ['.js', '.css', '.less', '.json', '.vue']
  }
}
```

## 配置开发环境

使用 webpack -merge 去合并公共部分的配置，然后针对开发环境，开启 webpack-dev-server 等功能

```js
const webpack = require('webpack')
const {
  merge
} = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-module-source-map',
  devServer: {
    hot: true,
    open: true,
    contentBase: 'public'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})
```

## 配置生产环境的构建任务

```js
const common = require('./webpack.common')
const merge = require('webpack-merge')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['public'])
  ]
})
```

