'use strict';

const JobHandlerLog = require('./JobHandlerLog');
const GlobalError = require('./GlobalError');
const { RESULT_FAIL } = require('../constants/result');

class AttackNumber {
  constructor(app, ssoToken) {
    this.app = app;
    this.ctx = app.context;
    this.jobHandlerLog = new JobHandlerLog(this.app);
    this.ssoToken = ssoToken;
    this.rulesObj = {
      ABC: new RegExp(
        '(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){2}\\d',
        'g'
      ),
      ABCD: new RegExp(
        '(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3}\\d',
        'g'
      ),
      ABCDE: new RegExp(
        '(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){4}\\d',
        'g'
      ),
      ABCABC: new RegExp(
        '(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){2}\\d{4}',
        'g'
      ),
      AAAAAA: new RegExp('([\\d])\\1{5,}', 'g'),
      AAAAA: new RegExp('([\\d])\\1{4,}', 'g'),
      AAAA: new RegExp('(.)\\1{3}', 'g'),
      AAA: new RegExp('(.)\\1{2}', 'g'),
      AAAAAB: new RegExp('(\\d)\\1\\1\\1\\1((?!\\1)\\d)', 'g'),
      AAAAB: new RegExp('(\\d)\\1\\1\\1((?!\\1)\\d)', 'g'),
      AAAB: new RegExp('(\\d)\\1\\1((?!\\1)\\d)', 'g'),
      AAABB: new RegExp('(\\d)\\1\\1((?!\\1)\\d)\\2', 'g'),
      ABAB: new RegExp('(\\d)((?!\\1)\\d)\\1\\2', 'g'),
      AABBCC: new RegExp('(\\d)\\1((?!\\1)\\d)\\2((?!\\1)\\d)\\3', 'g'),
    };
  }

  /**
   * 调用接口任务
   * @param {*} params 任务参数
   */
  async curlHandler(params) {
    // 获取参数
    return await this.app.curl(params.url, {
      method: params.method,
      data: params.data,
      headers: params.headers,
      dataType: 'json',
    });
  }

