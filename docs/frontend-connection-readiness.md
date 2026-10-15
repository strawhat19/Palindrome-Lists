# Frontend-only account preparation

This work does not connect Firebase, Vercel reporting, Stripe, AdSense, DNS, or app stores. It does not create or grant an Owner account. Profile/admin screens are explicitly labelled public layout previews containing no records. Sign-in controls are disabled and there is no local authentication fallback.

## Source boundaries

- `shared/account/types.ts`: provider-independent session, profile whitelist, subscriptions, favorite, and submission contracts.
- `shared/account/service.ts`: a disconnected adapter only. Reads return `unconfigured`; mutations reject. Replacing this adapter requires separate authorization and a real implementation, not a configuration toggle.
- Profile/favorites/submissions and dashboard/admin/analytics routes are noindex. Unconfigured data is never shown as zero or a real empty account.
- `/submit`: English A–Z local checker. Drafts stay in component memory; no submission, approval, or persistence.
- `/guidelines`: public editorial guidance, linked in the footer and sitemap.
- The service worker now caches only allowlisted public pages/assets, excludes query URLs and private routes, and respects private/no-store response directives.
- Appearance/collapse preferences are device-local. Preview state is not an authenticated account.

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
