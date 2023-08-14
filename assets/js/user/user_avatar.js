$(function () {
  // 获取剪裁区元素
  var $image = $("#image");

  var layer = layui.layer;

  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  //创建裁剪区域
  $image.cropper(options);

  //为上传按钮绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });

  //为文件选择框绑定change事件
  $("#file").on("change", function (e) {
    // 获取用户选择的文件
    var filelist = e.target.files;

    if (filelist.length === 0) {
      return layer.msg("请选择照片！");
    }

    // 拿到用户选择的文件
    var file = e.target.files[0];

    // 将文件转化为URL路径
    var imageURL = URL.createObjectURL(file);

    // 重新初始化裁剪区域
    $image.cropper("destroy").attr("src", imageURL).cropper(options);
  });

  //   为确定按钮，绑定点击事件
  $("#btnUpload").on("click", function () {
    // 拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建Canvas画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将Canvas画布上的内容，转化为base64格式的字符串

    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更换头像失败");
        }

        layer.msg("更新头像成功");

        window.parent.getUserInfo();
      },
    });
  });
});
