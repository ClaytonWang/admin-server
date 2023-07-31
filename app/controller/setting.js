'use strict';

const Controller = require('egg').Controller;
const { setResult } = require('../utils');

class SettingController extends Controller {
  async settingList() {
    const { ctx } = this;
    const result = await ctx.service.settingService.settingList(ctx.request.query);
    ctx.body = setResult({ data: result });
  }

  async editSetting() {
    const { ctx } = this;
    const { username } = ctx.request.headers;
    await ctx.service.taskService.editSchedule(username, ctx.request.body);
    ctx.body = setResult();
  }
}

module.exports = SettingController;
