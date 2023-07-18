'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  // const checkTokenHandler = app.middleware.checkTokenHandler();

  router.get(`${config.contextPath}/attack/my`, controller.attackNumer.myPhoneNumbs);

  router.get(`${config.contextPath}/attack/all`, controller.attackNumer.queryAll);

  router.post(`${config.contextPath}/attack/auto`, controller.attackNumer.autoAttackNumbs);
};
