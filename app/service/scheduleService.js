'use strict';

const { Service } = require('egg');
const { RESULT_SUCC } = require('./../constants/result');

class ScheduleService extends Service {
  /**
   * 测试处理程序
   * @param {*} params 任务参数
   * @param {*} jobHandlerLog 日志
   */
  async testHandler(params, jobHandlerLog) {
    // 此处替换成具体业务代码
    await this.logger.info('我是测试任务，任务参数: %s', params);
    await jobHandlerLog.log('我是测试任务，任务参数: {0}', params);
  }
  /**
   * 测试调用接口任务
   * @param {*} params 任务参数
   * @param {*} jobHandlerLog 日志
   */
  async testCurlHandler(params, jobHandlerLog) {
    // 获取参数
    const paramsObj = JSON.parse(params);
    const result = await this.ctx.curl(paramsObj.url, {
      method: paramsObj.method,
      data: paramsObj.data,
      dataType: 'json',
    });
    await jobHandlerLog.log('测试调用接口任务，状态码：{0}', result.status);
    await jobHandlerLog.log('测试调用接口任务，响应数据：{0}', JSON.stringify(result.data));
  }

  /**
   * 调用接口任务
   * @param {*} params 任务参数
   * @param {*} jobHandlerLog 日志
   */
  async curlHandler(params, jobHandlerLog) {
    // 获取参数
    const paramsObj = JSON.parse(params);
    const result = await this.ctx.curl(paramsObj.url, {
      method: paramsObj.method,
      data: paramsObj.data,
      dataType: 'json',
      headers: paramsObj.headers,
      timeout: [5000, 50000],
    });

    const { code, data } = result.data;

    if (code === RESULT_SUCC) {
      let msg = '';
      if (data.length === 0) {
        msg = '当前没有靓号';
      }

      if (data.length > 0) {
        msg = JSON.stringify(data);
      }

      await jobHandlerLog.log('靓号查找：{0}', msg);
    } else {
      await jobHandlerLog.log('调用接口任务，状态码：{0}', result.status);
      await jobHandlerLog.log('调用接口任务，响应数据：{0}', JSON.stringify(result.data));
    }

  }
}

module.exports = ScheduleService;
