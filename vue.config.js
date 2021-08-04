// eslint-disable-next-line
const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        // eslint-disable-next-line
        /element-plus[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]en/,
        'element-plus/lib/locale/lang/zh-cn',
      ),
    ]
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
