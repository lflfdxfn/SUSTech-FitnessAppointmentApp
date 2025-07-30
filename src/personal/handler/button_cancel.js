export default async function({event, data}) {
    // 获取当前的UTC+8时间戳
    const now = new Date();
    const now_utc8_timestamp = now.getTime() + now.getTimezoneOffset() * 60000 + 480 * 60000;

    // 获取被按下的块所对应的，开始时间的时间戳
    const info_container = event.currentTarget.parent.parent.children[0]
    const order_date = info_container.children[0].text
    const order_period = info_container.children[1].children[1].text
    const order_times = order_period.split(/[\s~]+/)
    const begin_time = order_times[0]
    const order_timestamp = new Date(order_date + " " +  begin_time).getTime()

    // 获取对应的数据ID
    $w.page.dataset.state.var_order_id_tmp = info_container.children[1].children[2].text;
    $w.page.dataset.state.var_order_date_tmp = order_date;
    //console.log(order_timestamp);
    let tmp=new Date(order_date + " " +  begin_time);
    tmp.setHours(tmp.getHours()-1);
    let order_timestamp_fixed=tmp.getTime();
    if (now_utc8_timestamp > order_timestamp_fixed) {
        throw Error
    }
}