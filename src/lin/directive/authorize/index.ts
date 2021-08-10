import { Directive } from 'vue'
import { isString } from 'lodash'
import { UserType } from '@/lin/models/data_type/user'
import typeHandle from '@/lin/directive/authorize/type-handler'
import store from '@/store'

/**
 * 判断是否允许访问该DOM
 * @param {*} permission 权限
 * @param {*} permissions 当前管理员所在分组权限集
 * @param {*} user 当前用户实例
 */
function isAllowed(permission: string, permissions: string[], user: UserType | null) {
  if (user?.admin) return true

  return permissions.includes(permission)
}

// interface ObjectPermission {
//   permission: string;
//   type?: 'disabled' | 'hidden';
// }

const permissionDirective: Directive<HTMLElement, string | string[]> = {
  beforeMount(el, binding) {
    const { permissions, user } = store.state

    const type = binding.arg ?? 'hidden'
    let isAllow = true

    if (isString(binding.value)) {
      const permission = binding.value
      isAllow = isAllowed(permission, permissions, user)
    } else if (Array.isArray(binding.value)) {
      const isAllows: boolean[] = binding.value.map(permission => isAllowed(permission, permissions, user))

      // 判断为false的数量是不是等于0，如果等于0则表示有权限
      isAllow = isAllows.filter(item => !item).length === 0
    } else {
      throw new Error('v-permission的value只有string与Array<string>两种类型')
    }

    if (!isAllow) {
      typeHandle(type, el)
    }
  },
}

export default permissionDirective
