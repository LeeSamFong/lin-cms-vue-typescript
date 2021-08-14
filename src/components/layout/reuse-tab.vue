<template>
  <div v-if="histories.length > 1"
       class="reuse-tab">
    <swiper class="reuse-tab-wrap"
            slides-per-view="auto"
            :space-between="1"
            :initial-slide="0"
            effect="slide"
            :prevent-clicks="false"
            :free-mode="true"
            :mousewheel="true"
            direction="horizontal"
    >
      <swiper-slide v-for="(item, index) in histories"
                    :key="item.path">
        <router-link class="reuse-tab-item"
                     :class="item.path === $route.path ? 'active' : ''"
                     :to="item.path"
                     @contextmenu.prevent="onTags(index, $event)"
        >
          <i v-if="!filterIcon(stageList[item.stageId].icon)"
             :class="stageList[item.stageId].icon"></i>
          <img v-else
               :src="stageList[item.stageId].icon"
               style="width: 16px;"
               alt="">
          <span style="padding: 0 5px;">{{ stageList[item.stageId].title }}</span>
          <span class="el-icon-close"
                @click.prevent.stop="close(index)"/>
        </router-link>
      </swiper-slide>
    </swiper>

    <ul v-show="visible"
        :style="{
          left: left + 'px',
          top: top + 'px',
        }"
        class="contextmenu">
      <li @click="closeAll">关闭所有</li>
      <li @click="closeOthers">关闭其他</li>
      <li @click="closeLeft" v-if="hasLeft">关闭左侧</li>
      <li @click="closeRight" v-if="hasRight">关闭右侧</li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SwiperCore, { Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useStore } from '@/store'
import { LinRouteType } from '@/router/route-type'
import emitter from '@/lin/utils/emitter'
import { StageMapType } from '@/store/getters'


SwiperCore.use([Mousewheel])

interface History {
  path: string;
  routePath: string;
  stageId: symbol;
}

