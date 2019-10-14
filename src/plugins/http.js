import axios from 'axios'

const MyHttpServrt = {}

MyHttpServrt.install = (Vue) => {


  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 请求拦截器
  axios.interceptors.request.use(function (config) {

    if (config.url !== 'login') {

      // console.log(config)

      // 获取token
      const token = localStorage.getItem('token')

      // 将token加入到请求头
      config.headers.common['Authorization'] = token;
    }
    return config;

  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServrt
