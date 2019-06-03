<script>
import '&/assets/global.css'

export default {
  onLaunch () {
    // const { path, scene, query } = wx.getLaunchOptionsSync()
    // console.log(path, scene, query)
  },
  onShow (data) {
    // 版本升级提示
    try {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(res => {
        console.log('请求完新版本信息的回调', res.hasUpdate)
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
    } catch (e) {
      console.log('版本不支持自动更新')
    }

    // 全局获取本机信息
    if (!this.systemInfo) {
      this.$store.dispatch('getSystemInfo')
    }
  }
}
</script>

<style lang="scss">
@import url("./assets/global.css");
</style>
