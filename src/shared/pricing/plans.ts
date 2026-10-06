import type { IconName } from '../../components/Icon';

type PricingPlan = {
  id: string;
  name: string;
  price: string;
  icon: IconName;
  period: string;
  detail: string;
  summary: string;
  audience: string;
  highlighted?: boolean;
  features: readonly string[];
};

export const pricingPlans: readonly PricingPlan[] = [
  {
    id: `free`,
    price: `$0`,
    name: `Free`,
    icon: `book`,
    period: `forever`,
    audience: `For the curious`,
    detail: `No account needed`,
    summary: `A little word wonder, open to everyone.`,
    features: [
      `Browse words, names, and phrases`,
      `Search and filter the collection`,
      `Copy and share your discoveries`,
      `Read the palindrome guides`,
    ],
  },
  {
    id: `pal`,
    name: `Pal`,
    price: `$3`,
    icon: `heart`,
    period: `/ month`,
    audience: `For the word lovers`,
    detail: `Preview price · USD`,
    summary: `Keep the words that stay with you.`,
    features: [
      `Everything in Free`,
      `Save your favorite palindromes`,
      `Create private personal lists`,
      `Add notes to your discoveries`,
    ],
  },
  {
    price: `$9`,
    icon: `save`,
    id: `lister`,
    name: `Lister`,
    highlighted: true,
    period: `/ month`,
    audience: `For the collectors`,
    detail: `Preview price · USD`,
    summary: `Turn your favorites into something worth sharing.`,
    features: [
      `Everything in Pal`,
      `Organize more lists and collections`,
      `Share public collection pages`,
      `Export your personal lists`,
    ],
  },
  {
    id: `pro`,
    name: `Pro`,
    price: `$19`,
    icon: `code`,
    period: `/ month`,
    audience: `For the builders`,
    detail: `Preview price · USD`,
    summary: `Bring a little wordplay into your next project.`,
    features: [
      `Everything in Lister`,
      `Developer API access`,
      `Bulk collection tools`,
      `Collaborative team collections`,
    ],
  },
];

export const pricingNotice = `Draft prices in USD. Free browsing is available now; paid plans and their features are coming soon.`;
