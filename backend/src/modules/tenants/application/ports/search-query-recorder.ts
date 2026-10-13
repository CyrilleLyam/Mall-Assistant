export abstract class SearchQueryRecorder {
  abstract record(term: string, resultCount: number): Promise<void>;
}
