import type { ContentPageData, PageKey } from './types';

export const contentPages: Record<PageKey, ContentPageData> = {
  pricing: {
    key: `pricing`,
    eyebrow: `Plans & possibilities`,
    title: `A little more wordplay.`,
    description: `Explore freely, keep your favorites, and imagine what comes next. Compare Free, Pal, Lister, and Pro.`,
    sections: [
      {
        id: `available-now`,
        title: `Start with Free`,
        paragraphs: [
          `The public collection, search, filters, educational guides, copying, and sharing are available without an account or subscription. Words, names, and phrases are open for everyone to explore.`,
        ],
        links: [
          { href: `/`, label: `Explore the Collection` },
        ],
      },
      {
        id: `planned-memberships`,
        title: `A preview of what’s next`,
        paragraphs: [
          `Pal, Lister, and Pro are proposed memberships. The prices shown are draft monthly amounts in USD, and the paid features are still planned. Subscriptions are not available to purchase, and no payment information is collected on this page.`,
          `Saved lists, public collections, exports, team tools, and API access are not available yet. Final prices, feature limits, billing details, and cancellation terms will be published before any paid plan launches. For a question or suggestion about a plan, use the project contact page.`,
        ],
        links: [
          { href: `/contact`, label: `Ask About the Plans` },
          { href: `/api`, label: `See API Status` },
        ],
      },
    ],
  },
  about: {
    key: `about`,
    eyebrow: `A little word wonder`,
    title: `Good words. Both ways.`,
    description: `Palindrome Lists is a small collection of words, names, and phrases that reward a second look.`,
    sections: [
      {
        id: `what-we-collect`,
        title: `A collection with a simple rule`,
        paragraphs: [
          `A palindrome reads the same forward and backward. Sometimes it is a single word, such as level. Sometimes it is a name, such as Anna. A phrase can work too, once its spaces, punctuation, and capitalization are set aside.`,
          `Palindrome Lists brings those small discoveries together in a calm place to browse. Each category has examples and explanations, so you can see the pattern rather than take our word for it. Try reading from both ends toward the middle: every pair of letters should match.`,
        ],
        links: [
          { href: `/words`, label: `Explore Words` },
          { href: `/names`, label: `Explore Names` },
          { href: `/phrases`, label: `Explore Phrases` },
        ],
      },
      {
        id: `editorial-approach`,
        title: `Clear examples, honest context`,
        paragraphs: [
          `The explanations on these guide pages are written for this collection. Familiar examples are included to illustrate the letter patterns; we do not claim to have invented them. A phrase that has circulated for years may have several reported origins, so an unattributed example is not evidence of a particular author or date.`,
          `The starter collection is curated by Palindrome Lists and labels its entries as editorial examples. That label describes our curation, not a historical source. When an original author or first recorded use is not known, we leave that uncertainty visible. An added date describes when an entry joined the collection, not when the palindrome was invented. Community activity controls are previews and do not publish activity.`,
        ],
      },
      {
        id: `project-status`,
        title: `Small today, room to grow`,
        paragraphs: [
          `Public browsing, local searching, theme switching, copying, and sharing are available now. Accounts, community submissions, saved collections, voting, comments, and a public HTTP API are planned features. Their preview controls do not create an account or store a contribution.`,
          `Spotted a spelling error or found a reliable source for an example? The contact page explains what to include with a correction. Clear evidence helps keep the collection useful for readers, writers, and anyone who enjoys language.`,
        ],
        links: [
          { href: `/api`, label: `Read the Developer Guide` },
          { href: `/contact`, label: `Suggest a Correction` },
        ],
      },
    ],
  },
  api: {
    key: `api`,
    eyebrow: `For the curious developer`,
    title: `A simple rule, in code.`,
    description: `Learn how to check a palindrome locally. A public Palindrome Lists HTTP API is not available yet.`,
    sections: [
      {
        id: `api-status`,
        title: `Public API status`,
        paragraphs: [
          `The current collection is bundled with the app. There is no public HTTP endpoint, API key, subscription, or downloadable API dataset at this time. This page offers a local JavaScript recipe you can adapt; it is not documentation for a live service.`,
          `A future API would need documented response fields, source information, limits, versioning, and a clear reuse policy before anyone could depend on it. Those details will be published here if a service launches.`,
        ],
      },
      {
        id: `palindrome-recipe`,
        title: `Check an English example locally`,
        paragraphs: [
          `For the familiar English examples on this site, lowercase the input, keep only ASCII letters and digits, and compare the result with its reversal. Reject an empty result: punctuation alone does not make a useful palindrome entry.`,
        ],
        code: `const normalize = value =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

const isPalindrome = value => {
  const text = normalize(value);
  const reversed = [...text].reverse().join('');

  return text.length > 0 && text === reversed;
};

isPalindrome('Never odd or even'); // true
isPalindrome('palindrome'); // false
isPalindrome('...'); // false`,
      },
      {
        id: `normalization-details`,
        title: `Decide what your checker means`,
        paragraphs: [
          `Ignoring punctuation and spaces lets a sentence such as Step on no pets. count as a palindrome. A strict character-for-character checker would produce a different result because it would retain the capital letter, spaces, and full stop. Neither rule should be left implicit in a product.`,
          `This compact recipe is intentionally limited to A–Z and 0–9. It removes accented letters and other scripts, so it is unsuitable as a general multilingual validator. For broader language support, define how Unicode normalization, case folding, diacritics, and grapheme clusters should behave before choosing an implementation.`,
        ],
        bullets: [
          `Keep the original text for display; use normalized text only for comparison.`,
          `Validate input types and length before processing untrusted input.`,
          `Treat word, name, and phrase as editorial categories, not outputs of the checker.`,
          `Keep an entry’s source and attribution separate from its palindrome result.`,
        ],
        links: [
          { href: `/words`, label: `Browse Word Examples` },
          { href: `/phrases`, label: `Browse Phrase Examples` },
        ],
      },
    ],
  },
  words: {
    key: `words`,
    eyebrow: `One word. Two directions.`,
    title: `Palindrome words.`,
    description: `Explore English palindrome words, from level and radar to kayak, with simple explanations of their letter patterns.`,
    sections: [
      {
        id: `word-definition`,
        title: `What makes a word a palindrome?`,
        paragraphs: [
          `A palindrome word has the same sequence of letters when read from left to right or right to left. Level becomes level when reversed. Compare its outer letters first: l matches l, then e matches e, with v sitting in the middle. You can use that same outside-in check on every example below.`,
          `The pattern concerns spelling, not pronunciation or meaning. A word does not need to sound the same backward, and it does not become a palindrome merely because it has repeated letters. Banana repeats letters, for example, but its two ends do not match.`,
        ],
      },
      {
        id: `word-patterns`,
        title: `Look for the middle`,
        paragraphs: [
          `Words with an odd number of letters have one center letter, such as the d in radar. Words with an even number have a center pair, such as the two o letters in noon. Either arrangement works when the letters on each side form matching pairs.`,
          `Short examples are a useful starting point for children, spelling activities, puzzles, and writing prompts. Deed and noon make the symmetry easy to see. Longer words such as racecar and rotator show that the same rule works without changing the method.`,
        ],
      },
      {
        id: `word-conventions`,
        title: `A note on spelling`,
        paragraphs: [
          `This guide compares English letters without regard to capitalization, so Radar and radar have the same result. The app’s current comparison uses ASCII letters and digits; accented letters and other writing systems need a language-aware rule rather than this simplified check.`,
          `Single-letter words also satisfy the basic reversal rule, but the examples here focus on longer spellings where the pattern is more interesting. Names have their own page, and phrases use a relaxed comparison that removes spaces and punctuation.`,
        ],
        links: [
          { href: `/names`, label: `See Palindrome Names` },
          { href: `/phrases`, label: `See Palindrome Phrases` },
          { href: `/api`, label: `Read the Checking Recipe` },
        ],
      },
    ],
    examples: [
      { id: `word-deed`, text: `deed`, note: `Four letters, with two matching e letters at the center.` },
      { id: `word-noon`, text: `noon`, note: `A compact even-length example with n at both ends.` },
      { id: `word-peep`, text: `peep`, note: `The outer p pair surrounds a matching e pair.` },
      { id: `word-civic`, text: `civic`, note: `Its c and i pairs meet at the center letter v.` },
      { id: `word-kayak`, text: `kayak`, note: `The k and a pairs frame a single center y.` },
      { id: `word-level`, text: `level`, note: `A familiar five-letter palindrome with v in the middle.` },
      { id: `word-madam`, text: `madam`, note: `The m and a pairs read the same around d.` },
      { id: `word-radar`, text: `radar`, note: `A five-letter example whose outside-in pairs are r and a.` },
      { id: `word-refer`, text: `refer`, note: `The r and e pairs leave f as the center letter.` },
      { id: `word-rotor`, text: `rotor`, note: `Its r and o pairs mirror each other around t.` },
      { id: `word-racecar`, text: `racecar`, note: `Seven letters: r, a, and c form pairs around e.` },
      { id: `word-rotator`, text: `rotator`, note: `The r, o, and t pairs meet at the middle a.` },
    ],
  },
  names: {
    key: `names`,
    eyebrow: `Names with a second side`,
    title: `Palindrome names.`,
    description: `Discover palindrome name spellings such as Anna, Ada, Otto, and Hannah, and learn how their letter symmetry works.`,
    sections: [
      {
        id: `name-definition`,
        title: `The spelling is the pattern`,
        paragraphs: [
          `A palindrome name has a spelling that reads the same in both directions. Anna is an easy example: the outer a letters match and the inner n letters match. Hannah uses the same idea over six letters, with h, a, and n forming three pairs.`,
          `A name’s palindrome property depends on the exact spelling shown. A variation, a hyphen, or an added middle name can change the result. The examples below illustrate given-name spellings; they are not a directory of people, an account list, or a claim that every spelling has the same origin or usage.`,
        ],
      },
      {
        id: `name-patterns`,
        title: `Short names, clear symmetry`,
        paragraphs: [
          `Three-letter examples such as Ada, Ava, Bob, and Eve have one center letter. Four-letter examples such as Anna and Otto have a center pair. Neither length is more “palindromic” than the other: the same matching rule applies.`,
          `These spellings can be useful when naming a fictional character, making a word puzzle, or looking for a compact symmetrical wordmark. Letter symmetry is only one consideration for a real name. Meaning, pronunciation, family connections, and cultural context deserve their own research.`,
        ],
      },
      {
        id: `name-conventions`,
        title: `Capitalization and language`,
        paragraphs: [
          `For these examples, a capital initial does not affect the result: Anna is compared as anna. The current app uses a simplified A–Z and 0–9 comparison. It does not establish how accented characters or other writing systems should be handled.`,
          `We do not infer a name’s nationality, gender, popularity, or historical origin from its letter pattern. If you need that information, consult a reliable naming or language reference. For the palindrome itself, write the spelling out and compare each pair of letters from the ends inward.`,
        ],
        links: [
          { href: `/words`, label: `See Palindrome Words` },
          { href: `/phrases`, label: `See Palindrome Phrases` },
          { href: `/contact`, label: `Suggest a Spelling Correction` },
        ],
      },
    ],
    examples: [
      { id: `name-ada`, text: `Ada`, note: `The a pair surrounds one center d.` },
      { id: `name-ava`, text: `Ava`, note: `The two a letters meet around a center v.` },
      { id: `name-bob`, text: `Bob`, note: `Two b letters frame the center o.` },
      { id: `name-eve`, text: `Eve`, note: `Two e letters frame the center v.` },
      { id: `name-nan`, text: `Nan`, note: `Its n pair sits on either side of a.` },
      { id: `name-anna`, text: `Anna`, note: `Two matching pairs: a on the outside and n inside.` },
      { id: `name-otto`, text: `Otto`, note: `The o pair surrounds the center t pair.` },
      { id: `name-elle`, text: `Elle`, note: `The e and l pairs form an even-length palindrome.` },
      { id: `name-aviva`, text: `Aviva`, note: `The a and v pairs meet at a center i.` },
      { id: `name-hannah`, text: `Hannah`, note: `Three pairs of letters: h, a, and n.` },
    ],
  },
  phrases: {
    key: `phrases`,
    eyebrow: `Read it. Reverse it.`,
    title: `Palindrome phrases.`,
    description: `Explore familiar palindrome phrases and see how removing spaces, punctuation, and capitalization reveals their symmetry.`,
    sections: [
      {
        id: `phrase-definition`,
        title: `A sentence can turn around too`,
        paragraphs: [
          `A palindrome phrase has a sequence of letters that reads the same backward after spaces, punctuation, and capitalization are ignored. Never odd or even becomes neveroddoreven. Reverse that uninterrupted sequence and the same letters appear in the same order.`,
          `This is a relaxed letter-based convention. A strict comparison of the printed sentence would keep spaces and punctuation, making many familiar phrase palindromes fail. The words themselves do not need to appear in the same order backward; it is the individual letter sequence that matters.`,
        ],
      },
      {
        id: `phrase-reading`,
        title: `How to see the reversal`,
        paragraphs: [
          `Start with a short example such as Step on no pets. Write steponnopets on one line, then compare the first and last letters, the second and second-to-last, and so on. This avoids the distraction of the spaces between words.`,
          `Longer examples can sound unusual because every added letter creates another matching obligation. That constraint is part of their appeal: an ordinary-looking sentence has to satisfy a precise pattern underneath. A funny or awkward sentence can still be a valid palindrome, while a beautiful sentence may not be one.`,
        ],
      },
      {
        id: `phrase-context`,
        title: `Examples without invented origins`,
        paragraphs: [
          `The familiar examples below are presented to explain their construction. Their appearance here does not establish who first wrote them or when they were coined. Historical attribution needs a reliable source, separate from the letter check.`,
          `Our current comparison is limited to ASCII letters and digits. It removes punctuation and spaces but is not a multilingual normalization standard. For a phrase in another language, decide how accents, case, and writing-system conventions should work before judging the result.`,
        ],
        links: [
          { href: `/words`, label: `Start with Palindrome Words` },
          { href: `/api`, label: `Try the Local Checking Recipe` },
          { href: `/contact`, label: `Share a Source or Correction` },
        ],
      },
    ],
    examples: [
      { id: `phrase-nurses-run`, text: `Nurses run.`, note: `nursesrun — the word boundary disappears in the letter check.` },
      { id: `phrase-step-pets`, text: `Step on no pets.`, note: `steponnopets — a short example to compare from the outside inward.` },
      { id: `phrase-top-spot`, text: `Top spot.`, note: `topspot — its two words share one symmetrical letter sequence.` },
      { id: `phrase-no-lemon`, text: `No lemon, no melon.`, note: `nolemonnomelon — the comma and spaces are ignored.` },
      { id: `phrase-never-odd`, text: `Never odd or even.`, note: `neveroddoreven — the middle is the matching d pair.` },
      { id: `phrase-taco-cat`, text: `Taco cat.`, note: `tacocat — a seven-letter sequence with o in the middle.` },
      { id: `phrase-madam-adam`, text: `Madam, I’m Adam.`, note: `madamimadam — the apostrophe, comma, and spaces are removed.` },
      { id: `phrase-no-devil`, text: `No devil lived on.`, note: `nodevillivedon — read the uninterrupted letters in either direction.` },
      { id: `phrase-do-geese`, text: `Do geese see God?`, note: `dogeeseseegod — the question mark and capitalization do not count.` },
      { id: `phrase-live-time`, text: `Live on time, emit no evil.`, note: `liveontimeemitnoevil — the middle is the matching e pair.` },
      { id: `phrase-car-cat`, text: `Was it a car or a cat I saw?`, note: `wasitacaroracatisaw — a question with o at its center.` },
      { id: `phrase-panama`, text: `A man, a plan, a canal: Panama!`, note: `amanaplanacanalpanama — punctuation helps the sentence, not the symmetry.` },
    ],
  },
  contact: {
    key: `contact`,
    eyebrow: `Keep the collection clear`,
    title: `Say hello. Send a correction.`,
    description: `Find the project link and learn what to include when suggesting a palindrome, correcting an entry, or asking about attribution.`,
    sections: [
      {
        id: `contact-project`,
        title: `Find the project`,
        paragraphs: [
          `Palindrome Lists links to Piratechs. Visit the Piratechs website to find any contact options it makes available. This page does not currently include a message form or a published project email address.`,
          `Browsing the collection does not require an account. Community submissions and account support will be added only when those features are available.`,
        ],
        links: [
          { href: `https://piratechs.com/`, label: `Visit Piratechs`, external: true },
        ],
      },
      {
        id: `contact-correction`,
        title: `A useful correction starts with the text`,
        paragraphs: [
          `When using an available project contact method, include the exact word, name, or phrase and the page where you found it. Explain the change you suggest so the issue can be understood without guessing.`,
          `For a source or attribution question, include a link or enough publication details to locate the evidence. A claimed first use needs more context than a repeated online attribution. Tell us whether you would like your name credited if a contribution feature becomes available.`,
        ],
        bullets: [
          `The exact palindrome spelling and its word, name, or phrase category.`,
          `The page address and a short explanation of the correction.`,
          `A reliable source for any proposed author, date, or origin claim.`,
          `No passwords, account credentials, or sensitive personal information.`,
        ],
      },
      {
        id: `contact-privacy`,
        title: `Before sharing personal details`,
        paragraphs: [
          `Piratechs is a separate website. Any contact method there is governed by that website’s own privacy practices. The Palindrome Lists privacy page describes what this app currently stores in your browser.`,
        ],
        links: [
          { href: `/privacy`, label: `Read the Privacy Policy` },
          { href: `/about`, label: `Read Our Editorial Approach` },
        ],
      },
    ],
  },
  terms: {
    key: `terms`,
    eyebrow: `Simple expectations`,
    title: `Terms of use.`,
    description: `The current terms for browsing Palindrome Lists, using its examples, and understanding preview features and source information.`,
    sections: [
      {
        id: `terms-scope`,
        title: `Using the current site`,
        paragraphs: [
          `Updated October 6, 2026. These terms describe the current public Palindrome Lists website. You can browse its educational guides and example collection without creating an account. Use the site lawfully and do not attempt to disrupt it or gain access to systems that are not offered for public use.`,
          `The site currently provides a frontend collection, local search and filtering, a theme preference, and tools to copy or share individual examples. It does not provide account registration, a public HTTP API, or a live community contribution service. Preview controls for those features do not establish a service agreement or reserve access.`,
        ],
      },
      {
        id: `terms-content`,
        title: `Examples and source information`,
        paragraphs: [
          `The collection is offered for reading, learning, and exploring letter patterns. Familiar words, names, and phrases appear as examples; their inclusion does not imply that Palindrome Lists invented them, owns them exclusively, or has cleared every possible reuse.`,
          `Original explanations, site artwork, and software may have separate rights from the examples they describe. Before republishing material or using an example commercially, consider any relevant rights and seek the original source when attribution matters. This site does not provide an unrestricted license to a downloadable dataset.`,
          `We try to make the examples and explanations clear, but a listed author, origin, or first recorded date should be checked against its cited source before being relied on. An added date records the collection entry, not invention. Editorial curation does not establish original authorship. Community activity controls are previews and do not publish activity.`,
        ],
      },
      {
        id: `terms-links`,
        title: `Other websites and future features`,
        paragraphs: [
          `External links lead to websites with their own terms and privacy practices. Palindrome Lists does not control those websites or promise that their content or contact options will remain available.`,
          `Features may change as this project develops. If accounts, submissions, advertising, or a public API are introduced, the relevant policies and feature terms will be updated before those features are offered. The date above identifies the current version of these terms.`,
        ],
        links: [
          { href: `/privacy`, label: `Read the Privacy Policy` },
          { href: `/contact`, label: `Find Contact Information` },
        ],
      },
    ],
  },
  privacy: {
    key: `privacy`,
    eyebrow: `Know what stays on your device`,
    title: `Privacy policy.`,
    description: `How the current Palindrome Lists app handles local searches, theme storage, browser caching, external links, and planned features.`,
    sections: [
      {
        id: `privacy-current`,
        title: `The current app`,
        paragraphs: [
          `Updated October 6, 2026. Palindrome Lists currently offers public educational pages and a bundled example collection. There is no account registration, contact form, analytics integration, or advertising integration in this version of the app.`,
          `Searches, filters, and sorting run in your browser against the bundled examples. This application does not send that search text to an account service or a search provider. Preview controls for voting, comments, hearts, and saving do not submit community activity.`,
        ],
      },
      {
        id: `privacy-device`,
        title: `Browser storage and caching`,
        paragraphs: [
          `The web app stores your chosen light or dark theme in browser local storage so it can remember your preference on that device. This preference is not an account profile and is not shared between devices by this app. You can remove it by clearing this website’s browser storage.`,
          `The progressive web app can use a service worker and browser cache to keep public app resources available. Your browser controls those caches and any installed app shortcut. Clearing site data can remove the saved theme and cached resources; removing a home-screen shortcut alone may not clear all browser data.`,
          `The current frontend does not set advertising or analytics cookies. A live hosting provider may process standard web requests, including an IP address, browser information, and requested URLs, to deliver and protect a hosted website. Hosting practices depend on the provider used for the published site.`,
        ],
      },
      {
        id: `privacy-sharing`,
        title: `Copying and sharing examples`,
        paragraphs: [
          `Copy writes the selected palindrome, a short caption, and its public link to your device’s clipboard when you choose that action. This app does not read your clipboard. If copying is unavailable, you can select and copy the displayed text yourself.`,
          `Share passes the selected example and public link to your device’s share sheet or opens the social or email composer you select. You choose the recipient and whether to publish or send. Those apps and websites handle the information under their own policies; Palindrome Lists does not collect your recipient, account credentials, or message delivery status. A public example link contains the entry identifier, not your identity.`,
        ],
      },
      {
        id: `privacy-external`,
        title: `External websites`,
        paragraphs: [
          `If you follow a link to Piratechs, Google, or another website, your browser requests that website directly. Its own privacy policy applies to information you share there. Palindrome Lists does not receive a message submitted through an external website as part of its current frontend.`,
          `No payment details, passwords, or account credentials are needed to browse this collection. Please do not send sensitive information when suggesting a correction through an available external contact method.`,
        ],
        links: [
          { href: `/contact`, label: `Find the Project Contact Link` },
        ],
      },
      {
        id: `privacy-advertising`,
        title: `Advertising and future changes`,
        paragraphs: [
          `Advertising is not enabled in the current app. If Google advertising is introduced, this policy will be updated to describe the actual integration, data use, available choices, and any consent controls before advertisements are served.`,
          `If ads are enabled, Google and other advertising partners may place or read cookies, use web beacons, and process IP addresses or other identifiers to deliver and measure advertisements. Personalized advertising may also use information from visits to this and other websites where permitted and enabled. The links below explain Google’s data use and available ad preferences; these products are not currently running on Palindrome Lists.`,
          `If accounts, analytics, or community submissions are added, we will explain what information is collected, why it is used, and how visitors can make the relevant choices. Check the updated date on this page for policy changes.`,
        ],
        links: [
          { href: `https://policies.google.com/technologies/partner-sites`, label: `How Google Uses Information from Partner Sites`, external: true },
          { href: `https://policies.google.com/privacy`, label: `Google Privacy Policy`, external: true },
          { href: `https://policies.google.com/technologies/ads`, label: `Google Advertising Technologies`, external: true },
          { href: `https://myadcenter.google.com/`, label: `Google Ad Preferences`, external: true },
        ],
      },
    ],
  },
  signin: {
    key: `signin`,
    eyebrow: `A collection open to everyone`,
    title: `Browse now. Accounts later.`,
    description: `Account sign-in is not available yet. You can explore palindrome words, names, and phrases without an account.`,
    sections: [
      {
        id: `signin-status`,
        title: `Sign-in is coming later`,
        paragraphs: [
          `There is no account registration or sign-in service in the current version of Palindrome Lists. This page does not collect an email address or password. Public browsing is available without an account.`,
          `Saved collections, contributions, votes, and comments are planned account features. The landing page previews those controls, but they do not currently save information or publish activity.`,
        ],
        links: [
          { href: `/words`, label: `Browse Words` },
          { href: `/names`, label: `Browse Names` },
          { href: `/phrases`, label: `Browse Phrases` },
        ],
      },
      {
        id: `signin-privacy`,
        title: `Your current preference stays local`,
        paragraphs: [
          `You can switch between light and dark themes now. The web app remembers that choice in your browser, without creating a profile. Our privacy page explains the current storage behavior and how to clear it.`,
        ],
        links: [
          { href: `/privacy`, label: `Read the Privacy Policy` },
          { href: `/about`, label: `Learn About the Project` },
        ],
      },
    ],
  },
};
