# OpenScholarFinder

**OpenScholarFinder** is an open-source web application designed to aggregate scholarship and funded academic position information from global and national sources. The platform serves as a single, auditable gateway for prospective students — particularly those from Indonesia and developing nations — to discover relevant funding opportunities at the Bachelor (S1), Master (S2), and Doctoral (S3/PhD) levels.

---

## Overview

The discovery of legitimate scholarship and funded position opportunities remains fragmented across hundreds of institutional portals, government agencies, and social media curations. OpenScholarFinder addresses this challenge by providing a structured, transparent, and ethically designed aggregation platform with clear source attribution and contextual flags tailored to Indonesian and Muslim-majority applicants.

---

## Key Features

- **Multi-source Aggregation** — Indexes over 60 curated sources across five categories: `GLOBAL_SCHOLARSHIPS`, `GLOBAL_PORTAL_PROGRAMS`, `META_LIST`, `SOCIAL_GROUP`, and `META_GUIDE`.
- **Structured Search & Filtering** — Supports filtering by study level, country, field of study, funding type (scholarship, fellowship, studentship, funded position), and fully-funded status.
- **Contextual Flags** — Each entry and source carries two optional boolean flags:
  - `indonesia_friendly`: set when the opportunity explicitly targets Indonesian nationals or is hosted in Indonesia.
  - `muslim_friendly`: set conservatively when the host entity is located in a Muslim-majority country and the program is open to international applicants.
- **Transparent Source Schema** — All sources and entries follow a documented JSON schema (`Source` and `Entry`), enabling auditability and community contribution.
- **Ethical Design Principle** — The platform prioritizes official portals, government funding bodies, and accredited universities as primary sources; social media curations are classified separately as `META_LIST` or `SOCIAL_GROUP`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js (TypeScript) |
| Styling | Tailwind CSS |
| Data Storage (initial) | JSON / CSV flat files |
| Scraping & ETL | Designed as a separate pipeline module |
| Language | TypeScript (97.6%), CSS (2.2%) |

---

## Project Structure

```
OpenScholarFinder/
├── app/
│   ├── about/          # About page
│   ├── entry/          # Scholarship/position entry detail page
│   ├── sources/        # Source directory page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main search & listing page
│   └── globals.css     # Global styles
├── data/               # Static JSON/CSV data files
├── lib/                # Utility functions and query engine
├── design.md           # Architecture and data schema specification
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Data Schema

The application is built around two core entities documented in [`design.md`](./design.md):

- **`Source`**: Represents a scholarship portal or curated resource, including metadata such as `category`, `region_scope`, `supported_levels`, `access_mode`, and contextual `flags`.
- **`Entry`**: Represents an individual scholarship or funded position, with fields covering funding coverage, host entity, eligibility, language requirements, application deadlines, and contextual `flags`.

---

## Source Categories

| Category | Description |
|---|---|
| `GLOBAL_SCHOLARSHIPS` | Cross-country, multi-level scholarship portals (e.g., Scholars4Dev, ScholarshipsAds, DAAD) |
| `GLOBAL_PORTAL_PROGRAMS` | Program and PhD/funded position portals (e.g., FindAPhD, MastersPortal, AcademicPositions) |
| `META_LIST` | Curated lists of scholarship websites from LinkedIn, X/Twitter, and Facebook |
| `SOCIAL_GROUP` | PhD and academic community groups on social media platforms |
| `META_GUIDE` | Educational and advisory articles on finding scholarships and funded positions |

---

## National & Government Sources

The platform includes dedicated entries for national scholarship agencies relevant to Indonesian applicants, including:

- **LPDP** (Lembaga Pengelola Dana Pendidikan)
- **KNB** (Kemitraan Negara Berkembang)
- **AMINEF / Fulbright** (American-Indonesian Exchange Foundation)
- **Indonesian AID / TIAS**
- **Chevening**, **Erasmus+**, **DAAD**, **World Bank**, and **Commonwealth** scholarship programs

---

## Contributing

Contributions are welcome. Please refer to [`design.md`](./design.md) for the canonical data schema before submitting new sources or entries. All pull requests adding sources should include a completed `Source` JSON object with accurate `flags`, `region_scope`, and `supported_levels` fields.

Submission guidelines and a contribution template will be provided in a subsequent release.

---

## License

This project is open source. License details will be specified in a forthcoming `LICENSE` file.

---

## Author

**Fat'hah Noor Prawita**  
Lecturer, School of Electrical Engineering — Telkom University, Indonesia  
[github.com/fathahnoor](https://github.com/fathahnoor)
