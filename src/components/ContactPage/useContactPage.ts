import { useState } from 'react';
import { contactLimits, contactTopics } from './data';
import type { ContactField, ContactValues, ContactErrors } from './types';

const emptyValues: ContactValues = { name: ``, email: ``, topic: ``, source: ``, subject: ``, message: `` };

const useContactPage = () => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [values, setValues] = useState<ContactValues>({ ...emptyValues });
  const showSource = values.topic === `suggestion` || values.topic === `correction`;

  const setField = (field: ContactField, value: string) => {
    setValidated(false);
    setErrors((current) => ({ ...current, [field]: undefined, ...(field === `topic` ? { source: undefined } : {}) }));
    setValues((current) => ({ ...current, [field]: value, ...(field === `topic` && value !== `suggestion` && value !== `correction` ? { source: `` } : {}) }));
  };

  const submit = () => {
    const nextErrors: ContactErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = `Enter Your Name`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = `Enter A Valid Email Address`;
    if (!contactTopics.some((topic) => topic.id === values.topic)) nextErrors.topic = `Choose An Inquiry Type`;
    if (!values.subject.trim()) nextErrors.subject = `Add A Subject`;
    if (values.message.trim().length < 10) nextErrors.message = `Add At Least 10 Characters`;
    if (values.message.length > contactLimits.message) nextErrors.message = `Keep Your Message Within 2,000 Characters`;
    if (showSource && values.source.trim()) {
      try {
        const source = new URL(values.source.trim());
        if (source.protocol !== `http:` && source.protocol !== `https:`) nextErrors.source = `Use An HTTP Or HTTPS Link`;
      } catch {
        nextErrors.source = `Enter A Complete Link, Such As https://example.com`;
      }
    }
    setErrors(nextErrors);
    const invalidField = (Object.keys(nextErrors) as ContactField[])?.[0];
    setValidated(!invalidField);
    return invalidField;
  };

  const reset = () => {
    setErrors({});
    setValidated(false);
    setValues({ ...emptyValues });
  };

  return { reset, submit, values, errors, setField, validated, showSource };
};

export default useContactPage;
