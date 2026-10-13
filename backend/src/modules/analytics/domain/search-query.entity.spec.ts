import { ValidationError } from '../../../shared/domain/domain.error.js';
import { SearchQuery, normalizeTerm } from './search-query.entity.js';

const at = new Date('2026-10-13T08:00:00Z');

describe('normalizeTerm', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeTerm('  ZaRa   Home ')).toBe('zara home');
  });

  it('keeps Khmer text unchanged', () => {
    expect(normalizeTerm(' ហាងកាហ្វេ ')).toBe('ហាងកាហ្វេ');
  });

  it('cuts terms longer than 100 characters', () => {
    expect(normalizeTerm('a'.repeat(150))).toHaveLength(100);
  });
});

describe('SearchQuery', () => {
  it('stores the normalized term and the result count', () => {
    const query = SearchQuery.create({ term: '  Pharmacy ', resultCount: 2, createdAt: at });

    expect(query.term).toBe('pharmacy');
    expect(query.resultCount).toBe(2);
    expect(query.createdAt).toBe(at);
  });

  it('accepts a search that found nothing', () => {
    expect(SearchQuery.create({ term: 'sushi', resultCount: 0, createdAt: at }).resultCount).toBe(0);
  });

  it('rejects terms shorter than two characters', () => {
    expect(() => SearchQuery.create({ term: ' z ', resultCount: 1, createdAt: at })).toThrow(
      ValidationError,
    );
  });

  it('rejects negative or fractional result counts', () => {
    expect(() => SearchQuery.create({ term: 'zara', resultCount: -1, createdAt: at })).toThrow(
      ValidationError,
    );
    expect(() => SearchQuery.create({ term: 'zara', resultCount: 1.5, createdAt: at })).toThrow(
      ValidationError,
    );
  });

  it('knows which raw terms are worth tracking', () => {
    expect(SearchQuery.isTrackable('za')).toBe(true);
    expect(SearchQuery.isTrackable(' z ')).toBe(false);
    expect(SearchQuery.isTrackable('   ')).toBe(false);
  });
});
