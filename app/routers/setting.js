'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  // const checkTokenHandler = app.middleware.checkTokenHandler();

  router.get(`${config.contextPath}/setting/list`, controller.setting.settingList);
  router.post(`${config.contextPath}/setting/edit`, controller.setting.editSetting);
};
