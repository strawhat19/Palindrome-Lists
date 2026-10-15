# Frontend-only account preparation

This work does not connect Firebase, Vercel reporting, Stripe, AdSense, DNS, or app stores. It does not create or grant an Owner account. Profile/admin screens are explicitly labelled public layout previews containing no records. Sign-in controls are disabled and there is no local authentication fallback.

## Source boundaries

- `shared/account/types.ts`: provider-independent session, profile whitelist, subscriptions, favorite, and submission contracts.
- `shared/account/service.ts`: a disconnected adapter only. Reads return `unconfigured`; mutations reject. Replacing this adapter requires separate authorization and a real implementation, not a configuration toggle.
- Profile/favorites/submissions and dashboard/admin/analytics routes are noindex. Unconfigured data is never shown as zero or a real empty account.
- `/submit`: English A–Z local checker. One bounded draft is stored on this browser when available; no cloud submission or approval.
- `/guidelines`: public editorial guidance, linked in the footer and sitemap.
- The service worker now caches only allowlisted public pages/assets, excludes query URLs and private routes, and respects private/no-store response directives.
- Appearance/collapse preferences are device-local. Preview state is not an authenticated account.

## Account/reporting layout parity

The account shell follows the reference sidebar and profile proportions while keeping Palindrome Lists colors, fonts, and wordplay labels. Website Traffic and Runtime Health have separate disconnected panels on web and native. Dashboard shows compact panels; Analytics offers a local report-layout switch. Report tabs, period/metric/filter fields, Chart/List, refresh and export are visibly unavailable until a trusted reporting source exists. They do not fetch data or simulate chart results. Moderation has a disabled search/status/review shell, with a native record-card explanation instead of an empty live table.

Reference: Domains Database Account/Profile and AdminAnalytics source, plus the portable Admin layout guide. `$reverse-engineer-anything` was not available in the inspected skill catalog or repository, so no claim is made that it was run. This is source-level parity preparation, not visual/device validation.

## Later connection checklist

1. Establish an approved Firebase project and billing choice. Do not reuse unrelated project credentials.
2. Implement Google and email/password authentication with hydration/loading/error states, verification/reset flows, and cleanup on sign-out/account change. Never assign Owner from first signup, email text, local storage, URL parameters, or client input.
3. Define app-owned IDs (`Type_Number_Name_Date_UUID`) and atomic counters with trusted UID mapping. Keep private account details separate from public projections. Public access must only read approved palindrome records.
4. Implement private per-account favorites and submissions using bounded listeners and unsubscribe cleanup. Reviewer-only transitions and role assignment must be validated by restrictive rules and trusted server operations.
5. Replace public layout previews with real account gates before handling private data. Keep preview components isolated, or disable the public preview entry points in the connected build. Frontend visibility is not authorization.
6. Owner-only analytics must use server-only provider access and return source, range, freshness, limits and unavailable states. Do not expose Vercel credentials or fabricate chart data.
7. Verify user-isolation, malformed writes, role escalation, moderation transitions, listener cleanup, repeated navigation, accessibility and mobile layouts once tests are authorized.

## Publication prerequisites, not completed submissions

Canonical metadata, sharing links, robots and sitemap default to the known deployment https://palindrome-lists.vercel.app, not the unconnected custom domain. `src/shared/site/config.json` is the future primary-origin configuration; `preexport:web` regenerates public SEO files from it on a later authorized export. Verify the chosen primary domain, HTTPS, redirects and actual deployed metadata before changing it. No DNS was changed. The generator has not been run or tested in this source-only pass.

AdSense: this build includes no ad scripts, approval claims or paid promises. Public educational content and policy pages exist, but an application still needs an accessible deployed site, working support channel, accurate operator/privacy disclosures, content review and any required consent implementation. Approval is not guaranteed. Existing contact is a local preview, not a working inbox.

App stores: Expo native views are source preparation only, not a signed or reviewed binary. Later verify native UX on devices, application identifiers, icons/screenshots, privacy/data disclosures, account deletion, authentication/store requirements and signing. Do not describe this frontend as submission-ready until those are completed.

## Validation

Per the repository AGENTS.md, no builds, automated tests, type checks, lint or UI checks were run without an explicit user request. Source review only. Suggested later checks: `npx tsc --noEmit`, `npm run export:web`, native device flows and browser navigation/accessibility checks.

## Shared guidance synchronization

AGENTS.md and the complete ai/ pack are synchronized from BengaliBlush main `7c26b2427ae7abeba3068a31661f4c18fbb20086`, cross-referenced with Domains Database `c08500922be6a78a305e9e00d71195c3d1b2e6a1`, plus the shared disconnected-account-frontend workflow. Licensed assets and notices are preserved. Optional shop/system guidance does not add a shop or enable services here. The current account sidebar uses measured header height, header-brand-width rail with a 220px fallback, single-column links and 56px collapsed width.

## Device-local functionality

The shared DeviceLibrary provider stores a versioned, bounded browser-local library: nickname (60 characters), favorite bundled IDs (200), named lists (20 lists, 60-character names, 200 entries each), and one draft (500 characters). Account screens expose this library outside the cloud-layout preview gate. Save buttons update it directly; local removal, list deletion, and confirmed clear controls are included. JSON version/shape/ID validation and storage error handling preserve invalid existing storage and switch changes to visibly session-only memory. No identity, passwords, email, cloud roles, account data, or private reports are persisted. Native currently uses session-only fallback because no persistent native storage dependency is installed. Browser storage events refresh other open tabs; concurrent writes remain last-write-wins, not transactional cross-tab merging or cross-device sync.
