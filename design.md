# OpenScholarFinder – Design Document

OpenScholarFinder adalah aplikasi web open source untuk mengagregasi informasi beasiswa dan posisi funded (S1, S2, S3/PhD) dari berbagai sumber global dan nasional, dengan fokus pada pencarian yang transparan dan etis.

Dokumen ini mencakup:
- Visi dan ruang lingkup.
- Arsitektur aplikasi web (high-level).
- Skema data inti (Source dan Entry).
- Aturan flag `indonesia_friendly` dan `muslim_friendly`.
- Daftar sumber (seed list) untuk:
  - GLOBAL_SCHOLARSHIPS
  - GLOBAL_PORTAL_PROGRAMS
  - META_LIST / SOCIAL_GROUP / META_GUIDE

---

## 1. Visi dan Ruang Lingkup

### 1.1 Visi

Menyediakan satu pintu pencarian beasiswa dan posisi funded S1/S2/S3 yang:
- Terbuka (open source) dan dapat diaudit.
- Mengutamakan kepercayaan terhadap sumber (portal resmi, badan pendanaan, universitas).
- Mendukung calon mahasiswa dari Indonesia dan negara berkembang untuk menemukan peluang relevan.

### 1.2 Ruang Lingkup Awal

- Level studi: `BACHELOR (S1)`, `MASTER (S2)`, `PHD (S3)`.
- Jenis pendanaan: `SCHOLARSHIP`, `FELLOWSHIP`, `STUDENTSHIP`, `FUNDED_POSITION`.
- Kategori sumber:
  - `GLOBAL_SCHOLARSHIPS` – portal beasiswa lintas negara/level.[web:23][web:28][web:49]
  - `GLOBAL_PORTAL_PROGRAMS` – portal program studi dan posisi PhD/funded.[web:30][web:41][web:40]
  - `META_LIST`, `SOCIAL_GROUP`, `META_GUIDE` – sumber referensi/edukatif.

---

## 2. Arsitektur Aplikasi Web (High-level)

### 2.1 Komponen

1. **Frontend Web**
   - Framework bebas (React/Vue/Svelte/HTML).
   - Fitur:
     - Form pencarian (filter level, negara, bidang, tipe pendanaan, fully funded).
     - Daftar hasil (cards/tabel) dengan informasi sumber dan status.
     - Halaman detail entri.
     - Halaman “About & Sources”.

2. **Backend / Data Layer**
   - Penyimpanan awal: file JSON/CSV dibangun dari konfigurasi `design.md`.
   - Entitas:
     - `Source`: konfigurasi portal/situs.
     - `Entry`: beasiswa/posisi (hasil scraping/ETL).
   - Modul:
     - Loader konfigurasi.
     - Query engine (filter berdasar field).

3. **Scraping & ETL Pipeline (dirancang terpisah)**
   - Scheduler (periodik).
   - Scraper per sumber (HTML/RSS/API).[web:63]
   - Normalizer → skema `Entry`.
   - Validator (deduplikasi, status, deadline).
   - Tagger flag `indonesia_friendly` dan `muslim_friendly`.

---

## 3. Skema Data Inti

### 3.1 Skema `Source`

```json
{
  "id": "source_id",
  "name": "Portal Name",
  "category": "GLOBAL_SCHOLARSHIPS | GLOBAL_PORTAL_PROGRAMS | META_LIST | SOCIAL_GROUP | META_GUIDE",
  "url": "https://example.com",
  "description": "Short description of the portal.",
  "supported_levels": ["BACHELOR", "MASTER", "PHD"],
  "supported_funding_types": ["SCHOLARSHIP", "FELLOWSHIP", "POSITION", "STUDENTSHIP"],
  "region_scope": "GLOBAL | REGION | COUNTRY",
  "primary_language": "EN",
  "update_frequency": "DAILY | WEEKLY | CONTINUOUS",
  "access_mode": "PUBLIC_WEB | API | EMAIL_FEED",
  "has_search_filters": true,
  "typical_filters": [
    "study_level",
    "country",
    "subject",
    "funding_type",
    "deadline"
  ],
  "flags": {
    "indonesia_friendly": false,
    "muslim_friendly": false
  }
}
```

Field dan filter mengikuti pola umum portal seperti DAAD Scholarship Database, Studyportals/MastersPortal, dan scholarships.com yang menyediakan filter level, negara, subject, deadline.[web:19][web:30][web:49][web:65]

### 3.2 Skema `Entry`

