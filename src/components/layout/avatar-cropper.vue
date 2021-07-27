<template>
  <el-dialog center
             title="裁剪"
             width="300px"
             append-to-body
             :close-on-click-modal="false"
             :model-value="cropVisible"
             custom-class="croppa-dialog"
  >
    <div style="text-align: center;">
      <div class="avatar-croppa-container">
        <vue-picture-cropper
          :box-style="{
            width: '100%',
            height: '100%',
            margin: 'auto',
            backgroundColor: '#f8f8f8'
          }"
          :img="originalImage"
          :options="{
            viewMode: 1, // 限制裁剪框不超过画布的大小
            aspectRatio: 1, // 头像使用长宽比为 1 裁剪
          }"
        />
      </div>
      <div style="margin-top: 1em;">通过鼠标滚轮调节头像大小</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="switchStatus">取 消</el-button>
        <el-button type="primary" size="small" @click="handleCrop">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import FileModel from '@/lin/models/file'
import { ElMessage } from 'element-plus'
import UserModel from '@/lin/models/user'

export default defineComponent({
  name: 'AvatarCropper',
  components: { VuePictureCropper },
  props: {
    originalImage: {
      type: String,
    },
    cropVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['switchCropVisible'],
  setup(props, { emit }) {
    function switchStatus() {
      emit('switchCropVisible', false)
    }

    const store = useStore()

    async function handleCrop() {
      // 获取裁剪数据
      const blob = cropper.getBlob()
      // 构造为文件对象
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })

      const res = await FileModel.uploadFile(file)
      if (!Array.isArray(res) || !res.length) {
        ElMessage.error('头像上传失败')
        return
      }

      await UserModel.updateUserInfo({
        avatar: res[0].path,
      })
      ElMessage.success('更新头像成功')
      switchStatus()
      const userInfo = await UserModel.getInformation()
      store.commit('setUserInfo', userInfo)
    }

    return {
      switchStatus,
      handleCrop,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
