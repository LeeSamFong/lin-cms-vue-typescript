<template>
  <!-- 列表页面 -->
  <div class="container">
    <div class="title">分组列表信息</div>
    <el-table :data="allGroups"
              v-loading="loading"
              @row-dblclick="rowDoubleClick"
    >
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="info" label="分组描述"/>
      <el-table-column label="操作" fixed="right" width="275">
        <template #default="scope">
          <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)">信息</el-button>
          <el-button plain size="mini" type="info" @click="goToGroupEditPage(scope.row.id)">权限</el-button>
          <el-button plain size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分组信息 -->
    <el-dialog title="分组信息"
               :append-to-body="true"
               v-model="dialogFormVisible"
               :before-close="handleClose">
      <div style="margin-top:-25px;">
        <el-form
          ref="form"
          status-icon
          :rules="rules"
          :model="group"
          label-width="120px"
          v-if="dialogFormVisible"
          label-position="labelPosition"
          style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input size="medium" clearable v-model="group.name"></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="info">
            <el-input size="medium" clearable v-model="group.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer" style="padding-left:5px;">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import useAsync from '@/lin/hooks/async'
import AdminModel from '@/lin/models/admin'
import { AdminGroupType } from '@/lin/models/data_type/admin'

export default defineComponent({
  name: 'GroupList',
  setup() {
    const {
      data: allGroups,
      run: getAllGroups,
      loading: getAllGroupsLoading,
    } = useAsync(AdminModel.getAlLGroups)

    onMounted(() => {
      getAllGroups()
    })

    const {
      run: deleteOneGroup,
      data: deleteOneGroupRes,
      loading: deleteOneGroupLoading,
    } = useAsync(AdminModel.deleteOneGroup)

    function handleDelete(id: number) {
      ElMessageBox.confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await deleteOneGroup(id)
        if (deleteOneGroupRes.value) {
          ElMessage.success(deleteOneGroupRes.value.message as string)
        }
        await getAllGroups()
      })
    }


    const router = useRouter()
    const id = ref(0)
    const form = ref<typeof ElForm | null>(null)

    const group = reactive<{
      name: string;
      info: string;
    }>({
      name: '',
      info: '',
    })
    const dialogFormVisible = ref(false) // 是否弹窗
    const rules = {
      // 表单验证规则
      info: [],
      name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
    }


    /**
     * 获取所拥有的权限并渲染  由子组件提供
     * @param row
     */
    function handleEdit(row: AdminGroupType) {
      id.value = row.id
      group.name = row.name
      group.info = row.info
      dialogFormVisible.value = true
    }


    const {
      run: updateOneGroup,
      data: updateOneGroupRes,
      loading: updateOneGroupLoading,
    } = useAsync(AdminModel.updateOneGroup)

    /**
     * 修改分组信息
     */
    async function confirmEdit() {
      if (group.name === '') {
        ElMessage.warning('请将信息填写完整')
        return
      }
      await updateOneGroup(group.name, group.info, id.value)
      getAllGroups()
      if (updateOneGroupRes.value) {
        ElMessage.success(updateOneGroupRes.value.message as string)
      }
      dialogFormVisible.value = false
    }


    function handleClose(done: () => void) {
      done()
    }


    function rowDoubleClick(row: AdminGroupType) {
      handleEdit(row)
    }


    function resetForm() {
      form.value?.resetFields()
    }


    function goToGroupEditPage(groupId: number) {
      id.value = groupId
      router.push({
        path: '/admin/group/edit',
        query: {
          id: groupId,
        },
      })
    }


    const loading = computed<boolean>(() => getAllGroupsLoading.value || deleteOneGroupLoading.value || updateOneGroupLoading.value)

    return {
      allGroups,
      loading,
      rules,
      dialogFormVisible,
      group,
      form,

      handleDelete,
      handleEdit,
      confirmEdit,
      handleClose,
      rowDoubleClick,
      resetForm,
      goToGroupEditPage,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
