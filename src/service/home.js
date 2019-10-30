import api from '../api/apiConfig'
import request from '../api/request'

// 首页商品展示
export function _getHomeList(data) {
  return request(api.getHomeList, 'post', data);
}

// 发送code
export function _getOpenId(data) {
  return request(api.getOpenId + `/${data.id}`, 'get');
}

// 获取home-tab产品列表
export function _getHomeProductList(data) {
  return request(api.getHomeProductList, 'post', data);
}

// 用户用户消息
export function _getUserMessage(data) {
  return request(api.getUserMessage, 'get', data);
}

// 发送定位
export function _sendChangeLocation(data) {
  return request(api.sendChangeLocation, 'post', data);
}
