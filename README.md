# vite-plugin-monaco-editor-nls
使用vite处理monaco-editor语言支持。该方案为打包时进行源码替换，暂不能运行时切换语言。


## 原理

### 安装  "monaco-editor-nls": "^3.0.0" 

### 然后通过 webpack 或vite 打包时对 monaco-editor 目录下的 monaco-editor/esm/vs/nls.js 的源码进行更改即可。
