const path = require('path'),
      webpack = require('webpack');

const smsBotBaseUrl = process.env.SMS_BOT_BASE_URL;

//TODO: remove this, it's better to define explicitly
const minify = process.env.NODE_ENV === 'production';
const production = process.env.NODE_ENV === 'production';


const GLOBALS = {
  __SMS_BOT_BASE_URL__: `'${smsBotBaseUrl}'`
};

module.exports = {
  devtool: 'source-map',
  entry: [
    //disabled these - seems to fix the node polling thing
    // 'webpack-dev-server/client?http://0.0.0.0:3002',
    // 'webpack/hot/dev-server',
    'whatwg-fetch',
    path.resolve(__dirname, './src/js/main.js'),
  ],
  cache: true,
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: "/dist/",
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    ...(production ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })] : []),
    ...(minify ? [
      new webpack.optimize.UglifyJsPlugin(),
    ] : []),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass?outputStyle=compressed']
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
  },
  postcss: function () {
    return [require('autoprefixer'), require('precss')];
  },
  devServer: {
    hot: true,
    outputPath: path.join(__dirname, '/dist'),
    host: "0.0.0.0",
    port: 3002
  }
};
