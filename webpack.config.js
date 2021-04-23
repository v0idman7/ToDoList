const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () =>{
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (isProd){
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCSSExtractPlugin.loader
    },
    'css-loader'
  ]
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }
  if (preset) {
    opts.presets.push(preset)
  }
  return opts
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',  //по умолчаниию запускать в режиме разработки
  entry: {
    main: ['@babel/polyfill', './index.js']
  },
  output: {
    filename: filename('js'),  //имя файла js на выходе
    path: path.resolve(__dirname, 'dist') //его путь
  },
  resolve: {
    extensions: ['.js', '.json'], //по умолчанию подставляет расширения (если не хочешь писать расширение добавь сюда)
    alias: {
      '@fonts': path.resolve(__dirname, 'src/fonts'), //переопределение путей вместо src/fonts - @fonts
      '@images': path.resolve(__dirname, 'src/images'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  //devtool: isDev ? 'source-map' : '',
  plugins:  [
    new HTMLWebpackPlugin({
      template: './index.html',  //исходный html
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),  //для очистки после каждой сборки
    new CopyWebpackPlugin({
      patterns: [
      {
        from: './images/content', //откуда и куда копировать при сборке
        to: '../dist/images/content'
      },
      {
        from: './scripts', //откуда и куда копировать при сборке
        to: '../dist/scripts'
      }
    ]}),
    new MiniCSSExtractPlugin({
      filename: filename('css')
    }),
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),
  ],
  module: {
    rules: [
      { 
        test: /\.css$/,
        use: cssLoaders()
      },
      { 
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      { 
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/design/'
          }
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts'
          }
        }
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      }
    ]
  }
}