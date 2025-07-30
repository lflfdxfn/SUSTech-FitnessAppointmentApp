export default async function({event, data}) {
    // 按下后立即不让用户继续按按钮
    $w.page.dataset.state.button_send_disabled = true;
    $w.page.dataset.state.button_send_text = '发送中...';

    let _student_id = $w.input2.value // 获取输入的学号值
    let _veri_code = -1 // 初始化验证码
    let _user_type = $w.topTab1.selectedValue;
    console.log(_user_type)

    // 判断传参数据是否合理
    if (typeof _student_id !== 'number') {
        let error_info = (_user_type == "1") ? '请填写正确学号' : '请填写正确工号'
        $w.page.dataset.state.var_error_info = error_info
        throw error_info;
    }
    
    let email_address;
    if (_user_type == "2"){
        // 如果身份是老师
        if (_student_id >= 40000000 || _student_id <= 30000000) {
            let error_info = '请填写正确工号'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }

        let prefix = $w.input4.value;
        if (prefix === "") {
            let error_info = '请填写邮箱前缀'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }

        // 检查是否为纯数字的function
        function isPureNumber(str) {
            const regex = /^[-+]?\d+(\.\d+)?$/;
            return regex.test(str);
        }

        if (isPureNumber(prefix)) {
            let error_info = '请填写正确邮箱前缀'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }
        
        if ($w.select2.value === null) {
            let error_info = '请选择邮箱后缀'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }
        let suffix = ($w.select2.value === "0")? "sustech.edu.cn" : "mail.sustech.edu.cn"

        email_address = prefix + "@" + suffix
    } else {
        // 如果身份是学生
        if (_student_id >= 20000000 || _student_id < 11111111) {
            let error_info = '请填写正确学号'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }
        email_address = _student_id + "@mail.sustech.edu.cn"
    }

    console.log(email_address)

    // 调用云函数来进行邮件发送，以防止信息在本地泄露
    await $w.cloud.callFunction({
        name: 'sendVeriCode',
        data:{
            "email_address": email_address
        }
    }).then((res) => {
        _veri_code = res.result.veri_code;
    }).catch(console.error);

    if (_veri_code < 0) {
        let error_info = '验证码发送失败'
        $w.page.dataset.state.var_error_info = error_info
        throw error_info
    }

    $w.page.dataset.state.var_true_veri_code = _veri_code;
    $w.page.dataset.state.var_id_of_veri_code = _student_id;
}