module.exports = {
  devServer: {
    // https: true,
    port: 8085,
    open: true
    // proxy: {
    //   // 只有碰到/api的才会执行代理
    //   '/wapi/v2.0': {
    //     target: 'https://10.21.17.155:8090', // 要访问的跨域的域名
    //     changeOrigin: true // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
    //   }
    // }
  },
  lintOnSave: true,
  css: {
    sourceMap: true
  }
};
