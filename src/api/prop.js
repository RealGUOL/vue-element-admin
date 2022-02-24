import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/prop/list',
    method: 'get',
    params: query
  })
}

export function fetchProp(id) {
  return request({
    url: '/vue-element-admin/prop/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/prop/pv',
    method: 'get',
    params: { pv }
  })
}

export function createProp(data) {
  return request({
    url: '/vue-element-admin/prop/create',
    method: 'post',
    data
  })
}

export function updateProp(data) {
  return request({
    url: '/vue-element-admin/prop/update',
    method: 'post',
    data
  })
}
