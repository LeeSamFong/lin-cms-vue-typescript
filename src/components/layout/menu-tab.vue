<template>
  <div>
    <div v-if="menuTabs.length || show">
      <ul class="menu-tab">
        <router-link v-for="tab in menuTabs"
                     :key="tab.path"
                     :to="tab.path">
          <li class="menu-li">
            <i :class="tab.icon"/>
            <span class="title">{{ $filters.filterTitle(tab.title) }}</span>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { LinRouteType } from '@/router/route-type'


interface MenuTabType {
  icon: string;
  title: string;
  path: string;
}

export default defineComponent({
  name: 'MenuTab',
  setup() {
    const store = useStore()
    const route = useRoute()

    const stageInfo = computed<LinRouteType[] | null>(() => store.getters.getStageInfo(route.name))

    const menuTabs = computed<MenuTabType[]>(() => {
      if (!stageInfo.value) return []

      const { length } = stageInfo.value
      if (!length || length < 2) {
        return []
      }

      const father = stageInfo.value[length - 2] as LinRouteType
      if (father.type === 'tab') {
        const menus: MenuTabType[] = []
        father.children?.forEach(item => {
          if (item.inNav) {
            menus.push({
              icon: item.icon || '',
              title: item.title,
              path: item.route,
            })
          }
        })
        return menus
      }

      return []
    })

    const show = ref(false)

    return {
      show,
      menuTabs,
    }
  },
})
</script>

<style lang="scss" scoped>
.router-link-active {
  background: black;
}

.menu-tab {
  width: 100%;
  height: 38px;
  line-height: 38px;
  background: $reuse-tab-item-background;
  font-size: 14px;
  font-weight: 400;
  color: rgba(140, 152, 174, 1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .router-link-exact-active,
  .router-link-active {
    background: $app-main-background;
    color: $theme;
  }

  .menu-li {
    width: 120px;
    height: 38px;
    cursor: pointer;
    display: flex;
    justify-content: center;

    .imgIcon {
      width: 16px;
      height: 16px;
      margin: 0 auto;
    }

    .title {
      margin-left: 5px;
    }
  }
}
</style>
