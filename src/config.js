// 应用配置

const config = {
  dev: {
    host: "http://192.168.30.186",
    url: 'http://192.168.30.186:9310', // 服务器地址
    ws: 'ws://192.168.30.186:9310/ws/chat', // WebSocket 地址
    udp: { // udp地址
      host: '192.168.30.186',
      port: 9310
    }
  },
  pro: {
    host: "http://fan.jx.cn:81",
    url: 'http://fan.jx.cn:9310', // 服务器地址
    ws: 'ws://fan.jx.cn:9310/ws/chat', // WebSocket 地址
    udp: { // udp地址
      host: 'fan.jx.cn',
      port: 9310
    }
  },
  app: {
    env: 'pro',
    title: 'hello', // 应用名称
    version: '', // 版本号，这里
    number: null, // 更新代号
    manufacturer: null, // 产商
    product: "", // 机型
    release: null, // 安卓版本
  },
  server:{},
};

if (config.app.env === "dev") {
  config.server = config.dev
} else {
  config.server = config.pro
}

export default config;
