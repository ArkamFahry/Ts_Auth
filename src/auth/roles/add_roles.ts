export const add_roles =
  ['admin', 'user', 'authenticated', 'anon'] ||
  process.env.ALLOWED_ROLES.split(',');
