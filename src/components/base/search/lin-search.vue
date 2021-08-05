<template>
  <div class="lin-search">
    <el-input size="medium"
              :placeholder="placeholder"
              clearable
              v-model="keyword"
              class="input-with-select">
      <template #suffix>
        <i class="el-input__icon el-icon-search" @click="search"></i>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Utils from '@/lin/utils/utils'

export default defineComponent({
  name: 'LinSearch',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    debounce: {
      type: Number,
      default: 1000,
    },
  },
  emits: ['update:modelValue', 'query'],
  setup(props, { emit }) {
    const keyword = ref('')

    const debounceEmit = Utils.debounce(() => {
      emit('query', keyword.value)
      emit('update:modelValue', keyword.value)
    }, props.debounce)

    watch(keyword, () => {
      debounceEmit()
    })

    watch(() => props.modelValue, newValue => {
      if (keyword.value === newValue) return
      keyword.value = newValue
    })

    function clear() {
      keyword.value = ''
    }

    function search() {
      emit('query', keyword.value)
    }

    return {
      keyword,
      clear,
      search,
    }
  },
})
</script>

<style lang="scss" scoped>
.lin-search ::v-deep(.el-input__inner) {
  width: 150px;
  border-radius: 20px;
  transition: all 0.2s linear;

  &:focus {
    width: 250px;
    transition: all 0.3s linear;
  }
}

.lin-search ::v-deep(.el-input__suffix) {
  cursor: pointer;
}
</style>
