<template>
  <div class="backTop" :style="{ right: right + 'px', bottom: bottom + 'px' }" v-if="showBackTop">
    <i class="iconfont icon-xsaaa" :style="{ fontSize: fontSize + 'px' }" @click="backTop"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'BackTop',
  props: {
    right: {
      type: Number,
      default: 50,
    },
    bottom: {
      type: Number,
      default: 50,
    },
    fontSize: {
      type: Number,
      default: 18,
    },
  },
  setup() {
    // 当前滚动对象
    let targetDom: HTMLElement | null = null

    // 是否显示回到顶部标识
    const showBackTop = ref(false)

    // 滚动距离
    let scrollY = 0

    function handleScroll(e: Event) {
      const { scrollTop } = e.target as HTMLElement
      scrollY = scrollTop
      showBackTop.value = scrollTop > 100
      targetDom = e.target as HTMLElement
    }

    function backTop() {
      let timer = requestAnimationFrame(function fn() {
        if (!targetDom) return
        const currentTop = targetDom.scrollTop
        if (currentTop <= 0) {
          cancelAnimationFrame(timer)
          return
        }
        targetDom.scrollTop = currentTop + (0 - currentTop) / 6
        timer = requestAnimationFrame(fn)
      })
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, true)
    })
    onUnmounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    return {
      backTop,
      showBackTop,
    }
  },
})
</script>

<style lang="scss" scoped>
.backTop {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  line-height: 50px;
  z-index: 3;
  color: $theme;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}
</style>
