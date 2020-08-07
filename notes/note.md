# 模块化开发与规范化标准

模块化开发是当下最重要的前端开发范式之一。项目代码需要花费大量时间管理，模块化通过把代码按照功能的不同划分为不同的模块，单独进行维护，从而提高效率，降低维护成本。

模块化是一种思想。

## 模块化演变过程

- Stage 1 - 文件划分的方式。

  将每个功能以及它相关的状态数据单独存放到不同文件中，去约定每一个文件就是一个独立的模块，使用时将模块引入到页面文件中，一个 script 就对应一个模块。早期模块化完全依靠约定

  缺点：

  - 污染全局作用域，没有独立的私有空间
  - 存在命名冲突问题
  - 无法管理模块的依赖关系

- Stage 2 - 命名空间方式

  约定每个模块只暴露一个全局对象，所有模块成员都挂载在这个全局对象上。可以减少命名冲突，但这种方式仍然没有私有空间，模块成员仍然可以在外部被访问被修改，模块之间的依赖关系也没有得到解决

- Stage3 - IIFE

  使用立即执行函数的方式去为模块提供私有空间。将模块中每一个成员都放在一个函数提供的私有作用域当中，对于需要暴露给外部的成员可以通过挂载到全局对象上的方式去实现。这种方式实现了私有成员的概念，私有成员只能在模块内部的成员通过闭包的方式去访问，在外部无妨访问到，确保了私有变量的安全。可以利用立即执行函数的参数去作为依赖声明去使用，使得每一个模块之间的依赖关系更明显

以上三种是早期没有工具和规范情况下对模块化的落地方式

模块化标准 + 模块加载器

### CommonJS  规范

node 所提出的一套标准，在 node.js 中所有模块化代码必须要遵循 CommonJS 规范。ComminJS 是以同步模式加载模块，在浏览器端使用导致效率低下

- 一个文件就是一个模块
- 每个模块都有单独的作用域
- 通过 module.exports 导出成员
- 通过 require 函数载入模块

### AMD（Asynchronous Module definition）异步模块定义规范

目前绝大多数第三方库都支持 AMD 规范

- AMD 使用起来相对复杂
- 模块 JS 文件请求频繁，页面效率低下
## 模块化标准规范——模块化的最佳实践

node 环境中遵循 CommonJS 规范

浏览器环境中遵循 ES Modules 规范（ES6 定义），存在兼容那个问题，随着 Webpack 等一些打包工作的流行，该规范才普及。

### ES Modules 的基本特性

- 自动采用严格模式，忽略 ‘use strict'
- 每个 ESM 模块都是单独的私有作用域
- ESM 是通过 CORS 去请求外部 JS 模块的
- ESM 的 script 标签会延迟执行脚本

### ES Modules 导出与导入

```js
// ./module.js
const foo = 'es modules'
export { foo }

// ./app.js
import { foo } from './module.js'
console.log(foo) // => es modules
```

### ES Modules 浏览器环境 Polyfill

使用 browser-es-module-loader 这个包来解决，可以 npm 安装，也可以引入。如果浏览器不支持 Promise 还需要引入 promise-polyfill

