import api from '../api/apiConfig'
import request from '../api/request'

// 手机验证码发送
export function _sendRegCode(data) {
  return request(api.sendRegCode, 'post', data);
}

// 手机注册提交
export function _phoneRegSubmit(data) {
  return request(api.phoneRegSubmit, 'post', data);
}

// 手机登陆
export function _phoneLogin(data) {
  return request(api.phoneLogin, 'post', data);
}

// 修改昵称
export function _changeNickName(data) {
  return request(api.changeNickName, 'post', data);
}

// 修改头像
export function _changeHeaderImg(data) {
  return request(api.changeHeaderImg, 'post', data);
}

// 获取用户信息
export function _getUserInfo(data) {
  return request(api.getUserInfo, 'get', data);
}

// 修改密码
export function _changePassword(data) {
  return request(api.changePassword, 'post', data);
}

// 我的订单列表
export function _getOrderList(data) {
  return request(api.getOrderList, 'post', data);
}

// 待支付列表
export function _getToBePaidList(data) {
  return request(api.getToBePaidList, 'get', data);
}

// 用户订单地址列表
export function _getUserAddress(data) {
  return request(api.getUserAddress, 'post', data);
}

// 获取用户地址
export function _getMyUserAddress(data) {
  return request(api.getMyUserAddress, 'post', data);
}

// 编辑修改地址
export function _editUserAddress(data) {
  return request(api.editUserAddress, 'post', data);
}

// 添加地址
export function _addAddress(data) {
  return request(api.addAddress, 'post', data);
}

// 删除地址
export function _delAddress(data) {
  return request(api.delAddress + `/${data.id}`, 'GET');
}

// 获取已评价列表
export function _getServicesData(data) {
  return request(api.getServicesData, 'get', data);
}

// 获取待评价列表
export function _getNoneServicesData(data) {
  return request(api.getNoneServicesData, 'post', data);
}

// 获取已评价单个所有列表
export function _getServicesList(data) {
  return request(api.getServicesList, 'post', data);
}

// 获取 checkbox 评价item
export function _getCheckServicesItem(data) {
  return request(api.getCheckServicesItem + `/${data.servicesId}`, 'get');
}

// 添加评论
export function _addServices(data) {
  return request(api.addServices, 'post', data);
}

// 发送wx用户授权信息
export function _sendWXuserInfo(data) {
  return request(api.sendWXuserInfo, 'post', data);
}

// 绑定手机登陆
export function _bindPhone(data) {
  return request(api.bindPhone, 'post', data);
}

// 手机快捷登陆
export function _phoneCodeLogin(data) {
  return request(api.phoneCodeLogin, 'post', data);
}
