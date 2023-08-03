'use strict';

module.exports = () => {
  const config = {};

  // add http_proxy to httpclient
  if (process.env.http_proxy) {
    config.httpclient = {
      request: {
        enableProxy: true,
        rejectUnauthorized: false,
        // proxy: process.env.http_proxy,
        proxy: 'http://127.0.0.1:8888',
      },
    };
  }

  config.mysql = {
    client: {
      // host
      // host: 'jxray.moyebuy.com',
      host: 'www.xuanlianghao.cn',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'admin2023',
      // 数据库名
      database: 'admin',
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'jxray.moyebuy.com',
      password: '2023redis!',
      db: 0,
    },
  };

  return config;
};
