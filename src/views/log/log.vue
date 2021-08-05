<template>
  <div class="log">
    <sticky-top>
      <div class="log-header">
        <div class="header-left">
          <p class="title">日志信息</p>
        </div>
        <div class="header-right" v-permission="'搜索日志'">
          <lin-search ref="searchKeywordDom" @query="onQueryChange"/>
          <div v-permission="'查询日志记录的用户'">
            <el-dropdown size="medium"
                         style="margin: 0 10px;"
                         @command="handleCommand"
            >
              <el-button>
                {{ searchUser ? searchUser : '全部人员' }} <i
                class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu v-loading="usersPaging.loading">
                  <el-dropdown-item :command="['全部人员']">全部人员</el-dropdown-item>
                  <el-dropdown-item
                    icon="el-icon-user-solid"
                    v-for="(user, index) in usersPaging.items"
                    :key="index"
                    :command="[user]"
                  >{{ user }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <lin-date-picker ref="searchDateDom"
                           class="date"
                           @dateChange="handleDateChange"/>
        </div>
      </div>
      <el-divider v-if="!keyword"></el-divider>
    </sticky-top>
    <transition name="fade">
      <div class="search" v-if="keyword">
        <p class="search-tip">
          搜索“<span class="search-keyword">{{ keyword }}</span
        >”， 找到 <span class="search-num">{{ searchLogsPaging.total }}</span> 条日志信息
        </p>
        <button class="search-back" @click="backInit">返回全部日志</button>
      </div>
    </transition>
    <div class="content">
      <article>
        <section v-for="log in searchLogsPaging.items" :key="log.id">
          <span class="point-time"></span>
          <aside>
            <p class="things" v-html="log.message"></p>
            <p class="brief">
              <span class="text-yellow">{{ log.username }}</span>
              {{ $filters.dateTimeFormatter(log.time) }}
            </p>
          </aside>
        </section>
      </article>

      <div>
        <el-divider></el-divider>
        <div class="more" :class="{ nothing: searchLogsPaging.moreData }">
          <i v-if="searchLogsPaging.loading" class="iconfont icon-loading"></i>
          <div v-show="searchLogsPaging.moreData" @click="searchLogsPaging.getMoreData">
            <span>查看更多</span> <i class="iconfont icon-gengduo" style="font-size:14px"></i>
          </div>
          <div v-if="!searchLogsPaging.moreData">
            <span>{{ searchLogsPaging.total === 0 ? '暂无数据' : '没有更多数据了' }}</span>
          </div>
        </div>
      </div>
      <div class="nothing"
           v-if="!searchLogsPaging.loading && !searchLogsPaging.items.length && !searchLogsPaging.moreData">
        暂无日志信息
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import LinSearch from '@/components/base/search/lin-search.vue'
import LinDatePicker from '@/components/base/date-picker/lin-date-picker.vue'
import { useStore } from '@/store'
import LogModel from '@/lin/models/log'
import { UserType } from '@/lin/models/data_type/user'
import StickyTop from '@/components/base/sticky-top/sticky-top.vue'

export default defineComponent({
  name: 'Log',
  components: { StickyTop, LinDatePicker, LinSearch },
  setup() {
    const store = useStore()
    const user = computed<UserType | null>(() => store.state.user)
    const permissions = computed<string[]>(() => store.state.permissions)

    const searchDateDom = ref<typeof LinDatePicker | null>(null)
    const searchKeywordDom = ref<typeof LinSearch | null>(null)

    const search = reactive<{
      keyword: string;
      searchUser: string;
      searchKeyword: string;
      searchDate: string[];
    }>({
      keyword: '',
      searchUser: '',
      searchKeyword: '',
      searchDate: [],
    })

    const usersPaging = LogModel.useLoggedUsersPaging()


    function getName() {
      return search.searchUser === '全部人员' ? '' : search.searchUser
    }

    const [start, end] = search.searchDate
    const searchLogsPaging = LogModel.useSearchLogsPaging({
      name: getName(),
      keyword: search.keyword,
      start,
      end,
    })

    /**
     * Part 1
     * 日志页面初始化
     */
    async function initPage() {
      usersPaging.reset()
      searchLogsPaging.reset({
        params: {
          name: getName(),
          keyword: search.keyword,
          start,
          end,
        },
      })
      if (user.value?.admin || permissions.value.includes('查询日志记录的用户')) {
        await usersPaging.getMoreData()
        await searchLogsPaging.getMoreData()
      }
    }

    onMounted(() => {
      initPage()
    })

    /**
     * Part 2
     * 根据调解筛选查询日志
     */

    const onQueryChange = (query: string) => {
      const keyword = query.trim()
      if (keyword === search.searchKeyword) return
      search.searchKeyword = keyword
    }

    const handleDateChange = (date: string[]) => {
      const { searchDate } = search
      if (searchDate === date) return
      search.searchDate = date
    }

    const handleCommand = ([currentUser]: string[]) => {
      const { searchUser } = search
      if (searchUser === currentUser) return
      search.searchUser = currentUser
    }

    async function searchPage() {
      const [start, end] = search.searchDate
      searchLogsPaging.reset({
        params: {
          name: getName(),
          keyword: search.searchKeyword,
          start,
          end,
        },
      })

      await searchLogsPaging.getMoreData()
    }

    function setKeyword() {
      const { searchUser, searchKeyword, searchDate } = search
      const [start, end] = searchDate

      const keywords: string[] = []

      if (searchUser) {
        keywords.push(searchUser)
      }

      if (searchKeyword) {
        keywords.push(searchKeyword)
      }

      if (searchDate.length) {
        keywords.push(`${start}至${end}`)
      }

      search.keyword = keywords
        .filter(keyword => (typeof keyword === 'string' && keyword.length))
        .join(' ')
    }

    watch(() => [search.searchKeyword, search.searchUser, search.searchDate], () => {
      setKeyword()
      searchPage()
    })

    async function backInit() {
      searchDateDom.value?.clear()
      searchKeywordDom.value?.clear()

      search.searchUser = ''
      search.searchKeyword = ''
      search.searchDate = []
      search.keyword = ''

      await initPage()
    }

    return {
      searchDateDom,
      searchKeywordDom,

      usersPaging,
      searchLogsPaging,
      ...toRefs(search),

      onQueryChange,
      handleDateChange,
      handleCommand,
      backInit,
    }
  },
})
</script>

<style lang="scss" scoped>
.log ::v-deep(.el-button) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.log {
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: -24px;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .search {
    height: 52px;
    width: 100%;
    background: rgba(57, 99, 188, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 24px;

    .search-tip {
      margin-left: 40px;
      height: 52px;
      line-height: 52px;
      color: #354058;
      font-size: 14px;

      .search-keyword {
        color: $theme;
      }

      .search-num {
        color: #f4516c;
      }
    }

    .search-back {
      margin: 8px 20px;
      height: 32px;
      background: #f4516c;
      border: none;
      border-radius: 2px;
      color: #fff;
      padding: 0 13px;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .content {
    padding: 40px 60px;

    article {
      position: relative;
      margin-bottom: -24px;

      section {
        padding: 0 0 36px;
        position: relative;

        &:before {
          content: '';
          width: 1px;
          top: 7px;
          bottom: -17px;
          left: 10.5px;
          background: #f3f3f3;
          position: absolute;
        }

        &:last-child:before {
          display: none;
        }

        .point-time {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          top: 2px;
          left: 10px;
          background: $theme;
          margin-left: -4px;
          border-radius: 50%;
        }

        time {
          width: 15%;
          display: block;
          position: absolute;

          span {
            display: block;
            text-align: right;
          }
        }

        aside {
          color: #45526b;
          margin-left: 30px;

          .things {
            font-size: 14px;
            color: #45526b;
            margin-bottom: 15px;
          }
        }

        .text-yellow {
          color: #8c98ae;
          font-size: 14px;
          line-height: 20px;
          padding-right: 30px;
          float: left;
        }

        .brief {
          font-size: 14px;
          color: #c4c9d2;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }

  .more {
    height: 40px;
    line-height: 40px;
    color: $theme;
    font-size: 14px;
    margin-left: 28px;
    cursor: pointer;

    &.nothing {
      cursor: text;
    }

    .icon-gengduo {
      display: inline;
      margin-left: 6px;
    }

    .icon-loading {
      &:before {
        display: inline-block;
        animation: spin 1s linear infinite;
      }
    }
  }
}

.nothing {
  color: #45526b;
  font-size: 14px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 1000px) {
  .date {
    display: none;
  }
}
</style>
