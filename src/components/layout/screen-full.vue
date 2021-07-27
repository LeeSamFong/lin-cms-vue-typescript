<template>
  <div class="container" title="全屏/正常">
    <i class="iconfont" :class="isFullScreen ? 'icon-quxiaoquanping' : 'icon-quanping'" @click="handleFullScreen"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ScreenFull',
  setup() {
    const isFullScreen = ref(false)

    function handleFullScreen() {
      if (!screenfull.isEnabled) {
        ElMessage({
          type: 'warning',
          message: '您的浏览器可能不支持全屏',
        })
        return false
      }
      screenfull.toggle()
    }

    function change() {
      if (screenfull.isEnabled) {
        isFullScreen.value = screenfull.isFullscreen
      }
    }

    onMounted(() => {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    })

    onUnmounted(() => {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    })

    return {
      isFullScreen,
      handleFullScreen,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;

  i {
    width: 40px;
    height: 40px;
    font-size: 20px;

    &:before {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
    }
  }
}
</style>
