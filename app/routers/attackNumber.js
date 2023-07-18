'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  const checkTokenHandler = app.middleware.checkTokenHandler();

  router.get(`${config.contextPath}/attack/my`, checkTokenHandler, controller.attackNumer.myPhoneNumbs);

  router.get(`${config.contextPath}/attack/all`, checkTokenHandler, controller.attackNumer.queryAll);

  router.post(`${config.contextPath}/attack/auto`, checkTokenHandler, controller.attackNumer.autoAttackNumbs);
};
