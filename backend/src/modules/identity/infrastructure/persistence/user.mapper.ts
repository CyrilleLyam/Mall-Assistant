import { User } from '../../domain/user.entity.js';
import { UserRole } from '../../domain/user-role.js';
import { UserOrmEntity } from './user.orm-entity.js';

export const UserMapper = {
  toDomain(row: UserOrmEntity): User {
    return User.restore(row.id, {
      email: row.email,
      password: row.password,
      role: row.role as UserRole,
    });
  },

  toPersistence(user: User): UserOrmEntity {
    return Object.assign(new UserOrmEntity(), {
      id: user.id,
      email: user.email.value,
      password: user.password,
      role: user.role,
    });
  },
};