  /** *
   * 登录成功后第一次请求,返回的是301跳转,app中用来拿准备选号的页面,
   */
  async getPage() {
    const params = {
      method: 'GET',
      url: 'http://211.136.111.153:8080/MOP_ac/PadcrmOpenService',
      data: {
        action: 'getPage',
        menuId: '60021183',
        channel: 'APP4A',
        ssoToken: 'L2dITy9zRVJ6dG1zVG85QTlvR1Z1TzVyUkJLbUx6SmRBWElNdGxwK1F4TzE3V29m',
      },
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': encodeURIComponent('Mozilla/5.0 (Linux; Android 13; V2271A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.74 Mobile Safari/537.36/shyd4a/shydyy/'),
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'X-Requested-With': 'com.sh.cm.grid4a',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    };
    const result = await this.curlHandler(params);
    await this.jobHandlerLog.log('任务getPage，状态码：{0}', result.status);
    await this.jobHandlerLog.log('任务getPage，响应数据：{0}', JSON.stringify(result.data));
    await this.jobHandlerLog.log('任务getPage，请求数据：{0}', JSON.stringify(params));
  }

  /**
   * 登录成功后第二次请求,用来发送当前app所再的位置,非上海的位置不允许使用
   * 返回ssoToken,JSESSIONID
   */
  async sendLocation() {
    const params = {
      method: 'GET',
      url: 'http://211.136.111.153:8080/MOP_ac/PadcrmOpenService',
      data: {
        action: 'getPage',
        menuId: '60021183',
        channel: 'APP4A',
        ssoToken: this.ssoToken,
        customCode: '',
        callback: '',
        device: JSON.stringify({ device: { appVersion: '1.9.4.3', availMemory: '4.15 GB', brand: 'vivo', c_id: '948fdb4b05639667', density: 3, model: 'V2271A', os: 'android', osVersion: 33, totalMemory: '7.81 GB' } }),
        location: JSON.stringify({ address: '上海市嘉定区交运路464号', city: '上海市', district: '嘉定区', exeResult: 1, lat: 31.296245, lng: 121.195396, locationType: 'GD', province: '上海市', street: '交运路', streetNumber: '464号' }),
      },
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; V2271A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.74 Mobile Safari/537.36/shyd4a/shydyy/',
        'X-Requested-With': 'com.sh.cm.grid4a',
        Referer: 'http://211.136.111.153:8080/MOP_ac/page-sh/other/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    };
    const result = await this.curlHandler(params);
    // const { url } = result.data;

    // if (url && url.length > 0 && url.indexOf('JSESSIONID') !== -1) {
    //   const jSessionId = url.split('&')[1];
    //   this.jSessionId = jSessionId;
    // }

    let sessionId = '';
    if (result.status === 302) {
      const cookie = result.headers['set-cookie'][0];
      sessionId = cookie.split(';')[0];
    }

    await this.jobHandlerLog.log('任务sendLocation，状态码：{0}', result.status);
    await this.jobHandlerLog.log('任务sendLocation，响应数据：{0}', JSON.stringify(result.data));
    await this.jobHandlerLog.log('任务sendLocation，请求数据：{0}', JSON.stringify(params));
    return sessionId;
  }

  async perpareAttackNumber(sessionId) {
    if (!this.ssoToken || !sessionId) {
      throw new GlobalError(RESULT_FAIL, '准备取号时,会话信息丢失，请检查');
    }
    const params = {
      method: 'POST',
      url: 'http://211.136.111.153:8080/MOP_ac/PadcrmSocialOpenAccountService?action=init',
      headers: {
        Pragma: 'no - cache',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        menuId: '60021183',
        channel: 'APP4A',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; V2271A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.74 Mobile Safari/537.36/shyd4a/shydyy/',
        ssoToken: this.ssoToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'http://211.136.111.153:8080',
        'X-Requested-With': 'com.sh.cm.grid4a',
        Referer: 'http://211.136.111.153:8080/MOP_ac/newMenu/padcrm/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        Cookie: `${sessionId}`,
      },
    };
    const result = await this.curlHandler(params);
    await this.jobHandlerLog.log('任务perpareAttackNumber，状态码：{0}', result.status);
    await this.jobHandlerLog.log('任务perpareAttackNumber，响应数据：{0}', JSON.stringify(result.data));
    await this.jobHandlerLog.log('任务perpareAttackNumber，请求数据：{0}', JSON.stringify(params));
    return result;
  }

  async attackNumber(sessionId, pNumber) {
    if (!this.ssoToken || !sessionId) {
      throw new GlobalError(RESULT_FAIL, '锁号时,会话信息丢失，请检查');
    }

    if (!pNumber) {
      throw new GlobalError(RESULT_FAIL, '未指定要选的号码');
    }

    const params = {
      method: 'POST',
      url: 'http://211.136.111.153:8080/MOP_ac/PadcrmSocialOpenAccountService?action=attackNumber',
      data: `checkednumber=${pNumber}`,
      headers: {
        Pragma: 'no - cache',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        menuId: '60021183',
        channel: 'APP4A',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; V2271A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.74 Mobile Safari/537.36/shyd4a/shydyy/',
        ssoToken: this.ssoToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'http://211.136.111.153:8080',
        'X-Requested-With': ' com.sh.cm.grid4a',
        Referer: 'http://211.136.111.153:8080/MOP_ac/newMenu/padcrm/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        Cookie: `${sessionId}`,
        Connection: 'keep-alive',
      },
    };
    const result = await this.curlHandler(params);
    await this.jobHandlerLog.log('任务attackNumber，状态码：{0}', result.status);
    await this.jobHandlerLog.log('任务attackNumber，响应数据：{0}', JSON.stringify(result.data));
    await this.jobHandlerLog.log('任务attackNumber，请求数据：{0}', JSON.stringify(params));
    return result;
  }

  async afterAttackNum(sessionId, pNumber) {
    const params = {
      method: 'POST',
      url: 'http://211.136.111.153:8080/MOP_ac/socialOpenAccount.do?action=isOptNumber',
      data: `type=4A&photoNumber=${pNumber}`,
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain, */*',
        menuId: '60021183',
        channel: 'APP4A',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; V2271A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.74 Mobile Safari/537.36/shyd4a/shydyy/',
        ssoToken: this.ssoToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'http://211.136.111.153:8080',
        'X-Requested-With': 'com.sh.cm.grid4a',
        Referer: 'http://211.136.111.153:8080/MOP_ac/newMenu/padcrm/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        Cookie: `${sessionId}`,
        Connection: 'keep-alive',
      },
    };
    const result = await this.curlHandler(params);
    await this.jobHandlerLog.log('任务afterAttackNum，状态码：{0}', result.status);
    await this.jobHandlerLog.log('任务afterAttackNum，响应数据：{0}', JSON.stringify(result.data));
    await this.jobHandlerLog.log('任务afterAttackNum，请求数据：{0}', JSON.stringify(params));
  }

  // 查号码
  async searchPhNum(sessionId, filerParams) {

    if (!this.ssoToken || !sessionId) {
      throw new GlobalError(RESULT_FAIL, '锁号时,会话信息丢失，请检查');
    }

    const params = {
      method: 'POST',
      url: 'http://211.136.111.153:8080/MOP_ac/PadcrmSocialOpenAccountService?action=queryNumber',
      data: { ...filerParams },
      headers: {
        Accept: 'application/json, text/plain, */*',
        channel: 'APP4A',
        ssoToken: this.ssoToken,
        Cookie: `${sessionId}`,
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json;charset=UTF-8',
        Origin: 'http://211.136.111.153:8080',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; V2271A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.74 Mobile Safari/537.36/shyd4a/shydyy/',
        menuId: '60021183',
        Referer: 'http://211.136.111.153:8080/MOP_ac/newMenu/padcrm/',
        Connection: 'keep-alive',
      },
    };
    const result = await this.curlHandler(params);
    await this.jobHandlerLog.log('任务searchPhNum，状态码：{0}', result.status);
    await this.jobHandlerLog.log('任务searchPhNum，响应数据：{0}', JSON.stringify(result.data));
    await this.jobHandlerLog.log('任务searchPhNum，请求数据：{0}', JSON.stringify(params));
    return result.data;
  }

  async getSelectPhNumByRule(numbers) {
    if (!numbers) {
      throw new GlobalError(RESULT_FAIL, '搜索号码结果为空,请检查.');
    }
    if (numbers && numbers.length === 0) {
      throw new GlobalError(RESULT_FAIL, '搜索号码结果为空,请检查.');
    }

    const prettyNums = [];

    for (const phone of numbers) {
      for (const rule in this.rulesObj) {
        const reg = this.rulesObj[rule];
        if (phone.match(reg) != null && !prettyNums.includes(phone)) {
          prettyNums.push(phone);
        }
      }
    }

    return prettyNums;
  }
}

module.exports = AttackNumber;
