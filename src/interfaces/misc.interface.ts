export interface ReqQueryOptions {
    limit?: number;
    cursor?: string | undefined;
    search?: string | undefined;
    orderBy?: string;
    sortOrder?: "asc" | "desc";
  }
  
  export interface PaginatedResponse<T> {
    records: T[];
    nextCursor?: string | null;
    currentPage?: number | null;
    nextPage?: number | null;
  }