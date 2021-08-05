<template>
  <div class="container">
    <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="medium"
      popper-class="date-box"
      :default-time="defaultTime"
      :shortcuts="shortcuts"
    >
    </el-date-picker>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'LinDatePicker',
  props: {
    modelValue: Array,
  },
  data() {
    return {
      value: [] as string[],
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ],
      shortcuts: [{
        text: '最近一周',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        })(),
      }, {
        text: '最近一个月',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        })(),
      }, {
        text: '最近三个月',
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        })(),
      }],

    }
  },
  emits: ['update:modelValue', 'dateChange'],
  watch: {
    value(date: string[]) {
      const _date = date ? date.map(item => dayjs(item)
        .format('YYYY-MM-DD HH:mm:ss')) : []

      this.$emit('dateChange', _date)
      this.$emit('update:modelValue', _date)
    },
    modelValue(date: string[]) {
      if (date === this.value) return
      this.value = date
    },
  },
  methods: {
    clear() {
      this.value = []
    },
  },
})
</script>

<style lang="scss" scoped>

</style>
