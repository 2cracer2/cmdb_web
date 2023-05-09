import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getHostsList(params) {
  return request({
    url: '/api/hosts/',
    method: 'get',
    params
  })
}

export function deleteHost(host_id) {
  return request({
    url: '/api/hosts/' + host_id + '/',
    method: 'delete',
  })
}

export function updateHost(host_id, data) {
  return request({
    url: '/api/hosts/' + host_id + '/',
    method: 'patch',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/api/user_create/',
    method: 'post',
    data
  })
}

export function activateUser(code) {
  return request({
    url: '/api/user_activate/' + code + '/',
    method: 'get',
  })
}
