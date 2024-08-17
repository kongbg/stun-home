import request from "@/utils/request";

const urlKey = '/urls'

// 新增
export const create = (data) => {
  return request({
    url: `${urlKey}/create`,
    method: "post",
    data
  })
}

// 编辑
export const update = (data) => {
  return request({
    url: `${urlKey}/update`,
    method: "post",
    data
  })
}


// 查询列表
export const getData = (params) => {
  return request({
    url: `${urlKey}/getData`,
    method: "get",
    params
  })
}

// 查询详情
export const getDetails = (params) => {
  return request({
    url: `${urlKey}/getDetails`,
    method: "get",
    params
  })
}

// 删除
export const del = (data) => {
  return request({
    url: `${urlKey}/delete`,
    method: "post",
    data
  })
}

// 查询列表(带children)
export const getDatas = (params) => {
  return request({
    url: `${urlKey}/getDatas`,
    method: "get",
    params
  })
}

// 通过code新增、更新
export const updateUrl = (data) => {
  return request({
    url: `${urlKey}/updateUrl`,
    method: "post",
    data
  })
}

