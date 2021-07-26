<template>
  <el-submenu v-if="item.children?.length"
              :index="item.path"
              popper-append-to-body
  >
    <template #title>
      <i v-if="!filterIcon(item.icon)"
         :class="item.icon"></i>
      <img v-else :src="item.icon" alt="">
      <span>{{ item.title }}</span>
    </template>
    <menu-tree v-for="child in item.children"
               :key="child.path"
               :item="child"/>
  </el-submenu>

  <el-menu-item v-else
                :index="item.path"
                @click="navigateTo(item.path)"
  >
    <i v-if="!filterIcon(item.icon)" :class="item.icon"></i>
    <img v-else :src="item.icon" alt="" class="img-icon">
    <span class="title">{{ item.title }}</span>
  </el-menu-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SideRoute } from '@/store/getters'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MenuTree',
  props: {
    item: {
      type: Object as PropType<SideRoute>,
      required: true,
    },
  },
  setup() {
    const router = useRouter()

    function navigateTo(path: string) {
      router.push({ path })
    }

    function filterIcon(icon?: string) {
      if (!icon) {
        return false
      }
      return icon.includes('/')
    }

    return {
      navigateTo,
      filterIcon,
    }
  },
})
</script>

<style lang="scss" scoped>
.img-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  margin-left: 5px;
  display: inline-block;
  transform: translateY(21px);
}

.iconfont {
  margin-right: 10px;
  margin-left: 5px;
  color: $sub-menu-title;
  height: $menu-item-height;
}

.title {
  display: inline-block;
  width: 110px;
  @include no-wrap();
}
</style>
