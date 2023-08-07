'use strict';

const Controller = require('egg').Controller;
const { setResult } = require('../utils');

class OrderController extends Controller {

  async order() {
    const { ctx } = this;
    const result = await ctx.service.orderService.order(ctx.request.body);
    ctx.body = setResult({ data: result });
  }

  async search() {
    const { ctx } = this;
    const result = await ctx.service.orderService.queryAll(ctx.request.query);
    ctx.body = setResult({ data: result });
  }

  async myStoreNums() {
    const { ctx } = this;
    const result = await ctx.service.orderService.queryStoreNums(ctx.request.query);
    ctx.body = setResult({ data: result });
  }

  async delete() {
    const { ctx } = this;
    const result = await ctx.service.orderService.delete(ctx.request.body);
    ctx.body = setResult({ data: result });
  }

}

module.exports = OrderController;