[browser-es-module-loader](https://unpkg.com/browse/browser-es-module-loader@0.4.1/dist/)

```html
<body>
  <script src="https://unpkg.com/browse/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
  <script src="https://unpkg.com/browse/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
  <script type="module">
    import { foo } from './module.js'
    console.log(foo)
  </script>
</body>

```

只适合开发阶段这样使用

### ES Module in Node

- js 文件的扩展命需要改为 .mjs

- 启动 node 是需要加上 --experimental-modules 的参数

  ```bash
  $ node --experimental-modules index.mjs
  ```

与 CommonJS 交互

- ES Modules 中可以导入 CommonJS 模块
- CommonJS 中不能导入 ES Modules 模块
- CommonJS 始终只会导出一个默认成员
- 注意 import 不是解构导出对象

Babel 兼容方案

```bash
$ yarn add @babel/node @babel/core @babel/preset-env --dev
$  node_modules\.bin\babel-node index.js --presets=@babel/preset-env

## 也可以创建.babelrc 文件配置参数
## { "presets": ["@babel/preset-env"] } 然后运行时就不用加参数啦
$ node_modules\.bin\babel-node index.js
```

preset-env 是一个插件集合，也可以使用单独的插件来处理 plugin-transform-modules-commonjs

```bash
$ yarn add @babel/plugin-transform-modules-commonjs --dev

## .babelrc
{
  "plugins": ["@babel/plugin-transform-modules-commonjs"]
}
```




## 常用的模块化打包工具

### 模块化工具的由来

- ES Modules 存在环境兼容问题
- 模块文件过多，网络请求频繁
- 所有的前端资源都需要模块化

综上，模块化是必要的

模块化工具：

- 能够编译具有新特性的 JS 代码（新特性代码编译）
- 能够将散落的文件打包到一起，解决频繁请求模块文件的问题（模块化 JavaScript 打包）
- 需要支持不同种类的资源文件类型（支持不同类型的资源模块）

## Webpack 打包

### Webpack  快速上手

```bash
$ yarn init --yes
$ yarn add webpack webpack-cli --dev
$ yarn webpack --version
$ yarn webpack
```

```json
// package.js
"scripts": {
	"build": "webpack"
}
```

```bash
$ yarn build
```

### Webpack 配置文件

默认约定是将 src/index.js 作为默认打包入口，最终打包结果存放到 dist/main.js

但需要配置时可以在根目录下创建 webpack.config.js 文件进行配置，该文件是运行在 node 环境中的文件，所以需要按照 CommonJS 的方式去编写。文件导出一个对象，通过导出对象的属性就可以完成对应的配置选项

```js
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/main.js', // 如果是相对路径，./ 不能省略。指定 webpack 打包文件入口的路径
  output: { // 设置输出文件的位置，它的值要求是一个对象
    filename: 'bundle.js', // filename 设置输出文件的名称
    path: path.join(__dirname, 'output') // 设置输出文件所在的目录,必须是绝对路径
  }
}
```

### Webpack 工作模式

这个模式简化了 webpcak 的配置的复杂程度，可以理解为针对不同环境的几组预设配置

可以通过 webpack-cli 输入参数设置，属性由三种取值，默认是 production，还有 development ,以及 none

```bash
$ yarn webpack --mode development
```

production，会启动优化，去优化打包结果，压缩代码等

development ，会自动优化打包的速度，会添加一些调试过程需要的辅助在代码中

none，会运行最原始状态的打包，不会进行额外优化。

也可以在配置文件中添加 mode 属性设置

### Webpack 打包结果运行原理

### Webpack 资源模块加载

可以通过 Webpack 引入任意类型的资源文件。通过 loader 处理对应的资源文件

```bash
$ yarn add css-loader --dev
$ yarn add style-loader --dev # 把 css-loader 转换的结果追加到页面上
```

在配置文件中添加相应对应，在 module  选项中添加 rules 数组

```js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.css', // 如果是相对路径，./ 不能省略。指定 webpack 打包文件入口的路径
  output: { // 设置输出文件的位置，它的值要求是一个对象
    filename: 'bundle.js', // filename 设置输出文件的名称
    path: path.join(__dirname, 'dist') // 设置输出文件所在的目录,必须是绝对路径
  },
  module: {
    rules: [ // 针对其他资源模块的加载规则配置，
      { //每个规则对象需要两个属性，test 和 use
        test: /.css$/, // 值为正则表达式，用来去匹配在打包过程中所遇到的文件路径
        use: [ // 指定匹配到的文件要使用的 loader,如果配置了多了 loader ,执行顺序是从后往前
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
```

Loader 是 Webpack 的核心特性，借助于 Loader 就可以加载任何类型的资源

### Webpack 导入资源模块

虽然可以使用 css 作为打包的入口，但是 Webpack 的打包入口一般还是 JavaScript ，因为打包入口从某种程度上来说可以算是应用的运行入口，就目前而言，JavaScript 驱动整个前端应用的业务。正确的做法还是把 JS 文件作为打包的入口，然后在 JS 代码中通过 import 的方式引入各种资源文件

- 逻辑合理，JS 确实需要这些资源文件
- 确保上线资源不缺失，都是必要的

### Webpack 文件资源加载器

图片，字体等资源文件需要用到

```
$ yarn add file-loader --dev
```

文件加载器的工作过程：Webpack 在打包时遇到了文件，然后根据配置文件当中的配置匹配到对应的文件加载器，此时文件加载器开始工作，文件加载器先是将导入的文件拷贝到输出目录，然后再将拷贝后的文件输出路径作为当前模块的返回值返回。对于应用来说，所需要的资源就被发布出来了，同时可以通过模块的导出成员，拿到这个资源的访问路径

### Webpack URL 加载器

Data URLs 与 url-loader

Data URLs 是一种特殊的 url 协议，可以用来直接表示一个文件。传统 url 一般要求服务器上有一个的文件，然后通过请求这个地址去拿到服务器上对应的文件。而 Data Url 的文本就已经了包含了当前文件的内容。使用时就不会再去发送任何的 http 请求

协议 媒体类型,编码 文件内容 ->``` data: [<mediatype>][;base64], <data>```

```bash
$ yarn add url-loader --dev
```

这种方式比较适合项目中体积比较小的资源，因为体积过大会导致打包后的体积过大，影响运行速度。

最佳实践：

- 小文件使用 Data URLs，减少请求次数
- 大文件单独提取存放，提高加载速度
- 超出 10 KB 文件单独提取存放
- 小于 10 KB 文件转换为 Data URLs 嵌入代码中

```js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js', // 如果是相对路径，./ 不能省略。指定 webpack 打包文件入口的路径
  output: { // 设置输出文件的位置，它的值要求是一个对象
    filename: 'bundle.js', // filename 设置输出文件的名称
    path: path.join(__dirname, 'dist'), // 设置输出文件所在的目录,必须是绝对路径
    publicPath: 'dist/', // 默认值是一个空字符串表示网站的根目录
  },
  module: {
    rules: [ // 针对其他资源模块的加载规则配置，
      { //每个规则对象需要两个属性，test 和 use
        test: /.css$/, // 值为正则表达式，用来去匹配在打包过程中所遇到的文件路径
        use: [ // 指定匹配到的文件要使用的 loader,如果配置了多了 loader ,执行顺序是从后往前
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        // use: 'file-loader'
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10 KB, 设置这个就是只将10kb 以下的文件使用url-loader，超过的仍然交给 file-loader 处理
          }
        }
      }
    ]
  }
}
```

### Webpack 常用加载器分类

编译转换类：会把加载到的资源模块转换为 JavaScript 代码，例如 css-loader

文件操作类：会把加载到的资源模块拷贝到输出目录，同时向外导出文件资源路径，例如 file-loader

代码检查类：对代码进行校验的加载器，目的是为了统一代码的风格，提高代码质量

### Webpack 处理 ES2015（babel-loader）

因为模块带包需要，所以 Webpack 处理 import 和 export，除此之外并不能够转换其他的 ES6 特性。

```bash
$ yarn add babel-loader @babel/core @babel/preset-env --dev
```

```js
// webpack.config.js
{
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
```

- Webpack 只是打包工具
- 加载器可以用来编译转换代码

### Webpack 模块加载方式

1. 遵循 ES Modules 标准的 import 声明
2. 遵循 CommonJS 标准的 require 函数
3. 遵循 AMD 标准的 define 函数和 require 函数

Loader 加载的非 JavaScript 也会触发资源加载

- 样式代码中的 @import 指令和 url 函数
- HTML 代码中图片标签的 src 属性

### Webpack 核心工作原理

在项目中散落着各种代码及资源文件，Webpack 会根据配置找到其中的一个文件作为打包入口（一般情况下这个文件为 js 文件），然后会顺着入口文件的代码根据代码中出现的 import 或 require 语句解析推断出这个文件所依赖的模块，然后分别去解析每个资源模块对应的依赖，最后就形成了整个项目中所有用的文件之间的依赖关系树。之后 Webpack 会递归这个依赖树，找到每个节点所对应的资源文件，再根据配置文件当中的 rules 属性去找到这个模块所对应的加载器，然后交给对应的加载器去加载这个模块。最后，会将加载到的结果放入到 bundle.js(打包结果)当中，从而去实现整个项目的打包。

Loader 机制是 Webpack 的核心

### Web pack Loader 的工作原理

Loader 负责资源文件从输入到输出的转换，Loader 实际是一种管道的概念，对于同一个资源可以依次使用多个 Loader

Loader 专注实现资源模块加载

### Webpack 插件机制

插件是为了增强 Webpack 自动化能力，Plugin 解决其他自动化工作，例如：自动地在打包前自动清除 dist 目录；拷贝静态文件到输出目录；压缩输出代码

### Webpack 常用插件

- clean-webapck-plugin，自动清除输出目录的插件
- html-webpack-plugin，自动生成使用 bundle.js 的 HTML，通过 Webpack 输出 HTMl 文件，也可以同时输出多个页面文件
- copy-webpack-plugin，不需要参与构建的静态文件的复制，例如 favicon.ico

Webpack + Plugin 解决大多前端工程化工作

### Webpack 插件机制的工作原理

相比于 Loader，Plugin 拥有更宽的能力范围，Plugin 通过钩子机制实现，在 Webpack 的工作过程当中会有很多环节，为了便于插件的扩展，Webpcak 几乎给每一个环节都埋下了钩子，开发插件的时候就可以通过往钩子挂载不同的任务来实现扩展能力。

Webpack 要求插件必须是一个函数或者是一个包含 apply 方法的对象。

一般我们会把这个插件定义为一个类型，然后再类型当中去定义一个 apply 方法，使用时就是通过这个类型去构建一个实例再使用。

插件是通过在 Webpack 生命周期的钩子中挂载函数实现扩展的

### Webpack 开发体验的设想

- 以 HTTP Server 运行
- 自动编译 + 自动刷新
- 提供 Source Map 支持

### Webpack 增强开发体验

- 实现自动编译

  Webpack-cli 的 watch 工作模式，监听文件变化，自动重新打包

  启动时添加 watch 参数

  ```bash
  $ yarn webpack --watch
  ```

- 实现自动刷新浏览器

  希望编译过后自动刷新浏览器，使用 BrowserSync

  ```bash
  $ browser-sync dist --files '**/*'
  ```

  但使用 BrowserSync 有一些弊端

  - 操作麻烦，因为需要同时启动两个命令
  - 效率降低了，从 webpcak 编译完写入磁盘，到 browser-sync 去读取磁盘内容，磁盘读写增加了，所以效率降低

### Webpack Dev Server

Webpack Dev Server 是 Webpack 官方推出的开发工具，提供用于开发的 HTTP Server 。它集成了自动编译和自动刷新浏览器等功能。

```bash
# 安装
$ yarn add webpack-dev-server --dev
# 运行命令
$ yarn webpack-dev-server --open # --open 可以自动打开浏览器
```

Webpack Dev Server 为了提高工作效率，并没有将打包结果写入到磁盘中，它是将打包结果暂时存放在内存中，而内部的 HTPP Server 也就是从内存中读出，然后发送给浏览器。这样减少了很多不必要的磁盘读写操作，从而提高了构建效率

配置静态资源访问：

```js
// webpack.config.js
  devServer: {
    contentBase: './public' // 额外为开发服务器指定查找资源目录
  },
```

配置代理 API 服务：

解决开发阶段接口跨域问题：在开发服务器当中去配置代理服务。Webpack Dev Server 支持配置代理

```js
  devServer: {
    contentBase: './public', // 额外为开发服务器指定查找资源目录
    proxy: { // 添加代理服务配置
      '/api': {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: 'https://api.github.com',
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: { // 设置代理路径的重写
          '^/api': ''
        },
        // 默认情况下不能使用 localhost:8080 作为请求 Github 的主机
        changeOrigin: true // 允许改变主机名
      }
    }
  },
```

### Source Map

编译运行后，运行代码与源代码之间完全不同，如果需要调试应用，则错误信息无法定位，因为调式和报错都是基于运行代码的。Source Map 是解决这类问题的办法。

Source Map (源代码地图)，它用来映射转换过后的代码和源代码之间的关系，解决了源代码与运行代码不一致所产生的调试问题

### Webpack 配置 Source Map

Webpack 支持 12 种不同的 Source map 方式，每种方式的效率和效果各不相同

```js
// webpack.config.js
devtool: 'source-map', // 配置开发过程的辅助工具，Source Map 相关功能的配置

```

#### eval 模式下的 Source Map

```js
devtool: 'eval'
```

速度快，效果差，只能定位到源代码文件，不能定位到行列信息

#### Webpcak devtool 模式对比

- eval - 是否使用 eval 执行模块代码
- cheap - Source Map 是否包含行信息
- module - 是否能够得到 Loader 处理之前的源代码

### Webpack 选择 Source Map 模式

- 开发环境：cheap-module-eval-source-map

  原因：

  - 代码每行不会超过 80 字符
  - 代码经过 Loader 转换过后的差异较大
  - 首次打包速度慢无所谓，重写打包相对较快

- 生产环境：none不选择 ，或者选择 nosources-source-map 模式

  原因：Source Map 会暴露源代码，调试是开发阶段的事情

没有绝对的选择，理解不同模式的差异，适配不同的环境

### Webpack 自动刷新的问题

问题核心：自动刷新导致的页面状态丢失

解决办法：

	1. 代码中写死编辑器的内容
 	2. 通过额外代码实现刷新前保存，刷新后读取

但都不是特别好。HRM

更好的办法是：页面不刷新的前提下，模块也可以及时更新（HMR）

### HMR（模块热替换）

Hot Module Replacement ，应用运行过程中实时替换某个模块，同时应用运行状态不受影响，可以解决自动刷新导致页面状态丢失的问题，热替换只将修改的模块实时替换至应用中。

热拔插——在一个正在运行的机器上随时插拔设备，设备不受影响，且插上的设备可以立即开始工作

HMR 是 Webpack 中最强大的功能之一，极大成都的提高了开发者的工作效率

### Webpack 开始 HMR

H'MR 集成在 webpack-dev-server 中，运行 webpack-dev-server 添加 --hot 参数开启，也可以通过配置文件开启s

```bash
$ yarn webpack-dev-server --hot
```

```js
// webpack.config.js
const webpack = require('webpack')

module.exports ={
	devServer: {
		hot: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
}
```

Webpack 中的 HMR 并不可以开箱即用，需要手动处理模块热替换逻辑

Q1：为什么样式文件的热更新开箱即用？

A1：因为样式文件是经过 Loader 处理的，在 style-loader 处理的时候就已经自动处理了热更新

Q2：凭什么样式可以自动处理

A2：在样式模块更新过后，只需要把更新过后的 css 即时替换到页面当中就可以覆盖掉之前的样式，而我们编写的 JS 模块没有任何规律可言，Webpack 不知道如何去处理更新过后的模块，所以自然没有提供一个通用的模块替换方案

Q3：使用框架时，项目没有手动处理，JS 照样可以热替换

A3：使用了某个框架，框架下的开发，每种文件都是有规律的，通过脚手架创建的项目内部都集成了 HMR 方案。

HMR API ，使用 module.hot.accept(url, fn) 去处理对应模块的热替换

### Webpack HMR 注意事项

1. 处理 HMR 的代码报错会导致自动刷新

   使用 hotOnly: true

2. 没启用 HMR 的情况下，HMR API  报错

   先去判断 if (module.hot)

3. 代码中多了一些与业务无关的代码

   不会有影响

### Webpack 生产环境优化

生产环境和开发环境有很大的差异，在生产环境中注重运行效率，需要更少量更高效的代码去完成业务功能。开发环境注重开发效率。Webpack 提供了模式（mode）,为不同的工作环境创建不同的配置，便于打包结果适用于不同的环境

#### 不同环境下的配置

两种方法

- 配置文件根据环境不同导出不同配置

  ```bash
  $ yarn webpack --env production
  ```

- 一个环境对应一个配置文件（多配置文件）

  大型项目，建议不同环境对应不同配置文件

  需要安装 webpack-merge 模块

  ```bash
  $ yarn add webpack-merge --dev
  $ yarn webpack --config webpack.prod.js # 指定所需的配置文件
  ```

### Webpack DefinePlugin

DefinePlugin,功能是为代码注入全局成员，在 production 模式下，这个插件会默认启用，并且向代码中注入 process.env.NODE_ENV 的一个常量，很多第三方模块会通过这个成员去判断当前的运行环境，从而去执行某些特定操作（打印日志等）

### Tree-shaking

shaking （摇掉）代码中未引用部分(未引用代码—— dead-code)，在生产模式下自动开启

```bash
# 使用 production mode 会默认启动
$ yarn webpack --mode production
```

Tree Shaking 并不是 Webpack 中的某个配置选项，它是一组功能搭配使用后的优化效果，这组功能会在 production 模式下自动开启

````js
// webpack.config.js 手动实现 tree-shaking 
optimization: { // 集中去配置 Webpcak 的内置功能的属性
    usedExports: true, // 模块只导出被使用的成员(负责标记枯树叶)
    concatenateModules: true, // 尽可能合并每一个模块到一个函数中
    minimize: true, // 压缩输出结果（负责摇掉枯树叶）
  }
````

concatenateModules 的作用是尽可能合并每一个模块到一个函数中，这样既提升了运行效率，又减少了代码的体积。这个特性被称为 Scope Hoisting（作用域提升）

### Tree-shaking & Babel

Tree Shaking 实现的前提是必须使用 ES Modules 去组织代码，也就是由 Webpack 打包的代码必须使用 ESM。

最新版本的 babel-loader 并不会导致 tree-shaking 失效，但是为了确保，可以使用 ['@babel/preset-env', { modules: false }] 关闭掉 ESM 到 commonJS 的转换

### Webpack sideEffects（副作用）

允许我们通过配置的方式去标识代码是否有副作用，从而为 Tree Shaking 提供更大的压缩空间。

副作用：模块执行时除了导出成员之外所做的事情

sideEffects 一般用于 npm 包标记是否有副作用。在 production 模式下会自动开启

```js
// webpack.config.js 手动配置 sideEffects
optimization: {
	sideEffects: true
}
```

```json
// package.json
{
  "sideEffects": true // 表示代码没有副作用  
  "sideEffects": [ // 标记有副作用代码
    "./src/extend.js",
    "*.css"
  ]
}

```

使用 Side Effects 的前提是确定自己的代码没有副作用

### Code Splitting (代码分包/代码分割)

Webpack 的弊端是所有代码最终都被打包到一起，bundle 体积过大，但大多数时候并不是每个模块在启动时都是必要的，所以我们需要分包，根据运行按需加载

Webpack 实现分包的方式有两种

- 多入口打包
- 动态导入

### 多入口打包（Multi Entry）

一般适用于多页应用程序，最常见的划分规则是一个页面对应一个打包入口，公共部分单独提取

### Webpack 提取公共模块

提取公共模块（Split Chunks）

不同入口中肯定会有公共模块，所以不同的打包结果中会有相同的模块出现

```js
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
  },
```

### 动态导入（Dynamic Imports）

按需加载模块，需要用到某个模块时，再加载这个模块，可以极大的节省带宽和流量。

Webpack 支持动态导入，所有动态导入的模块会被自动分包

配合魔法注释（Magic Comments）可以实现对动态导入的模块命名

```js
    import(/* webpackChunkName: 'components' */'./album/album').then(({ default: album }) => {
      mainElement.appendChild(album())
    })
```

### Webpack MiniCssExtractPlugin

提到 CSS 到单个文件，通过这个插件可以实现 CSS 模块的按需加载

```bash
$ yarn add mini-css-extract-plugin --dev
```

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin()
  ]
