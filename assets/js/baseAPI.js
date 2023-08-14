// 注意:每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  //   在发起真正的Ajax请求之前, 统一拼接请求的跟路径;
  options.url = "http://big-event-api-t.itheima.net" + options.url;

  // 统一为有权限的接口设置 headers 请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调函数
  options.complete = function (res) {
    // console.log(res);
    //在 complete 回调函数中，可以使用responseJSON拿到服务器响应回来的参数
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //强制清空token且跳转到登录页
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
