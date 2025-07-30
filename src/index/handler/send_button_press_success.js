export default function({event, data}) {
    // 使按钮不可用
    $w.page.dataset.state.button_send_disabled = true;

    // 设置倒计时的总秒数
    let countdownSeconds = 60;

    // 开始显示倒计时
    $w.page.dataset.state.button_send_text = countdownSeconds + '秒后重试';

    // 定义一个函数来更新倒计时
    function updateCountdown() {
        countdownSeconds--;
        
        // 更新文本
        $w.page.dataset.state.button_send_text = countdownSeconds + '秒后重试';

        // 如果倒计时结束
        if (countdownSeconds <= 0) {
            clearInterval(interval)
            $w.page.dataset.state.button_send_disabled = false;
            $w.page.dataset.state.button_send_text = '发送到邮箱';
        }
    }

    // 每秒调用一次updateCountdown函数
    const interval = setInterval(updateCountdown, 1000);
}