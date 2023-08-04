/*
 Navicat Premium Data Transfer

 Source Server         : uat-mysql
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : 39.99.238.155:3306
 Source Schema         : admin_demo

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 26/04/2022 11:38:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for schedule_job
-- ----------------------------
DROP TABLE IF EXISTS `schedule_job`;
CREATE TABLE `schedule_job` (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `cron` varchar(50) NOT NULL DEFAULT '' COMMENT 'cron表达式',
  `jobName` varchar(100) NOT NULL DEFAULT '' COMMENT '任务名',
  `jobHandler` varchar(100) NOT NULL DEFAULT '' COMMENT '任务处理方法',
  `params` varchar(255) NOT NULL COMMENT '参数',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `runMode` tinyint(1) NOT NULL DEFAULT '0' COMMENT '运行模式\n\n0: BEAN模式：任务以JobHandler方式维护在执行器端；需要结合 "JobHandler" 属性匹配执行器中任务\n1: Shell模式：任务以源码方式维护在调度中心；该模式的任务实际上是一段 "shell" 脚本\n',
  `runSource` mediumtext COMMENT '源代码',
  `status` int(1) NOT NULL DEFAULT '-1' COMMENT '状态 0启用 -1停止',
  `create_by` varchar(100) NOT NULL COMMENT '创建人',
  `update_by` varchar(100) NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0:未删除 -1:删除',
  PRIMARY KEY (`job_id`) USING BTREE,
  UNIQUE KEY `ind_id` (`job_id`) USING BTREE,
  KEY `ind_handler` (`jobHandler`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='定时任务表';

-- ----------------------------
-- Records of schedule_job
-- ----------------------------
BEGIN;
INSERT INTO `schedule_job` VALUES (1, '*/5 * * * * *', 'testHandler', 'testHandler', '', '', 0, '', -1, 'admin', 'admin', '2022-04-26 11:19:52', '2022-04-26 11:35:18', 0);
INSERT INTO `schedule_job` VALUES (2, '0 0 0 * * *', 'testCurlHandler', 'testCurlHandler', '{\n    \"url\": \"http://daodi-herbs.com/more_system/demo.php\",\n    \"method\": \"POST\",\n    \"data\": {\n        \"name\": \"XXX\",\n        \"address\": \"123\"\n    }\n}', '', 0, '', -1, 'admin', 'admin', '2022-01-21 19:10:08', '2022-04-26 11:23:14', 0);
INSERT INTO `schedule_job` VALUES (3, '0 0 0 * * *', 'testShell', '', 'wq21', '123213', 1, '#!/bin/sh\n\n# 由于当前实现原因，接受参数应从第二位开始\n\nnode -v\n\nnpm -v\n\necho \"hello shell\"\n\nexit 0', -1, 'admin', 'admin', '2022-03-26 22:57:45', '2022-04-26 11:27:06', 0);
COMMIT;

-- ----------------------------
-- Table structure for schedule_job_log
-- ----------------------------
DROP TABLE IF EXISTS `schedule_job_log`;
CREATE TABLE `schedule_job_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL COMMENT '任务ID',
  `job_handler` varchar(100) NOT NULL DEFAULT '' COMMENT '任务处理方法',
  `job_param` varchar(255) NOT NULL DEFAULT '' COMMENT '任务参数',
  `handle_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '任务执行时间',
  `job_log` text NOT NULL COMMENT '任务日志',
  `job_status` int(1) NOT NULL DEFAULT '0' COMMENT '任务执行状态：0-成功 -1-失败',
  `error_log` text NOT NULL COMMENT '任务异常日志',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `trigger_type` int(1) NOT NULL DEFAULT '0' COMMENT '触发类型：0-任务触发 1-手动触发',
  `execution_status` int(1) NOT NULL DEFAULT '0' COMMENT '任务状态：0-执行中 1-执行完成',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `ind_job_id` (`job_id`),
  KEY `ind_job_handler` (`job_handler`),
  KEY `ind_job_status` (`job_status`),
  KEY `ind_execution_status` (`execution_status`),
  KEY `ind_trigger_type` (`trigger_type`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='定时任务执行日志';

-- ----------------------------
-- Records of schedule_job_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_admin
-- ----------------------------
DROP TABLE IF EXISTS `sys_admin`;
CREATE TABLE `sys_admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` varchar(255) NOT NULL DEFAULT '' COMMENT '用户名',
  `avatar_url` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `role_id` int(2) NOT NULL DEFAULT '0' COMMENT '角色',
  `google_secret_key` varchar(100) NOT NULL DEFAULT '' COMMENT '谷歌私钥',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_by` varchar(255) NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统管理员';

-- ----------------------------
-- Records of sys_admin
-- ----------------------------
BEGIN;
INSERT INTO `sys_admin` VALUES (1, 'admin', 'https://oss-blog.myjerry.cn/files/avatar/blog-avatar.jpg', 'e10adc3949ba59abbe56e057f20f883e', 1, '', 0, 'system', 'system', '2020-12-11 06:28:54', '2022-04-26 11:15:22');
COMMIT;

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL COMMENT '操作人ID',
  `role_id` int(11) NOT NULL COMMENT '操作人角色',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `ip` varchar(50) NOT NULL DEFAULT '' COMMENT '操作人IP',
  `client` varchar(100) NOT NULL DEFAULT '' COMMENT '操作人客户端信息',
  `content` varchar(255) NOT NULL DEFAULT '' COMMENT '操作内容',
  `level` tinyint(1) NOT NULL DEFAULT '0' COMMENT '操作等级',
  PRIMARY KEY (`id`),
  KEY `ind_admin_id` (`admin_id`) USING BTREE,
  KEY `ind_ip` (`ip`) USING BTREE,
  KEY `ind_level` (`level`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志';

-- ----------------------------
-- Records of sys_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '上一级菜单ID',
  `title` varchar(255) NOT NULL COMMENT '菜单标题',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '组件名称',
  `component` varchar(255) NOT NULL DEFAULT '' COMMENT '组件',
  `menu_sort` int(2) NOT NULL DEFAULT '0' COMMENT '排序',
  `icon` varchar(255) NOT NULL DEFAULT '' COMMENT '图标',
  `path` varchar(255) NOT NULL DEFAULT '' COMMENT '路径',
  `redirect` varchar(255) NOT NULL DEFAULT '' COMMENT '重定向',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_by` varchar(255) NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否显示',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统菜单';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 'System', 'layout', 99, 'setting', 'system', '/system/admin', 0, 'admin', 'admin', '2020-12-13 04:42:46', '2020-12-30 23:00:57', 0);
