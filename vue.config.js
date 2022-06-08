const { resolve } = require('path');
const webpack = require('webpack');
const r = (path) => resolve(__dirname, path);
const isPrd = process.env.NODE_ENV === 'production';

const prdConfig = {
  pages: {
    app: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      // chunk:['chunk-vendors', 'driggers'],
      excludeChunks: ['script']
    }
  }
};

// if (isPrd) {
//   if (!prdConfig.pages.app.excludeChunks) {
//     prdConfig.pages.app.excludeChunks = ['script'];
//   } else {
//     prdConfig.pages.app.excludeChunks.push('script');
//   }
// }

module.exports = {
  outputDir: 'dist/games-iframe',
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    devtool: !isPrd ? 'source-map' : undefined,
    // plugins: [new webpack.ProvidePlugin({ $: 'jquery' })]
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@s',r('./src/script'));
    config.entry('script').add(r('./src/script/main.js'));
    config.output.filename((pathData) => {
      return 'js/[name].[hash].js';
    });
  },
  ...prdConfig
};
