'use strict';

const Controller = require('egg').Controller;
const { setResult } = require('../utils');

class AttackNumerController extends Controller {
  async myPhoneNumbs() {
    const { ctx } = this;
    const result = await ctx.service.attackNumberService.queryMyOwn(ctx.request.query);
    ctx.body = setResult({ data: result });
  }

  async myStoreNums() {
    const { ctx } = this;
    const result = await ctx.service.attackNumberService.queryStoreNums(ctx.request.query);
    ctx.body = setResult({ data: result });
  }

  async autoAttackNumbs() {
    const { ctx } = this;
    const result = await ctx.service.attackNumberService.autoAttack(ctx.request.body);
    ctx.body = setResult({ data: result });
  }

  async queryAll() {
    const { ctx } = this;
    const result = await ctx.service.attackNumberService.queryAll(ctx.request.query);
    ctx.body = setResult({ data: result });
  }

  async order() {
    const { ctx } = this;
    const result = await ctx.service.attackNumberService.order(ctx.request.body);
    ctx.body = setResult({ data: result });
  }

  async search() {
    const { ctx } = this;
    const result = await ctx.service.attackNumberService.queryAll(ctx.request.query);
    ctx.body = setResult({ data: result });
  }
}

module.exports = AttackNumerController;
