<template>
  <div class="container">
    <el-dialog title="编辑分组"
               :append-to-body="true"
               v-model:visible="dialogFormVisible">
      <slot name="content"></slot>
      <slot name="footer"></slot>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LinDialog',
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialogFormVisible: false,
    }
  },
  watch: {
    value(val: boolean) {
      this.dialogFormVisible = val
    },
    dialogFormVisible(val: boolean) {
      this.$emit('input', val)
    },
  },
})
</script>

<style scoped lang="stylus"></style>
