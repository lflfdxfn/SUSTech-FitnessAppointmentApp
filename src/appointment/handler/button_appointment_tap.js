export default async function({event, data}) {
    // 按下后立即不让用户继续按按钮
    $w.page.dataset.state.button_appointment_disabled = true;
    $w.page.dataset.state.button_appointment_text = '预约中...';
    $w.utils.showLoading({
        title:'预约中...'
    })
    
    // 获取今天的UTC+8时间戳
    const today = new Date();
    const today_utc8_timestamp = today.getTime() + today.getTimezoneOffset() * 60000 + 480 * 60000;
    // 获取今天的UTC+8的日期字符串
    const formattedToday_date = $w.app.common.timestampToString(today_utc8_timestamp)[0];
    // 获取明天的UTC+8时间戳
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const tomorrow_utc8_timestamp = tomorrow.getTime() + tomorrow.getTimezoneOffset() * 60000 + 480 * 60000;
    // 获取明天的UTC+8的日期字符串
    const formattedTommorow_date = $w.app.common.timestampToString(tomorrow_utc8_timestamp)[0];

    // 获取用户选中的日期信息
    let ordered_date = $w.topTab1.selectedValue == "1"? formattedToday_date : formattedTommorow_date;
    // 获取用户选中的值
    let ordered_period_index = $w.topTab1.selectedValue == "1"? $w.radio1.value : $w.radio2.value;
    console.log($w.topTab1.selectedValue)
    console.log($w.radio1.value==="")
    console.log($w.radio2.value)

    let toast_title;
    let toast_icon;
    if (ordered_period_index ==="") {
        toast_title = "请选择一个时间区间",
        toast_icon = "error"
    } else {
        // 提交请求发送到云服务器
        let order_result = -1;
        await $w.cloud.callFunction({
            name: 'operate_order',
            data:{
                "operate": "order",
                "order_id": $w.app.dataset.state.var_usr_id,
                "ordered_date": ordered_date,
                "period_index": ordered_period_index
            }
        }).then((res) => {
            order_result = res.result;
        }).catch(console.error);

        if (order_result === -999) {
            toast_title = "您已被拉黑，请联系管理员",
            toast_icon = "error"
        } else if (order_result === -888) {
            toast_title = $w.topTab1.selectedValue == "1"? `您已预约今天的名额`: `您已预约明天的名额`,
            toast_icon = "error"
        } else if (order_result === -777) {
            toast_title = "网络错误",
            toast_icon = "error"
        } else if (order_result === -666) {
            toast_title = "已无预约名额",
            toast_icon = "error"
        } else if (order_result === -555) {
            toast_title = "已过预约时间",
            toast_icon = "error"
        } else if (order_result === 0) {
            toast_title = "预约成功",
            toast_icon = "success"
        } else {
            toast_title = "响应错误",
            toast_icon = "error"
        }
    }

    $w.page.dataset.state.button_appointment_disabled = false;
    $w.page.dataset.state.button_appointment_text = "开始预约";
    $w.utils.hideLoading()

    await $w.utils.showToast({
        title: toast_title,
        icon: toast_icon,
        duration: 2000
    })
}

