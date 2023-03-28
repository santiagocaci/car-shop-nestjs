const ORoles = {
  admin: 'admin',
  superUser: 'super-user',
  user: 'user',
} as const;

export type ValidRoles = (typeof ORoles)[keyof typeof ORoles];
