import { UserGroupType } from '@/lin/models/data_type/user'

export type GroupLevelType = 'ROOT' | 'GUEST' | 'USER'

export interface AdminUser {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  groups: UserGroupType[];
}

export interface AdminGroupType {
  id: number;
  info: string;
  level: GroupLevelType;
  name: string;
}

export interface AdminPermissionType {
  id: number;
  module: string;
  mount: boolean;
  name: string;
}

export interface AdminPermissionsType {
  [k: string]: AdminPermissionType[];
}

export interface GroupPermissionType {
  id: number;
  name: string;
  info: string;
  permissions: AdminPermissionType[];
}
