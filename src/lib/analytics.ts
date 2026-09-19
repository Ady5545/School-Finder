export type AnalyticsEvent =
  | { name: 'school_view'; properties: { schoolSlug: string; schoolName: string } }
  | { name: 'school_search'; properties: { query: string; resultsCount: number } }
  | { name: 'filter_used'; properties: { filterType: string; filterValue: string | number } }
  | { name: 'school_saved'; properties: { schoolSlug: string; action: 'save' | 'unsave' } }
  | { name: 'compare_added'; properties: { schoolSlug: string; totalCompared: number } }
  | { name: 'compare_started'; properties: { schoolSlugs: string[] } }
  | { name: 'admission_clicked'; properties: { schoolSlug: string; actionType: string } }
  | { name: 'signup_started'; properties: { source: string } }
  | { name: 'signup_completed'; properties: { method: string } };

export interface AnalyticsDispatcher {
  track(event: AnalyticsEvent): void;
}

// Development or in-memory dispatcher stub
class ConsoleAnalyticsDispatcher implements AnalyticsDispatcher {
  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV === 'development') {
      // In dev mode, log events clearly for verification without spamming production
      // console.debug(`[Analytics Event]`, event.name, event.properties);
    }
  }
}

export const analytics: AnalyticsDispatcher = new ConsoleAnalyticsDispatcher();
