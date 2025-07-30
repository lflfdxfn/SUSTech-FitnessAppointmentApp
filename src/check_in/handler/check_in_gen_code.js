export default function({event, data}) {
    // 获取时间戳的字符串格式
    function timestampToString(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return [`${year}-${month}-${day}`, `${hours}:${minutes}:${seconds}`]
    }
    // 获取当前的UTC+8的时间戳
    const now = new Date();
    const now_utc8_timestamp = now.getTime() + now.getTimezoneOffset() * 60000 + 480 * 60000;
    // 获取今天的UTC+8的日期字符串
    const [formattedNow_date, formattedNow_time] = timestampToString(now_utc8_timestamp);

    // 生成qrcode
    let qrcode_info = `{"date": "${formattedNow_date}", "time": "${formattedNow_time}", "id": ${$w.app.dataset.state.var_usr_id}}`;
    $w.page.dataset.state.var_date_in_code = formattedNow_date;
    $w.page.dataset.state.var_time_in_code = formattedNow_time;
    
    $w.page.dataset.state.var_check_info = qrcode_info;

    // 提交一个云端申请，如果没有提醒过。
    if ($w.page.dataset.state.var_infomed_success == false){
        
    }
}