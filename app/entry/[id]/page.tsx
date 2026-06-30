import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntryById, getAllEntries, getSourceById } from "@/lib/data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllEntries().map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = getEntryById(id);
  if (!entry) return { title: "Not Found" };
  return {
    title: `${entry.title} – OpenScholarFinder`,
    description: `${entry.title} at ${entry.host_entity.name}. ${entry.requirements_summary}`,
  };
}

function CoverageBadge({ label, value }: { label: string; value: string }) {
  const icons: Record<string, string> = {
    FULL: "✅",
    PARTIAL: "⚠️",
    NONE: "❌",
    VARIES: "❓",
    YES: "✅",
    NO: "❌",
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium">
        {icons[value] || ""} {value.replace(/_/g, " ")}
      </span>
    </div>
  );
}

export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getEntryById(id);
  if (!entry) notFound();

  const source = getSourceById(entry.source_id);
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

  const levelLabels: Record<string, string> = {
    BACHELOR: "Bachelor's (S1)",
    MASTER: "Master's (S2)",
    PHD: "PhD (S3)",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-primary-600 transition-colors">Search</Link>
            <span>/</span>
            <span className="text-slate-700 truncate">{entry.short_title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {entry.level.map((l) => (
                <span key={l} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  {levelLabels[l] || l}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                {entry.funding_type.replace(/_/g, " ")}
              </span>
              {entry.is_fully_funded && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/80 text-white backdrop-blur-sm">
                  ✓ Fully Funded
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {entry.title}
            </h1>
            <p className="text-lg text-white/80">{entry.host_entity.name}</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{entry.host_entity.country}, {entry.host_entity.region}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Host Type</h3>
                  <div className="text-slate-700">{entry.host_entity.type.replace(/_/g, " ")}</div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Source</h3>
                  <a
                    href={source?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    {entry.source_name}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Estimated Annual Value</h3>
                  <div className="text-2xl font-bold text-emerald-600">{valueFormatted}</div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Delivery Mode</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.delivery_mode.map((m) => (
                      <span key={m} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        {m.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Attendance</h3>
                  <div className="text-slate-700">{entry.attendance_mode.map((m) => m.replace(/_/g, " ")).join(", ")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Requirements</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{entry.requirements_summary}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Academic</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>Min GPA: {entry.academic_requirements.min_gpa}</li>
                    <li>
                      Required Degree:{" "}
                      {entry.academic_requirements.required_previous_degree.map((d) => d.replace(/_/g, " ")).join(", ")}
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Language</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>Primary: {entry.language_requirements.primary_language}</li>
                    <li>
                      Tests: {entry.language_requirements.accepted_tests.join(", ")}
                    </li>
                    {Object.entries(entry.language_requirements.min_scores).map(([test, score]) => (
                      <li key={test}>
                        Min {test}: {score}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Eligible Fields */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Eligible Fields</h2>
              <div className="flex flex-wrap gap-2">
                {entry.eligible_fields.map((f) => (
                  <span key={f} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Selection Criteria */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Selection Criteria</h2>
              <div className="flex flex-wrap gap-2">
                {entry.selection_criteria_keywords.map((kw) => (
                  <span key={kw} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    {kw.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700">
                    #{tag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">📅</div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Application Deadline</h3>
                <div className={`text-xl font-bold ${isExpired ? "text-red-500" : isUrgent ? "text-amber-600" : "text-slate-900"}`}>
                  {deadlineDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {!isExpired && (
                  <p className={`text-sm mt-1 ${isUrgent ? "text-amber-600" : "text-slate-500"}`}>
                    {isUrgent ? `${daysUntilDeadline} days left!` : `${daysUntilDeadline} days remaining`}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Start Date</span>
                  <span className="font-medium text-slate-700">
                    {new Date(entry.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Recurrence</span>
                  <span className="font-medium text-slate-700">{entry.recurrence_pattern}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-medium text-slate-700">{entry.last_checked}</span>
                </div>
              </div>

              <a
                href={entry.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-center hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25"
              >
                Apply Now →
              </a>
              <a
                href={entry.official_call_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-3 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium text-center hover:bg-slate-200 transition-colors"
              >
                View Official Call
              </a>
            </div>

            {/* Funding Coverage */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Funding Coverage</h3>
              <div className="space-y-0">
                <CoverageBadge label="Tuition" value={entry.funding_coverage.tuition} />
                <CoverageBadge label="Stipend" value={entry.funding_coverage.stipend} />
                <CoverageBadge label="Travel" value={entry.funding_coverage.travel} />
                <CoverageBadge label="Health Insurance" value={entry.funding_coverage.health_insurance} />
              </div>
              {entry.funding_coverage.other_benefits.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Other Benefits</h4>
                  <ul className="space-y-1">
                    {entry.funding_coverage.other_benefits.map((b) => (
                      <li key={b} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Compatibility Flags</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${entry.flags.indonesia_friendly ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-700">🇮🇩 Indonesia Friendly</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${entry.flags.muslim_friendly ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-700">☪️ Muslim Friendly</span>
                </div>
              </div>
            </div>

            {/* Eligible Nationalities */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Eligible Nationalities</h3>
              <div className="flex flex-wrap gap-2">
                {entry.eligible_nationalities.map((n) => (
                  <span key={n} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700">
                    {n === "GLOBAL" ? "🌍 Open to All" : n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
