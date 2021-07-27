<template>
  <div class="app-nav-bar">
    <div class="nav-content">
      <breadcrumb/>
      <div class="right-info">
        <!-- TODO lin-notify -->
        <clear-tab/>
        <screen-full/>
        <user/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Breadcrumb from '@/components/layout/breadcrumb.vue'
import ClearTab from '@/components/layout/clear-tab.vue'
import ScreenFull from '@/components/layout/screen-full.vue'
import User from '@/components/layout/user.vue'

export default defineComponent({
  name: 'NavBar',
  components: { User, ScreenFull, ClearTab, Breadcrumb },
  setup() {
    // TODO lin-notify
    // const path = `${Config.baseURL}/ws/message?token=${getAccessToken().split(' ')[1]}`
    //
    // onMounted(() => {
    // })
  },
})
</script>

<style lang="scss" scoped>
.app-nav-bar {
  width: 100%;
  height: $navbar-height;
  display: flex;
  align-items: center;

  .logo.js-min-logo {
    width: 64px;
    font-size: 16px;
    color: #fff;
  }

  .nav-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: $navbar-padding;

    .right-info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
