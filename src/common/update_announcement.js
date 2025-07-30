export default async function update_announcement() {
  const today = new Date();
  const today_utc8_timestamp = today.getTime() + today.getTimezoneOffset() * 60000 + 480 * 60000;
  // 获取今天的UTC+8的日期字符串
  const [formattedToday_date, formattedToday_time] = $w.app.common.timestampToString(today_utc8_timestamp);

  // 获取健身房公告
  let announcement_text
  await $w.cloud.callFunction({
    name: 'operate_announcement',
    data:{
        "operate": "get_newest",
        "input_date": formattedToday_date,
        "input_time": formattedToday_time
    }
  }).then((res) => {
    announcement_text = res.result.publish_content;
  }).catch(console.error);

  $w.app.dataset.state.text_announcement_text = announcement_text;
}
