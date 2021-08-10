<template>
  <div class="container">
    <el-form
      ref="form"
      :model="info"
      status-icon
      :rules="rules"
      v-loading="loading"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="密码" prop="newPassword">
        <el-input size="medium" clearable type="password" v-model="info.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" label-position="top">
        <el-input size="medium" clearable type="password" v-model="info.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-show="false">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ref, UnwrapNestedRefs } from '@vue/reactivity'
import useAsync from '@/lin/hooks/async'
import AdminModel from '@/lin/models/admin'

export default defineComponent({
  name: 'UserPassword',
  props: {
    id: Number,
  },
  emits: ['handlePasswordResult'],
  setup(props, context) {
    const form = ref<typeof ElForm | null>(null)
    const info = reactive({
      newPassword: '',
      confirmPassword: '',
    })

    /**
     * 表单规则
     */
    const rules = getRules(context, info, form)

    const { run, loading, data, reset } = useAsync(AdminModel.changePassword)

    /**
     * 提交表单数据
     */
    function submitForm() {
      form.value?.validate(async (valid: boolean) => {
        if (!valid) {
          ElMessage.error('请填写正确的密码信息')
          return
        }

        if (!props.id) {
          ElMessage.error('没找到当前账号的id')
          return
        }

        await run(info.newPassword, info.confirmPassword, props.id)
        if (data.value) {
          ElMessage.success(data.value.message as string)
        }
        resetForm()
        context.emit('handlePasswordResult', true)
      })
    }

    function resetForm() {
      reset()
      form.value?.resetFields()
    }

    return {
      form,

      rules,
      info,
      loading,

      submitForm,
      resetForm,
    }
  },
})

/**
 * 表单规则
 */
function getRules(ctx: any, info: UnwrapNestedRefs<{
  newPassword: string;
  confirmPassword: string;
}>, form: Ref<typeof ElForm | null>) {
  const validatePassword = (rule: unknown, value: string, callback: (e?: Error) => void) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码长度不能少于6位数'))
    } else {
      if (info.confirmPassword) {
        form.value?.validateField('confirmPassword')
      }
      callback()
    }
  }
  const validatePassword2 = (rule: unknown, value: string, callback: (e?: Error) => void) => {
    if (!value) {
      callback(new Error('请再次输入密码'))
    } else if (value !== info.newPassword) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  // 验证规则
  return {
    newPassword: [{ validator: validatePassword, trigger: 'blur', required: true }],
    confirmPassword: [{ validator: validatePassword2, trigger: 'blur', required: true }],
  }
}
</script>

<style lang="scss" scoped>
.el-form-item ::v-deep(.el-form-item__label) {
  padding-right: 10px !important;
}
</style>
