export default async function({event, data}) {
    // 只有页面渲染完成后，才能点击按钮
    $w.page.dataset.state.button_appointment_disabled = true;
    $w.utils.hideLoading()

    // 查看是否在维护
    let [if_under, message] = await $w.app.common.get_maintenance_info();

    if (if_under) {
        $w.app.dataset.state.var_if_under_maintenance = if_under
        $w.app.dataset.state.var_maintenance_message = message;
        await $w.utils.navigateTo({
            pageId: "under_maintenance"
        })
    } else if ($w.app.dataset.state.var_if_have_loggedin == false){
        // 当页面完成渲染后，要做的动作
        // 0. 首先，检测用户是否登录
        // 跳转到登录界面
        await $w.utils.navigateTo({
            pageId: "index"
        })
    } else {
        if ($w.app.dataset.state.var_if_have_informed == false){
            // 之后不会再提醒规则
            $w.app.dataset.state.var_if_have_informed = true;
            $w.utils.navigateTo({     // 这里取消了await，让预约信息的获取可以后台运行。
                pageId: "rules"
            })
        }

        // // 查看用户是否已被提醒登录成功
        // if ($w.app.dataset.state.var_if_have_informed == false) {
        //     // 显示消息提示
        //     $w.utils.showToast({
        //         title: $w.app.dataset.state.var_if_superusr ? `欢迎登录！管理员:${$w.app.dataset.state.var_usr_name}`: `登录成功！`,
        //         icon: 'success',
        //         duration: 2000
        //     })
        //     // 之后不会再提醒
        //     $w.app.dataset.state.var_if_have_informed = true;
        // }
        // 1. 获取当前的日期，来设置预约上的今天和明天
        // 获取今天的UTC+8时间戳
        const today = new Date();
        const today_utc8_timestamp = today.getTime() + today.getTimezoneOffset() * 60000 + 480 * 60000;
        // 获取今天的UTC+8的日期字符串
        const [formattedToday_date, formattedToday_time] = $w.app.common.timestampToString(today_utc8_timestamp);
        // 当前的小时、分钟值 
        const [cur_hour, cur_minutes] = formattedToday_time.split(":").map(Number);
        
        // 获取明天的UTC+8时间戳
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate()+1);
        const tomorrow_utc8_timestamp = tomorrow.getTime() + tomorrow.getTimezoneOffset() * 60000 + 480 * 60000;
        // 获取明天的UTC+8的日期字符串
        const formattedTomorrow_date = $w.app.common.timestampToString(tomorrow_utc8_timestamp)[0];

        // 更新页面上的日期显示
        $w.page.dataset.state.topTab_today_date = formattedToday_date;
        $w.page.dataset.state.topTab_tomorrow_date = formattedTomorrow_date;

        // 2. 获取今天和明天的名额列表
        // 显示正在更新
        $w.utils.showLoading({
            title:'更新名额列表中...'
        })
        // 今天
        let today_list
        await $w.cloud.callFunction({
            name: 'operate_order',
            data:{
                "operate": "get_remain_all_info",
                "request_date": formattedToday_date,
            }
        }).then((res) => {
            today_list = res.result;
        }).catch(console.error);
        // console.log(today_list)
        // 明天
        let tomorrow_list
        await $w.cloud.callFunction({
            name: 'operate_order',
            data:{
                "operate": "get_remain_all_info",
                "request_date": formattedTomorrow_date
            }
        }).then((res) => {
            tomorrow_list = res.result;
        }).catch(console.error);
        // console.log(tomorrow_list)

        function to_usr_available (_list, _if_today) {
            const _display_list = [];
            const regex = /(\d{2}):(\d{2})/g;

            for (let i = 0; i < _list.length; i++) {

                let _interval_text = _list[i].available_interval;
                let _num_text = _list[i].cur_available_num;
                let _if_disabled = false;
                let _label_text = `${_interval_text} 剩余名额：`+ _num_text;

                // 剩余名额为0的，不能被选择
                if (_num_text==0) {
                    _if_disabled = true;
                }

                // 今天的结束时间在当前时间之前的选项，变成无法选择。
                if (_if_today == true) {
                    let match = _interval_text.match(regex);
                    if (match) {
                        const startTime = match[0];
                        const [start_hour, start_minutes] = startTime.split(":").map(Number);
                
                        let start_minutes_fixed=start_minutes+30;
                        let start_hour_fixed=start_hour;
                        if(start_minutes_fixed >=60)
                        {
                            start_minutes_fixed-=60;
                            start_hour_fixed+=1;
                        }
                        //console.log(start_minutes_fixed);
                        const cur_timestamp = 1000* (cur_hour * 60 + cur_minutes);
                        const start_timestamp = 1000* (start_hour_fixed * 60 + start_minutes_fixed);
                        //console.log(cur_timestamp + "---" + start_timestamp);
                        if (cur_timestamp> start_timestamp){
                            _if_disabled = true;
                            _label_text = `${_interval_text}`;
                        }
                        //console.log(i+"+"+_if_disabled)
                    }
                }
                //if(_if_disabled==true) _num_text=0;
                _display_list.push({
                    "value": i.toString(),
                    "disabled": _if_disabled,
                    "label": _label_text
                })                
            }

            return _display_list
        }
        // 更新页面上的名额列表
        $w.app.dataset.state.var_available_info_today = to_usr_available(today_list, true);
        $w.app.dataset.state.var_available_info_tomorrow = to_usr_available(tomorrow_list, false);
        // 更新完成
        $w.utils.hideLoading()
        $w.page.dataset.state.button_appointment_disabled = false;

        await $w.app.common.update_announcement()
    }
}