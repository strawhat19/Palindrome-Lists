import type { IconName } from '../Icon';

export const contactTopics = [
  { id: `general`, label: `General Question`, icon: `comment` },
  { id: `suggestion`, label: `Suggest A Palindrome`, icon: `book` },
  { id: `correction`, label: `Correction Or Attribution`, icon: `file` },
  { id: `partnership`, label: `Project Or Partnership`, icon: `heart` },
  { id: `api`, label: `API Or Developer Inquiry`, icon: `code` },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];

export const contactGuides = [
  { id: `collection`, icon: `book`, title: `A word worth sharing`, copy: `Suggest a palindrome or flag a correction. Include the exact spelling and a source when you have one.` },
  { id: `projects`, icon: `code`, title: `Something to build together`, copy: `Tell us about your project, partnership, or API idea. A little context helps the conversation start well.` },
  { id: `questions`, icon: `comment`, title: `A little help finding your way`, copy: `Ask about the collection, how an example works, or where to find more information.` },
] as const satisfies readonly { id: string; title: string; copy: string; icon: IconName }[];

export const contactQuestions = [
  { id: `suggestions`, title: `What should a suggestion include?`, answer: `Include the exact word, name, or phrase, its language, and any source you can point to. For corrections, include the entry or page and explain what should change.` },
  { id: `accounts`, title: `Do I need an account?`, answer: `No. The collection and this form preview are open to everyone. Account features are still being prepared.` },
  { id: `delivery`, title: `Can I send a message right now?`, answer: `Messaging is coming soon. You can fill out the form and check your details, but this preview does not send or save messages.` },
] as const;

export const contactLimits = { name: 80, email: 254, subject: 120, source: 1000, message: 2000 } as const;
