'use strict';

module.exports = () => {
  const config = {};

  /** mysql配置 */
  config.mysql = {
    client: {
    // host
    // host: 'jxray.moyebuy.com',
      host: 'mysql',
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

  /** redis配置 */
  config.redis = {
    client: {
      port: 6379,
      host: 'redis',
      password: '2023redis!',
      db: 0,
    },
  };

  return config;
};
