'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;

  router.get(`${config.contextPath}/order/mystore`, controller.order.myStoreNums);

  router.post(`${config.contextPath}/order/order`, controller.order.order);

  router.post(`${config.contextPath}/order/delete`, controller.order.delete);

  router.get(`${config.contextPath}/order/search`, controller.order.search);
};
