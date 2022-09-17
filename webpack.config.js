const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; 访问构造函数

module.exports = {
  mode: "development",
  devtool: "inline-source-map", // 方便查看打包后的源代码
  entry: "./src/index.js",
  output: {
    // filename: "[name].[contenthash].js",
    filename: "dist.js",
    path: path.resolve(__dirname, "dist"), // path工具需要手动导入
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, "src/utils"), // 设置别名
    }
  },
  optimization: {
    minimize: true, // 是否要压缩
    minimizer: [new TerserPlugin()], // 要使用什么工具压缩
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "blog list",
    }),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin() // 导入的是对象,我们要访问同名的构造函数,也可以在导入时就直接访问出来
  ],
  module: {
    rules: [{
        test: /\.css$/i, // 正则匹配以".css"结尾的文件,$的意思是匹配结尾,i的意思是忽略大小写,""./"是因为"."不能直接用,要"\"转义
        use: ["style-loader", "css-loader"], // 使用了哪些loader
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource", // webpack内置了图片loader不需要额外引入
      },
      {
        test: /\.js$/, // 匹配".js"结尾的文件
        exclude: /node_modules/, // 保证不会转译node_modules下边的代码
        use: {
          loader: "babel-loader",
          options: { // options给loader传递配置
            presets: ["@babel/preset-env"], // 自动转译代码
          }
        }
      }
    ]
  }
};