const Fly = require("flyio/dist/npm/wx");
const fly = new Fly;
import store from '../store/index'
import qs from 'qs'
import * as types from '../store/mutations';
import {
  _getOpenId
} from '../service/home'
//设置超时
fly.config.timeout = 20000;
//设置请求基地址
// fly.config.baseURL = 'http://192.168.1.113:8888';
fly.config.baseURL = 'https://api.omnrj.com';
// https://api.omnrj.com/swagger-ui.html     
// https://file.omnrj.com
//给所有请求添加自定义header
fly.config.headers["X-Tag"] = "flyio";
fly.config.headers["smstoken"] = "";
fly.config.headers["jsonType"] = "jsonType";
var smstoken = "";
// Fly.config.headers['content-type'] = 'application/x-www-form-urlencoded';
// Fly.config.headers['cache-control'] = 'no-cache';

function fetch(url, method = 'get', data = {}) {
  // 添加请求拦截器
  fly.interceptors.request.use((request) => {
    if (smstoken) {
      request.headers["smstoken"] = smstoken;
    }
    if (store.state.login.authorization) {
      request.headers["authorization"] = store.state.login.authorization;
    }
    if (method == "post") {
      let a = qs.parse(request.body);
      if (a.loading) {
        wx.showLoading({
          title: '加载中',
          mask: false
        });
      }
      if (a.md5Str) {
        request.headers["cipher"] = a.md5Str;
      }
    } else {
      if (request.body.loading) {
        wx.showLoading({
          title: '加载中',
          mask: false
        });
      }
    }
    return request;
  });

  // 添加响应拦截器，响应拦截器会在then/catch处理之前执行
  fly.interceptors.response.use((res) => {
    if (res.headers.smstoken) {
      fly.config.headers["smstoken"] = smstoken = res.headers.smstoken[0];
    }
    if (res.headers.authorization) {
      let anthToken = {
        token: res.headers.authorization[0],
        name: 'setToken'
      }
      store.commit(types.SET_AUTHORIZATION, anthToken);
      fly.config.headers["authorization"] = anthToken.token;
    }
    if (res.data.data.code == 100021) {
      console.log('code --> 100021')
      let anthToken = {
        token: '',
        phoneLogin: false,
        phoneNum: '',
      }
      store.commit(types.SET_AUTHORIZATION, anthToken);
      wx.login({
        success: function (res) {
          if (res.code) {
            let params = {
              id: res.code
            };
            _getOpenId(params);
          }
        }
      });
      let url = `../forget_password/main`;
      wx.navigateTo({
        url
      });
    } else if (res.data.code == 200 || 201) {
      wx.hideLoading();
    }
    return res
  }, (err) => {
    //发生网络错误后会走到这里
    return Promise.reject(err);
  });

  switch (method) {
    case 'get':
      return fly.get(url, data);
    case 'post':
      // data instanceof 'FormData'
      if (data.img) {
        return fly.post(url, data);
      } else {
        return fly.post(url, qs.stringify(data));
      }
      return fly.post(url, data);
    default:
      return fly.get(url, data);
  };
};

function request(url, method = 'get', data = {}) {
  return new Promise((resolve, reject) => {
    const resData = fetch(url, method, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    return resData;
  });
}

// request('/productType/list', 'get').then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })

export default request;

/*
    在小程序项目中，通常需要在请求header中带上token,以识别用户身份，每一个请求都去做判断处理十分的麻烦，
    因此想到了用flyio,fly和axios十分相似，但是axios并不能在小程序中使用，因此还是选择了fly。

    fly里面的拦截机制还是很强大的，并且在错误返回信息做了优化处理，在fly拦截器中支持执行异步任务，
    就是说在请求数据的时候如果拦截到token不存在那么我们就可以在拦截器中重新获取token，再接着执行之前的请求。
*/
