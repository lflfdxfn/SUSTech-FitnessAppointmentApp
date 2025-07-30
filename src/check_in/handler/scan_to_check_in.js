export default async function({event, data}) {
  wx.scanCode({
    onlyFromCamera: false,
    scanType: ['qrCode'],
    success: async function (res) {
      // 成功后振动一下
      wx.vibrateShort({
        type: 'heavy' // 可选值：'light'（轻量级）、'medium'（默认）、'heavy'（沉重）
      });

      // 提示正在签到中
      $w.utils.showLoading({
            title:'签到中...'
      })

      const scan_info = res.result;
      console.log('扫码结果：', scan_info);
      let tag_result;
      await $w.cloud.callFunction({
          name: 'operate_order',
          data:{
              "operate": "scanTag_cat",
              "tagger_name": $w.app.dataset.state.var_usr_name,
              "tagger_id": $w.app.dataset.state.var_usr_id,
              "scan_info": scan_info
          }
      })
      .then((res) => {
          tag_result = res.result;
      }).catch(console.error);

      // 返回结果后，去掉加载框
      $w.utils.hideLoading()

      let _icon, _title      
      if (tag_result === -999) {
        _icon = "error";
        _title = "您不是管理员，无权限"
      } else if (tag_result === -888) {
        _icon = "error";
        _title = "该同学/老师今天没有预约"
      } else if (tag_result === -777) {
        _icon = "error";
        _title = "二维码已失效"
      } else if (tag_result === -1) {
        _icon = "error";
        _title = "该同学/老师预约的时间未到"
      } else if (tag_result === -2) {
        _icon = "error";
        _title = "该同学/老师预约的时间已过"
      } else if (tag_result === 0) {
        _icon = "success";
        _title = "该同学/老师签到成功"
      } else if (tag_result === 1) {
        _icon = "error";
        _title = "已经签到（多次签到）"
      } else {
        _title = "响应错误";
        _icon = "error";
      }
      $w.utils.showToast({
        title: _title,
        icon: _icon,
        duration: 5000
      })
    },
    fail: function (err) {
      console.error('扫码失败：', err);
      // 在这里处理扫码失败后的逻辑
    },
    complete: function () {
      console.log('扫码结束');
      // 在这里处理扫码结束后的逻辑，无论成功或失败都会执行
      $w.page.handler.get_scan_history({event, data});
    }
  })
}