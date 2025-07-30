export default async function({event, data}) {
    $w.utils.hideLoading()
    $w.page.dataset.state.var_order_delete_disable=true;
    let [if_under, message] = await $w.app.common.get_maintenance_info();

    if (if_under) {
        $w.app.dataset.state.var_if_under_maintenance = if_under
        $w.app.dataset.state.var_maintenance_message = message;
        await $w.utils.navigateTo({
            pageId: "under_maintenance"
        })
    } else if ($w.app.dataset.state.var_if_have_loggedin == false){
        // 跳转到登录界面
        $w.utils.navigateTo({
            pageId: "index"
        })
    } else {
        $w.utils.showLoading({
            title:'更新预约记录中...'
        })
        // 1. 获取该登录者的历史预约记录
        let order_tmp;
        await $w.cloud.callFunction({
            name: 'operate_order',
            data:{
                "operate": "find_student_history",
                "student_id": $w.app.dataset.state.var_usr_id,
            }
        })
        .then((res) => {
            order_tmp = res.result.records;
        }).catch(console.error);
        $w.utils.hideLoading()

        // 2. 生成向用户展示的记录列表
        const to_usr_array = [];
        for (const element of order_tmp) {
            // 预约的日期
            const date = new Date(element.ordered_day);
            const dateString =  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

            to_usr_array.push({
                ordered_day: dateString,
                ordered_period: element.ordered_period_text,
                if_arrived: element.if_arrived,
                _id: element._id
            })
        }
        $w.app.dataset.state.var_order_history_tmp = to_usr_array;

    }
    $w.page.dataset.state.var_order_delete_disable=false;
}