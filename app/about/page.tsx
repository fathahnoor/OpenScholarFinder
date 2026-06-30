import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About – OpenScholarFinder",
  description: "Learn about OpenScholarFinder, our mission, data schema, and how we aggregate scholarships transparently.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About OpenScholarFinder
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              An open-source scholarship aggregator built for transparency and trust.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Vision */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed text-lg">
              OpenScholarFinder provides a single search portal for scholarships and funded positions
              (Bachelor&apos;s, Master&apos;s, PhD) that is:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3 text-slate-600">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong className="text-slate-800">Open source</strong> and auditable by anyone</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong className="text-slate-800">Trust-focused</strong> — prioritizing official portals, funding bodies, and universities</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong className="text-slate-800">Inclusive</strong> — supporting students from Indonesia and developing countries</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "🔍",
                title: "Aggregate",
                description: "We collect data from 60+ trusted scholarship portals, government agencies, and curated lists worldwide.",
              },
              {
                step: "2",
                icon: "⚡",
                title: "Standardize",
                description: "All entries are normalized to a consistent schema with flags for compatibility (Indonesia-friendly, Muslim-friendly).",
              },
              {
                step: "3",
                icon: "🎯",
                title: "Search & Filter",
                description: "Students can search and filter by level, country, field, funding type, and special flags to find relevant opportunities.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Schema */}
        <section id="data-schema" className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Data Schema</h2>
          <p className="text-slate-600 mb-6">
            Our data follows two core schemas: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">Source</code> (for portals) and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">Entry</code> (for individual scholarships/positions).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Schema */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Source Schema</h3>
              <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
                <pre className="text-sm text-slate-300 font-mono whitespace-pre">
{`{
  "id": "source_id",
  "name": "Portal Name",
  "category": "GLOBAL_SCHOLARSHIPS",
  "url": "https://...",
  "description": "...",
  "supported_levels": ["BACHELOR","MASTER","PHD"],
  "region_scope": "GLOBAL",
  "primary_language": "EN",
  "update_frequency": "DAILY",
  "flags": {
    "indonesia_friendly": false,
    "muslim_friendly": false
  }
}`}
                </pre>
              </div>
            </div>

            {/* Entry Schema */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Entry Schema</h3>
              <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
                <pre className="text-sm text-slate-300 font-mono whitespace-pre">
{`{
  "id": "entry_id",
  "source_id": "source_id",
  "title": "Scholarship Title",
  "level": ["MASTER"],
  "funding_type": "SCHOLARSHIP",
  "host_entity": {
    "name": "...",
    "country": "..."
  },
  "is_fully_funded": true,
  "application_deadline": "YYYY-MM-DD",
  "flags": {
    "indonesia_friendly": false,
    "muslim_friendly": false
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Flags */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Compatibility Flags</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-xl">🇮🇩</span> Indonesia Friendly
              </h3>
              <p className="text-slate-600 mb-2">
                A scholarship is flagged as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">indonesia_friendly</code> if:
              </p>
              <ul className="space-y-1.5 ml-6">
                <li className="text-sm text-slate-600 list-disc">The host country is Indonesia, or</li>
                <li className="text-sm text-slate-600 list-disc">Indonesia is listed in eligible nationalities, or</li>
                <li className="text-sm text-slate-600 list-disc">The source is clearly targeted at Indonesian citizens (LPDP, KNB, AMINEF, etc.)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-xl">☪️</span> Muslim Friendly
              </h3>
              <p className="text-slate-600 mb-2">
                A scholarship is flagged as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">muslim_friendly</code> (conservatively) if:
              </p>
              <ul className="space-y-1.5 ml-6">
                <li className="text-sm text-slate-600 list-disc">The host country is a majority-Muslim country (Indonesia, Malaysia, Turkey, etc.), and</li>
                <li className="text-sm text-slate-600 list-disc">The scholarship is open to international students</li>
              </ul>
              <p className="text-sm text-slate-500 mt-2 italic">
                Note: This flag is a contextual signal, not a guarantee of Sharia compliance.
              </p>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section id="sources" className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Source Guidelines</h2>
          <p className="text-slate-600 mb-4">
            We aggregate from multiple categories of sources:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { cat: "GLOBAL_SCHOLARSHIPS", label: "Global Scholarship Portals", desc: "Major portals listing scholarships across countries and levels." },
              { cat: "GLOBAL_PORTAL_PROGRAMS", label: "Program & Position Portals", desc: "Universities, PhD search engines, and program databases." },
              { cat: "META_LIST", label: "Curated Lists", desc: "Social media posts and threads aggregating useful links." },
              { cat: "META_GUIDE", label: "Guides & Resources", desc: "Educational content on finding and applying for funding." },
            ].map((item) => (
              <div key={item.cat} className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800">{item.label}</h4>
                <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {["Next.js", "TypeScript", "Tailwind CSS", "React", "JSON Data Layer"].map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
