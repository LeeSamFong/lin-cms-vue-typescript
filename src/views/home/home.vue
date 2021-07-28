<template>
  <div style="height: 100%">
    <el-container>
      <el-aside :width="sidebarWidth"
                class="aside"
                :style="asideStyle">
        <sidebar :is-collapse="isCollapse"
                 :is-phone="isPhone"/>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="left">
            <div class="operate" ref="operate">
              <i class="iconfont icon-fold"
                 :class="{ rotate: foldState }"
                 @click="changeSidebarState"/>
              <nav-bar/>
            </div>
            <el-collapse-transition>
              <reuse-tab/>
            </el-collapse-transition>
          </div>
        </el-header>
        <el-main id="mainStage" ref="main">
          <menu-tab/>
          <app-main ref="appMain"/>
        </el-main>
        <el-backtop target="#mainStage"/>
      </el-container>
      <div class="sidenav-mask"
           :class="{ show: isPhone && isCollapse}"
           @click="sidebarWidth"></div>
    </el-container>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import AppMain from '@/components/layout/app-main.vue'
import emitter from '@/lin/utils/emitter'
import Utils from '@/lin/utils/utils'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/sidebar/sidebar.vue'
import NavBar from '@/components/layout/nav-bar.vue'
import ReuseTab from '@/components/layout/reuse-tab.vue'
import MenuTab from '@/components/layout/menu-tab.vue'

const navBarHeight = 66 // header高度
const reuseTabHeight = 70 // 历史记录栏高度
const marginHeight = 20 // 历史记录栏与舞台的间距
const _sidebarWidth = '210px' // 左侧菜单宽度
const totalHeight = navBarHeight + reuseTabHeight + marginHeight

export default defineComponent({
  name: 'Home',
  components: { MenuTab, ReuseTab, NavBar, Sidebar, AppMain },
  setup() {
    const route = useRoute()

    const clientSize = reactive({
      clientWidth: 0,
      clientHeight: 0,
    })

    const appMain = ref<typeof AppMain | null>(null)

    function setResize() {
      const { clientWidth, clientHeight } = document.body
      clientSize.clientWidth = clientWidth
      clientSize.clientHeight = clientHeight
      if (appMain.value) {
        appMain.value.$el.style.minHeight = `${clientHeight - totalHeight + 20}px`
      }
    }

    const isCollapse = ref(false)
    const foldState = ref(false)
    const isPhone = ref(false)

    // 控制菜单折叠
    function changeSidebarState() {
      isCollapse.value = !isCollapse.value
      if (isCollapse.value) {
        emitter.emit('removeSidebarSearch')
      } else {
        emitter.emit('showSidebarSearch')
      }
      foldState.value = !foldState.value
    }

    const elMenuCollapse = computed(() => {
      if (isPhone.value) return false
      return isCollapse.value
    })

    const asideStyle = computed(() => {
      const style: Partial<CSSStyleDeclaration> = {}
      if (!isPhone.value) {
        return style
      }

      style.position = 'absolute'
      style.height = `${clientSize.clientHeight}px`
      style.zIndex = '12'
      style.transform = isCollapse.value ? 'translateX(0)' : `translateX(-${_sidebarWidth})`
      return style
    })

    const sidebarWidth = ref(_sidebarWidth)
    watch(isCollapse, () => {
      if (isPhone.value) {
        sidebarWidth.value = _sidebarWidth
        return
      }
      sidebarWidth.value = !isCollapse.value ? _sidebarWidth : '64px'
    })

    watch(route, () => {
      if (isPhone.value && isCollapse.value) {
        changeSidebarState()
      }
    })

    onMounted(() => {
      setResize()
      const { clientWidth } = clientSize
      if (clientWidth < 500) {
        isPhone.value = true
        return
      }

      isPhone.value = false

      // 检测屏幕宽度, 确定默认是否展开
      if (clientWidth <= 768) {
        emitter.emit('removeSidebarSearch')
        isCollapse.value = true
      } else {
        isCollapse.value = false
        emitter.emit('showSidebarSearch')
      }
    })

    function onResize() {
      setResize()
      const { clientWidth } = clientSize
      if (clientWidth <= 500) {
        isPhone.value = true
      } else if (clientWidth <= 800) {
        isPhone.value = false
      }
    }

    onMounted(() => {
      const debounceResize = Utils.debounce(onResize, 35)
      window.addEventListener('resize', debounceResize)

      onUnmounted(() => {
        window.removeEventListener('resize', debounceResize)
      })
    })

    const operate = ref<HTMLElement | null>(null)

    function noReuse() {
      if (operate.value) {
        operate.value.style.height = '86px'
      }
    }

    function hasReuse() {
      if (operate.value) {
        operate.value.style.height = '45px'
      }
    }

    // 监测屏幕宽度 折叠左侧菜单栏
    onMounted(() => {
      emitter.on('noReuse', noReuse)
      emitter.on('hasReuse', hasReuse)
    })

    onUnmounted(() => {
      emitter.off('noReuse', noReuse)
      emitter.off('hasReuse', hasReuse)
    })

    return {
      sidebarWidth,
      isCollapse,
      isPhone,
      foldState,
      appMain,
      operate,
      elMenuCollapse,
      asideStyle,
      changeSidebarState,
    }
  },
})
</script>

<style lang="scss" scoped>
.aside {
  background: rgb(25, 42, 94);
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

.header {
  padding: 0;
  background: $header-background;
  height: $header-height !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 6px 0px rgba(190, 204, 216, 0.4);
  border-bottom: 1px solid rgba(190, 204, 216, 0.4);

  .left {
    height: 100%;
    width: 100%;

    .operate {
      display: flex;
      align-items: center;
      background: $header-background;
      padding-left: 20px;
      height: 86px;

      .iconfont {
        font-size: 16px;
        font-weight: 500;
        color: $right-side-font-color;
        cursor: pointer;
        transform: rotate(0deg);
        transition: all 0.3s linear;
        margin-right: 10px;

        &:hover {
          color: #3963bc;
        }
      }

      .rotate {
        transform: rotate(180deg);
        transition: all 0.3s linear;
      }
    }
  }

  .right-info {
    display: flex;
    align-items: center;
  }
}

.el-main {
  overflow-y: auto;
  position: relative;
  padding: 0;
}

.backTop {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  right: 50px;
  bottom: 50px;
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  z-index: 99;
  background: #fff;

  .iconfont {
    font-size: 36px;
  }
}

.sidenav-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
  display: none;
  cursor: pointer;

  &.show {
    display: block;
  }
}
</style>
