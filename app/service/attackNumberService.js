'use strict';

const { Service } = require('egg');
const AttackNumber = require('../utils/attackNumber');
const GlobalError = require('../utils/GlobalError');
const { ADMIN_EXPIRE_TIME, ADMIN_PREFIX } = require('../constants/redis');
const { FILERPARAMS } = require('../constants');
const { RESULT_FAIL } = require('../constants/result');

class AttackNumberService extends Service {
  async query(aNumb, force = false, { token, filerParams }) {
    let sessionId = await this.app.redis.get(ADMIN_PREFIX + token);

    try {
      // 第一次或1小时后重新认证一下
      if (!sessionId || force) {
        // 超时,自动 重新拿JSESSIONID
        sessionId = await aNumb.sendLocation();
        // 保存缓存
        await this.app.redis.set(ADMIN_PREFIX + token, sessionId, 'Ex', ADMIN_EXPIRE_TIME);
      }

      // sessionId = 'JSESSIONID=88e373ef9c6792fb46a158d78554';
      // 准备页面接口
      await aNumb.perpareAttackNumber(sessionId);

      // 按条件拿号码
      const phoneNumbs = await aNumb.searchPhNum(sessionId, filerParams);
      return { phoneNumbs, sessionId };
    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }

  async autoAttack({ token }) {
    const aNumb = new AttackNumber(this.app, token);

    try {
      // 按条件拿号码
      const { phoneNumbs, sessionId } = await this.query(aNumb, { token, filerParams: FILERPARAMS });

      // 按规则,过滤出靓号
      const prettyNo = await aNumb.getSelectPhNumByRule(phoneNumbs);

      // 锁号
      for (const no of prettyNo) {
        await aNumb.attackNumber(sessionId, no);
        // 锁号完,调页面接口
        await aNumb.afterAttackNum(sessionId, no);
      }
    } catch (error) {
      throw new GlobalError(RESULT_FAIL, error.message);
    }
  }

  async queryMyOwn({ token }) {
    const aNumb = new AttackNumber(this.app, token);
    const { phoneNumbs } = await this.query(aNumb, false, {
      token, filerParams: { ...FILERPARAMS, isPreLock: '1' },
    });

    return phoneNumbs;
  }

  async queryAll({ token }) {
    const aNumb = new AttackNumber(this.app, token);
    const { phoneNumbs } = await this.query(aNumb, false, {
      token, filerParams: { ...FILERPARAMS },
    });

    return phoneNumbs;
  }
}

module.exports = AttackNumberService;
