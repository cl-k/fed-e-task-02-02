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