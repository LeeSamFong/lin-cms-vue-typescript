<template>
  <div class="container">
    <div class="title">编辑分组权限</div>
    <div class="content">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <div class="content">
            <group-permission
              :id="id"
              ref="groupPermissionsRef"
              @updatePermissions="updatePermissions"
              @getCacheAuthIds="getCacheAuthIds"
              @updateAllPermissions="updateAllPermissions"
              style="margin-right:-30px;margin-left:-25px;margin-bottom:-10px;"
            />
          </div>
          <div style="padding-left:5px;margin-top: 30px;">
            <el-button type="primary"
                       :disabled="loading"
                       :loading="loading"
                       @click="confirmEdit">确 定
            </el-button>
            <el-button @click="back">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { AdminPermissionsType } from '@/lin/models/data_type/admin'
import useAsync from '@/lin/hooks/async'
import AdminModel from '@/lin/models/admin'
import GroupPermission from '@/views/admin/group/group-permission.vue'

export default defineComponent({
  name: 'GroupEdit',
  components: { GroupPermission },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const id = Number(route.query.id)

    const permissions = ref<number[]>([])
    const allPermissions = ref<AdminPermissionsType>({})
    const cachePermissions = ref<number[]>([])

    const groupPermissionsRef = ref<typeof GroupPermission | null>(null)

    const refreshLoading = ref(false)

    async function refreshPermission() {
      if (!groupPermissionsRef.value) {
        console.error('没有获取到groupPermission组件的ref')
        return
      }
      refreshLoading.value = true
      groupPermissionsRef.value.getGroupPermissions()
        .finally(() => {
          setTimeout(() => {
            refreshLoading.value = false
          }, 5000)
        })
    }

    /**
     * 编辑后的最终权限
     */
    function updatePermissions(picked: number[]) {
      permissions.value = picked
    }

    /**
     * 全部权限
     */
    function updateAllPermissions(all: AdminPermissionsType) {
      allPermissions.value = all
    }

    /**
     * 页面打开时候，记录当前分组所拥有的全部权限
     */
    function getCacheAuthIds(ids: number[]) {
      cachePermissions.value = ids
    }


    const {
      run: dispatchPermissions,
      loading: dispatchPermissionsLoading,
    } = useAsync(AdminModel.dispatchPermissions)

    const {
      run: removePermissions,
      loading: removePermissionsLoading,
    } = useAsync(AdminModel.removePermissions)

    /**
     * 确认修改
     */
    async function confirmEdit() {
      // 判断是否更改了分组权限
      const permissionsStr = permissions.value.sort().toString()
      const cacheStr = cachePermissions.value.sort().toString()
      if (permissionsStr === cacheStr) {
        ElMessage.success('权限没有变化~')
        return
      }

      const deletePermissions = cachePermissions.value
        .concat(permissions.value)
        .filter(v => !permissions.value.includes(v))

      const addPermissions = cachePermissions.value
        .concat(permissions.value)
        .filter(v => !cachePermissions.value.includes(v))

      try {
        if (addPermissions.length) {
          await dispatchPermissions(id, addPermissions)
        }

        if (deletePermissions.length) {
          await removePermissions(id, deletePermissions)
        }

        ElMessage.success('权限修改成功')
      } finally {
        refreshPermission()
      }
    }


    /**
     * 返回
     */
    const back = () => {
      router.go(-1)
    }

    const loading = computed<boolean>(() => dispatchPermissionsLoading.value || removePermissionsLoading.value || refreshLoading.value)

    return {
      groupPermissionsRef,

      id,
      loading,
      back,
      permissions,
      confirmEdit,
      allPermissions,
      getCacheAuthIds,
      cachePermissions,
      updatePermissions,
      updateAllPermissions,
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

  .content {
    margin-top: 10px;
    padding-left: 33px;
    padding-right: 40px;
  }

  .submit {
    float: left;
  }
}
</style>
