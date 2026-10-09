import { useState } from 'react';
import { onboardingStories } from './data';
import type { OnboardingMode, OnboardingField, CollectionInterest, OnboardingErrors } from './types';

const useOnboarding = (mode: OnboardingMode) => {
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState(``);
  const [storyIndex, setStoryIndex] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [interests, setInterests] = useState<CollectionInterest[]>([`word`]);
  const [values, setValues] = useState({ name: ``, email: ``, password: `` });
  const isSignup = mode === `signup`;
  const story = onboardingStories[storyIndex] ?? onboardingStories[0];

  const setField = (field: OnboardingField, value: string) => {
    setNotice(``);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleInterest = (interest: CollectionInterest) => {
    setErrors((current) => ({ ...current, interests: undefined }));
    setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  };

  const submit = () => {
    setNotice(``);
    if (isSignup && step === 1) {
      if (!interests.length) {
        setErrors({ interests: `Choose At Least One Collection` });
        return;
      }
      setErrors({});
      setValues((current) => ({ ...current, password: `` }));
      setStep(2);
      return;
    }
    const nextErrors: OnboardingErrors = {};
    if (isSignup && !values.name.trim()) nextErrors.name = `Enter Your Name`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = `Enter A Valid Email Address`;
    if (!values.password) nextErrors.password = `Enter Your Password`;
    else if (isSignup && values.password.length < 8) nextErrors.password = `Use At Least 8 Characters`;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (isSignup) setStep(1);
    else {
      setValues((current) => ({ ...current, password: `` }));
      setNotice(`Sign In Is Coming Soon — You Can Explore Without An Account`);
    }
  };

  return {
    step,
    story,
    mode,
    values,
    errors,
    notice,
    setStep,
    setField,
    isSignup,
    interests,
    setNotice,
    storyIndex,
    setStoryIndex,
    passwordVisible,
    toggleInterest,
    submit,
    previousStep: () => { setNotice(``); setErrors({}); setStep((current) => Math.max(0, current - 1)); },
    moveStory: (direction: number) => setStoryIndex((current) => (current + direction + onboardingStories.length) % onboardingStories.length),
    togglePassword: () => setPasswordVisible((current) => !current),
    forgotPassword: () => setNotice(`Password Reset Is Coming Soon — No Email Has Been Sent`),
    continueWithGoogle: () => setNotice(`Google Sign-In Is Coming Soon — You Can Explore Without An Account`),
  };
};

export default useOnboarding;