```

### Webpack OptimizeCssAssetsWebpackPlugin

压缩输出的 CSS 文件

```bash
$ yarn add optimize-css-assets-webpack-plugin --dev
```

然后在配置文件中配置

### Webpack 输出文件名 Hash (substitutions)

生产模式下，文件名使用 Hash,一旦资源文件发生改变，那文件名称也可以跟随着变化。

```js
filename: '[name]-[hash].bundle.js' // 项目级别
filename: '[name]-[chunkhash].bundle.js' // chunk 级别，同一路的都会改变
filename: '[name]-[contenthash].bundle.js' // 文件级别的，解决缓存问题做好的方式，也可以指定 hash 长度 contenthash:8
```

## 其他打包工具

### Rollup

Roolup 与 Webpack 作用类似，但是更为小巧，Rollup 仅仅是一款 ESM 打包器，并不支持类似 HMR 这种高级特性。Rollup 初衷是提供一个充分利用 ESM 各项特性的高效打包器

#### 安装 使用 Rollup

```bash
$ yarn add rollup --dev
# $ yarn rollup
$ yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

#### Rollup 配置文件

根目录下新建 rollup.config.js 的配置文件

```js
// rollup.config.js
export default {
  input: 'src/index.js', // 指定打包入口文件路径
  output: { // 输出相关配置
    file: 'dist/bundle.js', // 输出文件名
    format: 'iife', // 输出格式
  }
}
```

