export default async function rules_whenready({event, data}) {
    
    $w.utils.hideLoading()
    await $w.cloud.callFunction({
        name: 'get_rules',
    }).then((res) => {
        $w.page.dataset.state.rules_markdown = res.result;
    }).catch(console.error);
    
}