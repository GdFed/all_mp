<script>
import '&/assets/global.css'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      systemInfo: (state) => state.user.systemInfo
    })
  },
  onLaunch () {
    // const { path, scene, query } = wx.getLaunchOptionsSync()
    // console.log(path, scene, query)
  },
  onShow (data) {
    this.$store.dispatch('checkLogin')
    // 版本升级提示
    try {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('请求完新版本信息的回调', res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
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
</style>
