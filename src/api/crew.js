import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/crew/list',
    method: 'get',
    params: query
  })
}

export function fetchCrew(id) {
  return request({
    url: '/vue-element-admin/crew/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/crew/pv',
    method: 'get',
    params: { pv }
  })
}

export function createCrew(data) {
  return request({
    url: '/vue-element-admin/crew/create',
    method: 'post',
    data
  })
}

export function updateCrew(data) {
  return request({
    url: '/vue-element-admin/crew/update',
    method: 'post',
    data
  })
}

export function deleteCrew(data) {
  return request({
    url: '/vue-element-admin/depot/delete',
    method: 'post',
    data
  })
}

