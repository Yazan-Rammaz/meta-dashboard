export const enum PermissionKey {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VIEW_ROLES = 'VIEW_ROLES',
  ROLES_CREATE = 'roles.create',
  ROLES_UPDATE = 'roles.update',
  ROLES_DELETE = 'roles.delete',

  // Analytics Permissions
  ANALYTICS_READ = 'analytics.read',

  // API Keys Permissions
  API_KEYS_CREATE = 'api_keys.create',
  API_KEYS_DELETE = 'api_keys.delete',
  API_KEYS_READ = 'api_keys.read',
  API_KEYS_UPDATE = 'api_keys.update',
  API_KEYS_REVOKE = 'api_keys.delete',

  // Clients Permissions
  CLIENTS_CREATE = 'clients.create',
  CLIENTS_DELETE = 'clients.delete',
  CLIENTS_READ = 'clients.read',
  CLIENTS_UPDATE = 'clients.update',

  // Messages Permissions
  MESSAGES_READ = 'messages.read',
  MESSAGES_SEND = 'messages.send',

  // System Permissions
  SYSTEM_ADMIN = 'system.admin',

  // Users Permissions
  USERS_CREATE = 'users.create',
  USERS_DELETE = 'users.delete',
  USERS_READ = 'users.read',
  USERS_UPDATE = 'users.update',

  // Webhooks Permissions
  WEBHOOKS_READ = 'webhooks.read'
}

export const PAGE_PERMISSIONS = {
  DASHBOARD: PermissionKey.ANALYTICS_READ,
  ROLES: PermissionKey.VIEW_ROLES,
  API_KEYS: PermissionKey.API_KEYS_READ,
  CLIENTS: PermissionKey.CLIENTS_READ,
  MESSAGES: PermissionKey.MESSAGES_READ,
  USERS: PermissionKey.USERS_READ,
  WEBHOOKS: PermissionKey.WEBHOOKS_READ
} as const;
