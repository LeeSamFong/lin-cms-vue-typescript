<template>
  <div class="wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StickyTop',
})
</script>

<style lang="scss" scoped>
.wrapper {
  position: sticky;
  top: 0;
  z-index: 9;
  background: #fff;
}
</style>
