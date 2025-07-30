export default async function({event, data}) {
  $w.utils.hideLoading()

  $w.app.common.update_announcement()

  let [if_under, message] = await $w.app.common.get_maintenance_info();

  if (if_under) {
      $w.app.dataset.state.var_if_under_maintenance = if_under
      $w.app.dataset.state.var_maintenance_message = message;
      await $w.utils.navigateTo({
          pageId: "under_maintenance"
      })
  } else{
    await $w.utils.showToast({
      title: "请登录",
      icon: "warn",
      duration: 2000
    })
  }
}