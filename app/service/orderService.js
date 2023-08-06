'use strict';

const { Service } = require('egg');
const AttackNumber = require('../utils/attackNumber');
const GlobalError = require('../utils/GlobalError');
const { FILERPARAMS } = require('../constants');
const { RESULT_FAIL } = require('../constants/result');
const { JSESSION_EXPIRE_TIME, ADMIN_PREFIX } = require('../constants/redis');

class OrderService extends Service {

  async query(aNumb, { force = false, token, filerParams }) {
    let sessionId = await this.app.redis.get(ADMIN_PREFIX + token);

    // 第一次或10分钟后重新认证一下
    if (!sessionId || force) {
      // 第一次302跳转页面
      sessionId = await aNumb.getPage();
      this.app.logger.info('【第一次302跳转页面】：%s', '完成');

      // 超时,自动 重新拿JSESSIONID
      sessionId = await aNumb.sendLocation(sessionId);
      this.app.logger.info('【第二次发送位置】：%s', '完成');

      // 保存缓存
      await this.app.redis.set(ADMIN_PREFIX + token, sessionId, 'Ex', JSESSION_EXPIRE_TIME);
    }

    this.app.logger.info('【JSESSIONID】：%s', sessionId);
    this.app.logger.info('【token】：%s', token);

    // 准备页面接口
    await aNumb.perpareAttackNumber(sessionId);
    this.app.logger.info('【准备页面接口】：%s', '完成');

    // 查号码
    let phoneNumbs = [];
    phoneNumbs = await aNumb.searchPhNum(sessionId, filerParams);

    this.app.logger.info('【查号码】：%s', '完成');
    return { phoneNumbs, sessionId };
  }

  async queryStoreNums({ minute = 31 }) {
    const sqlStr = `
    select DISTINCT * from number_detail
    where update_time between DATE_ADD(date_format(now(),'%Y-%m-%d %H:%i:%s'),interval -${minute} MINUTE)
    AND date_format(now(),'%Y-%m-%d %H:%i:%s')`;

    const list = await this.app.mysql.query(sqlStr);
    return list;
  }

  async queryAll({ token, force = false, filter }) {
    if (!token) { token = 'd3hlUXBqT2ZBMkxaTnI4ZUhLVGx6dlFpQTZBek96alVyYm5SSkl0V2daRVR0UEds'; }
    const filterParam = filter ? JSON.parse(filter) : FILERPARAMS;

    if (filterParam.price !== '-9999') { filterParam.iPrestoreFee = filterParam.price; }
    if (filterParam.rule === '-9999') { filterParam.rule = ''; }

    try {
      const aNumb = new AttackNumber(this.app, token, filterParam.rule);
      let { phoneNumbs } = await this.query(aNumb, {
        force,
        token, filerParams: { ...FILERPARAMS, ...filterParam },
      });
      const { selectPool } = phoneNumbs;
      phoneNumbs = await aNumb.getSelectPhNumByRule(selectPool);
      return phoneNumbs;
    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }

  async order(lockedNum, user = 'custom', type = 'order') {
    const { id: res_id } = lockedNum;
    const sql = 'INSERT INTO number_detail(phone_num,busi_type,detail_json,create_by,update_by) VALUES (?, ?, ?, ?, ?);';
    const addSqlParams = [ res_id, type, JSON.stringify(lockedNum), user, user ];
    return await this.app.mysql.query(sql, addSqlParams);
  }

}

module.exports = OrderService;
