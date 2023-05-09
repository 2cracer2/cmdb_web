/**
 * File: /Users/ecrose/Code/LearnDjango/devops-test/src/api/table.js
 * Project: /Users/ecrose/Code/LearnDjango/devops-test
 * Created Date: Tuesday, August 9th 2022, 3:07:23 pm
 * Author: Cracer
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2022 Cracer Inc.
 * ------------------------------------
 * Javascript will save your soul!
 */


import require from '@/utils/request'

export function getList(params) {
  return request({
    url: '/users',
    method: 'GET',
    params
  })
}
