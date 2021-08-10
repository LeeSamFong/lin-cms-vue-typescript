import { usePagination } from '@/lin/hooks/paging'
import { AdminGroupType, AdminUser } from '@/lin/models/data_type/admin'
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

  static async getAlLGroups() {
    return linAxios<AdminGroupType[]>('cms/admin/group/all')
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
}


export default AdminModel
