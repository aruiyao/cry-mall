import axios from 'axios';
import vMessage from '@/components/messageTips';
import qs from 'qs';
import router from '@/router';

const service = axios.create({
  // 请求超时时间
  // timeout: 3000
});
// service.defaults.withCredentials = true;
// service.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
service.interceptors.request.use(
  async config => {
    if (localStorage.getItem('token')) {
      config.headers.common.Authorization = localStorage.getItem('token');
      config.headers.common.userId = localStorage.getItem('userId');
    }
    return config;
  },
  err => {
    console.log(err);
  }
);
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response;
    } else if (response.status === 207) {
      console.log(router.currentRoute);
      router.push({
        name: 'login',
        query: {
          redirectUrl: location.href
        }
      });
    }
  },
  err => {
    // console.log(err.request);
    if (err.request.status === 510) {
      // return Promise.resolve(err.response);
      // return err.response;
    } else {
      return Promise.reject(err.request);
    }
  }
);

const asyncGet = (url, params, config, errorExt) => {
  const obj = Object.assign({
    url: `${window.projectConfig.url}/${url}`,
    method: 'get',
    params
  }, config);
  return to(service(obj), errorExt);
};
const asyncDownload = (url, params, config, errorExt) => {
  const obj = Object.assign({
    url: `${window.projectConfig.url}/${url}`,
    method: 'get',
    params,
    responseType: 'arraybuffer'
  }, config);
  return to(service(obj), errorExt);
};
const asyncPost = (url, data, config, errorExt) => {
  const obj = Object.assign({
    url: `${window.projectConfig.url}/${url}`,
    method: 'post',
    data
    // data: qs.stringify(data)
  }, config);
  return to(service(obj), errorExt);
};
const asyncPut = (url, data, config, errorExt) => {
  const obj = Object.assign({
    url: `${window.projectConfig.url}/${url}`,
    method: 'put',
    data
  }, config);
  return to(service(obj), errorExt);
};
const asyncDelete = (url, params, config, errorExt) => {
  const obj = Object.assign({
    url: `${window.projectConfig.url}/${url}`,
    method: 'delete',
    params
  }, config);
  return to(service(obj), errorExt);
};

const to = (promise, errorExt = '未知错误') => {
  return promise
    .then(function (data) {
      return [null, data];
    })
    .catch(function (err) {
      if (errorExt) {
        Object.assign(err, { errorExt });
      }
      vMessage.error(`${err.errorExt} [ code：${err.status} ]`);
      return [err, undefined];
    });
};

const exportObj = {
  service,
  to,
  asyncGet,
  asyncPost,
  asyncPut,
  asyncDelete,
  asyncDownload
};

export default exportObj;
