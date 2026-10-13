import { Entity } from '../../../shared/domain/entity.js';
import { ValidationError } from '../../../shared/domain/domain.error.js';
import { newId } from '../../../shared/domain/id.js';

export const MIN_TERM_LENGTH = 2;
export const MAX_TERM_LENGTH = 100;

export const normalizeTerm = (raw: string): string =>
  raw.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, MAX_TERM_LENGTH);

export interface SearchQueryProps {
  term: string;
  resultCount: number;
  createdAt: Date;
}

export class SearchQuery extends Entity {
  private constructor(
    id: string,
    readonly term: string,
    readonly resultCount: number,
    readonly createdAt: Date,
  ) {
    super(id);
  }

  static isTrackable(rawTerm: string): boolean {
    return normalizeTerm(rawTerm).length >= MIN_TERM_LENGTH;
  }

  static create(props: SearchQueryProps): SearchQuery {
    const term = normalizeTerm(props.term);
    if (term.length < MIN_TERM_LENGTH) {
      throw new ValidationError(
        `Search term must have at least ${MIN_TERM_LENGTH} characters`,
      );
    }
    if (!Number.isInteger(props.resultCount) || props.resultCount < 0) {
      throw new ValidationError('Result count must be a whole number, zero or more');
    }
    return new SearchQuery(newId(), term, props.resultCount, props.createdAt);
  }

  static restore(id: string, props: SearchQueryProps): SearchQuery {
    return new SearchQuery(id, props.term, props.resultCount, props.createdAt);
  }
}
