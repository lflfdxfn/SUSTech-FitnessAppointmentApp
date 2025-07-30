export default async function({event, data}) {
   $w.page.dataset.state.var_order_delete_disable=true;
  let result;
  $w.utils.showLoading({
    title: '删除中...'
  })
    //$w.page.dataset.state.var_order_delete_disable=true;
  await $w.cloud.callFunction({
      name:'operate_order',
      data:{
          "operate": "delete_order",
          "_id": $w.page.dataset.state.var_order_id_tmp
      }
  }).then((res) => {
      result = res.count;
  })
  
  $w.utils.hideLoading()
  if (result === 0) {
      $w.utils.showToast({
          title: "无预约记录",
          icon: 'error',
          duration: 2000
      }) 
  } else {
      $w.utils.showToast({
          title: "已删除",
          icon: 'success',
          duration: 2000
      }) 
      // 刷新
      await $w.page.handler.personal_whenready({event, data})
      $w.page.dataset.state.var_order_delete_disable=false;
  }
}