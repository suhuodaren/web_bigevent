// 放置 所有的 axios 相关配置

// 优化配置请求根路径
axios.defaults.baseURL = "http://big-event-api-t.itheima.net";

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    // config 是配置对象 配置请求头
    // 无论以什么开头，都带上 token信息
    // config.headers.Authorization = localStorage.getItem('token')

    // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
    if (config.url.indexOf("/my" !== -1)) {
      //  带有  /my 开头， 携带 token
      config.headers.Authorization = localStorage.getItem("token");
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // Do something before response is sent

    // 对response响应的数据进行判断，查看status和message结果
    // console.log("响应拦截器response",response);
    if (
      response.data.status === 1 &&
      response.data.message === "身份认证失败！"
    ) {
      // 不合法 退回登录界面
      location.href = "/login.html";
    }

    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);
