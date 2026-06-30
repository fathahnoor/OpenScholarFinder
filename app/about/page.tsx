export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 text-blue-900">About OpenScholarFinder</h1>
      <p className="text-lg text-gray-500 mb-10 border-b pb-6">
        A transparent, open-source aggregator of scholarships and funded academic positions for prospective students worldwide.
      </p>

      {/* Background */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Background and Motivation</h2>
        <p className="text-base leading-relaxed mb-3">
          The process of identifying scholarship and funded PhD opportunities is disproportionately burdensome
          for students in developing nations, where institutional guidance is limited and trustworthy aggregation
          platforms are scarce. While numerous scholarship portals exist globally, their coverage, currency, and
          relevance to Indonesian or Muslim-majority applicants vary significantly.
        </p>
        <p className="text-base leading-relaxed">
          OpenScholarFinder was initiated to consolidate this landscape into a single, auditable, and ethically
          curated resource — one that is open to community contribution and grounded in verifiable source attribution.
        </p>
      </section>

      {/* Design Principles */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Design Principles</h2>
        <ol className="list-decimal list-inside space-y-3 text-base leading-relaxed">
          <li>
            <span className="font-medium">Transparency</span> — All sources are documented with their origin,
            access mode, and scope. The full data schema is publicly available in the project&apos;s{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">design.md</code> file.
          </li>
          <li>
            <span className="font-medium">Source Integrity</span> — Priority is given to official institutional
            portals, government agencies, and accredited universities. Social media curations are classified
            separately and clearly labeled.
          </li>
          <li>
            <span className="font-medium">Contextual Relevance</span> — Each scholarship entry carries optional
            contextual flags (<code className="bg-gray-100 px-1 rounded text-sm">indonesia_friendly</code>,{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">muslim_friendly</code>) to help users filter
            results based on their applicant profile. These flags are descriptive, not normative.
          </li>
          <li>
            <span className="font-medium">Open Contribution</span> — The codebase and data schema are open for
            community contribution, subject to quality and accuracy standards defined in the project documentation.
          </li>
        </ol>
      </section>

      {/* Scope */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Scope of Coverage</h2>
        <p className="text-base leading-relaxed mb-3">
          The platform aggregates information across three study levels — Bachelor (S1), Master (S2), and
          Doctoral (S3/PhD) — and four funding types:{" "}
          <span className="font-medium">Scholarship, Fellowship, Studentship,</span> and{" "}
          <span className="font-medium">Funded Position</span>.
        </p>
        <p className="text-base leading-relaxed">
          Sources are drawn from over 60 global portals, national scholarship agencies, and curated meta-lists,
          with ongoing expansion targeting a minimum of 100 curated sources across all categories.
        </p>
      </section>

      {/* Source Categories */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Source Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Category</th>
                <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["GLOBAL_SCHOLARSHIPS", "Cross-country, multi-level scholarship portals (e.g., Scholars4Dev, ScholarshipsAds, DAAD)"],
                ["GLOBAL_PORTAL_PROGRAMS", "Program and PhD/funded position portals (e.g., FindAPhD, MastersPortal, AcademicPositions)"],
                ["META_LIST", "Curated lists of scholarship websites from LinkedIn, X/Twitter, and Facebook"],
                ["SOCIAL_GROUP", "PhD and academic community groups on social media platforms"],
                ["META_GUIDE", "Educational and advisory articles on finding scholarships and funded positions"],
              ].map(([cat, desc]) => (
                <tr key={cat} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 font-mono text-xs">{cat}</td>
                  <td className="border border-gray-200 px-4 py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contextual Flags */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Contextual Flags</h2>
        <p className="text-base leading-relaxed mb-4">
          Two optional boolean flags are applied to each source and entry to assist users in identifying
          opportunities most relevant to their background:
        </p>
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 px-5 py-4 rounded">
            <p className="font-semibold text-sm mb-1">
              <code>indonesia_friendly</code>
            </p>
            <p className="text-sm leading-relaxed">
              Set when the host institution is located in Indonesia, when Indonesian nationals are explicitly
              listed as eligible, or when the source is directly operated by an Indonesian funding body
              (e.g., LPDP, KNB, AMINEF).
            </p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 px-5 py-4 rounded">
            <p className="font-semibold text-sm mb-1">
              <code>muslim_friendly</code>
            </p>
            <p className="text-sm leading-relaxed">
              Set conservatively when the host institution is located in a Muslim-majority country and the
              program is open to international applicants. This flag is intended as a contextual signal only
              and does not constitute an endorsement of full Sharia compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Acknowledgements */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Acknowledgements</h2>
        <p className="text-base leading-relaxed">
          This platform draws its source list from publicly accessible scholarship portals, government agency
          websites, university scholarship pages, and community-curated meta-lists shared across professional
          networks. Full attribution is embedded in the{" "}
          <code className="bg-gray-100 px-1 rounded text-sm">Source</code> schema for each indexed entry.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Contact &amp; Contribution</h2>
        <p className="text-base leading-relaxed">
          For academic inquiries, source submissions, or technical contributions, please refer to the project
          repository at{" "}
          <a
            href="https://github.com/fathahnoor/OpenScholarFinder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            github.com/fathahnoor/OpenScholarFinder
          </a>{" "}
          or contact the project maintainer through GitHub Issues.
        </p>
      </section>

      {/* Footer note */}
      <div className="border-t pt-6 text-sm text-gray-400">
        <p>
          OpenScholarFinder is developed and maintained by{" "}
          <span className="font-medium text-gray-600">Fat&apos;hah Noor Prawita</span>, Lecturer at the School
          of Electrical Engineering, Telkom University, Indonesia.
        </p>
      </div>
    </main>
  );
}
