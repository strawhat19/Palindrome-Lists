export const heroPhrases = [
  { lead: `Good words.`, accent: `Both ways.` },
  { lead: `Good names.`, accent: `Same magic.` },
  { lead: `Clever lines.`, accent: `In reverse.` },
  { lead: `Word wonder.`, accent: `Full circle.` },
] as const;

export const heroHeading = `${heroPhrases[0].lead} ${heroPhrases[0].accent}`;
export const heroPhraseDuration = 5200;
