export class RedisKeys {
  /**
   * 用户信息
   */
  static user(userId: string) { return `user:${userId}` }
  static userByName(userName: string) { return `user:name:${userName}` }
  /**
   * 权限码集合
   */
  static rolePermissionSet(roleId: string) { return `role:permissionSet:${roleId}` }
}