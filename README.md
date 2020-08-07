# 模块化开发与规范化标准

## 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

主要环节：

- 找到入口文件，推断文件所依赖的模块
- 解析每个模块对应的依赖，形成依赖关系树
- 递归关系树，找到模块对应的 Loader 去处理加载
- 把结果打包到结果文件中

在项目中散落着各种代码及资源文件，Webpack 会根据配置找到其中的一个文件作为打包入口（一般情况下这个文件为 js 文件），然后会顺着入口文件的代码根据代码中出现的 import 或 require 语句解析推断出这个文件所依赖的模块，然后分别去解析每个资源模块对应的依赖，最后就形成了整个项目中所有用的文件之间的依赖关系树。之后 Webpack 会递归这个依赖树，找到每个节点所对应的资源文件，再根据配置文件当中的 rules 属性去找到这个模块所对应的加载器，然后交给对应的加载器去加载这个模块。最后，会将加载到的结果放入到 bundle.js(打包结果)当中，从而去实现整个项目的打包


## 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路

Loader 机制是 Webpack 的核心，负责资源文件从输入到输出的转换，专注实现资源模块的加载

Plugin 是为了增强 Webpack 的自动化能力，解决其他自动化工作。例如：自动地在打包前自动清除 dist 目录；拷贝静态文件到输出目录；压缩输出代码

### Loader 开发思路

Loader 开发，本质上是导出一个函数，该函数处理模块加载的内容（接收加载内容为 source 参数），然后将处理后的结果返回。这个返回结果是一段可执行的 JS 代码

示例：

```js
// sample-loader.js
module.exports = source => {
  // 处理 source
  result = ...
  return result
}
```

### Plugin 开发思路

Webpack 要求插件必须是一个函数或者是一个包含 apply 方法的对象。

一般我们会把这个插件定义为一个类型，然后在类型当中去定义一个 apply 方法，使用时就是通过这个类型去构建一个实例再使用。

插件是通过在 Webpack 生命周期的钩子中挂载函数实现扩展的。

实例：

```js

class MyPlugin {
  apply(compiler) {
    console.log('MyPlugin start')

    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name) // 拿到文件名
        // console.log(compilation.assets[name].source()); // 拿到文件内容
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '') // 处理文件，替换注释

          // 覆盖文件，每个资源都必须包含 source 和 size 属性
          // source 是一个返回资源文件内容的方法
          // size 是一个返回资源文件大小的方法
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}
```

