'use strict';

const AttackNumber = require('./AttackNumber');
const GlobalError = require('./GlobalError');

class Worker {
  constructor() {

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

  run() { }
}

