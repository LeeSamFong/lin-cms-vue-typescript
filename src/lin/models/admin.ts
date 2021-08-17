import { usePagination } from '@/lin/hooks/paging'
import {
  AdminGroupType,
  AdminPermissionsType,
  AdminUser,
  GroupPermissionType,
} from '@/lin/models/data_type/admin'
import linAxios from '@/lin/plugin/axios'
import { UnifyResponse } from '@/lin/models/data_type/response-types'

class AdminModel {
  static useAdminUsersPagination(groupId?: number) {
    const params: {
      [k in string]: unknown
    } = {}
    if (groupId) {
      params.group_id = groupId
    }
    return usePagination<AdminUser>('cms/admin/users', params)
  }

  static async getAllPermissions() {
    return linAxios<AdminPermissionsType>('cms/admin/permission')
  }

  static async getAlLGroups() {
    return linAxios<AdminGroupType[]>('cms/admin/group/all')
  }

  static async getOneGroup(id: number) {
    return linAxios<GroupPermissionType>(`cms/admin/group/${id}`)
  }

  static deleteOneUser(id: number) {
    return linAxios<UnifyResponse>({
      url: `cms/admin/user/${id}`,
      method: 'delete',
    })
  }

  static async updateOneUser(email: string, group_ids: number[], id: number) {
    return linAxios<UnifyResponse>({
      url: `cms/admin/user/${id}`,
      method: 'put',
      data: {
        email,
        group_ids,
      },
    })
  }

  static async changePassword(new_password: string, confirm_password: string, id: number) {
    return linAxios<UnifyResponse>({
      url: `cms/admin/user/${id}/password`,
      method: 'put',
      data: {
        new_password,
        confirm_password,
      },
    })
  }

  static async createOneGroup(name: string, info: string, permission_ids: number[]) {
    return linAxios<UnifyResponse>({
      url: 'cms/admin/group',
      method: 'post',
      data: {
        name,
        info,
        permission_ids,
      },
    })
  }

  static async updateOneGroup(name: string, info: string, id: number) {
    return linAxios<UnifyResponse>({
      url: `cms/admin/group/${id}`,
      method: 'put',
      data: {
        name,
        info,
      },
    })
  }

  static async deleteOneGroup(id: number) {
    return linAxios<UnifyResponse>({
      url: `cms/admin/group/${id}`,
      method: 'delete',
    })
  }

  static async dispatchPermissions(group_id: number, permission_ids: number[]) {
    return linAxios<UnifyResponse>({
      url: 'cms/admin/permission/dispatch/batch',
      method: 'post',
      data: {
        group_id,
        permission_ids,
      },
    })
  }

  static async removePermissions(group_id: number, permission_ids: number[]) {
    return linAxios<UnifyResponse>({
      url: 'cms/admin/permission/remove',
      method: 'post',
      data: {
        group_id,
        permission_ids,
      },
    })
  }
}


export default AdminModel
