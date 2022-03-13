import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/record/list',
    method: 'get',
    params: query
  })
}

export function fetchRecord(id) {
  return request({
    url: '/vue-element-admin/record/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/record/pv',
    method: 'get',
    params: { pv }
  })
}

export function createRecord(data) {
  return request({
    url: '/vue-element-admin/record/create',
    method: 'post',
    data
  })
}

export function updateRecord(data) {
  return request({
    url: '/vue-element-admin/record/update',
    method: 'post',
    data
  })
}

export function deleteRecord(data) {
  return request({
    url: '/vue-element-admin/record/delete',
    method: 'post',
    data
  })
}
