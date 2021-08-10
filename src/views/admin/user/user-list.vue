<template>
  <div class="container">
    <div class="header">
      <div class="title">用户列表</div>
      <!-- 分组选择下拉框 -->
    </div>
    <!-- 表格 -->
    <el-table :data="paging.items"
              v-loading="loading"
              @row-dblclick="handleEdit"
    >
      <el-table-column prop="username" label="名称"></el-table-column>
      <el-table-column prop="groupNames" label="所属分组"></el-table-column>
      <el-table-column label="操作" fixed="right" width="275">
        <template #default="scope">
          <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button plain size="mini" type="danger" @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:currentPage="paging.page"
        v-model:pageSize="paging.count"
        :page-sizes="[10, 20, 30]"
        :total="paging.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog title="用户信息"
               append-to-body
               :before-close="handleClose"
               v-model="dialogFormVisible"
    >
      <div style="margin-top: -25px;">
        <el-tabs v-model="activeTab"
                 @tab-click="handleTabClick"
        >
          <el-tab-pane label="修改信息"
                       name="修改信息"
          >
            <user-info :id="id"
                       ref="infoRef"
                       class="info"
                       pageType="edit"
                       :info="userInfo"
                       :submit="false"
                       :allGroups="allGroups"
                       labelPosition="right"
                       v-if="dialogFormVisible"
                       @handleInfoResult="handleInfoResult"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码"
                       name="修改密码"
          >
            <user-password ref="passwordRef"
                           :id="id"
                           class="password"
                           @handlePasswordResult="handlePasswordResult"/>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 按键操作 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminModel from '@/lin/models/admin'
import { AdminUser } from '@/lin/models/data_type/admin'
import useAsync from '@/lin/hooks/async'
import UserInfo from '@/views/admin/user/user-info.vue'
import UserPassword from '@/views/admin/user/user-password.vue'

export default defineComponent({
  name: 'UserList',
  components: { UserPassword, UserInfo },
  setup() {
    const dialogFormVisible = ref(false)

    const paging = AdminModel.useAdminUsersPagination()
    const {
      data: allGroups,
      loading: allGroupsLoading,
      run: getAllGroups,
    } = useAsync(AdminModel.getAlLGroups)

    onMounted(() => {
      paging.getData()
      getAllGroups()
    })

    const deleteUserAsync = useAsync(AdminModel.deleteOneUser)
    const { run: deleteUser } = deleteUserAsync

    function handleDelete(id: number) {
      ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await deleteUser(id)
        ElMessage.success(deleteUserAsync.data.value?.message as string)
        if (paging.items.length - 1 > 0) {
          await paging.getData()
          return
        }

        const page = paging.page - 1
        if (page > 0) {
          paging.page = page
        }
        await paging.getData()
      })
    }


    const userInfo = reactive<{
      email: string;
      username: string;
      password: string;
      groups: any[];
      confirm_password: string;
    }>({
      email: '',
      username: '',
      password: '',
      groups: [],
      confirm_password: '',
    })
    const activeTab = ref('修改信息')
    const id = ref<number | null>(null)
    const passwordRef = ref<typeof UserPassword | null>(null)
    const infoRef = ref<typeof UserInfo | null>(null)


    function handleEdit(row: AdminUser) {
      id.value = row.id
      userInfo.email = row.email
      userInfo.groups = row.groups
      userInfo.username = row.username
      dialogFormVisible.value = true
    }

    function handleClose(done: () => void) {
      dialogFormVisible.value = false
      passwordRef.value?.resetForm()
      activeTab.value = '修改信息'
      done()
    }

    function handleInfoResult(flag: boolean) {
      dialogFormVisible.value = false
      if (flag) {
        paging.getData()
      }
    }

    function handleTabClick(tab: any) {
      activeTab.value = tab.props.name
    }

    function handlePasswordResult(result: boolean) {
      if (result) {
        dialogFormVisible.value = false
      }
    }

    function resetForm() {
      if (activeTab.value === '修改信息') {
        infoRef.value?.resetForm()
      } else {
        passwordRef.value?.resetForm()
      }
    }

    async function confirmEdit() {
      if (activeTab.value === '修改信息') {
        await infoRef.value?.submitForm()
      } else {
        await passwordRef.value?.submitForm()
      }
    }


    const loading = computed<boolean>(() => paging.loading || deleteUserAsync.loading.value || allGroupsLoading.value)

    return {
      passwordRef,
      infoRef,

      id,
      userInfo,
      allGroups,
      dialogFormVisible,
      paging,
      loading,
      activeTab,

      handleEdit,
      handleDelete,
      handleClose,
      handleInfoResult,
      handleTabClick,
      handlePasswordResult,
      resetForm,
      confirmEdit,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
</style>
