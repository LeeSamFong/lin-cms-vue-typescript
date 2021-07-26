<template>
  <div v-if="showSidebarSearch"
       style="margin-top: 15px;">
    <div class="search-display"
         v-if="!showSearchList"
         @click="toSearch">
      <i class="el-icon-search"></i>
    </div>
    <el-select v-else
               clearable
               filterable
               size="medium"
               class="search"
               v-model="sidebar"
               ref="searchInput"
               :filter-method="search"
               placeholder="请输入关键字"
               @change="handleChange">
      <el-option v-for="item in groups"
                 :key="item.key"
                 :label="item.title"
                 :value="item.path"/>
    </el-select>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import { useStore } from '@/store'
import emitter from '@/lin/utils/emitter'
import Config from '@/config'
import { useRouter } from 'vue-router'
import { SideRoute } from '@/store/getters'

export default defineComponent({
  name: 'Search',
  setup() {
    const store = useStore()
    const router = useRouter()

    const sidebarList = computed<SideRoute[]>(() => store.getters.sidebarList)

    const showSidebarSearch = ref(false)
    onMounted(() => {
      emitter.on('removeSidebarSearch', () => {
        showSidebarSearch.value = false
      })
      emitter.on('showSidebarSearch', () => {
        if (Config.showSidebarSearch) {
          showSidebarSearch.value = true
        }
      })
    })

    const groups = ref<{
      path: string;
      title: string;
      key: number;
    }[]>([])
    const sidebar = ref('')
    const showSearchList = ref(false)
    const searchInput = ref<HTMLElement | null>(null)

    function handleChange(val: string) {
      groups.value = []
      sidebar.value = ''
      showSearchList.value = false
      router.push(val)
    }

    function toSearch() {
      showSearchList.value = true
      nextTick(() => {
        if (searchInput.value) {
          searchInput.value.focus()
        }
      })
    }

    function search(val: string) {
      groups.value = []

      function deepTravel<T extends { children?: T[] }>(configs: T[], func: (config: T) => void) {
        configs.forEach(config => {
          if (config.children?.length) {
            deepTravel(config.children, func)
          } else {
            func(config)
          }
        })
      }

      deepTravel(sidebarList.value, config => {
        if (config.title.includes(val)) {
          groups.value.push({
            path: config.path,
            title: config.title,
            key: Math.random(),
          })
        }
      })
    }

    return {
      searchInput,
      showSidebarSearch,
      showSearchList,
      sidebar,
      groups,
      handleChange,
      toSearch,
      search,
    }
  },
})
</script>

<style lang="scss" scoped>
.search-display {
  position: relative;
  width: 80%;
  margin: 0 auto;
  height: 36px;
  border-bottom: 1px rgb(185, 190, 195) solid;
  cursor: pointer;

  .el-icon-search {
    position: absolute;
    left: 1px;
    top: 10px;
    color: rgb(185, 190, 195);
  }
}

.search {
  width: 80%;
}
</style>
