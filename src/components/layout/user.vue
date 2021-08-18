<template>
  <div class="user">
    <el-dropdown>
      <span class="el-dropdown-link">
        <div class="nav-avatar">
          <img :src="userInfo?.avatar || defaultAvatar" alt="头像">
        </div>
      </span>

      <template #dropdown>
        <el-dropdown-menu class="user-box">
          <div class="user-info">
            <div class="avatar"
                 title="点击修改头像">
              <img :src="userInfo?.avatar || defaultAvatar" alt="头像">
              <label class="mask">
                <i class="iconfont icon-icon-test"
                   style="font-size: 20px;"></i>
                <input type="file"
                       ref="avatarInput"
                       accept="image/*"
                       @change="fileChange">
              </label>
            </div>
            <div class="text">
              <div class="username"
                   v-if="!nicknameChanged"
                   @click="changeNickname"
              >{{ nickname }}
              </div>
              <el-input v-else
                        placeholder="请输入内容"
                        size="small"
                        v-model="nickname"
                        ref="input"
                        v-loading="nicknameLoading"
                        @blur="change"
                        @change="change"
              />
              <div class="desc"
                   v-if="!nicknameChanged"
              >{{ groupName }}
              </div>
            </div>
            <img src="@/assets/image/user/corner.png"
                 class="corner"
                 alt="">
          </div>
          <ul class="dropdown-box">
            <li class="password"
                @click="goToCenter">
              <i class="iconfont icon-weibaoxitongshangchuanlogo-"></i>
              <span>个人中心</span>
            </li>
            <li class="account"
                @click="outLogin">
              <i class="iconfont icon-tuichu"></i>
              <span>退出账户</span>
            </li>
          </ul>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 修改头像 -->
    <avatar-cropper :original-image="cropImg"
                    :crop-visible="cropVisible"
                    @switchCropVisible="switchCropVisible"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'
import router from '@/router'
import defaultAvatar from '@/assets/image/user/user.png'
import UserModel from '@/lin/models/user'
import AvatarCropper from '@/components/layout/avatar-cropper.vue'

export default defineComponent({
  name: 'User',
  components: { AvatarCropper },
  setup() {
    const store = useStore()

    const userInfo = computed(() => store.state.userInfo)
    const nickname = ref(userInfo.value?.nickname ?? '佚名')
    const username = ref(userInfo.value?.username ?? '未登录')
    const groupName = ref(userInfo.value?.groups
      .map(group => group.info)
      .join('、') ?? '超级管理员')

    const logout = () => store.dispatch('logout')


    const avatarInput = ref<HTMLInputElement | null>(null)
    const cropVisible = ref(false)
    const cropImg = ref('')


    const nicknameChanged = ref(false)
    const input = ref<HTMLInputElement | null>(null)


    function _clearFileInput() {
      if (avatarInput.value) {
        avatarInput.value.value = ''
      }
    }

    /**
     * 验证图像是否符合要求
     * @param file
     */
    function _verifyImage(file: File) {
      const imgSrc = window.URL.createObjectURL(file)
      const image = new Image()
      image.src = imgSrc
      image.onload = () => {
        const { width, height } = image
        if (width < 50) {
          ElMessage.error('图像宽度过小, 请选择大于50px的图像')
          _clearFileInput()
          return
        }
        if (height < 50) {
          ElMessage.error('图像高度过小, 请选择大于50px的图像')
          _clearFileInput()
          return
        }

        // 验证通过, 打开裁剪框
        cropImg.value = imgSrc
        cropVisible.value = true
      }

      image.onerror = () => {
        ElMessage.error('获取本地图片出现错误, 请重试')
        // 清空输入框
        _clearFileInput()
      }
    }

    function fileChange(event: InputEvent) {
      const { files } = event.target as HTMLInputElement
      if (!files || files.length !== 1) {
        return
      }

      const imgFile = files[0]
      // 验证文件大小是否符合要求, 不大于 5MB
      if (imgFile.size > 1024 * 1024 * 5) {
        ElMessage.error('文件过大超过5MB')
        // 清空输入框
        _clearFileInput()
        return
      }

      _verifyImage(imgFile)
    }

    watch(cropVisible, val => {
      if (!val) {
        cropImg.value = ''
      }
    })

    function switchCropVisible(flag: boolean) {
      cropVisible.value = flag
    }

    function changeNickname() {
      nicknameChanged.value = true
      nextTick(() => {
        if (input.value) {
          input.value.focus()
        }
      })
    }

    const nicknameLoading = ref(false)
    // 记录原来的nickname
    let _nickname = nickname.value

    async function change() {
      if (nicknameLoading.value) return
      if (!nickname.value) {
        nicknameChanged.value = false
        return
      }
      if (nickname.value === userInfo.value?.nickname || nickname.value === '佚名') {
        nicknameChanged.value = false
        return
      }
      nicknameLoading.value = true
      await UserModel.updateUserInfo({
        nickname: nickname.value,
      }).catch(error => {
        nicknameLoading.value = false
        nickname.value = _nickname
        nicknameChanged.value = false
        return Promise.reject(error)
      })

      nicknameLoading.value = false
      _nickname = nickname.value
      nicknameChanged.value = false

      ElMessage({
        type: 'success',
        message: '更新昵称成功',
      })

      const info = await UserModel.getInformation()
      store.commit('setUserInfo', info)
    }

    function goToCenter() {
      router.push('/center')
    }

    function outLogin() {
      logout()
      window.location.reload()
    }

    const dialogFormVisible = ref(false)

    return {
      userInfo,
      input,
      avatarInput,
      defaultAvatar,
      cropImg,
      username,
      nickname,
      groupName,
      cropVisible,
      nicknameChanged,
      dialogFormVisible,
      nicknameLoading,
      fileChange,
      switchCropVisible,
      changeNickname,
      change,
      goToCenter,
      outLogin,
    }
  },
})
</script>

<style lang="scss" scoped>
.user {
  height: 40px;

  .el-dropdown-link {
    cursor: pointer;

    .nav-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
    }
  }
}

.user-box {
  width: 326px;
  background: transparent;
  margin-bottom: 0;
  padding-bottom: 0;
  border: none;

  .user-info {
    background-image: url('../../assets/image/user/user-bg.png');
    background-size: 100% 100%;
    transform: translateY(-10px);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex-direction: row;
    padding: 35px 20px 25px 30px;
    z-index: 100;
    position: relative;

    .corner {
      position: absolute;
      right: 18px;
      top: -9px;
      width: 27px;
      height: 10px;
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
        height: 32px;
        line-height: 32px;
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

  .dropdown-box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 35px;
    height: 122px;
    color: #596c8e;
    font-size: 14px;
    background: white;
    margin-top: -10px;

    li {
      cursor: pointer;

      &:nth-child(1) {
        margin-top: 20px;
      }

      &:nth-child(2) {
        margin-bottom: 20px;
      }

      i {
        margin-right: 10px;
      }

      &:hover {
        color: $theme !important;

        i {
          color: $theme !important;
        }
      }
    }
  }
}

.popper__arrow {
  display: none !important;
}

.avatar-croppa-container {
  display: inline-block;
  border-color: #3862bc;
  border-style: dashed;
  font-size: 0;
  border-width: 2px;
}
</style>
