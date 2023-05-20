/**
 * File: /Users/ecrose/Code/LearnDjango/devops-test/src/api/server.js
 * Project: /Users/ecrose/Code/LearnDjango/devops-test
 * Created Date: Tuesday, August 9th 2022, 2:53:35 pm
 * Author: Cracer
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2022 Cracer Inc.
 * ------------------------------------
 * Javascript will save your soul!
 */


import request from '@/utils/request'

// 获取server列表
export function getServerList(params) {
  return request({
    url: '/server/',
    method: 'get',
    params
  })
}

export function getAutoServerList(params) {
  return request({
    url: '/serverauto/',
    method: 'get',
    params
  })
}

// 创建server
export function createServer(params) {
  return request({
    url: '/server/',
    method: 'post',
    data: params
  })
}

// 删除服务器
export function deleteServer(id) {
  return request({
    url: '/server/' + id + '/',
    method: 'delete'
  })
}

// 更新服务器
export function updateServer(params) {
  return request({
    url: '/server/' + params.id + '/',
    method: 'patch',
    data: params
  })
}


// 获取serverIp列表
export function getserverIP(params) {
  return request({
    url: '/server/getserverIP',
    method: 'get',
    params
  })
}

// 进行自动安装
export function serverAutoInstall(params) {
  return request({
    url: '/server/autoInstalling/',
    method: 'post',
    data: params
  })
}