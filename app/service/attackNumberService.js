'use strict';

const { Service } = require('egg');
const AttackNumber = require('../utils/attackNumber');
const GlobalError = require('../utils/GlobalError');
const { JSESSION_EXPIRE_TIME, ADMIN_PREFIX } = require('../constants/redis');
const { FILERPARAMS } = require('../constants');
const { RESULT_FAIL } = require('../constants/result');

class AttackNumberService extends Service {
  async query(aNumb, { force = false, token, filerParams, isAuto = false }) {
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
    if (isAuto) {
      for (let i = 0; i < 10; i++) {
        if (phoneNumbs.length > 0) {
          break;
        } else {
          this.app.logger.info('【查号码】：%s', i);
          phoneNumbs = await aNumb.searchPhNum(sessionId, filerParams);
        }
      }
    } else {
      phoneNumbs = await aNumb.searchPhNum(sessionId, filerParams);
    }

    this.app.logger.info('【查号码】：%s', '完成');
    return { phoneNumbs, sessionId };
  }

  async autoAttack({ token, force = false, filer = FILERPARAMS }) {

    const aNumb = new AttackNumber(this.app, token);
    const lockedNumb = [];

    try {
      // 按条件拿号码
      const { phoneNumbs, sessionId } = await this.query(aNumb, {
        isAuto: true,
        force,
        token, filerParams: {
          ...FILERPARAMS,
          ...filer,
        },
      });

      // const data = require('../../test/data/phone.json');
      // const sessionId = '';
      // const phoneNumbs = data.selectPool;

      // 按规则,过滤出靓号
      const prettyNo = await aNumb.getSelectPhNumByRule(phoneNumbs.selectPool);
      const noLogs = prettyNo.map(value => {
        return value.item.res_id + '|' + value.rule;
      });
      this.app.logger.info('【选中的号】：%s', prettyNo.length === 0 ? '当前条件没有靓号' : JSON.stringify(noLogs));

      // const prettyNo = ['18321578974'],
      // sessionId = 'JSESSIONID=967ec90198624822f59adf717668';

      // 锁号
      // for (const item of prettyNo) {
      //   try {
      //     await aNumb.attackNumber(sessionId, item.phone);
      //     lockedNumb.push(item.phone + '|' + item.rule);
      //     // 锁号完,调页面接口
      //     await aNumb.afterAttackNum(sessionId, item.phone);
      //   } catch (error) {
      //     this.app.logger.info('【锁号失败】：%s', item.phone);
      //     this.app.logger.info('【锁号信息】：%s', error);
      //   }
      // }
      return lockedNumb;
    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }

  async queryMyOwn({ token, force = false }) {

    try {
      const aNumb = new AttackNumber(this.app, token);
      const { phoneNumbs } = await this.query(aNumb, force, {
        token, filerParams: { ...FILERPARAMS, isPreLock: '1' },
      });
      return phoneNumbs;

    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }

  async queryStoreNums(user) {
    const sqlStr = `
    select DISTINCT * from number_detail
    where create_by = 'dls_bszg00414'
    AND create_time between DATE_ADD(date_format(now(),'%Y-%m-%d %H:%i:%s'),interval -30 MINUTE)
    AND date_format(now(),'%Y-%m-%d %H:%i:%s')`;

    const list = await this.app.mysql.query(sqlStr, [user]);
    return list;
  }

  async queryAll({ token, force = false, filerParams = FILERPARAMS }) {
    if (!token) { token = 'd3hlUXBqT2ZBMkxaTnI4ZUhLVGx6dlFpQTZBek96alVyYm5SSkl0V2daRVR0UEds'; }
    try {
      const aNumb = new AttackNumber(this.app, token);
      const { phoneNumbs } = await this.query(aNumb, force, {
        token, filerParams,
      });

      return phoneNumbs;
    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }

  async order(lockedNum, user = 'custom', type = 'order') {
    const { id: res_id } = lockedNum;
    const sql = 'INSERT INTO number_detail(phone_num,busi_type,detail_json,create_by,update_by) VALUES (?, ?, ?, ?, ?);';
    const addSqlParams = [res_id, type, JSON.stringify(lockedNum), user, user];
    return await this.app.mysql.query(sql, addSqlParams);
  }

}

module.exports = AttackNumberService;
