$(function () {
  getUserInfo();

  var layer = layui.layer;

  //   点击 “退出” 按钮，实现退出功能
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        // 1.清空本地存储中的token
        localStorage.removeItem("token");

        // 2.重新跳转到登录页面
        location.href = "/login.html";

        // 关闭 confirm 询问框
        layer.close(index);
      }
    );
  });
});

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",

    // 请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },

    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }

      // 渲染用户头像
      renderAvatar(res.data);
    },

    // complete: function (res) {
    //   console.log(res);
    //   //在 complete 回调函数中，可以使用responseJSON拿到服务器响应回来的参数
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     //强制清空token且跳转到登录页
    //     localStorage.removeItem("token");
    //     location.href = "/login.html";
    //   }
    // },
  });
}

// 渲染用户头像
function renderAvatar(user) {
  var name = user.nickname || user.username;

  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);

  //   渲染头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 渲染文字头像
    $(".layui-nav-img").hide();

    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
