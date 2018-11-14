var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/scss/main.scss', './src/js/app.js'],
  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['@babel/preset-env']
      }
    },
    {
      test: /\.(sa|sc)ss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: [
            postcssPresetEnv({
              browsers: ['>1%']
            }),
            require('cssnano')()
          ]
        }
      },
      {
        loader: 'sass-loader'
      }
      ]
    }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.min.css'
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: 'js/[name].js.map',
    })
  ],
  stats: {
    colors: true
  },
  target: 'node'
};