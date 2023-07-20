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
  return config;
};
