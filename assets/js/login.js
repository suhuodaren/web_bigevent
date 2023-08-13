$(function () {
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  // 从layui中获取form对象
  var form = layui.form;

  var layer = layui.layer;
  // 通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义一个叫做 pwd 的校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    //校验两次密码是否一致
    repwd: function (value) {
      // 通过形参拿到是的确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次判断
      // 如果判断错误,则return一个提示消息

      var pwd = $(".reg-box [name=password]").val();

      if (pwd !== value) {
        return "两次密码不一致,请确认后重新输入!";
      }
    },
  });

  // 监听注册表单提交事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();

    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };

    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }

      layer.msg("注册成功,请登录");

      //模拟点击行为
      $("#link_login").click();
    });
  });

  // 监听登录表单提交事件
  $("#form_login").submit(function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("登录失败");
        }

        layer.msg("登录成功");

        // 将登录成功得到的token字符串,保存到localStorage中
        localStorage.setItem("token", res.token);

        location.href = "/index.html";
      },
    });
  });
});
