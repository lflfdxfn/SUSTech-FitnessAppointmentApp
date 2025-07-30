export default function({event, data}) {
    // 重置登录相关信息
    $w.app.dataset.state.var_if_have_informed = false;
    $w.app.dataset.state.var_if_have_loggedin = false;
    $w.app.dataset.state.var_if_superusr = false;
    $w.app.dataset.state.var_if_usr = false;
    $w.app.dataset.state.var_usr_id = -1;
    $w.app.dataset.state.var_usr_name = "user";
    $w.app.dataset.state.var_if_have_informed = false;

    // 跳转到登录界面
    $w.utils.navigateTo({
        pageId: "index"
    })
}