export type OnboardingMode = `signin` | `signup`;
export type OnboardingProps = { mode: OnboardingMode };
export type OnboardingField = `name` | `email` | `password`;
export type CollectionInterest = `word` | `name` | `phrase`;
export type OnboardingErrors = Partial<Record<OnboardingField | `interests`, string>>;
