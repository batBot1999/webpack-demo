# webpack是一个模块打包工具,可以把互相依赖的html、css、js、以及图片字体等资源文件,经过一系列的处理打包成静态的前端项目.

# 为什么用webpack
我们在传统的网页开发项目中,需要在html中引入大量的js、css等文件,不仅会有命名冲突还会使页面体积变大,因为第三方库很多时候不是按需引入而是加载所有代码,而在nodejs出现之后,js项目支持通过require进行模块化开发,并且支持npm方便地管理依赖,对于react和vue这种组件化的开发方式,因为有很多分散的文件,就特别需要这样的构建操作,也就是需要webpack来进行构建操作,把js模块化的代码转化为浏览器可执行的代码,提供了import、exportES6模块化的语法支持,然后通过分析代码中import导入的依赖,把需要的代码加载进来,在webpack中任何文件都可以通过import导入,只要有对应的loader支持就可以,在打爆过程中还可以通过插件干预打包过程,例如剔除不必要的代码,形成体积更小的项目.

### 创建项目
确保安装了nodejs
在合适的文件目录下,mkdir blog,创建blog文件夹,cd blog进入文件夹,输入yarn init -y,生成package.json文件并取默认值,添加webpack依赖:
  yarn add webpack webpack-cli --dev
--dev的意思是把依赖放进开发者依赖中,因为webpack只有开发时才用到,最后打包成的代码里不需要再使用webpack
用vscode打开blog文件夹,根目录中新建src目录存放源代码,src中新建index.js文件,编写简单的测试代码:
  console.log("hello world");
在根目录下创建inex.html文件,在这里边加载index.js文件,快速创建:html:5然后自动补全,body中添加script标签,src属性为"./src/index.js",body内添加一个"<h1>hello world</h1>"用于测试,接下来启动live server,可以看到hello world在网页中,打开f12也可以看到console出来的hello world.

### 首次打包
命令行输入 npx webpack,打包完成后可以看到生成的dist文件夹,把index.html:
```js
  <script src="./dist/main.js"></script>
```
因为后边要是用的都是打包后的js文件,src下新建data.js文件:
```js
export function getBlogPosts() {
  return ["blog1", "blog2", "blog3"];
}
```
然后index.js中引用:
```js
import { getBlogPosts } from "./data";
console.log(getBlogPosts());
```
执行npx webpack,可以看到main.js中:
```js
(()=>{"use strict";console.log(["blog1","blog2","blog3"])})();
```
说明webpack智能地判断了代码的逻辑,然后分析代码的执行逻辑,最后得出打印了blog list数据,在index.html中运行live server也可以看到效果.

### webpack最关键的配置项
在根目录创建webpack.config.js文件作为配置项,这个文件里使用nodejs的模块化语法:
```js
  const path = require("path");

  module.exports = {
    mode: "development", // 开发环境,方便调试
    entry: "./src/index.js", // 入口文件
    output: { // 打包后的文件名
      filename: "dist.js",
      path: path.resolve(__dirname, "dist"), // path工具需要手动导入,第一个参数多级目录,第二个参数放在哪
    },
  }
```
打包后发现dist文件夹里多了一个dist.js文件,接下来把index.html的文件引入改成:
```js
  <script src="./dist/dist.js"></script>
```
再删除dist文件夹下边的main.js文件,
删除index.html中<h1>标签,在修改index.js中代码,根据获取到的bloglist数据生成一组ul和li元素展示:
```js
const blogs = getBlogPosts();

const ul = document.createElement("ul");
blogs.forEach(blog => {
  const li = document.createElement("li");
  li.innerHTML = blog;
  ul.appendChild(li);
});
document.body.appendChild(ul);
```
这样就在js里边创建好了html元素,运行npx webpack,再到index.html运行live server,浏览器中可以看到三个li.

### 加载css
在src下新建style.css文件,随便加点儿样式:
```css
* {
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}

body {
  display: grid;
  place-items: center;
}

li {
  padding: 12px;
}

img {
  max-width: 500px;
}
```
在index.js中导入进去,这样就可以充分利用webpack特性,如果在index.html中导入,那就和普通导入css无区别了,就不能对css样式进行优化或操作,index.js中:
```js
import "./style.css";
```
此时npx webpack看看不使用loader是什么效果,果然报错了,显示需要一个合适的loader才可以:
  yarn add --dev style-loader css-loader
几乎所有和webpack有关的依赖都需要安装在开发者依赖中,因为打包后不需要它,
安装完成后需要在webpack.config.js中配置loader,在导出的对象里添加新的module配置项:
```js
module: {
  rules: [ // rules是一个数组,包含很多对象,每个对象就是一个loader的配置,每个配置都包含使用loader的扩展名和使用loader相关的选项,
    {
      test: /\.css$/i, // 正则匹配以".css"结尾的文件,$的意思是匹配结尾,i的意思是忽略大小写,""./"是因为"."不能直接用,要"\"转义
      use: ["style-loader", "css-loader"], // 使用了哪些loader
    }
  ]
}
```
运行npx webpack,再看浏览器,样式生效,像是其他的sass等css预处理也是这样装loader来配置.

### 配置图片等静态资源
因为对于图片等静态资源,webpack原生支持所以不需要安装loader,只需要加一个配置对象就好了:
```js
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource", // webpack内置了图片loader不需要额外引入
      },
```
测试一下,在src下新建asset文件夹,asset文件夹中新建images文件夹,丢进去一张图片,然后去index.js中创建img元素:
```js
import HeroImage from "./asset/images/qq.jpg";

const image = document.createElement("img");
image.src = HeroImage;
document.body.prepend(image); // 放在开头
```
打包一下,npx webpack,然后浏览器就可以看到图片了.

