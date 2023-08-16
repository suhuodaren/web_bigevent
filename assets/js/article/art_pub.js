$(function () {
  var layer = layui.layer;
  var form = layui.form;

  //初始化图片裁剪器
  var $image = $("#image");

  //裁剪选项
  var options = {
    aspectRatio: 400 / 200,
    preview: ".img-preview",
  };

  //初始化裁剪区域
  $image.cropper(options);

  initCate();
  initEditor();

  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！");
        }

        //调用模板引擎渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);

        //一定记得要调用 form.render() 方法
        form.render();
      },
    });
  }

  //为选择封面的按钮，绑定点击事件处理函数
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //监听 coverFile 的 change 事件，获取用户选择的图片文件
  $("#coverFile").on("change", function (e) {
    // 获取文件列表数组
    var files = e.target.files;

    // 判断用户是否选择了文件
    if (files.length === 0) {
      return;
    }

    // 根据图片文件创建对应的URL地址
    var newImgURL = URL.createObjectURL(files[0]);

    // 为裁剪区重新设置封面图片
    $image.cropper("destroy").attr("src", newImgURL).cropper(options);
  });

  //定义文章的发布状态
  var art_state = "已发布";

  //为 存为草稿 按钮，绑定点击事件处理函数
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  //   为表单表单 submit 提交事件
  $("#form-pub").on("submit", function (e) {
    //阻止表单默认提交行为
    e.preventDefault();

    // 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0]);

    //将文章的发布状态，存储到 fd 中
    fd.append("state", art_state);

    //将封面裁剪过的图片，输出为一个图片文件
    $image
      .cropper("getCroppedCanvas", {
        //创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 将文件对象，储存到 fd 中
        fd.append("cover_img", blob);

        //发起 ajax 数据请求
        publishArticle(fd);
      });
  });

  //   定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,

      // 注意：如果向 FormData 格式的数据
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,

      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }

        layer.msg("发布文章成功！");

        location.href = "/article/art_lsit.html";
      },
    });
  }
});
