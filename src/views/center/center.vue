<template>
  <div class="container">
    <div class="title">个人中心</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16"
                :md="20"
                :sm="24"
                :xs="24"
        >
          <div class="password">
            <div class="title">修改密码</div>
            <el-form ref="elForm"
                     :model="form"
                     status-icon
                     :rules="rules"
                     @submit.prevent
                     label-width="90px"
                     label-position="left"
            >
              <el-form-item label="原始密码"
                            prop="old_password">
                <el-input type="password"
                          v-model="form.old_password"
                          autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="新密码"
                            prop="new_password">
                <el-input type="password"
                          v-model="form.new_password"
                          autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="确认密码"
                            prop="confirm_password"
                            label-position="top">
                <el-input type="password"
                          v-model="form.confirm_password"
                          autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary"
                           v-loading="loading"
                           @click="submitForm">保存
                </el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { useStore } from '@/store'
import { ElForm, ElMessage } from 'element-plus'
import UserModel from '@/lin/models/user'
import useAsync from '@/lin/hooks/async'


export default defineComponent({
  name: 'Center',
  setup() {
    const store = useStore()

    function logout() {
      store.dispatch('logout')
    }

    function setUserAndState() {
      store.dispatch('setUserAndState')
    }

    const user = computed(() => store.state.user)

    const nickname = ref(user.value?.nickname ?? '佚名')

    const elForm = ref<(typeof ElForm) | null>(null)
    const form = reactive<{
      old_password: string;
      new_password: string;
      confirm_password: string;
    }>({
      old_password: '',
      new_password: '',
      confirm_password: '',
    })

    const { loading, run } = useAsync(UserModel.updatePassword)

    function resetForm() {
      elForm.value?.resetFields()
    }

    async function submitForm() {
      if (!elForm.value) return
      await elForm.value.validate().catch((e: Error) => {
        console.error(e)
        return Promise.reject(e)
      })

      await run(unref(form))
      ElMessage.success('修改成功~')
      resetForm()
      // setTimeout(() => {
      //   logout()
      //   const { origin } = window.location
      //   window.location.href = origin
      // }, 1000)
    }


    const rules: {
      [k in string]: unknown[];
    } = {
      old_password: [{
        trigger: 'blur',
        required: true,
        min: 1,
        message: '原始密码不能为空',
      }],
      new_password: [{
        trigger: 'blur',
        required: true,
        validator(rule: typeof rules.new_password, value: string, callback: (err?: Error) => void) {
          if (value === '') {
            callback(new Error('请输入密码'))
          } else if (value.length < 6) {
            callback(new Error('密码长度不能少于6位数'))
          } else {
            callback()
          }
        },
      }],
      confirm_password: [{
        trigger: 'blur',
        required: true,
        validator(rule: typeof rules.confirm_password, value: string, callback: (err?: Error) => void) {
          if (!value) {
            callback(new Error('请再次输入密码'))
          } else if (value !== form.new_password) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
      }],
    }

    return {
      elForm,

      nickname,
      form,
      loading,
      rules,

      submitForm,
      resetForm,
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
    padding: 20px;
    max-width: 800px;

    .user {
      padding: 0px 20px 25px 30px;
      z-index: 100;
      position: relative;
      border-bottom: 1px solid #dae1ec;

      .title {
        font-weight: bold;
        font-size: 16px;
        color: #3a3a3a;
        text-indent: 0px;
        border: none;
      }

      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name-wrapper {
          display: flex;
          align-items: center;

          .label {
            margin-right: 20px;
            color: #333;
            font-weight: bold;
            font-size: 14px;
          }

          .name {
            font-weight: 500;
          }
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          cursor: pointer;
          overflow: hidden;
          position: relative;

          .mask {
            opacity: 0;
            transition: all 0.2s;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: white;

            input {
              display: none;
            }
          }

          &:hover {
            .mask {
              opacity: 1;
            }
          }
        }

        .text {
          margin-left: 20px;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .username {
            margin-bottom: 10px;
            font-size: 16px;
            cursor: pointer;
          }

          .desc {
            font-size: 14px;
            color: rgba(222, 226, 230, 1);
          }
        }

        .info {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          color: #fff;
          font-size: 14px;
          height: 20px;
          line-height: 20px;

          .mid {
            padding: 0 5px;
          }
        }
      }
    }

    .password {
      padding: 25px 20px 25px 30px;

      .title {
        color: #3a3a3a;
        font-weight: bold;
        font-size: 16px;
        text-indent: 0px;
        margin-bottom: 20px;
        border: none;
      }
    }
  }
}
</style>