### plugin 插件
index.html是手写的,很容易出错,需要同步src下边的路径,而webpack有一个插件可以自动生成html文件,就不需要手动写html代码，这个插件叫做html-webpack-plugin,输入:
  yarn add html-webpack-plugin --dev,
 --dev"的意思是在开发者模式中.
安装完成后,在webpack配置项webpack.config.js中使用这个插件,顶部引入:
  const HtmlWebpackPlugin = require("html-webpack-plugin");
在配置对象里边添加plugins配置项,他的值是一个数组,里边可以加载多种插件,上边HtmlWebpackPlugin导出的是一个构造函数,所以此处new调用他就加载好了这个插件:
  plugins: [new HtmlWebpackPlugin()],
然后运行npx webpack,dist目录下多了一个index.html,这个就是webpack帮我们自动生成的html代码,在这个文件内启动live server就可以看到效果了,当然"new HtmlWebpackPlugin()"括号内可以传递参数:
```js
  plugins: [new HtmlWebpackPlugin({
    title: "blog list",
  })],
```
比如title,再执行npx webpack,可以看到网页标题就是"blog list".

### babel
在开发前端项目时,可能会使用新的js特性,但为了兼容低版本浏览器,可以利用babel来转译代码,webpack也支持相应的loader,首先安装babel-loader,命令行执行:
  yarn add --dev babel-loader @babel/core @babel/preset-env
需要安装这个三个.
在webpack配置项webpack.config.js中,新添加一个loader的配置:
```js
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
```
然后在导出的对象里设置一个devtool:
devtool: "inline-source-map", // 方便查看打包后的源代码
注意index.js中使用了箭头函数作为forEach的回调函数,但在es6之前,是不支持箭头函数的,这样打包后应该转化成普通函数.
查看dist.js,ctrl+f搜索"/src/index.js",可以看到：
blogs.forEach(function (blog) {
  var li = document.createElement("li");
  li.innerHTML = blog;
  ul.appendChild(li);
});
箭头函数被转换成了普通的匿名函数的形式,说明babel-loader生效了.

### 压缩打包后的js代码,可以减少打包后的体积
这个功能需要插件"terser-webpack-plugin",命令行输入:
  yarn add --dev terser-webpack-plugin
安装完成后,在webpack配置项webpack.config.js中配置插件,首先导入进来:
  const TerserPlugin = require("terser-webpack-plugin");
然后在导出的对象里设置:
  optimization: {
    minimize: true, // 是否要压缩
    minimizer: [new TerserPlugin()], // 要使用什么工具压缩
  },
打开dist.js可以看到代码被压缩了,空白去掉了,变量简化的形式,后边还加了一大坨加密字符.

### 开发时,每次改动js之后都要重新打包,webpack提供了一个dev server开发服务器,在其启动之后,若果我们修改了js代码,他就会自动重新打包,并刷新页面.
首先安装他:
  yarn add --dev webpack-dev-server
接下来指定dev-server从哪里加载代码,打开webpack配置项webpack.config.js,配置项中添加devServer配置项:
  devServer: {
    static: "./dist",
  },
为了方便运行开发服务器,我们在package.json里新添加一个script:
  "scripts": {
    "start": "webpack serve --open"
  },
我们再去改一下index.js的代码,测试是否会重新打包,代码底部新加:
```js
  const h1 = document.createElement("h1");
  h1.innerText = "blog list";
  document.body.appendChild(h1);
  const h1 = document.createElement("h1;")
```
打包后的文件名就是dist.js每次都是一样的,浏览器会根据文件名进行缓存,为了避免浏览器进行缓存,会给文件名加上一串随机的字符,每次更新后都改为新的字符,在导出的对象里设置filename就可以实现在打包后自动生成新的一串字符,原来:
```js
filename: "dist.js",
```

现在:
```js
output: {
  filename: "[name].[contenthash].js",
  path: path.resolve(__dirname, "dist"),
},
```
[name]也可以写死,但是webpack会自动将其替换成文件名,[contenthash]会根据文件的内容进行hash计算得到不重复的字符,所以每次打包的时候,文件变化,hash就会变化.

### 如何给导入的路径设置别名
有时js文件所在的目录嵌套层级比较深,要引入其他目录下边的js文件,要使用大量的"/"和"."来访问相对路径,但webpack提供了路径别名,就可以把相对路径替换掉,这样可以少写很多字符串,在导出的对象里设置:
```js
  resolve: {
    alias: {
      utils: path.resolve(__dirname, "src/utils"), // 设置别名
    }
  },
```
  别人引用的时候就可以用:
```js
  import { dateToStr } from "utils/date";
  console.log(dateToStr(方法));
```

### 有时需要分析打包后的结果,那个文件体积比较大,可以进行针对性优化,webpack有一个可视化的打包分析工具
安装:
  yarn add --dev webpack-bundle-analyzer
安装完成后,打开webpack配置项webpack.config.js把它导入进来:
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
它是一个插件所以我们把他放到plugin数组中:
```js
    plugins: [
    new HtmlWebpackPlugin({
      title: "blog list",
    }),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin()
  ],
```
导入的是对象,我们要访问同名的构造函数,也可以在导入时就直接访问出来:
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
他会在我们运行npx webpack时自动打开
可以看到index.js体积最大.

test
