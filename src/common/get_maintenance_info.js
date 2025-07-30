export default async function get_maintenance_info() {
    let info;

    await $w.cloud.callFunction({
          name: 'under_maintenance'
    }).then((res) => {
        info = res.result;
    })

    return info
}
