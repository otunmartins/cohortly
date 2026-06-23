export type AuthorityFilter =
  | "FDA"
  | "EMA"
  | "MHRA"
  | "ICH"
  | "Internal"
  | "CT.gov"
  | "PubMed";

export type KbSortOrder = "relevance" | "recency" | "authority";

export interface KbCitationRef {
  n: number;
  sourceId: string;
  label: string;
}

export interface KbAnswerSegment {
  type: "text" | "citation";
  value: string;
  citationRef?: KbCitationRef;
}

export interface KbPassage {
  id: string;
  n: number;
  authority: AuthorityFilter;
  kind: string;
  date: string;
  score: number;
  citedCount: number;
  snippet: string;
  sourceId: string;
  sourceTitle: string;
}

export interface KbAnswer {
  query: string;
  confidence: number;
  sourceCount: number;
  latencyMs: number;
  modelVersion: string;
  segments: KbAnswerSegment[];
  passages: KbPassage[];
}

export interface KbSourceCategory {
  label: string;
  chunkCount: number;
}

export interface KbRecentIngest {
  id: string;
  title: string;
  authority: AuthorityFilter;
  chunksAdded: number;
  age: string;
}

export interface KbIndexHealth {
  status: "synced" | "indexing" | "error";
  lastSyncedAgo: string;
  totalChunks: number;
  categories: KbSourceCategory[];
  recentIngests: KbRecentIngest[];
  pinnedStudyCode: string | null;
}
