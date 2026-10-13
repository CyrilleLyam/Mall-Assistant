import { Entity } from '../../../shared/domain/entity.js';
import { newId } from '../../../shared/domain/id.js';
import { Email } from './email.js';
import { UserRole } from './user-role.js';

export interface UserProps {
  email: string;
  password: string;
  role: UserRole;
}

export class User extends Entity {
  private constructor(
    id: string,
    readonly email: Email,
    readonly password: string,
    readonly role: UserRole,
  ) {
    super(id);
  }

  static create(props: UserProps): User {
    return new User(
      newId(),
      Email.create(props.email),
      props.password,
      props.role,
    );
  }

  static restore(id: string, props: UserProps): User {
    return new User(id, Email.create(props.email), props.password, props.role);
  }
}
