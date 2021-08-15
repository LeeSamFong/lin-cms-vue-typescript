<template>
  <div class="container">
    <div class="title">新建分组信息</div>
    <el-row>
      <el-col :lg="16"
              :md="20"
              :sm="24"
              :xs="24">
        <div class="content">
          <el-form ref="form"
                   status-icon
                   :rules="rules"
                   :model="group"
                   label-position="right"
                   label-width="100px"
                   v-loading="loading"
                   @submit.prevent>
            <el-form-item label="分组名称" prop="name">
              <el-input size="medium"
                        clearable
                        v-model="group.name"/>
            </el-form-item>
            <el-form-item label="分组描述" prop="info">
              <el-input size="medium"
                        clearable
                        v-model="group.info"></el-input>
            </el-form-item>
            <el-form-item>
              <group-permission title="分配权限"
                                ref="groupPermissions"
                                @updatePermissions="updatePermissions"/>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary"
                         @click="submitForm('form')">保 存
              </el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import GroupPermission from '@/views/admin/group/group-permission.vue'
import useAsync from '@/lin/hooks/async'
import AdminModel from '@/lin/models/admin'

export default defineComponent({
  name: 'GroupCreate',
  components: { GroupPermission },
  setup() {
    const router = useRouter()

    const { rules } = getRules()
    const form = ref<typeof ElForm | null>(null)
    const groupPermissions = ref<typeof GroupPermission | null>(null)

    const permissions = ref<number[]>([])
    const group = reactive({
      name: '',
      info: '',
    })

    /**
     * 重置表单
     */
    function resetForm() {
      form.value && form.value.resetFields()
      groupPermissions.value && groupPermissions.value.getGroupPermissions()
    }


    const {
      run: createGroup,
      data: createGroupRes,
      loading,
    } = useAsync(AdminModel.createOneGroup)

    /**
     * 提交表单
     * 添加新的分组
     */
    function submitForm() {
      if (!form.value) return
      form.value.validate(async (valid: boolean) => {
        if (!valid) {
          ElMessage.error('请将信息填写完整')
        }

        await createGroup(group.name, group.info, permissions.value)
        if (createGroupRes.value) {
          ElMessage.success(createGroupRes.value.message as string)
        }
        router.push('/admin/group/list')
        resetForm()
      })
    }

    /**
     * 编辑后的最终权限
     */
    function updatePermissions(picked: number[]) {
      permissions.value = picked
    }

    return {
      rules,
      form,
      groupPermissions,

      loading,
      group,

      resetForm,
      submitForm,
      updatePermissions,
    }
  },
})

function getRules() {
  const checkName = (rule: never, value: string, callback: (e?: unknown) => void) => {
    if (!value) {
      return callback(new Error('分组名称不能为空'))
    }
    callback()
  }
  const rules = {
    info: [],
    name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
  }
  return { rules }
}
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
    padding-left: 25px;
    padding-right: 40px;
  }

  .submit {
    float: left;
  }
}
</style>
