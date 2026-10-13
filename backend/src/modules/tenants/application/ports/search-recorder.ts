export abstract class SearchRecorder {
  abstract record(tenantId: string, query: string): Promise<void>;
}