```json
{
  "id": "entry_id",
  "source_id": "source_id",
  "source_name": "Portal Name",
  "category": "GLOBAL_SCHOLARSHIPS | GLOBAL_PORTAL_PROGRAMS",

  "title": "Scholarship or Position Title",
  "short_title": "Short Name",
  "level": ["BACHELOR", "MASTER", "PHD"],
  "funding_type": "SCHOLARSHIP | FELLOWSHIP | POSITION | STUDENTSHIP",
  "funding_coverage": {
    "tuition": "FULL | PARTIAL | NONE | VARIES",
    "stipend": "YES | NO | VARIES",
    "travel": "YES | NO | VARIES",
    "health_insurance": "YES | NO | VARIES",
    "other_benefits": ["optional string list"]
  },

  "host_entity": {
    "type": "UNIVERSITY | GOVERNMENT | FOUNDATION | NGO | PRIVATE_ORGANIZATION | INTERNATIONAL_ORGANIZATION",
    "name": "Host Name",
    "country": "Country Name",
    "region": "Region Name"
  },

  "eligible_nationalities": ["GLOBAL | COUNTRY_LIST"],
  "eligible_fields": ["ENGINEERING", "COMPUTER_SCIENCE", "EDUCATION", "XR", "..."],
  "delivery_mode": ["ON_CAMPUS", "ONLINE", "HYBRID"],
  "attendance_mode": ["FULL_TIME", "PART_TIME"],

  "application_url": "https://official-application-link",
  "official_call_url": "https://official-call-or-description",
  "application_open_date": "YYYY-MM-DD",
  "application_deadline": "YYYY-MM-DD",
  "start_date": "YYYY-MM-DD",

  "requirements_summary": "Text summary requirements.",
  "academic_requirements": {
    "min_gpa": 0.0,
    "required_previous_degree": ["HIGH_SCHOOL", "BACHELOR", "MASTER"]
  },
  "language_requirements": {
    "primary_language": "EN",
    "accepted_tests": ["IELTS", "TOEFL"],
    "min_scores": {
      "IELTS": 6.5,
      "TOEFL": 90
    }
  },

  "selection_criteria_keywords": ["academic_merit", "leadership", "research_potential"],

  "is_fully_funded": true,
  "currency": "USD",
  "estimated_yearly_value": 0,
  "recurrence_pattern": "ANNUAL | ONE_OFF | CONTINUOUS",

  "tags": ["FULLY_FUNDED", "GLOBAL", "DEVELOPING_COUNTRIES"],
  "flags": {
    "indonesia_friendly": false,
    "muslim_friendly": false
  },
  "last_checked": "YYYY-MM-DD",
  "status": "OPEN | CLOSED | UNKNOWN"
}
```

Skema ini kompatibel dengan cara portal seperti DAAD, World Bank, Studyportals, ScholarshipsAds, Scholars4Dev menggambarkan beasiswa (level studi, negara, bidang, coverage, deadline).[web:19][web:18][web:23][web:28][web:30][web:40][web:41]

---

## 4. Aturan Flag `indonesia_friendly` dan `muslim_friendly`

### 4.1 `indonesia_friendly`

Set `flags.indonesia_friendly = true` jika:

- `host_entity.country == "Indonesia"`; atau  
- "Indonesia" tercantum pada `eligible_nationalities`; atau  
- sumber jelas ditujukan untuk WNI (LPDP, KNB, AMINEF, Indonesian AID, DAAD Indonesia).[web:9][web:16][web:22][web:34][web:64][web:65]

Contoh rule:

```text
if host_entity.country == "Indonesia"
  OR "Indonesia" in eligible_nationalities
  OR source_name contains "Indonesia":
    indonesia_friendly = true
```

### 4.2 `muslim_friendly`

Set `flags.muslim_friendly = true` secara konservatif jika:

- `host_entity.country` berada di negara mayoritas Muslim (Indonesia, Malaysia, Saudi Arabia, UAE, Qatar, Turkey, Pakistan, Egypt, dll); dan  
- beasiswa/portal terbuka untuk internasional atau negara mitra berkembang.[web:34][web:64]

Rule awal:

```text
if host_entity.country in [list_majority_muslim_countries]
  AND "GLOBAL" in eligible_nationalities OR includes majority Muslim countries:
    muslim_friendly = true
```

Flag ini adalah sinyal konteks, bukan jaminan kepatuhan syariah.

---

## 5. Daftar Sumber – GLOBAL_SCHOLARSHIPS (Portal Utama)

### 5.1 Portal Scholarship Global

- `source_scholars4dev` – International Scholarships for International Students  
  - `url`: https://www.scholars4dev.com[web:23]

- `source_scholarshipsads` – Fully funded Scholarships for international Students  
  - `url`: https://www.scholarshipsads.com[web:28]

- `source_scholarships_com` – Scholarships.com  
  - `url`: https://www.scholarships.com[web:49]

- `source_internationalstudent` – International Student Scholarship Search  
  - `url`: https://www.internationalstudent.com/scholarships/[web:42]

- `source_iefa` – International Financial Aid & Scholarships (IEFA)  
  - `url`: https://www.iefa.org[web:55]

