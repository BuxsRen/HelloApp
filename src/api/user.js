import Request from '../utils/Request';

// 登录
export function login(data) {
  return Request({
    url: '/api/login',
    method: 'POST',
    title: '正在登录,请稍后...',
    data,
  });
}

// 注册
export function register(data) {
  return Request({
    url: '/api/register',
    method: 'POST',
    title: '正在注册,请稍后...',
    data,
  });
}

// 获取图形验证码
export function getCode(param) {
  return Request({
    url: '/api/get/code',
    method: 'GET',
    title: '正在处理,请稍后...',
    param,
    close: false
  });
}

// 获取邮箱验证码
export function getEmaliCode(data) {
  return Request({
    url: '/api/emali/code',
    method: 'POST',
    title: '正在发送,请稍后...',
    data,
  });
}

// 用户列表
export function list(param) {
  return Request({
    url: '/api/user/list',
    method: 'GET',
    title: '正在加载,请稍后...',
    param,
  });
}

// 获取邮箱验证码
export function star(data) {
  return Request({
    url: '/api/user/star',
    method: 'POST',
    data,
    load: false,
    close: false,
  });
}

// 用户信息
export function userInfo(param) {
  return Request({
    url: '/api/user/info',
    method: 'GET',
    load: false,
    close: false,
    param,
  });
}

// 修改资料
export function updateUser(data) {
  return Request({
    url: '/api/user/update',
    method: 'POST',
    data,
  });
}

// 上传图片
export function uploadImages(data) {
  return Request({
    url: '/api/upload',
    method: 'POST',
    header: {'Content-Type': 'multipart/form-data'},
    data,
  });
}

