export type ContactField = `name` | `email` | `topic` | `subject` | `message` | `source`;
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;
