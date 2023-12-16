export class RedisKeys {
  /**
   * 用户信息
   */
  static user(userId: string) { return `user:${userId}` }
  /**
   * 权限码集合
   */
  static rolePermissionSet(roleId: string) { return `role:permissionSet:${roleId}` }
}