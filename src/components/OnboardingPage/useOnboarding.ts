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
    setValues({ name: ``, email: ``, password: `` });
    setNotice(`Firebase Is Not Connected — No Account Was Created Or Signed In`);
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
