import { Directive } from 'vue'
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

interface ObjectPermission {
  permission: string;
  type?: 'disabled' | 'hidden';
}

const permissionDirective: Directive<HTMLElement, string | ObjectPermission> = {
  beforeMount(el, binding) {
    const { permissions, user } = store.state

    let type = 'hidden'
    let permission: string

    if (typeof binding.value === 'string') {
      permission = binding.value
    } else {
      permission = binding.value.permission
      type = binding.value.type ?? type
    }

    const isAllow = isAllowed(permission, permissions, user)
    if (permission && !isAllow) {
      typeHandle(type, el)
    }
  },
}

export default permissionDirective
