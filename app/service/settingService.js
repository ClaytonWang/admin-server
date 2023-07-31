'use strict';

const { Service } = require('egg');
const { SCHEDULE_STATUS, SCHEDULE_TRIGGER_TYPE, SCHEDULE_RUN_MODE, SCHEDULE_DELETE, ACTIVE_KYES } = require('../constants');
const { RESULT_FAIL } = require('../constants/result');
const GlobalError = require('../utils/GlobalError');

class SettingService extends Service {
  async settingList({ page = 1, size = 20 }) {
    const limit = parseInt(size),
      offset = parseInt(page - 1) * parseInt(size);

    const [list, total] = await Promise.all([
      this.app.mysql.select('config_detail', {
        where: { is_delete: SCHEDULE_DELETE.MANUAL },
        orders: [['cfg_id', 'asc']],
        limit,
        offset,
      }),
      this.app.mysql.count('config_detail'),
    ]);
    return { list, total };
  }

  async editSetting(userName, { cfg_id, name, token, period_time, maxStoreMount, prestore_fee, mini_fee, reg_exp = '' }) {
    if (!cfg_id) {
      // 新增
      return await this.app.mysql.insert('config_detail', {
        name,
        token,
        period_time,
        maxStoreMount,
        prestore_fee,
        mini_fee,
        reg_exp,
        create_time: new Date(),
        create_by: userName,
        update_time: new Date(),
        update_by: userName,
      });
    }
    // 修改
    await this.app.mysql.update('config_detail', {
      update_time: new Date(),
      update_by: userName,
      name,
      token,
      period_time,
      maxStoreMount,
      prestore_fee,
      mini_fee,
      reg_exp,
    }, { where: { cfg_id } });
  }

}

module.exports = SettingService;
