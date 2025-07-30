export default async function({event, data}) {
    // 取消其他页面的载入中。。。
    $w.utils.hideLoading()

    // 检查是否在维护
    let [if_under, message] = await $w.app.common.get_maintenance_info();

    if (if_under) {
        $w.app.dataset.state.var_if_under_maintenance = if_under
        $w.app.dataset.state.var_maintenance_message = message;
        await $w.utils.navigateTo({
            pageId: "under_maintenance"
        })
    } else {
        // 生成二维码
        $w.page.handler.check_in_gen_code({event, data});
        // 获取标记信息
        $w.page.handler.get_scan_history({event, data});
    }
}