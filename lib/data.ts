import sources from "@/data/sources.json";
import entries from "@/data/entries.json";

export type Source = {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
  supported_levels: string[];
  supported_funding_types: string[];
  region_scope: string;
  primary_language: string;
  update_frequency: string;
  access_mode: string;
  has_search_filters: boolean;
  typical_filters: string[];
  flags: {
    indonesia_friendly: boolean;
    muslim_friendly: boolean;
  };
};

export type FundingCoverage = {
  tuition: string;
  stipend: string;
  travel: string;
  health_insurance: string;
  other_benefits: string[];
};

export type HostEntity = {
  type: string;
  name: string;
  country: string;
  region: string;
};

export type AcademicRequirements = {
  min_gpa: number;
  required_previous_degree: string[];
};

export type LanguageRequirements = {
  primary_language: string;
  accepted_tests: string[];
  min_scores: Record<string, number>;
};

export type Entry = {
  id: string;
  source_id: string;
  source_name: string;
  category: string;
  title: string;
  short_title: string;
  level: string[];
  funding_type: string;
  funding_coverage: FundingCoverage;
  host_entity: HostEntity;
  eligible_nationalities: string[];
  eligible_fields: string[];
  delivery_mode: string[];
  attendance_mode: string[];
  application_url: string;
  official_call_url: string;
  application_open_date: string;
  application_deadline: string;
  start_date: string;
  requirements_summary: string;
  academic_requirements: AcademicRequirements;
  language_requirements: LanguageRequirements;
  selection_criteria_keywords: string[];
  is_fully_funded: boolean;
  currency: string;
  estimated_yearly_value: number;
  recurrence_pattern: string;
  tags: string[];
  flags: {
    indonesia_friendly: boolean;
    muslim_friendly: boolean;
  };
  last_checked: string;
  status: string;
};

export type SearchFilters = {
  query?: string;
  level?: string;
  funding_type?: string;
  country?: string;
  field?: string;
  fully_funded?: boolean;
  indonesia_friendly?: boolean;
  status?: string;
};

export function getAllSources(): Source[] {
  return sources as Source[];
}

export function getSourceById(id: string): Source | undefined {
  return (sources as Source[]).find((s) => s.id === id);
}

export function getAllEntries(): Entry[] {
  return entries as Entry[];
}

export function getEntryById(id: string): Entry | undefined {
  return (entries as Entry[]).find((e) => e.id === id);
}

export function getEntriesBySourceId(sourceId: string): Entry[] {
  return (entries as Entry[]).filter((e) => e.source_id === sourceId);
}

export function searchEntries(filters: SearchFilters): Entry[] {
  let results = entries as Entry[];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.short_title.toLowerCase().includes(q) ||
        e.host_entity.name.toLowerCase().includes(q) ||
        e.host_entity.country.toLowerCase().includes(q) ||
        e.requirements_summary.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.level) {
    results = results.filter((e) => e.level.includes(filters.level!));
  }

  if (filters.funding_type) {
    results = results.filter((e) => e.funding_type === filters.funding_type);
  }

  if (filters.country) {
    results = results.filter(
      (e) =>
        e.host_entity.country.toLowerCase().includes(filters.country!.toLowerCase()) ||
        e.eligible_nationalities.some(
          (n) => n.toLowerCase().includes(filters.country!.toLowerCase()) || n === "GLOBAL"
        )
    );
  }

  if (filters.field) {
    results = results.filter((e) =>
      e.eligible_fields.some((f) => f.toLowerCase().includes(filters.field!.toLowerCase()))
    );
  }

  if (filters.fully_funded) {
    results = results.filter((e) => e.is_fully_funded);
  }

  if (filters.indonesia_friendly) {
    results = results.filter((e) => e.flags.indonesia_friendly);
  }

  if (filters.status) {
    results = results.filter((e) => e.status === filters.status);
  }

  return results;
}

export function getUniqueLevels(): string[] {
  const levels = new Set<string>();
  (entries as Entry[]).forEach((e) => e.level.forEach((l) => levels.add(l)));
  return Array.from(levels).sort();
}

export function getUniqueCountries(): string[] {
  const countries = new Set<string>();
  (entries as Entry[]).forEach((e) => {
    countries.add(e.host_entity.country);
    e.eligible_nationalities.forEach((n) => {
      if (n !== "GLOBAL") countries.add(n);
    });
  });
  return Array.from(countries).sort();
}

export function getUniqueFields(): string[] {
  const fields = new Set<string>();
  (entries as Entry[]).forEach((e) => e.eligible_fields.forEach((f) => fields.add(f)));
  return Array.from(fields).sort();
}

export function getUniqueFundingTypes(): string[] {
  const types = new Set<string>();
  (entries as Entry[]).forEach((e) => types.add(e.funding_type));
  return Array.from(types).sort();
}

export function getSourceStats() {
  const allSources = getAllSources();
  const categories: Record<string, number> = {};
  allSources.forEach((s) => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });
  return {
    total: allSources.length,
    categories,
  };
}
