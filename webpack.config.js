const path = require('path');
const webpack = require('webpack');
const isPrd = process.env.NODE_ENV === 'production';
const customEnv = require('./.' + process.env.NODE_ENV + '.js');

const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  isPrd,
  ...customEnv
};

console.log(
  Object.keys(ENV).reduce((env, key) => {
    env[key] = JSON.stringify(ENV[key]);
    return env;
  }, {})
);

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    diggerswgame: './src/script/main.js',
    farmersworld: './src/farmersworld/main.js'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@waxio/waxjs': path.resolve(__dirname, 'node_modules/@waxio/waxjs'),
      '@': path.resolve(__dirname, 'src/'),
      '@s': path.resolve(__dirname, 'src/script'),
      src: path.resolve(__dirname, 'src/'),
      node_modules: path.resolve(__dirname, 'node_modules/')
    }
  },
  devServer: {
    hot: true,
    port: 8000
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(ENV).reduce((env, key) => {
        env[key] = JSON.stringify(ENV[key]);
        return env;
      }, {})
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    })
  ]
};
