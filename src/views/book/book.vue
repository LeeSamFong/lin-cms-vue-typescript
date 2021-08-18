<template>
  <div class="container">
    <div class="title"
         v-if="!editBookId">新建图书{{ editBookId }}
    </div>
    <div class="title"
         v-else>
      <span>修改图书</span><span class="back"
                             @click="back"><i class="iconfont icon-fanhui"/> 返回 </span>
    </div>

    <div class="wrap" v-loading="loading">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="book"
                   status-icon
                   ref="form"
                   label-width="100px"
                   :rules="rules"
                   @submit.prevent>
            <el-form-item label="书名" prop="title">
              <el-input size="medium" v-model="book.title" placeholder="请填写书名"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input size="medium" v-model="book.author" placeholder="请填写作者"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input size="medium" v-model="book.image" placeholder="请填写封面地址"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入简介"
                v-model="book.summary"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary"
                         :loading="btnLoading"
                         :disabled="btnLoading"
                         @click="submitForm">保 存
              </el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { BookType } from '@/models/types/book'
import useAsync from '@/lin/hooks/async'
import BookModel from '@/models/book'
import { UnifyResponse } from '@/lin/models/data_type/response-types'

export default defineComponent({
  name: 'Book',
  props: {
    editBookId: {
      type: Number,
      default: null,
    },
  },
  setup(props, { emit }) {
    const form = ref<typeof ElForm | null>(null)
    const book = reactive<Omit<BookType, 'id'>>({
      title: '',
      author: '',
      summary: '',
      image: '',
    })

    const { run: getBook, loading: getBookLoading } = useAsync(BookModel.getBook)
    onMounted(async () => {
      if (props.editBookId) {
        const res = await getBook(props.editBookId)
        listAssign(book, res)
      }
    })


    // 重置表单
    function resetForm() {
      form.value.resetFields()
    }


    const { run: editBook, loading: editLoading } = useAsync(BookModel.editBook)
    const { run: createBook, loading: createLoading } = useAsync(BookModel.createBook)

    async function submitForm() {
      form.value.validate(async (valid: boolean) => {
        if (!valid) {
          ElMessage.error('请将信息填写完整')
          return
        }

        let res: UnifyResponse

        if (props.editBookId) {
          res = await editBook(props.editBookId, book)
          emit('editClose')
        } else {
          res = await createBook(book)
          resetForm()
        }

        ElMessage.success(res.message as string)
      })
    }


    /**
     * 会改变原对象
     */
    function listAssign(a: { [k: string]: unknown; }, b: { [k: string]: unknown; }) {
      Object.keys(a).forEach(key => {
        a[key] = b[key] || a[key]
      })
      return a
    }


    function back() {
      emit('editClose')
    }

    /**
     * 表单规则验证
     */
    const { rules } = getRules()


    const loading = computed<boolean>(() => getBookLoading.value)
    const btnLoading = computed<boolean>(() => editLoading.value || createLoading.value)

    return {
      form,

      rules,
      book,
      loading,
      btnLoading,

      back,
      resetForm,
      submitForm,
    }
  },
})

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule: never, value: string, callback: (e: unknown) => void) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    title: [{ validator: checkInfo, trigger: 'blur', required: true }],
    author: [{ validator: checkInfo, trigger: 'blur', required: true }],
    summary: [{ validator: checkInfo, trigger: 'blur', required: true }],
    image: [{ validator: checkInfo, trigger: 'blur', required: true }],
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

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
