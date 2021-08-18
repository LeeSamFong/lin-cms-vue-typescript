<template>
  <div>
    <!-- 列表页面 -->
    <div class="container"
         v-if="!showEdit">
      <div class="header">
        <div class="title">图书列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="books" v-loading="loading">
        <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column prop="title" label="书名"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑
            </el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission:disabled="'删除图书'"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑页面 -->
    <book-modify v-else
                 :editBookId="editBookId"
                 @editClose="editClose"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useAsync from '@/lin/hooks/async'
import BookModel from '@/models/book'
import { BookType } from '@/models/types/book'
import BookModify from './book'

export default defineComponent({
  name: 'book-list',
  components: { BookModify },
  setup() {
    const showEdit = ref(false)
    const editBookId = ref<number | null>(null)

    const {
      run: getBooks,
      loading: getBooksLoading,
      data: booksData,
    } = useAsync(BookModel.getBooks)
    const books = computed<BookType>(() => booksData.value ?? [])

    onMounted(() => {
      getBooks()
    })

    function handleEdit(id: number) {
      showEdit.value = true
      editBookId.value = id
    }


    const { run: deleteBook, loading: deleteBookLoading } = useAsync(BookModel.deleteBook)

    function handleDelete(id: number) {
      ElMessageBox.confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await deleteBook(id)
        ElMessage.success(res.message as string)
      })
    }

    function editClose() {
      showEdit.value = false
      getBooks()
    }

    function indexMethod(index: number) {
      return index + 1
    }


    const loading = computed<boolean>(() => getBooksLoading.value || deleteBookLoading.value)

    return {
      books,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editBookId,
      indexMethod,
      handleDelete,
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
</style>