```bash
# 运行
$ yarn rollup --config # --config 参数表明使用配置文件 参数后还可跟上具体的配置文件名称
# yarn rollup --config rollup.config.js
```

#### Rollup 使用插件

想要加载其他类型资源模块，导入 CommonJS 模块，编译 ECMA 新特性等需求，Rollup 支持使用插件的方式扩展使用，插件是 Rollup 唯一扩展途径

使用 rollup-plugin-json 插件

```bash
$ yarn add rollup-plugin-json --dev
```

```js
// rollup.config.js
import json from 'rollup-plugin-json'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json()
  ]
}

```

#### Rollup 加载 npm 模块

rollup-plugin-node-resolve 插件

```bash
$ yarn add rollup-plugin-node-resolve --dev
```

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve()
  ]
}

```

#### Rollup 加载 CommonJS  模块

rollup-plugin-commonjs 插件

#### Rollup Code Splitting（代码拆分）

可以使用动态导入加载的方式，但是打包时不能使用 iife 格式

```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'amd'
  }
}

```

#### Rollup 多入口打包

```js
// rollup.config.js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  }
}

```

### Rollup / Webpack 选用原则

Rollup:

优点

- 输出结果更加扁平
- 自动移除未引用代码
- 打包结果依然完全可读

缺点

- 加载非 ESM 的第三方模块比较复杂
- 模块最终都被打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD 库

如果我们正在开发应用程序，难免引用大量第三方模块，又需要 HMR 提高开发体验等，Rollup 比较欠缺，但是如果正在开发一个框架或者类库，则Rollup 就很好用

大多数知名框架/库都在使用 Rollup 作为模块打包器。

社区中希望二者并存。

Webpack 大而全，Rollup 小而美。大多数时候，应用开发使用 Webpack，库/框架开发使用 Rollup (但都没有绝对标准)

### Parcel

Parcel 是一款零配置的前端应用打包器，构建速度快，内部使用了多进程工作。官方推荐用 html 文件作为打包入口

```bash
$ yarn add parcel-bundler --dev
$ yarn parcel src/index.html # 开发环境运行
$ yarn parcel build src/index.html # 以生产模式运行打包
```



## 规范化标准

规范化是践行前端工程化中重要的一部分

### 规范化介绍

- 为什么要有规范标准
  - 软件开发需要多人协同
  - 不同开发者具有不同的编码习惯和喜好
  - 不同的喜好增加项目维护成本
  - 每个项目或者团队需要明确统一的标准
- 哪里需要规范化标准
  - 代码、文档、甚至是提交日志
  - 开发过程中人为编写的成果物
  - 代码标准化规范最为重要
- 实施规范化的方法
  - 编码前人为的标准约定
  - 通过工具实现 Lint

常见的规范化实现方式

- ESLint 工具使用
- 定制 ESLint 校验规则
- ESLint 对 TypeScript 的支持
- ESLint 结合自动化工具或者 Webpack
- 基于 ESLint 的衍生工具
- Stylelint 工具的使用

### ESLint 介绍

- 最为主流的 JavaScript Lint 工具，用于监测 JS 代码质量
- ESLint 很容易同意开发者的编码风格
- ESLint 可以帮助开发者提升编码能力

### ESLint 安装步骤

- 初始项目
- 安装 ESLint 模块为开发依赖
- 通过 CLI 命令验证安装结果

```bash
$ yarn init --yes
$ yarn add eslint --dev
# 查看版本两种方式
$ yarn eslint --version
$ cd .\node_modules\.bin\
$ .\eslint --version
```

### ESLint 快速上手

ESLint 检查步骤

- 编写“问题”代码
- 使用 eslint 执行检测
- 完成 eslint 使用配置

```bash
$ yarn eslint --init
$ yarn eslint .\01-prepare.js
$ yarn eslint .\01-prepare.js --fix # 自动修正
```

### ESLint 配置文件解析

```js
module.exports = {
  env: { // 标记当前代码的运行环境
    browser: false, // 代码运行在 浏览器中，允许使用 window 对象等
    es6: false
  },
  extends: [ // 继承共享的配置
    'standard'
  ],
  parserOptions: { // 设置语法解析器相关配置，控制是否显示某个 es 版本的语法
    ecmaVersion: 11
  },
  rules: { // 配置校验规则中每个规则的开启或关闭
    'no-alert': 'error'
  },
  globale: { // 额外声明在代码中可以使用的全局成员
    'jQuery': 'readOnly'
  }
}

