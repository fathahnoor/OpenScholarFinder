import Link from "next/link";
import { getAllSources, getSourceStats } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sources – OpenScholarFinder",
  description: "Browse all scholarship sources and portals aggregated by OpenScholarFinder.",
};

const CATEGORY_LABELS: Record<string, string> = {
  GLOBAL_SCHOLARSHIPS: "Global Scholarships",
  GLOBAL_PORTAL_PROGRAMS: "Programs & Positions",
  META_LIST: "Curated Lists",
  SOCIAL_GROUP: "Social Groups",
  META_GUIDE: "Guides & Resources",
};

const CATEGORY_COLORS: Record<string, string> = {
  GLOBAL_SCHOLARSHIPS: "bg-blue-100 text-blue-700 border-blue-200",
  GLOBAL_PORTAL_PROGRAMS: "bg-purple-100 text-purple-700 border-purple-200",
  META_LIST: "bg-amber-100 text-amber-700 border-amber-200",
  SOCIAL_GROUP: "bg-pink-100 text-pink-700 border-pink-200",
  META_GUIDE: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const CATEGORY_ICONS: Record<string, string> = {
  GLOBAL_SCHOLARSHIPS: "🎓",
  GLOBAL_PORTAL_PROGRAMS: "🌐",
  META_LIST: "📋",
  SOCIAL_GROUP: "👥",
  META_GUIDE: "📖",
};

export default function SourcesPage() {
  const sources = getAllSources();
  const stats = getSourceStats();

  const grouped = sources.reduce(
    (acc, source) => {
      const cat = source.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(source);
      return acc;
    },
    {} as Record<string, typeof sources>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Scholarship Sources & Portals
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {stats.total} trusted sources aggregated across {Object.keys(stats.categories).length} categories.
              Each source follows our standardized data schema.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {Object.entries(stats.categories).map(([cat, count]) => (
            <div key={cat} className="bg-white rounded-xl border border-slate-200/80 p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{CATEGORY_ICONS[cat] || "📄"}</div>
              <div className="text-2xl font-bold text-slate-900">{count}</div>
              <div className="text-xs text-slate-500 mt-1">{CATEGORY_LABELS[cat] || cat}</div>
            </div>
          ))}
        </div>

        {/* Sources by Category */}
        {Object.entries(grouped).map(([category, categorySources]) => (
          <div key={category} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{CATEGORY_ICONS[category] || "📄"}</span>
              <h2 className="text-xl font-bold text-slate-900">
                {CATEGORY_LABELS[category] || category}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {categorySources.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySources.map((source) => (
                <div
                  key={source.id}
                  className="bg-white rounded-xl border border-slate-200/80 p-5 hover-lift shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {source.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${CATEGORY_COLORS[category] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{source.description}</p>

                  <div className="space-y-2 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 truncate"
                      >
                        {new URL(source.url).hostname}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Updates: {source.update_frequency}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {source.supported_levels.map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-600">
                        {l === "BACHELOR" ? "S1" : l === "MASTER" ? "S2" : "S3"}
                      </span>
                    ))}
                    {source.flags.indonesia_friendly && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                        🇮🇩
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
