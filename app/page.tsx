"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  searchEntries,
  getUniqueLevels,
  getUniqueCountries,
  getUniqueFields,
  getUniqueFundingTypes,
  type Entry,
} from "@/lib/data";

const LEVELS = ["BACHELOR", "MASTER", "PHD"];
const FUNDING_TYPES = ["SCHOLARSHIP", "FELLOWSHIP", "STUDENTSHIP", "POSITION"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    OPEN: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-red-100 text-red-700 border-red-200",
    UNKNOWN: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.UNKNOWN}`}>
      {status}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  const labels: Record<string, string> = {
    BACHELOR: "Bachelor",
    MASTER: "Master",
    PHD: "Doctorate",
  };
  const colors: Record<string, string> = {
    BACHELOR: "bg-blue-100 text-blue-700",
    MASTER: "bg-purple-100 text-purple-700",
    PHD: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[level] || "bg-slate-100 text-slate-700"}`}>
      {labels[level] || level}
    </span>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const deadlineDate = new Date(entry.application_deadline);
  const now = new Date();
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDeadline <= 30 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;

  const valueFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: entry.currency,
    maximumFractionDigits: 0,
  }).format(entry.estimated_yearly_value);

  return (
    <Link href={`/entry/${entry.id}`}>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 hover-lift cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {entry.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{entry.host_entity.name}</p>
          </div>
          <StatusBadge status={entry.status} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {entry.level.map((l) => (
            <LevelBadge key={l} level={l} />
          ))}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
            {entry.funding_type.replace("_", " ")}
          </span>
          {entry.is_fully_funded && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Fully Funded
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{entry.host_entity.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>
              Deadline:{" "}
              <span className={isUrgent ? "text-amber-600 font-medium" : isExpired ? "text-red-500" : ""}>
                {deadlineDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {isUrgent && !isExpired && (
                <span className="text-amber-600 font-medium ml-1">
                  ({daysUntilDeadline} days left)
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              ~{valueFormatted}/year
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {entry.eligible_fields.slice(0, 3).map((f) => (
              <span key={f} className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                {f.replace(/_/g, " ")}
              </span>
            ))}
            {entry.eligible_fields.length > 3 && (
              <span className="text-xs text-slate-400">+{entry.eligible_fields.length - 3}</span>
            )}
          </div>
          <span className="text-xs text-slate-400">{entry.source_name}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [country, setCountry] = useState("");
  const [field, setField] = useState("");
  const [fullyFunded, setFullyFunded] = useState(false);
  const [indonesiaFriendly, setIndonesiaFriendly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [query, level, fundingType, country, field, fullyFunded, indonesiaFriendly]);

  const results = useMemo(() => {
    return searchEntries({
      query: query || undefined,
      level: level || undefined,
      funding_type: fundingType || undefined,
      country: country || undefined,
      field: field || undefined,
      fully_funded: fullyFunded || undefined,
      indonesia_friendly: indonesiaFriendly || undefined,
      status: "OPEN",
    });
  }, [query, level, fundingType, country, field, fullyFunded, indonesiaFriendly]);

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  const activeFilterCount = [level, fundingType, country, field, fullyFunded, indonesiaFriendly].filter(Boolean).length;

  const clearFilters = () => {
    setQuery("");
    setLevel("");
    setFundingType("");
    setCountry("");
    setField("");
    setFullyFunded(false);
    setIndonesiaFriendly(false);
    setVisibleCount(12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/90 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Open Source &middot; {results.length} Opportunities Available
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Find Your Next
              <br />
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Scholarship
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Discover fully funded opportunities for Bachelor&apos;s, Master&apos;s, and PhD studies from 60+ trusted sources worldwide.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search scholarships, universities, countries..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 shadow-xl shadow-black/10 focus:ring-4 focus:ring-white/20 outline-none text-slate-800 placeholder:text-slate-400"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Opportunities", value: results.length, icon: "📋" },
            { label: "Fully Funded", value: results.filter((e) => e.is_fully_funded).length, icon: "✅" },
            { label: "Countries", value: new Set(results.map((e) => e.host_entity.country)).size, icon: "🌍" },
            { label: "Indonesia Friendly", value: results.filter((e) => e.flags.indonesia_friendly).length, icon: "🇮🇩" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-sm">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6 shadow-sm animate-slideDown">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Study Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">All Levels</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l === "BACHELOR" ? "Bachelor" : l === "MASTER" ? "Master" : "Doctorate"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Funding Type</label>
                <select
                  value={fundingType}
                  onChange={(e) => setFundingType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">All Types</option>
                  {FUNDING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">All Countries</option>
                  {getUniqueCountries().map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Field of Study</label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">All Fields</option>
                  {getUniqueFields().map((f) => (
                    <option key={f} value={f}>{f.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fullyFunded}
                    onChange={(e) => setFullyFunded(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">Fully Funded Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indonesiaFriendly}
                    onChange={(e) => setIndonesiaFriendly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">🇮🇩 Indonesia Friendly</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="pb-16">
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleResults.map((entry, i) => (
                  <div key={entry.id} className="animate-fadeIn" style={{ animationDelay: `${i * 50}ms` }}>
                    <EntryCard entry={entry} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex flex-col items-center mt-10 gap-3">
                  <div className="text-sm text-slate-400">
                    Showing {visibleCount} of {results.length} opportunities
                  </div>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-2xl border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-all shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    Load More
                  </button>
                </div>
              )}

              {!hasMore && results.length > 12 && (
                <div className="text-center mt-10 text-sm text-slate-400">
                  Showing all {results.length} opportunities
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No scholarships found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
