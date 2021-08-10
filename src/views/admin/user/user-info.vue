<template>
  <div class="container">
    <el-form ref="form"
             status-icon
             :rules="rules"
             :model="userInfo"
             label-width="100px"
             v-loading="loading"
             :label-position="labelPosition"
             @submit.prevent
    >
      <el-form-item label="用户名"
                    prop="username">
        <el-input size="medium"
                  clearable
                  v-model="userInfo.username"
                  :disabled="isEdited"></el-input>
      </el-form-item>
      <el-form-item label="邮箱"
                    prop="email">
        <el-input
          clearable
          size="medium"
          :disabled="isEdited"
          v-model="userInfo.email"
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'"
                    label="密码"
                    prop="password">
        <el-input
          clearable
          size="medium"
          type="password"
          v-model="userInfo.password"
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'"
                    label="确认密码"
                    prop="confirmPassword"
                    label-position="top">
        <el-input
          clearable
          size="medium"
          type="password"
          autocomplete="off"
          v-model="userInfo.confirmPassword"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pageType !== 'password'"
                    label="选择分组">
        <el-checkbox-group v-model="userInfo.groupIds"
                           size="small"
                           style="transform: translateY(5px);">
          <el-checkbox v-for="item in allGroups"
                       :key="item.id"
                       :label="item.id"
                       border
                       style="margin-left: 0">{{
              item.name
            }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-show="submit"
                    class="submit">
        <el-button type="primary"
                   @click="submitForm">保 存
        </el-button>
        <el-button @click="resetForm">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import useAsync from '@/lin/hooks/async'
import UserModel from '@/lin/models/user'
import { UserGroupType } from '@/lin/models/data_type/user'
import AdminModel from '@/lin/models/admin'
import { UserInfoType } from '@/views/admin/user/type'


export default defineComponent({
  name: 'UserInfo',
  props: {
    submit: {
      // 表单是否显示功能按钮
      type: Boolean,
      default: true,
    },

    id: {
      type: Number,
    },
    allGroups: Array,
    labelPosition: {
      type: String,
      default: 'right',
    },
    info: Object as PropType<{
      username: string;
      password: string;
      confirm_password: string;
      email: string | null;
      groups: UserGroupType[];
    }>,
    pageType: {
      type: String,
      default: 'add', // 区分编辑页面/添加页面
    },
  },
  setup(props, { emit }) {
    const form = ref<typeof ElForm | null>(null)
    const isEdited = ref(false) // 能否编辑

    const userInfo = reactive<UserInfoType>({
      email: '',
      username: '',
      password: '',
      groupIds: [],
      confirmPassword: '',
    })

    const { rules } = getRules(userInfo)

    const addAsync = useAsync(UserModel.register)
    const { run: addRun } = addAsync

    const editAsync = useAsync(AdminModel.updateOneUser)
    const { run: editRun } = editAsync

    function submitForm() {
      if (!form.value) return

      form.value.validate(async (valid: boolean) => {
        if (!valid) {
          ElMessage.error('请填写正确的信息')
          return
        }

        // 1. 新增用户
        if (props.pageType === 'add') {
          await addRun(userInfo)
          ElMessage.success(addAsync.data.value?.message as string)
          resetForm()
          return
        }

        // 2. 更新用户信息
        const originalGroupIds = props.info?.groups.map(item => item.id)
        if (userInfo.groupIds.sort().toString() === originalGroupIds?.toString()) {
          emit('handleInfoResult', false)
          return
        }

        if (!props.id) return
        await editRun(userInfo.email, userInfo.groupIds, props.id)
        ElMessage.success(editAsync.data.value?.message as string)
        emit('handleInfoResult', true)
        resetForm()
      })
    }

    const loading = computed<boolean>(() => addAsync.loading.value || editAsync.loading.value)

    function setInitialUserInfo() {
      if (!props.info) return
      const { email, username, groups } = props.info

      email && (userInfo.email = email)
      username && (userInfo.username = username)
      groups && (userInfo.groupIds = groups.map(item => item.id))
    }

    /**
     * reset表单内容
     */
    function resetForm() {
      if (props.pageType === 'edit') {
        setInitialUserInfo()
      } else {
        userInfo.groupIds = []
        form.value?.resetFields()
      }
    }

    /**
     * 通过是否接收到数据来判断当前页面是添加数据还是编辑数据
     */
    onMounted(() => {
      if (props.pageType === 'edit') {
        setInitialUserInfo()
        isEdited.value = true
      }
    })
    return {
      form,
      loading,
      rules,
      userInfo,
      isEdited,

      submitForm,
      resetForm,
    }
  },
})

/**
 * 表单验证规则
 */
function getRules(userInfo: UserInfoType) {
  const rules = {
    password: [{ validator: validatePassword, trigger: 'blur', required: true }],
    username: [{ validator: checkUserName, trigger: ['blur', 'change'], required: true }],
    confirmPassword: [{ validator: validatePassword2, trigger: 'blur', required: true }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址或者不填', trigger: ['blur', 'change'] }],
  }

  type ValidatorCallback = (error?: Error) => void

  function checkUserName(rule: unknown, value: string, callback: ValidatorCallback) {
    if (!value) {
      callback(new Error('用户名不能为空'))
      return
    }
    callback()
  }

  /**
   * 验证密码
   */
  function validatePassword(rule: unknown, value: string, callback: ValidatorCallback) {
    if (!value) {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码长度不能少于6位数'))
    } else {
      callback()
    }
  }

  /**
   * 再次验证密码
   */
  function validatePassword2(rule: unknown, value: string, callback: ValidatorCallback) {
    if (!value) {
      callback(new Error('请再次输入密码'))
    } else if (value !== userInfo.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  return {
    rules,
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  margin-left: -5px;
  max-width: 800px;

  .submit {
    float: left;
  }
}
</style>
