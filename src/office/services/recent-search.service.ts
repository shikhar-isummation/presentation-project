import { Injectable } from "@nestjs/common";

type RecentList = Array<{ query: string; list: any[] }>;

@Injectable()
export class RecentSearchService {
  private readonly store = new Map<string, RecentList>();

  private readonly MAX_STORED_ITEMS = 500;

  addRecentSerach(token: string, query: string, list: any[]) {
    const recentList = this.store.get(token) || [];

    recentList.unshift({ query, list });

    if (recentList.length > this.MAX_STORED_ITEMS) {
      recentList.length = this.MAX_STORED_ITEMS;
    }

    this.store.set(token, recentList);
  }

  find(token: string) {
    const recentList = this.store.get(token);

    return recentList || [];
  }

  findByTokenAndQuery(token: string, query: string) {
    const recentList = this.find(token);

    return recentList.filter((searchResult) =>
      searchResult.query.includes(query.toLowerCase())
    );
  }
}
