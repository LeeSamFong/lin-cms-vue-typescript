/* eslint-disable */
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackBar = require('webpackbar')

const isProduction = process.env.NODE_ENV === 'production'
const isAnalyzeMode = !!process.env.ANALYZE_MODE

module.exports = {
  configureWebpack: config => {
    // 进度条
    config.plugins.push(
      new WebpackBar(),
    )

    if (isProduction) {
      // 拆分node_modules，充分利用缓存
      setSplitChunks(config)


      // 将太小的chunk整合成一个chunk
      config.plugins.push(
        new webpack.optimize.MinChunkSizePlugin({
          minChunkSize: 10240 * 1, // Minimum number of characters
        }),
      )


      // 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
        }),
      )
    }


    if (isAnalyzeMode) {
      // 添加包分析插件
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      )
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/style/shared.scss";',
      },
    },
  },
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ['vuex-persist'],
}


/**
 * 拆分node_modules，充分利用缓存
 * @param config
 */
function setSplitChunks(config) {
  // 需要单独打包成一个独立chunk的包名
  const singleChunkPackageNames = [
    'element-plus',
    'lodash',
    'core-js',
    'dayjs',
    'swiper',
    'vue-picture-cropper',
  ]


  /**
   *
   * @param packageNames string[] 要搜索的包名列表
   * @param path string 路径
   */
  function packageExist(packageNames, path) {
    const joinName = packageNames.join('|')
    const reg = new RegExp(`[\\\\/]node_modules[\\\\/](${joinName})([\\\\/]|$)`)
    return reg.test(path)
  }


  config.optimization.splitChunks = {
    maxInitialRequests: Infinity,
    // minSize: 300 * 1024,
    chunks: 'all',
    cacheGroups: {
      nodeModulesVendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const path = module.context

          // vue相关的package合并成一个chunk
          const vuePackages = [
            'vue',
            '@vue',
            'vue-router',
            'vuex',

            // 非vue官方的依赖
            'vuex-persist',
          ]
          const vueExists = packageExist(vuePackages, path)
          if (vueExists) {
            return 'chunk-vue'
          }

          // ------------------------------------------------------

          // 其他需要单独打一个包的chunk
          const singleExist = packageExist(singleChunkPackageNames, path)
          if (singleExist) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace('@', '')}`
          }

          // ------------------------------------------------------
          // 其他的全部打进chunk-vendors
          return 'chunk-vendors'
        },
      },
      common: {
        name: 'chunk-common',
        minChunks: 2,
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true,
      },
    },
  }
}
