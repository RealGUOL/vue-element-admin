import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/depot/list',
    method: 'get',
    params: query
  })
}

export function fetchDepot(id) {
  return request({
    url: '/vue-element-admin/depot/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/depot/pv',
    method: 'get',
    params: { pv }
  })
}

export function createDepot(data) {
  return request({
    url: '/vue-element-admin/depot/create',
    method: 'post',
    data
  })
}

export function updateDepot(data) {
  return request({
    url: '/vue-element-admin/depot/update',
    method: 'post',
    data
  })
}
