import api from '../api/apiConfig'
import request from '../api/request'

// 商品详情
export function _getProductDetail(data) {
  return request(api.getProductDetail + `/${data.id}`, 'get');
}

// 提交订单
export function _toSubmitOrder(data) {
  return request(api.toSubmitOrder, 'post', data);
}

// 订单详情
export function _getOrderDetailInfo(data) {
  return request(api.getOrderDetailInfo + `/${data.id}`, 'get');
}

// 订单支付
export function _submitPayment(data) {
  return request(api.submitPayment, 'post', data);
}

// 支付成功回调
export function _sendPayBack(data) {
  return request(api.sendPayBack + `/${data.id}`, 'get');
}

// 技工添加时间提交
export function _addWorkTime(data) {
  return request(api.addWorkTime, 'post', data);
}

// 预约面试 --> 列表按钮
export function _addAppoint(data) {
  return request(api.addAppoint, 'post', data);
}

// 获取用户预约列表
export function _getAppointList(data) {
  return request(api.getAppointList, 'post', data);
}

// 取消预约
export function _delAppoint(data) {
  return request(api.delAppoint + `/${data.id}`, 'get');
}

// 获取 阿姨-技工 详情
export function _getEmployeeDetail(data) {
  return request(api.getEmployeeDetail, 'post', data);
}

// 获取已预约时间
export function _getWorkTime(data) {
  return request(api.getWorkTime + `/${data.indentId}`, 'get');
}

// 获取服务明细列表 
export function _getServiceDetailsList(data) {
  return request(api.getServiceDetailsList + `/${data.indentId}`, 'get', data);
}

// 微信支付 wxPayOrder
export function _wxPayOrder(data) {
  return request(api.wxPayOrder + `/${data.indentId}`, 'post');
}
