<template>
  <div class="container" ref="container">
    <img class="page-404" src="@/assets/image/error-page/404.png" alt=""/>
    <img class="page-logo" src="@/assets/image/error-page/logo.png" alt=""/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: '404',
  setup() {
    const container = ref<HTMLDivElement | null>(null)

    onMounted(() => {
      const headerHeight = document.getElementById('operate')?.clientHeight
      const { clientHeight } = document.body

      if (!headerHeight) return
      if (container.value) {
        container.value.style.height = `${clientHeight - headerHeight}px`
      }
    })

    return {
      container,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .page-404 {
    width: 349px;
    height: 190px;
  }

  .page-logo {
    position: absolute;
    right: 40px;
    bottom: 40px;
    width: 60px;
    height: 98px;
  }
}
</style>