export default defineComponent({
  name: 'ReuseTab',
  components: { Swiper, SwiperSlide },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()


    function getStageByRoute(path: string): LinRouteType | undefined {
      return store.getters.getStageByRoute(path)
    }

    const loggedIn = computed(() => store.state.loggedIn)
    const defaultRoute = computed(() => store.state.defaultRoute)

    const histories = ref<History[]>([])
    const visible = ref(false)
    const hasLeft = ref(true)
    const hasRight = ref(true)
    const top = ref(0)
    const left = ref(0)
    const index = ref(0)

    function init() {
      // 获取当前的历史记录, 可能从本地存储, 可能直接获取当前的
      let localHistory: History[]
      if (histories.value.length > 0) {
        localHistory = [...histories.value]
      } else {
        const storage = window.localStorage.getItem('history') || '[]'
        localHistory = JSON.parse(storage)
      }


      const _histories: History[] = []

      localHistory.forEach(item => {
        const findResult = getStageByRoute(item.routePath)
        if (!findResult) return

        _histories.push({ ...item, stageId: findResult.name })
      })

      histories.value = _histories
    }

    function filterIcon(icon?: string) {
      return !!icon && icon.includes('/')
    }

    function closeAll() {
      histories.value = []
      router.push(defaultRoute.value)
    }

    function closeOthers() {
      const { path } = histories.value[index.value]
      router.push(path)
      histories.value = []
    }

    function closeLeft() {
      histories.value.splice(0, index.value)
    }

    function closeRight() {
      histories.value.splice(index.value + 1)
    }

    function closeMenu() {
      visible.value = false
      hasLeft.value = true
      hasRight.value = true
    }

    function onTags(_index: number, event: any) {
      closeMenu()
      const menuMinWidth = 126
      const el = getCurrentInstance()?.vnode.el
      if (!el) return
      const offsetLeft = el.getBoundingClientRect().left
      const { offsetWidth } = el
      const maxLeft = offsetWidth - menuMinWidth
      const _left = event.clientX - offsetLeft + 15

      left.value = _left > maxLeft ? maxLeft : _left

      if (_index === 0) {
        hasLeft.value = false
      }

      if (_index + 1 === histories.value.length) {
        hasRight.value = false
      }

      top.value = 18
      index.value = _index
      visible.value = true
    }

    function close(index: number) {
      // 检测是否是当前页, 如果是当前页则自动切换路由
      if (route.path === histories.value[index].path) {
        if (index > 0) {
          router.push(histories.value[index - 1].path)
        } else if (histories.value.length > 1) {
          router.push(histories.value[1].path)
        } else {
          router.push(defaultRoute.value)
        }
      }
      // 删除该历史记录
      histories.value.splice(index, 1)
    }


    onBeforeMount(() => {
      window.onbeforeunload = () => {
        window.localStorage.setItem('history', JSON.stringify(histories.value))
      }
    })

    onMounted(() => {
      init()
      emitter.on('clearTap', () => {
        histories.value = []
      })
    })

    watch(route, () => {
      // 对路由变化作出响应...
      const flag = histories.value.find(item => item.path === route.path)
      if (flag) return

      const ele: History = {
        path: route.path,
        routePath: route.matched[route.matched.length - 1].path,
        stageId: route.name as LinRouteType['name'],
      }
      histories.value.unshift(ele)
    })

    watch(loggedIn, value => {
      if (value) return
      closeAll()
    })

    watch(visible, value => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    const stageList = computed<StageMapType>(() => store.getters.stageList)

    // 舞台改变时触发
    watch(stageList, () => {
      init()
    })

    watch(histories, arr => {
      if (arr.length < 2) {
        emitter.emit('noReuse')
      } else {
        emitter.emit('hasReuse')
      }
    })

    return {
      histories,
      stageList,
      visible,
      left,
      top,
      hasLeft,
      hasRight,
      filterIcon,
      closeAll,
      closeOthers,
      closeLeft,
      closeRight,
      onTags,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
.swiper-slide {
  width: auto !important;
  min-width: 126px;
  display: flex;
  height: $reuse-tab-height;
  flex-direction: column;
  justify-content: center;
  background-color: $reuse-tab-item-background;
  color: $right-side-font-color;
  margin-right: 1px;
}

.reuse-tab-wrap {
  bottom: 0;
  left: 0;
  user-select: none;
  height: $reuse-tab-height;
  background: $header-background;
  font-size: 14px;
  color: #8c98ae;
  display: flex;
  align-items: center;
  overflow: hidden;

  ::v-deep(.swiper-wrapper) {
    display: flex;
    flex-direction: row;
  }

  .reuse-tab-item {
    box-sizing: border-box;
    width: auto;
    height: $reuse-tab-height;
    min-width: 126px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    margin-right: 1px;
    position: relative;
    white-space: nowrap;

    > i {
      color: $theme;
    }

    .el-icon-close {
      opacity: 0;
      position: absolute;
    }

    &:hover {
      background: $theme;
      border: none;
      color: #fff;

      > i {
        color: #fff;
      }

      .el-icon-close {
        position: absolute;
        display: inline-block;
        width: 14px;
        height: 14px;
        top: 0;
        right: 0;
        opacity: 1;
        border-radius: 0 0 0 14px;
        background: rgba(255, 255, 255, 0.3);

        &::before {
          font-size: 12px;
          position: absolute;
          right: -1px;
          transform: scale(0.7);
        }
      }
    }
  }

  .active {
    box-sizing: border-box;
    height: 40px;
    color: #ffffff;
    background: $theme;
    border: none;
    position: relative;

    > i {
      color: #fff;
    }

    .el-icon-close {
      position: absolute;
      display: inline-block;
      width: 14px;
      height: 14px;
      top: 0;
      right: 0;
      opacity: 1;
      border-radius: 0 0 0 14px;
      background: rgba(255, 255, 255, 0.3);

      &::before {
        font-size: 12px;
        position: absolute;
        right: -1px;
        transform: scale(0.7);
      }
    }
  }

  .reuse-tab-wrap {
    height: 100%;
  }
}

.reuse-tab {
  position: relative;

  .contextmenu {
    margin: 0;
    background: #ffffff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #596c8e;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 10px 20px;
      cursor: pointer;

      &:hover {
        background: #ebeff8;
        color: #6182c9;
      }
    }
  }
}
</style>
