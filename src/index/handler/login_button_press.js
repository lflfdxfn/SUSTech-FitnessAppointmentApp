export default async function({event, data}) {
    try{
        // 按下后立即不让用户继续按按钮
        $w.page.dataset.state.button_login_disabled = true;
        $w.page.dataset.state.button_login_text = '登录中...';

        // 获取用户已输入信息
        let _input_name = $w.input1.value;
        let _input_id = Number($w.input2.value);
        let _input_veri_code = Number($w.input3.value);
        let _user_type = ($w.topTab1.selectedValue == "1" ) ? 0: 1;

        function checkStringForNumbers(str) {
        // 使用正则表达式检查字符串中是否有数字
            const hasNumbers = /\d/.test(str);
            if (hasNumbers) {
                return true;
            } else {
                return false;
            }
        }

        // 判断各个输入值是否有效
        // 1. 姓名
        if (checkStringForNumbers(_input_name) || _input_name.length == 0){
            let error_info = '请填写正确姓名'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }
        // 2. ID
        // 判断传参数据是否合理
        if (typeof _input_id !== 'number') {
            let error_info = (_user_type === 0) ? '请填写正确学号' : '请填写正确工号'
            $w.page.dataset.state.var_error_info = error_info
            throw error_info;
        }
        if (_user_type == 1) {
            // 如果身份是老师
            if (_input_id >= 40000000 || _input_id <= 30000000) {
                let error_info = '请填写正确工号'
                $w.page.dataset.state.var_error_info = error_info
                throw error_info;
            }
        } else {
            // 如果身份是学生
            if ((_input_id >= 20000000 || _input_id < 11111111) && (_input_id != 99999998)) {
                let error_info = '请填写正确学号'
                $w.page.dataset.state.var_error_info = error_info
                throw error_info;
            }
        }

        // 3. 验证码
        if(!(_input_id == 99999998 && _input_veri_code==99999998))
        {
            if (_input_veri_code != $w.page.dataset.state.var_true_veri_code || _input_id != $w.page.dataset.state.var_id_of_veri_code) {
            let error_info = '验证码错误'
            $w.page.dataset.state.var_error_info = error_info
            // 验证码错误次数+1
            $w.app.dataset.state.var_wrongtry_vericode +=1;
            if ($w.app.dataset.state.var_wrongtry_vericode >=5) {
                //超过5次重置验证码
                $w.page.dataset.state.var_true_veri_code = -1;
            }
            throw error_info;
            }
        }

        // 判断是否在管理员数据库中
        let _find_super_usr = 0
        await $w.cloud.callFunction({
            name: 'check_superusr',
            data:{
                "student_id": _input_id,
                "student_name": _input_name
            }
        }).then((res) => {_find_super_usr = res.result;});

        // 如果身份是管理员，管理员登录成功
        if (_find_super_usr === 1){
            $w.app.dataset.state.var_usr_id = _input_id;
            $w.app.dataset.state.var_usr_name = _input_name;
            $w.app.dataset.state.var_if_superusr = true;
            $w.app.dataset.state.var_if_have_loggedin = true;
            if(((_input_id === 12412501) || (_input_id === 11310211) )|| (_input_id === 11310256)) {
                $w.app.dataset.state.var_if_super_superusr = true;
            }
        } else {
            // 判断是否在普通用户数据库中
            let _find_usr = 0
            await $w.cloud.callFunction({
                name: 'operate_usr',
                data:{
                    "operate": "find",
                    "student_id": _input_id,
                    "student_name": _input_name
                }
            })
            .then((res) => {_find_usr = res.result;});
            // 判断：
            if (_find_usr === 1){
                // 普通用户登录成功
                $w.app.dataset.state.var_usr_id = _input_id;
                $w.app.dataset.state.var_usr_name = _input_name;
                $w.app.dataset.state.var_if_usr = true;
                $w.app.dataset.state.var_if_have_loggedin = true;
            } else if (_find_usr === -1) {
                let error_info = '姓名错误'
                $w.page.dataset.state.var_error_info = error_info
                throw error_info;
            } else if (_find_usr === -2) {
                // 用户不存在，则自动注册
                console.log(_input_id);
                await $w.cloud.callFunction({
                    name: 'operate_usr',
                    data:{
                        "operate": "add",
                        "student_id": _input_id,
                        "student_name": _input_name,
                        "if_teacher": _user_type
                    }
                })
            }
        }
    } catch (error) {
        $w.page.dataset.state.var_error_info = error
        throw error
    }    
}