<template>
  <div class="nav-title">
    <a class="item"
       v-for="(item, index) in titleArr"
       :key="index"
       style="cursor: default;"
    >
      <p>{{ item }}</p>
    </a>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { LinRouteType } from '@/router/route-type'

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const store = useStore()

    const stageInfo = computed<LinRouteType[] | null>(() => store.getters.getStageInfo(route.name))

    const titleArr = computed(() => stageInfo.value?.map(item => item.title).filter(item => !!item) || [])

    return {
      stageInfo,
      titleArr,
    }
  },
})
</script>

<style lang="scss" scoped>
.nav-title {
  display: flex;
  align-items: center;
  font-size: 14px;

  .item {
    i {
      margin-right: 4px;
    }

    display: flex;
    align-items: center;
    padding-right: 18px;
    position: relative;
    color: $right-side-font-color;

    &:after {
      content: '/';
      position: absolute;
      top: 0;
      right: 6px;
    }
  }

  .item:last-child {
    color: $theme;
    padding-right: 0;

    &:after {
      content: '';
    }
  }
}
</style>
