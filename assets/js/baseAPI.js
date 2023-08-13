// 注意:每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  //   在发起真正的Ajax请求之前, 统一拼接请求的跟路径;
  options.url = "http://big-event-api-t.itheima.net" + options.url;

  console.log(options.url);
});
