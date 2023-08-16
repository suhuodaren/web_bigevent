$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  //定义时间补零函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据，默认每页显示两条
    cate_id: "", //文章类别的ID
    state: "", //文章的发布状态
  };

  initTable();
  initCate();

  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }

        // 使用模板引擎渲染页面数据
        var htmlStr = template("tpl-table", res);

        $("tbody").html(htmlStr);

        //调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }

        // 调用模板引擎渲染分类可选项
        var htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  //为筛选表单绑定 submit 事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();

    // 获取表单选项的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();

    //为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;

    //根据最新的筛选条件，重新渲染表格数据
    initTable();
  });

  //定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render()方法渲染分页结构
    laypage.render({
      elem: "pageBox", //分页容器ID
      count: total, //数据总条数，从服务端得到
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页

      limits: [2, 3, 5, 10],
      layout: ["count", "limit", "prev", "page", "next", "skip"],

      //1.分页发生点击切换时触发 jump 回调
      //2.只要调用了laypage.render()方法，就会触发 jump 回调
      jump: function (obj, first) {
        // 可以通过 first 的值判断是哪种方式触发的 jump 回调的
        // 如果 first 的值为 true,证明是方式2触发的
        // console.log(first);
        // console.log(obj.curr);

        //把最新的页码值赋值到 q 这个查询参数对象对的的属性中
        q.pagenum = obj.curr;

        //把最新的条目数赋值到 q 这个查询对象的 pagesize 属性中
        q.pagesize = obj.limit;

        //根据最新的 q 获取数据列表，并渲染表格
        // initTable();
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 通过代理的形式为删除按钮绑定点击事件处理函数
  $("tbody").on("click", ".btn-delete", function () {
    //获取删除按钮的个数，即当前页的文章剩余数量
    var len = $(".btn-delete").length;

    //获取文章ID
    var id = $(this).attr("data-id");

    layer.confirm(
      "确认删除该文章吗?",
      { icon: 3, title: "提示" },
      function (index) {
        $.ajax({
          method: "GET",
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除文章失败！");
            }

            layer.msg("删除文章成功！");

            //当数据删除完成后，需要判断当前页是否还有剩余数据
            //如果没有，则让页码值-1
            //再重新调用 initTable()
            if (len === 1) {
              //如果 len=1 ,证明删除完毕后当前页面无文章数据
              //页面值最小必须为 1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
            }

            initTable();
          },
        });

        layer.close(index);
      }
    );
  });
});
