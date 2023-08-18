// const debug = process.env.NODE_ENV !== 'production';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    // plugins: [new BundleAnalyzerPlugin()]
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ],
    externals: { moment: 'moment' },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer')
      }
    }
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_fonts.scss";
          @import "@/scss/_media.scss";
          @import "@/scss/_mixins.scss";
          @import "@/scss/_color.scss";
        `
      }
    }
  }
  // ,
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://api.meter.io:4000/api/", //对应自己的接口
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         "^/api": ""
  //       }
  //     }
  //   }
  // }
};
