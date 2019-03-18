<template>
  <div class="baby">
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    // ...mapGetters({
    //   needGetUnionId: 'user/needGetUnionId',
    //   needGetAuthTel: 'user/needGetAuthTel'
    // }),
    ...mapState({
    })
  },
  methods: {
  },
  async onShow () {
  }
}
</script>

<style lang="scss" scoped>
</style>