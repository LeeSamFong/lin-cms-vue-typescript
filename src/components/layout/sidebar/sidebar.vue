<template>
  <div class="app-sidebar">
    <logo :el-menu-collapse="elMenuCollapse"/>
    <div style="margin-bottom: 50px;">
      <search/>
      <el-menu ref="menu"
               class="el-menu-vertical-demo"
               :default-active="defaultActive"
               :collapse="elMenuCollapse"
               background-color="#192A5E"
               text-color="rgba(196, 201, 210, 1)"
               active-text-color="#1890ff"
      >
        <menu-tree v-for="item in sidebarList"
                   :key="item.path"
                   :item="item"/>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import Logo from '@/components/layout/sidebar/logo.vue'
import Search from '@/components/layout/sidebar/search.vue'
import MenuTree from '@/components/layout/sidebar/menu-tree.vue'

export default defineComponent({
  name: 'Sidebar',
  components: { MenuTree, Search, Logo },
  props: {
    isPhone: {
      type: Boolean,
      default: false,
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute()
    const store = useStore()

    const elMenuCollapse = computed(() => {
      if (props.isPhone) return false
      return props.isCollapse
    })

    const defaultActive = computed(() => route.path)

    const sidebarList = computed(() => store.getters.sidebarList)

    return {
      elMenuCollapse,
      defaultActive,
      sidebarList,
    }
  },
})
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.app-sidebar {
  background: #192a5e;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
</style>