```

### ESLint 配置注释

ESLint 配置注释可以理解为将配置直接通过注释的方式写在脚本文件中，再去执行代码的校验。

```js
const str1 = '${name} is a coder' // eslint-disable-line no-template-curly-in-string

console.log(str1)
```

[配置注释文档](http://eslint.cn/docs/user-guide/configuring#configuring-rules)

### ESLint 结合自动化工具

- 集成之后，ESLint 一定会工作
- 与项目统一，管理更加方便

与 gulp 结合需要安装 eslint gulp-eslint 模块

### ESLint 结合 Webpack

通过 Loader 机制去完成

需要安装 eslint eslint-loader 模块，然后初始化 .eslintrc.js 配置文件

```js
// webpack.config.js
module: {
	rules: [
	  {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
	]
}
```

### 现代化项目集成 ESLint

### ESLint 检查 TypeScript

```js
module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser', // 指定一个语法解析器
  parserOptions: {
    ecmaVersion: 11
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  }
}
```

### Stylelint 的使用介绍

css 代码的 lint

- 提供默认的代码检查规则
- 提供 CLI 工具，快速调用
- 通过插件支持 Sass Less PostCSS
- 支持 Gulp 或 Webpack 集成

```bash
$ yarn add stylelint --dev
# 然后添加 .stylelintrc.js 文件在根目录下
$ touch .stylelintrc.js
$ yarn add stylelint-config-standard --dev
$ yarn stylelint ./index.css --fix
$ yarn add stylelint-config-sass-guidelines --dev
$ yarn stylelint ./index.scss --fix
```

### Prettier 的使用

```bash
$ yarn add prettier --dev
$ yarn prettier style.css --write # 格式化对应文件
$ yarn prettier . --write # 根目录下所有文件
```

### Git Hooks 介绍

通过 Git Hooks 在代码提交前强制 lint。

- Git Hook 也称之为 git 钩子，每个钩子都对应一个任务
- 通过 shell 脚本可以编写钩子任务触发时要具体执行的操作

### ESLint 结合 Git Hooks

Husky 可以实现 Git Hooks 的使用需求

```bash
$ yarn add husky --dev
$ yarn add lint-staged --dev
```

```json
{
  "scripts": {
    "test": "eslint ./index.js",
    "precommit": "lint-staged"
  },
  "devDependencies": {
    "eslint": "^7.6.0",
    "eslint-config-standard": "^14.1.1",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "husky": "^4.2.5"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn precommit"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint",
      "git add"
    ]
  }
}
```

