<template>
  <div title="关闭全部历史记录"
       class="tab"
       @click="closeReuseTab"
  >
    <i class="iconfont icon-moshubang"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import emitter from '@/lin/utils/emitter'

export default defineComponent({
  name: 'ClearTab',
  setup() {
    function closeReuseTab() {
      emitter.emit('clearTap')
    }

    return {
      closeReuseTab,
    }
  },
})
</script>

<style lang="scss" scoped>
.tab {
  cursor: pointer;
  margin-right: 10px;

  i {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