- `source_internationalscholarships` – InternationalScholarships.com  
  - `url`: https://www.internationalscholarships.com[web:48]

- `source_fastweb` – Fastweb main portal  
  - `url`: https://www.fastweb.com[web:46]

- `source_bigfuture` – College Board BigFuture Scholarship Search  
  - `url`: https://bigfuture.collegeboard.org/scholarship-search[web:43]

- `source_petersons` – Peterson’s Scholarship Search Engine  
  - `url`: https://www.petersons.com/scholarship-search.aspx[web:53]

- `source_appily` – Appily (Cappex) Scholarships  
  - `url`: https://www.appily.com/scholarships[web:56]

- `source_scholarshiproar` – ScholarshipRoar  
  - `url`: https://scholarshiproar.com[web:20]

- `source_gooverseas` – GoOverseas Study Abroad Scholarships & Grants  
  - `url`: https://www.gooverseas.com/blog/study-abroad-scholarships-grants[web:54]

- `source_fastweb_abroad` – Fastweb scholarships for studying abroad (article + list)  
  - `url`: https://www.fastweb.com/college-scholarships/articles/scholarships-for-studying-abroad[web:51]

---

## 6. Daftar Sumber – GLOBAL_PORTAL_PROGRAMS

### 6.1 Portal Program & Positions

- `source_studyportals` – Studyportals main  
  - `url`: https://studyportals.com[web:39]

- `source_bachelorsportal` – BachelorsPortal  
  - `url`: https://www.bachelorsportal.com (via Studyportals)[web:39]

- `source_mastersportal` – MastersPortal scholarships section  
  - `url`: https://www.mastersportal.com/scholarships/[web:30]

- `source_phdportal` – PhDPortal  
  - `url`: https://www.phdportal.com[web:41]

- `source_utwente_scholarship_finder` – University of Twente Scholarship Finder  
  - `url`: https://www.utwente.nl/en/education/scholarship-finder/[web:40]

- `source_daad_global_db` – DAAD Scholarship Database (global)  
  - `url`: https://www.daad.de/stipdb-redirect/[web:19]

- `source_daad_indonesia_db` – DAAD Scholarship Database Indonesia  
  - `url`: https://www.daad-indonesia.org/en/find-funding/scholarship-database/[web:65]

- `source_findaphd` – FindAPhD  
  - `url`: https://www.findaphd.com[web:10][web:67]

- `source_phdpositions` – PhDPositions  
  - `url`: https://www.phdpositions.eu[web:10][web:67]

- `source_gradschools` – GradSchools.com  
  - `url`: https://www.gradschools.com[web:10][web:67]

- `source_gradcafe` – TheGradCafe  
  - `url`: https://www.thegradcafe.com[web:10][web:67]

- `source_academicpositions` – AcademicPositions  
  - `url`: https://academicpositions.com[web:11][web:10][web:67]

- `source_academictransfer` – AcademicTransfer  
  - `url`: https://www.academictransfer.com[web:10][web:67]

- `source_phdjobs` – PhDJobs  
  - `url`: https://www.phdjobs.com[web:10][web:67]

- `source_phdscanner` – PhDScanner (fully funded PhD opportunities)  
  - `url`: https://www.phdscanner.com[web:68]

- `source_goabroad` – GoAbroad main portal  
  - `url`: https://www.goabroad.com[web:10][web:67]

- `source_applykite` – ApplyKite (AI‑assisted funded opportunities)  
  - `url`: https://applykite.com[web:67]

- `source_researchgate` – ResearchGate (for finding lab/university calls)  
  - `url`: https://www.researchgate.net[web:10][web:67]

---

## 7. Sumber Pemerintah & National Agencies (Scholarships)

- `source_lpdp_programs` – LPDP Program Beasiswa  
  - `url`: https://bantuan.lpdp.kemenkeu.go.id/kb/program-beasiswa-penerima[web:9]

- `source_aminef_fulbright_master` – AMINEF Fulbright Master’s for Indonesians  
  - `url`: https://www.aminef.or.id/grants-for-indonesians/fulbright-programs/scholarship/fulbright-masters-degree-scholarship/[web:22]

- `source_knb` – KNB Scholarship (Kemitraan Negara Berkembang)  
  - `url`: https://knb.kemdiktisaintek.go.id[web:64]

- `source_indonesian_aid` – Indonesian AID Scholarship (TIAS)  
  - `url`: https://tias.kemenkeu.go.id/landing/[web:34]

- `source_chevening` – Chevening Scholarships (UK Gov)  
  - `url`: https://www.chevening.org/scholarships/[web:17][web:10]

- `source_commonwealth` – Commonwealth Scholarship Commission  
  - `url`: https://www.cscuk.org.uk[web:10][web:67]

