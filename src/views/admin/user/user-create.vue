<template>
  <div class="container" v-loading="loading">
    <div class="title">新建用户</div>
    <div class="wrap">
      <user-info :all-groups="allGroups"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import AdminModel from '@/lin/models/admin'
import useAsync from '@/lin/hooks/async'
import UserInfo from '@/views/admin/user/user-info.vue'

export default defineComponent({
  name: 'UserCreate',
  components: { UserInfo },
  setup() {
    const { run: getAllGroups, data: allGroups, loading } = useAsync(AdminModel.getAlLGroups)

    onMounted(() => {
      getAllGroups()
    })

    return {
      loading,
      allGroups,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 0px 20px;
  }
}
</style>
