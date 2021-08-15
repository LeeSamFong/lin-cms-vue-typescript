<template>
  <div class="container"
       v-loading="loading">
    <div class="group">
      <div class="label">
        <label>{{ title }}</label>
      </div>
      <div class="details">
        <div class="permissions-box"
             v-for="(permission, moduleName) in allPermissions"
             :key="moduleName">
          <el-checkbox-group v-model="permissionModuleNames">
            <div class="module-box">
              <el-checkbox class="module"
                           :label="moduleName"
                           :indeterminate="halfPermissions.includes(moduleName)"
                           @change="moduleCheck($event, permission, moduleName)"/>
            </div>
          </el-checkbox-group>
          <el-checkbox-group v-model="checkedPermissionNames">
            <ul class="permissions-ul">
              <li class="permissions-li"
                  v-for="(item, key) in permission"
                  :key="key">
                <el-checkbox :label="item.name"
                             :model-value="permissionModuleIds.includes(item.id)"
                             @change="singleCheck(item.id, permission, moduleName)"/>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import useAsync from '@/lin/hooks/async'
import AdminModel from '@/lin/models/admin'
import { AdminPermissionType } from '@/lin/models/data_type/admin'

export default defineComponent({
  name: 'GroupPermission',
  props: {
    id: Number,
    title: String,
  },
  emits: [
    'getCacheAuthIds',
    'updatePermissions',
    'updateAllPermissions',
  ],
  setup(props, { emit }) {
    const {
      run: getAllPermissions,
      data: allPermissions,
      loading: getAllPermissionsLoading,
    } = useAsync(AdminModel.getAllPermissions)

    const { run: getOneGroup, loading: getOneGroupLoading } = useAsync(AdminModel.getOneGroup)

    const permissionModuleIds = ref<number[]>([]) // 权限组 集合 id
    const checkedPermissionNames = ref<string[]>([])
    const halfPermissions = ref<string[]>([]) // 该分类下的权限没有全选中
    const permissionModuleNames = ref<string[]>([]) // 权限组 module name

    /**
     * 初始化权限
     * 通过判断有没有传入id，来判断当前页面是添加分组还是编辑分组
     */
    async function getGroupPermissions() {
      const allPermissions = await getAllPermissions()
      if (props.id) {
        const res = await getOneGroup(props.id)
        let temp: string[] = []
        const cache: { [k: string]: number } = {}

        res.permissions.forEach(v => {
          permissionModuleIds.value.push(v.id)
          checkedPermissionNames.value.push(v.name)
          temp.push(v.module)
          // 每个module拥有权限个数
          if (!cache[v.module]) {
            cache[v.module] = 1
          } else {
            cache[v.module]++
          }
        })

        // 去重
        temp = Array.from(new Set(temp))

        // 半选
        temp.forEach(item => {
          if (allPermissions[item].length !== cache[item]) {
            halfPermissions.value.push(item)
          }
        })
        permissionModuleNames.value = Array.from(new Set(temp))
      }

      emit('getCacheAuthIds', permissionModuleIds.value.slice())
      emit('updatePermissions', permissionModuleIds.value)
      emit('updateAllPermissions', allPermissions.value)
    }

    onMounted(() => {
      getGroupPermissions()
    })


    /**
     * 权限批量选中（一个module）
     */
    function moduleCheck(checked: boolean, permissions: AdminPermissionType[], moduleName: string) {
      const ids = permissions.map(item => item.id)
      const checkedNames = permissions.map(item => item.name)
      if (checked) {
        permissionModuleIds.value = Array.from(new Set(permissionModuleIds.value.concat(ids)))
        checkedPermissionNames.value = Array.from(new Set(checkedPermissionNames.value.concat(checkedNames)))
        if (!permissionModuleNames.value.includes(moduleName)) {
          permissionModuleNames.value.push(moduleName)
        }
      } else {
        permissionModuleIds.value = permissionModuleIds.value.filter(v => !ids.includes(v))
        checkedPermissionNames.value = checkedPermissionNames.value.filter(v => !checkedNames.includes(v))
        permissionModuleNames.value = permissionModuleNames.value.filter(v => v !== moduleName)
      }
      halfPermissions.value = halfPermissions.value.filter(v => v !== moduleName)
      emit('updatePermissions', permissionModuleIds.value)
    }

    /**
     * 单选某一权限
     */
    function singleCheck(id: number, permission: AdminPermissionType[], moduleName: string) {
      const ids = permission.map(item => item.id)
      let count = 0
      const index = permissionModuleIds.value.indexOf(id)
      if (index === -1) {
        permissionModuleIds.value.push(id)
      } else {
        permissionModuleIds.value.splice(index, 1)
      }

      ids.forEach(item => {
        if (permissionModuleIds.value.includes(item)) {
          count++
        }
        // 全选状态
        if (ids.length === count) {
          permissionModuleNames.value.push(moduleName)
          halfPermissions.value = halfPermissions.value.filter(v => v !== moduleName)
        } else if (count === 0) {
          // 未选中状态
          permissionModuleNames.value = permissionModuleNames.value.filter(v => v !== moduleName)
          halfPermissions.value = halfPermissions.value.filter(v => v !== moduleName)
        } else {
          // 半选状态
          permissionModuleNames.value = permissionModuleNames.value.filter(v => v !== moduleName)
          if (!halfPermissions.value.includes(moduleName)) {
            halfPermissions.value.push(moduleName)
          }
        }
      })

      emit('updatePermissions', permissionModuleIds.value)
    }


    const loading = computed<boolean>(() => getAllPermissionsLoading.value || getOneGroupLoading.value)

    return {
      loading,

      allPermissions,
      halfPermissions,
      permissionModuleIds,
      permissionModuleNames,
      checkedPermissionNames,

      getGroupPermissions,
      moduleCheck,
      singleCheck,
    }
  },
})
</script>

<style lang="scss" scoped>
.group {
  margin-left: -95px;

  .label {
    margin-bottom: 10px;
    width: 70px;
    margin-left: 20px;
    float: left;
    font-weight: 500;

    label {
      color: #333333;
      font-size: 14px;
      font-weight: 500;
      height: 20px;
      line-height: 20px;
    }

    .necessary {
      color: #e46a76;
      font-size: 14px;
      font-weight: 500px;
      margin-right: 5px;
      font-size: 16px;
    }
  }

  .details {
    display: inline-block;
    width: calc(100% - 95px);
    margin-top: 5px;
    margin-left: 5px;

    .text-input {
      height: 40px;
      width: 780px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid #dee2e6;
      text-indent: 20px;

      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #c4c9d2;
        text-indent: 20px;
      }
    }

    .permissions-box {
      .module {
        height: 20px;
        font-size: 13px;
        color: #45526b;
        line-height: 20px;
        margin-bottom: 10px;
      }

      .permissions-ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20px 20px 0;
        background: #f5f5f6;
        margin-bottom: 20px;

        .permissions-li {
          width: 150px;
          height: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          vertical-align: text-top;
          margin-right: 10px;

          .check {
            transform: translateY(2px);
            margin-right: 5px;
          }

          .permissions-name {
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #596c8e;
            line-height: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