INSERT INTO `sys_menu` VALUES (3, 1, '账号管理', 'SystemAdmin', 'system/admin', 1, 'eye-open', 'admin', '', 0, 'admin', 'admin', '2020-12-13 04:57:48', '2022-03-29 12:03:49', 0);
INSERT INTO `sys_menu` VALUES (4, 1, '菜单管理', 'SystemMenu', 'system/menu', 2, 'menu', 'menu', '', -1, 'admin', 'admin', '2020-12-13 04:58:25', '2022-04-09 03:35:16', 0);
INSERT INTO `sys_menu` VALUES (5, 1, '角色管理', 'SystemRole', 'system/role', 3, 'user', 'role', '', 0, 'admin', 'admin', '2020-12-13 04:59:11', '2021-07-29 04:55:26', 0);
INSERT INTO `sys_menu` VALUES (6, 0, '任务管理', 'Task', 'layout', 1, 'task', 'task', '/task/schedule', 0, 'admin', 'admin', '2020-12-15 23:13:09', '2022-01-20 12:41:13', 0);
INSERT INTO `sys_menu` VALUES (7, 6, '定时任务管理', 'TaskSchedule', 'task/schedule', 2, 'schedule', 'schedule', '', 0, 'admin', 'admin', '2020-12-15 23:15:54', '2022-04-02 17:49:12', 0);
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '角色名',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `create_by` varchar(255) NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES (1, '超级管理员', '拥有系统所有权限', 'admin', 'admin', '2020-12-13 04:55:17', '2021-09-04 00:56:58');
-- INSERT INTO `sys_role` VALUES (2, '运营', '运营角色', 'admin', 'admin', '2020-12-16 01:08:16', '2021-11-30 17:00:39');
-- INSERT INTO `sys_role` VALUES (3, '业务员', '业务员', 'admin', 'admin', '2021-09-17 06:06:59', '2021-09-18 17:06:37');
-- INSERT INTO `sys_role` VALUES (4, '1', '1', 'admin', 'admin', '2021-12-22 10:04:33', '2021-12-22 10:04:33');
-- INSERT INTO `sys_role` VALUES (5, 'v', '方法', 'admin', 'admin', '2022-04-25 12:00:02', '2022-04-25 12:00:02');
COMMIT;

-- ----------------------------
-- Table structure for sys_roles_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles_menus`;
CREATE TABLE `sys_roles_menus` (
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色菜单关联';

-- ----------------------------
-- Records of sys_roles_menus
-- ----------------------------
BEGIN;
INSERT INTO `sys_roles_menus` VALUES (7, 1);
INSERT INTO `sys_roles_menus` VALUES (3, 1);
INSERT INTO `sys_roles_menus` VALUES (4, 1);
INSERT INTO `sys_roles_menus` VALUES (5, 1);
INSERT INTO `sys_roles_menus` VALUES (7, 2);
INSERT INTO `sys_roles_menus` VALUES (7, 3);
INSERT INTO `sys_roles_menus` VALUES (4, 3);
INSERT INTO `sys_roles_menus` VALUES (5, 3);
INSERT INTO `sys_roles_menus` VALUES (4, 4);
INSERT INTO `sys_roles_menus` VALUES (5, 4);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
