/**
 * File: /Users/ecrose/Code/LearnDjango/devops-test/src/api/users.js
 * Project: /Users/ecrose/Code/LearnDjango/devops-test
 * Created Date: Tuesday, August 9th 2022, 2:54:57 pm
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

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/users/',
    method: 'get',
    params
  })
}

// 创建用户
export function createUser(params) {
  return request({
    url: '/users/',
    method: 'post',
    data: params
  })
}

// 更新用户
export function updateUser(params) {
  return request({
    url: '/users/' + params.id + '/',
    method: 'patch',
    data: params
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/users/' + id + '/',
    method: 'delete'
  })
}

// 更新用户的属组
export function updateUserGroup(id, data) {
  return request({
    url: '/usergroup/' + id + '/',
    method: 'patch',
    data
  })
}

// 更新用户的密码
export function changeUserPass(id, data) {
  return request({
    url: '/chuserpasswd/' + id + '/',
    method: 'put',
    data
  })
}
