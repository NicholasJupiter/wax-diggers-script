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
      excludeChunks: []
    }
  }
};

if (isPrd) {
  if (!prdConfig.pages.app.excludeChunks) {
    prdConfig.pages.app.excludeChunks = ['script'];
  } else {
    prdConfig.pages.app.excludeChunks.push('script');
  }
}

module.exports = {
  outputDir: 'dist/diggerswgame-iframe',
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    devtool: !isPrd ? 'source-map' : undefined
    // plugins: [new webpack.ProvidePlugin({ $: 'jquery' })]
  },
  chainWebpack(config) {
    config.entry('script').add(r('./src/script/main.js'));
    config.entry('farmers').add(r('./src/farmersworld/main.js'));
    config.output.filename((pathData) => {
      // if (pathData.chunk.name === 'script') {
      //   return 'diggerswgame.js';
      // }
      return 'js/[name].[hash].js';
    });
  },
  ...prdConfig
};
