# Palindrome Lists

An Expo app based on the approved pink-and-lime landing design, with a landing page and public educational pages. The original half-turn PLPL logo geometry is preserved, with pink P letters and lime L letters.

## Run locally

Use Node 24.21.0, pinned for this project through Volta and `.nvmrc`. Dependencies and the npm lockfile are included in the setup.

```sh
npm install
npm run web
```

For the native landing page, run `npm start` and open it in a compatible Expo Go app, or use `npm run ios` / `npm run android` with the relevant development tools installed.

## Landing page

- Sticky header with translucent blur while scrolling and an icon-only hamburger that smoothly opens a panel of navigation links, including on short mobile screens.
- Sun/moon header toggle with a charcoal dark palette and the original pink/lime logo. The browser remembers a manual choice; native choices last for the session. Without a manual choice, the app uses the available system color scheme.
- Continuously rotating hero logo above “Words Worth Repeating,” with reduced-motion support.
- GSAP SplitText headline reveals and subtle staggered entrances for cards and sections.
- Smooth scroll-driven header logo rotation and a continuously rotating footer logo.
- Reversible 3D flips on button/link labels and icons, including keyboard focus, with stable clickable areas.
- Timed hero headline flips, paused offscreen or in an inactive app/tab, with a static reduced-motion heading.
- Card Copy and Share actions, formatted clipboard text, per-card public links, and device/social/email share composers.
- Searchable curated examples, word/name/phrase filters, sorting, and expandable metadata.
- Top-right Comment, Heart, Copy, Save, and Share actions; voting stays bottom-right.
- Four-plan pricing section and `/pricing` page, sharing the same plan data and table component. Draft USD prices are Free $0, Pal $3/month, Lister $9/month, and Pro $19/month. Paid features are previews; their links open Contact, and no subscription or payment is created.
- About/how-it-works, API preview, FAQ, and Contact sections.
- Always-visible footer with the current year, Piratechs link, and a floating scroll-to-top button. Footer rows are kept out of opacity reveals so reaching the end of the page cannot leave them hidden.

Browsing uses local curated examples. Original authors and historical first-use dates remain unknown unless recorded; collection attribution does not claim an origin. Copy and Share work without an account. Sharing opens the device sheet or a composer for X, Bluesky, WhatsApp, or email; the visitor chooses whether to send. Clipboard restrictions offer selectable text instead. Public links such as `/?palindrome=level` find and focus the matching card on the deployed domain. Community counters start at zero and are preview placeholders. Account, voting, comment, save, and heart actions show a coming-soon notice. There is no authentication, database, or API integration in this frontend scope.

Header and footer navigation open real internal pages: `/about`, `/api`, `/words`, `/names`, `/phrases`, `/pricing`, `/contact`, `/signin`, `/terms`, and `/privacy`. The category guides include original explanations and 34 familiar examples with notes on their letter patterns. The API page includes a local checking recipe and clearly states that the HTTP API is not available. The sign-in page describes current account availability without collecting credentials.

Common route aliases, including `/about-us`, `/contact-us`, `/privacy-policy`, `/terms-of-service`, `/sign-in`, and `/login`, redirect to their canonical pages. Existing landing query bookmarks still work. Unknown pages show a branded, non-indexable 404 view.

## Files

- `app/`: thin Expo Router pages, redirects, providers, and web document shell.
- `src/shared/content/`: original educational and policy content shared across web and native views.
- `src/components/`: platform-specific landing components and styles.
- `src/shared/landing/`: curated starter entries and shared React Context.
- `src/shared/routes.ts`: canonical navigation URLs, labels, icons, and aliases.
- `src/styles/`: global web styles and shared color tokens.
- `public/`: brand SVG, favicon, PWA manifest, and production service worker.
- `assets/concepts/`: preserved logo and design rounds, including the selected v5 mockup.

Web uses SCSS and GSAP with SplitText and ScrollTrigger; native uses React Native style objects and Animated logo motion. Motion respects reduced-motion preferences, and GSAP restores split text/styles and removes its listeners when the page unmounts. The web service worker is registered only in production and caches pages after a successful visit.

Each page has its own title, description, canonical URL, Open Graph tags, and Twitter summary metadata. Public pages include WebSite/WebPage and breadcrumb JSON-LD matching the visible content. The home page retains “Palindrome Lists — Words Worth Repeating.” Titles are also set on navigation for local development. Expo Router Head supplies metadata in the static HTML; the document shell avoids duplicate home-page metadata on interior pages.

`public/robots.txt` and `public/sitemap.xml` point to the public canonical pages on `https://palindromelists.com`. The sign-in status and 404 pages have `noindex, follow` metadata and are omitted from the sitemap. Crawlers may still access those pages to read the directive.

## Publishing later

`npm run export:web` is the configured static export command for hosting on `palindromelists.com`. Serve each exported page at its matching URL over HTTPS, rather than serving the home HTML for every route. Configure real HTTP redirects for aliases and an HTTP 404 status for missing pages where the host supports them. Keep the sitemap and canonical domain aligned if the production domain changes. Submit the sitemap in Google Search Console after publishing.

The frontend now includes About, Terms, Contact, and Privacy Policy pages, readable original content, and crawlable navigation. This follows [Google’s SEO guidance](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and [AdSense site-readiness guidance](https://support.google.com/adsense/answer/7299563?hl=en); neither rankings nor AdSense approval can be guaranteed.

AdSense is not connected and ads are not enabled. Before applying or serving ads, confirm the site operator and a working public contact channel, and finalize policies for the actual hosting and advertising services. The Contact page currently uses the existing Piratechs project link because no public email was provided. No invented email, publisher ID, or ads.txt record is included.

When connecting an actual AdSense account, use the publisher identifier and site-verification method issued by Google, publish the matching ads.txt record when required, and configure the appropriate privacy/consent controls. Google requires a [certified CMP integrated with TCF](https://support.google.com/adsense/answer/13554116?hl=en) for personalized ads in the EEA, UK, and Switzerland. The current [privacy disclosures](https://support.google.com/publisherpolicies/answer/10437794?hl=en) describe local storage, offline caching, external sites, and advertising as a future feature; update them to match the real integration before ads go live. Future comments or submissions will need moderation before being placed alongside ads.

No tests, builds, dev servers, UI checks, commits, or deployments were run during implementation, per the project instructions. Review the changes and run the app when ready.
