<template>
  <div class="login">
    <div class="team-name hidden-sm-and-down">
      <img src="@/assets/image/login/team-name.png" alt="logo"/>
    </div>
    <div class="form-box"
         v-loading="loading"
         element-loading-background="rgba(0, 0, 0, 0)">
      <div class="title">
        <h1 title="Lin">Lin CMS</h1>
      </div>
      <form class="login-form"
            autocomplete="off"
            @submit.prevent="throttleLogin()">
        <div class="form-item nickname">
          <span class="icon account-icon"></span>
          <input v-model="account.username"
                 type="text"
                 autocomplete="off"
                 placeholder="请填写用户名"/>
        </div>
        <div class="form-item password">
          <span class="icon secret-icon"></span>
          <input v-model="account.password"
                 type="password"
                 autocomplete="off"
                 placeholder="请填写用户登录密码"/>
        </div>
        <button class="submit-btn" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'
import UserModel from '@/lin/models/user'
import Config from '@/config'
import Utils from '@/lin/utils/utils'

export default defineComponent({
  name: 'Login',
  setup() {
    const wait = 2000 // 2000ms之内不能重复发起请求
    const loading = ref(false)
    const store = useStore()
    const router = useRouter()

    const account = reactive({
      username: '',
      password: '',
    })

    /**
     * 根据账号密码登录，拿到 token 并储存
     */
    const getInformation = async () => {
      try {
        const user = await UserModel.getPermissions()
        const userInfo = await UserModel.getInformation()
        await store.dispatch('setUserAndState', user)
        store.commit('setUserInfo', userInfo)
        store.commit('setUserPermissions', user.permissions)
      } catch (e) {
        console.error(e)
        return Promise.reject(e)
      }
    }

    /**
     * 根据账号密码登录，拿到 token 并储存
     */
    const login = async () => {
      const { username, password } = account
      try {
        loading.value = true
        await UserModel.getToken(username, password)
        await getInformation()
        loading.value = false
        router.push(Config.defaultRoute)
        ElMessage({
          message: '登录成功',
          type: 'success',
        })
      } catch (e) {
        loading.value = false
      }
    }

    const throttleLogin = Utils.throttle(login, wait)

    return {
      account,
      loading,
      throttleLogin,
    }
  },
})
</script>

<style lang="scss" scoped>
$login-ba-png: '~@/assets/image/login/login-ba.png';
$nickname-png: '~@/assets/image/login/nickname.png';
$password-png: '~@/assets/image/login/password.png';
$login-btn-png: '~@/assets/image/login/login-btn.png';

.login {
  width: 100%;
  height: 100%;
  background-size: auto;
  background: #1b2c5f url($login-ba-png) no-repeat center center;

  .team-name {
    position: fixed;
    left: 40px;
    top: 50%;
    width: 50px;
    transform: translateY(-50%);
  }

  .form-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 445px;

    .title {
      height: 37px;
      font-size: 30px;
      line-height: 37px;
      margin-bottom: 15%;

      h1 {
        padding-left: 74px;
        box-sizing: border-box;
        text-align: left;
        color: #8c98ae;
      }
    }

    .login-form {
      width: 100%;

      .form-item {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        padding-bottom: 13px;
        margin-bottom: 34px;

        input {
          width: 100%;
          height: 100%;
          background: transparent;
          color: #c4c9d2;
          font-size: 14px;
          padding-left: 74px;
          box-sizing: border-box;
        }
      }

      .form-item.nickname {
        background: url($nickname-png) no-repeat;
        background-size: 100% auto;
        background-position: left bottom;
      }

      .form-item.password {
        background: url($password-png) no-repeat;
        background-size: 100% auto;
        background-position: left bottom;
      }

      .submit-btn {
        width: 100%;
        height: 70px;
        color: #c4c9d2;
        font-size: 16px;
        text-align: left;
        box-sizing: border-box;
        padding: 0 10px;
        padding-left: 74px;
        background: url($login-btn-png) no-repeat;
        background-size: 90% auto;
        background-position: center bottom;
        border: none;
        cursor: pointer;
      }
    }
  }
}
</style>
