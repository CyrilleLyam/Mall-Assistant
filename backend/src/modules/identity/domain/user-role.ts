export const UserRole = {
  Admin: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
