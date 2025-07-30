export default async function({event, data}) {
    // 1. 获取今天的日期
    // 获取今天的UTC+8时间戳
    const today = new Date();
    const today_utc8_timestamp = today.getTime() + today.getTimezoneOffset() * 60000 + 480 * 60000;
    // 获取今天的UTC+8的日期字符串
    const [formattedToday_date, formattedToday_time] = $w.app.common.timestampToString(today_utc8_timestamp);

    // 2. 获取今天的标记记录
    if ($w.app.dataset.state.var_if_superusr === true) {
        let scan_tmp;
        await $w.cloud.callFunction({
            name: 'operate_scan_history',
            data: {
                "operate": "find_scan_history",
                "request_date": formattedToday_date,
                "superuser_id": $w.app.dataset.state.var_usr_id
            }
        })
        .then ((res) => {
            scan_tmp = res.result.records;
        }).catch(console.error)

        // 3. 生成向管理员展示的记录列表
        const to_superuser_array = [];

        for (const element of scan_tmp) {
            to_superuser_array.push({
                tagged_userid: element.tagged_userid,
                tagged_time: $w.app.common.timeToString(element.tagged_time),
                tag_result: element.tag_result
            })
        }

        $w.page.dataset.state.var_scan_history_tmp = to_superuser_array;
    }    
}