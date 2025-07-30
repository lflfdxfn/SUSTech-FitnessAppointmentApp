export default async function rules_whenready({event, data}) {
    /*
    $w.utils.hideLoading()
    await $w.cloud.callFunction({
        name: 'get_rules',
    }).then((res) => {
        $w.page.dataset.state.var_rules_markdown = res.result;
    }).catch(console.error);
    */
    const today = new Date();
  const today_utc8_timestamp = today.getTime() + today.getTimezoneOffset() * 60000 + 480 * 60000;
  // 获取今天的UTC+8的日期字符串
  const [formattedToday_date, formattedToday_time] = $w.app.common.timestampToString(today_utc8_timestamp);

  // 获取健身房公告
  let announcement_text
  await $w.cloud.callFunction({
    name: 'find_announcement_front',
    data:{
        "operate": "get_newest",
        "input_date": formattedToday_date,
        "input_time": formattedToday_time
    }
  }).then((res) => {
    announcement_text = res.result.publish_content;
  }).catch(console.error);
  $w.page.dataset.state.txt_announcement_txt=announcement_text;
}