'use strict';

const { Service } = require('egg');
const AttackNumber = require('../utils/attackNumber');
const GlobalError = require('../utils/GlobalError');
const { JSESSION_EXPIRE_TIME, ADMIN_PREFIX } = require('../constants/redis');
const { FILERPARAMS } = require('../constants');
const { RESULT_FAIL } = require('../constants/result');

class AttackNumberService extends Service {
  async query(aNumb, force = false, { token, filerParams }) {
    let sessionId = await this.app.redis.get(ADMIN_PREFIX + token);

    // 第一次或1小时后重新认证一下
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
    const phoneNumbs = await aNumb.searchPhNum(sessionId, filerParams);
    this.app.logger.info('【查号码】：%s', '完成');
    return { phoneNumbs, sessionId };
  }

  async autoAttack({ token, force = false }) {

    const aNumb = new AttackNumber(this.app, token);
    const lockedNumb = [];

    try {
      // 按条件拿号码
      const { phoneNumbs, sessionId } = await this.query(aNumb, force, { token, filerParams: FILERPARAMS });

      // const data = require('../../test/data/phone.json');
      // const sessionId = '';
      // const phoneNumbs = data.selectPool;

      // 按规则,过滤出靓号
      const prettyNo = await aNumb.getSelectPhNumByRule(phoneNumbs.selectPool);

      // const prettyNo = ['18321578974'],
      // sessionId = 'JSESSIONID=967ec90198624822f59adf717668';

      // 锁号
      for (const item of prettyNo) {
        try {
          await aNumb.attackNumber(sessionId, item.phone);
          lockedNumb.push(item.phone + '|' + item.rule);
          // 锁号完,调页面接口
          await aNumb.afterAttackNum(sessionId, item.phone);
        } catch (error) {
          this.app.logger.info('【锁号失败】：%s', item.phone);
          this.app.logger.info('【锁号信息】：%s', error);
        }
      }
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

  async queryAll({ token, force = false }) {
    try {
      const aNumb = new AttackNumber(this.app, token);
      const { phoneNumbs } = await this.query(aNumb, force, {
        token, filerParams: { ...FILERPARAMS },
      });

      return phoneNumbs;
    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }
}

module.exports = AttackNumberService;