- `source_fulbright_global` – Fulbright Scholar Program (global)  
  - `url`: https://www.cies.org[web:10][web:67]

- `source_worldbank` – World Bank Scholarships Program  
  - `url`: https://www.worldbank.org/en/programs/scholarships[web:18]

- `source_erasmusplus` – Erasmus+  
  - `url`: https://erasmus-plus.ec.europa.eu

- `source_koica` – KOICA Scholarship Program (via Scholars4Dev)  
  - `url`: (linked via https://www.scholars4dev.com)[web:23]

- `source_unicaf` – UNICAF Scholarships (via Scholars4Dev)  
  - `url`: (linked via https://www.scholars4dev.com)[web:23]

---

## 8. Social Media & Meta Lists (Curator)

### 8.1 META_LIST (List of Websites)

- `source_linkedin_30sites` – 30 Websites Fully Funded MS/PhD/PDF Positions  
  - `url`: https://www.linkedin.com/posts/sunkanmi-folorunsho_30-sites-that-post-fully-funded-msphdpdf-activity-7303076558754267136--gEQ[web:10]

- `source_linkedin_waqar` – Websites for Fully Funded MS/PhD Positions  
  - `url`: https://www.linkedin.com/posts/muhammad-waqar-766112100_websites-that-post-fully-funded-msphd-positions-activity-736610880250234[web:67]

- `source_x_oludeewon` – X/Twitter thread Websites Fully Funded MS/PhD Positions  
  - `url`: https://x.com/Oludeewon/status/1976236913079075065?lang=en[web:24]

- `source_facebook_35sites` – Facebook post 35 Websites Fully Funded MS/PhD/PDF  
  - `url`: https://www.facebook.com/groups/1140290823053617/posts/2268522910230397/[web:27]

- `source_instagram_syjobodygoals` – Instagram post Websites Fully Funded MS/PhD  
  - `url`: https://www.instagram.com/p/DXbnYF5tp-e/[web:69]

### 8.2 SOCIAL_GROUP

- `source_facebook_phd_groups` – PhD & Postdoc Facebook groups  
  - `url`: (see AcademicPositions advice article)[web:70]

### 8.3 META_GUIDE

- `source_topuniversities_phd_funding` – TopUniversities PhD Funding Around the World  
  - `url`: https://www.topuniversities.com/blog/phd-funding-around-world[web:8]

- `source_topuniversities_online_scholarships` – Scholarships to Study Online  
  - `url`: https://www.topuniversities.com/student-info/scholarship-advice/scholarships-study-online[web:25]

- `source_dragicevic_finding_phd` – “How to find a PhD position”  
  - `url`: https://dragice.fr/finding-phd.html[web:15]

- `source_sallie_ai_scholarships` – How Students Can Use AI to Find Scholarships  
  - `url`: https://www.sallie.com/scholarships/guide/ai-for-scholarships[web:61]

---

## 9. University / Field-specific Scholarship Pages (Contoh)

- `source_architects_foundation` – Architects Foundation Scholarships  
  - `url`: https://architectsfoundation.org/scholarships/[web:62]

- `source_riba_funding` – RIBA Bursaries and Scholarships  
  - `url`: https://www.riba.org/learn/bursaries-and-scholarships/[web:59]

- `source_houzz_arch_scholarship` – Houzz Architecture Scholarships (referenced in PDF)  
  - `url`: (linked via National Sources of Scholarships in AEC PDF)[web:57]

- `source_schwarz_arch_scholarship` – Schwarz Foundation Architectural Scholarship  
  - `url`: https://www.schwarzfoundation.com/initiative/architectural-scholarship-26-27/[web:60]

- `source_uoregon_arch_scholarships` – University of Oregon Architecture Scholarships  
  - `url`: https://archenvironment.uoregon.edu/architecture/undergrad/scholarships[web:58]

- `source_newschool_arch_scholarships` – NewSchool of Architecture & Design Scholarships  
  - `url`: https://newschoolarch.edu/scholarships/[web:66]

---

## 10. Catatan Ekspansi Sumber

- Daftar di atas mencakup >60 sumber inti portal global, national agencies, meta lists, dan university/field-specific.
- Untuk mencapai ≥100 sumber:
  - Tambahkan lebih banyak halaman beasiswa universitas (Top‑100 QS/THE dan yang dikurasi oleh Scholars4Dev/ScholarshipsAds).[web:23][web:28]
  - Tambahkan portal nasional tambahan (Turkiye Burslari, Qatar scholarships, dll) menggunakan pola yang sama.
- Semua sumber baru mengikuti skema `Source` dan memakai kategori yang sesuai (`GLOBAL_SCHOLARSHIPS`, `GLOBAL_PORTAL_PROGRAMS`, atau lainnya).

---

End of `design.md`.