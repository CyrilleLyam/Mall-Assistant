import { ValidationError } from '../../../shared/domain/domain.error.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Email {
    const value = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(value)) {
      throw new ValidationError(`Invalid email address: ${raw}`);
    }
    return new Email(value);
  }
}
