import request from '@/utils/request'

// 获取安装记录列表
export function getRecordsList(params) {
  return request({
    url: '/records/',
    method: 'get',
    params
  })
}

export function getRecordInstalling(params) {
    return request({
      url: '/records/getrecordsinstalling/',
      method: 'get',
      params
    })
  }