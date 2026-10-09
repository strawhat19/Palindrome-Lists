import { Link } from 'expo-router';
import { useEffect } from 'react';
import Icon from '../Icon';
import GoogleLogo from '../GoogleLogo';
import useOnboarding from './useOnboarding';
import PageMetadata from '../PageMetadata';
import HalfTurnLogo from '../HalfTurnLogo';
import Header from '../Header/index.web';
import WebAnchor from '../WebAnchor/index.web';
import FlipContent from '../FlipContent/index.web';
import ScrollToTop from '../ScrollToTop/index.web';
import { landingLinks } from '../../shared/routes';
import { useTheme } from '../../shared/themeContext/useTheme';
import type { OnboardingProps, OnboardingField } from './types';
import useContentPage from '../ContentPage/useContentPage.web';
import { onboardingSteps, onboardingStories, collectionInterests } from './data';
import '../LandingPage/styles.scss';
import './styles.scss';

const OnboardingPageView = ({ mode }: OnboardingProps) => {
  const form = useOnboarding(mode);
  const prefix = `onboarding-${mode}`;
  const { palette } = useTheme();
  const { theme, rootRef, heroRef, scrolled, themeStyle, showScrollTop, scrollToTop } = useContentPage(mode);
  const { step, story, values, errors, notice, isSignup, interests, storyIndex, passwordVisible } = form;
  const title = !isSignup ? `Welcome back.` : step === 0 ? `A little about you.` : step === 1 ? `Your kind of wordplay.` : `Ready to explore.`;
  const description = !isSignup
    ? `A favorite word, a little discovery, a collection that feels like you. Pick up where you left off.`
    : step === 0 ? `Start with the basics. Your next little discovery begins here.`
      : step === 1 ? `Choose what you love. You can pick more than one collection.`
        : `Your preview is ready. Account creation is coming soon; the collection is yours to explore today.`;

  useEffect(() => {
    if (step > 0) document.getElementById(`${prefix}-title`)?.focus({ preventScroll: true });
  }, [step, prefix]);

  const renderField = (field: OnboardingField, label: string) => {
    const isPassword = field === `password`;
    const errorId = `${prefix}-${field}-error`;
    const hintId = `${prefix}-${field}-hint`;
    const descriptionIds = [isPassword && isSignup ? hintId : ``, errors[field] ? errorId : ``].filter(Boolean).join(` `);

    return (
      <div id={`${prefix}-${field}-field`} className={`onboarding-field${isPassword ? ` onboarding-field--wide` : ``}`}>
        <div id={`${prefix}-${field}-label-row`} className='onboarding-label-row'>
          <label id={`${prefix}-${field}-label`} className='onboarding-label' htmlFor={`${prefix}-${field}`}>{label}</label>
          {isPassword && !isSignup && (
            <button id={`${prefix}-forgot-password`} type='button' className='onboarding-forgot' onClick={form.forgotPassword}>
              <Icon name='mail' size={13} /><span>Forgot password?</span>
            </button>
          )}
        </div>
        <div id={`${prefix}-${field}-input-wrap`} className='onboarding-input-wrap'>
          <input
            required
            name={field}
            value={values[field]}
            id={`${prefix}-${field}`}
            className='onboarding-input'
            minLength={isPassword && isSignup ? 8 : undefined}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={descriptionIds || undefined}
            onChange={(event) => form.setField(field, event.target.value)}
            autoComplete={field === `password` ? isSignup ? `new-password` : `current-password` : field}
            placeholder={field === `name` ? `Your name` : field === `email` ? `you@example.com` : isSignup ? `At least 8 characters` : `Your password`}
            type={isPassword ? passwordVisible ? `text` : `password` : field === `email` ? `email` : `text`}
          />
          {isPassword && (
            <button
              type='button'
              onClick={form.togglePassword}
              aria-pressed={passwordVisible}
              id={`${prefix}-password-toggle`}
              className='onboarding-password-toggle'
              aria-label={passwordVisible ? `Hide Password` : `Show Password`}
            >
              <Icon size={18} name={passwordVisible ? `eyeOff` : `eye`} color={palette.action} />
            </button>
          )}
        </div>
        {isPassword && isSignup && <p id={hintId} className='onboarding-hint'>Make it yours with at least 8 characters.</p>}
        {errors[field] && <p id={errorId} role='alert' className='onboarding-error'>{errors[field]}</p>}
      </div>
    );
  };

  return (
    <div id={prefix} ref={rootRef} data-theme={theme} style={themeStyle} className='palindrome-landing onboarding-page'>
      <PageMetadata page={mode} />
      <a id={`${prefix}-skip`} className='skip-link' href={`#${prefix}-form-content`}>
        <FlipContent id={`${prefix}-skip-label`}><Icon name='down' size={16} /><span>Skip to {isSignup ? `Sign Up` : `Sign In`}</span></FlipContent>
      </a>
      <Header scrolled={scrolled} />
      <main id={`${prefix}-main`} className='onboarding-main'>
        <aside id={`${prefix}-story`} ref={heroRef} className='onboarding-story' aria-label='Meet Palindrome Lists'>
          <div id={`${prefix}-story-inner`} className='onboarding-story-inner'>
            <div id={`${prefix}-story-art`} aria-hidden='true' className='onboarding-story-art' data-phrase={story.word.length > 12}>
              <div id={`${prefix}-art-card-back`} className='onboarding-art-card onboarding-art-card--back' />
              <div id={`${prefix}-art-card-front`} className='onboarding-art-card onboarding-art-card--front'>
                <span id={`${prefix}-art-logo`} className='onboarding-art-logo'><HalfTurnLogo id={`${prefix}-logo`} size={74} /></span>
                <span id={`${prefix}-art-word`} className='onboarding-art-word'>{story.word}</span>
                <span id={`${prefix}-art-reflection`} className='onboarding-art-reflection'>{story.word}</span>
              </div>
              <span id={`${prefix}-art-badge`} className='onboarding-art-badge'><Icon name='repeat' size={16} /><span>Same both ways</span></span>
            </div>
            <div id={`${prefix}-story-copy-${storyIndex}`} key={storyIndex} className='onboarding-story-copy'>
              <p id={`${prefix}-story-eyebrow`} className='onboarding-eyebrow'>{story.eyebrow}</p>
              <h2 id={`${prefix}-story-title`} className='onboarding-story-title'>{story.title}<span>{story.accent}</span></h2>
              <p id={`${prefix}-story-description`} className='onboarding-story-description'>{story.copy}</p>
            </div>
          </div>
          <div id={`${prefix}-story-footer`} className='onboarding-story-footer'>
            <div id={`${prefix}-story-pagination-row`} className='onboarding-story-pagination-row'>
              <div id={`${prefix}-story-pagination`} className='onboarding-story-pagination' role='group' aria-label='Wordplay Stories'>
                {onboardingStories.map((item, index) => (
                  <button
                    type='button'
                    key={item.label}
                    className='onboarding-story-dot'
                    aria-pressed={storyIndex === index}
                    onClick={() => form.setStoryIndex(index)}
                    id={`${prefix}-story-pagination-${index}`}
                    aria-label={`Show Story ${index + 1}: ${item.label}`}
                  />
                ))}
                <span id={`${prefix}-story-count`} className='onboarding-story-count'>{String(storyIndex + 1).padStart(2, `0`)} / 03</span>
              </div>
              <div id={`${prefix}-story-controls`} className='onboarding-story-controls'>
                <button id={`${prefix}-story-previous`} type='button' className='onboarding-story-control' aria-label='Previous Story' onClick={() => form.moveStory(-1)}>
                  <span className='onboarding-previous-icon'><Icon name='right' size={17} /></span>
                </button>
                <button id={`${prefix}-story-next`} type='button' className='onboarding-story-control' aria-label='Next Story' onClick={() => form.moveStory(1)}>
                  <Icon name='right' size={17} />
                </button>
              </div>
            </div>
            <p id={`${prefix}-story-note`} className='onboarding-story-note'>A little curiosity. Both ways.</p>
          </div>
        </aside>
        <section id={`${prefix}-form-panel`} className='onboarding-form-panel' aria-labelledby={`${prefix}-title`}>
          <div id={`${prefix}-form-body`} className='onboarding-form-body'>
            <div id={`${prefix}-form-content`} tabIndex={-1} className='onboarding-form-content'>
              {isSignup && (
                <ol id={`${prefix}-progress`} className='onboarding-progress' aria-label='Sign Up Progress'>
                  {onboardingSteps.map((label, index) => (
                    <li
                      key={label}
                      data-active={step === index}
                      data-complete={step > index}
                      className='onboarding-progress-step'
                      id={`${prefix}-progress-step-${index}`}
                      aria-current={step === index ? `step` : undefined}
                    >
                      <span className='onboarding-step-number'>{step > index ? <Icon name='check' size={11} /> : String(index + 1).padStart(2, `0`)}</span>
                      <span className='onboarding-step-label'>{label}</span>
                    </li>
                  ))}
                </ol>
              )}
              <p id={`${prefix}-eyebrow`} className='onboarding-eyebrow'>{isSignup ? `${onboardingSteps[step]} / ${String(step + 1).padStart(2, `0`)}` : `A Familiar Little Feeling`}</p>
              <h1 id={`${prefix}-title`} tabIndex={-1} className='onboarding-title'>{title}{!isSignup && <span>Let’s keep the wordplay going.</span>}</h1>
              <p id={`${prefix}-description`} className='onboarding-description'>{description}</p>
              {isSignup && step === 2 ? (
                <div id={`${prefix}-ready`} className='onboarding-ready'>
                  <span id={`${prefix}-ready-icon`} className='onboarding-ready-icon'><Icon name='check' size={25} color={palette.leaf} /></span>
                  <dl id={`${prefix}-summary`} className='onboarding-summary'>
                    <div id={`${prefix}-summary-name`}><dt>Your name</dt><dd>{values.name.trim()}</dd></div>
                    <div id={`${prefix}-summary-collection`}><dt>Your collections</dt><dd>{collectionInterests.filter((item) => interests.includes(item.id)).map((item) => item.label).join(`, `)}</dd></div>
                    <div id={`${prefix}-summary-privacy`}><dt>Profile visibility</dt><dd>Private by default</dd></div>
                  </dl>
                  <div id={`${prefix}-ready-actions`} className='onboarding-ready-actions'>
                    <Link href={landingLinks.home} asChild>
                      <WebAnchor id={`${prefix}-explore`} className='onboarding-submit'><Icon name='search' size={17} color={theme === `dark` ? palette.searchInk : palette.lime} /><span>Explore the collection</span></WebAnchor>
                    </Link>
                    <button id={`${prefix}-edit-interests`} type='button' className='onboarding-back' onClick={form.previousStep}><span className='onboarding-previous-icon'><Icon name='right' size={14} /></span><span>Edit your collection</span></button>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  id={`${prefix}-form`}
                  className='onboarding-form'
                  aria-labelledby={`${prefix}-title`}
                  onSubmit={(event) => { event.preventDefault(); form.submit(); }}
                >
                  {isSignup && step === 1 ? (
                    <>
                      <div id={`${prefix}-interests`} role='group' className='onboarding-interests' aria-label='Choose Your Collections' aria-describedby={errors.interests ? `${prefix}-interests-error` : undefined}>
                        {collectionInterests.map((item, index) => (
                          <button
                            type='button'
                            key={item.id}
                            className='onboarding-interest'
                            id={`${prefix}-interest-${item.id}`}
                            aria-pressed={interests.includes(item.id)}
                            onClick={() => form.toggleInterest(item.id)}
                          >
                            <span className='onboarding-interest-icon'><Icon size={22} name={item.icon} color={index % 2 ? palette.leaf : palette.action} /></span>
                            <span className='onboarding-interest-copy'><span className='onboarding-interest-title'>{item.label}</span><span className='onboarding-interest-description'>{item.description}</span></span>
                            <span className='onboarding-interest-check'>{interests.includes(item.id) && <Icon name='check' size={17} color={palette.leaf} />}</span>
                          </button>
                        ))}
                      </div>
                      {errors.interests && <p id={`${prefix}-interests-error`} role='alert' className='onboarding-error'>{errors.interests}</p>}
                      <p id={`${prefix}-privacy-note`} className='onboarding-privacy-note'><Icon name='shield' size={17} /><span>Your future profile starts private. Public browsing is always open.</span></p>
                      <button id={`${prefix}-back`} type='button' className='onboarding-back' onClick={form.previousStep}><span className='onboarding-previous-icon'><Icon name='right' size={14} /></span><span>Back to your details</span></button>
                    </>
                  ) : (
                    <div id={`${prefix}-fields`} className={`onboarding-fields${isSignup ? ` onboarding-fields--signup` : ``}`}>
                      {isSignup && renderField(`name`, `Your name`)}
                      {renderField(`email`, `Email address`)}
                      {renderField(`password`, `Password`)}
                    </div>
                  )}
                  <button id={`${prefix}-submit`} type='submit' className='onboarding-submit'>
                    <Icon size={17} name={isSignup ? `right` : `login`} color={theme === `dark` ? palette.searchInk : palette.lime} /><span>{isSignup ? `Continue` : `Sign in`}</span>
                  </button>
                </form>
              )}
              {(!isSignup || step === 0) && (
                <>
                  <div id={`${prefix}-provider-divider`} className='onboarding-provider-divider'><span>or {isSignup ? `sign up` : `sign in`} with</span></div>
                  <button id={`${prefix}-google`} type='button' className='onboarding-provider' onClick={form.continueWithGoogle}><GoogleLogo /><span>{isSignup ? `Sign up` : `Sign in`} with Google</span></button>
                </>
              )}
              <p id={`${prefix}-mode-switch`} className='onboarding-mode-switch'>
                <span>{isSignup ? `Already part of the collection?` : `New to Palindrome Lists?`}</span>
                <Link href={isSignup ? landingLinks.signin : landingLinks.signup} asChild>
                  <WebAnchor id={`${prefix}-mode-switch-link`} className='onboarding-mode-switch-link'><Icon name={isSignup ? `login` : `user`} size={14} /><span>{isSignup ? `Sign in` : `Sign up`}</span></WebAnchor>
                </Link>
              </p>
              {step < 2 && <p id={`${prefix}-preview-note`} className='onboarding-preview-note'>Accounts are coming soon. Your details stay on this page for this preview.</p>}
              <p id={`${prefix}-notice`} role='status' aria-live='polite' aria-atomic='true' className='onboarding-notice'>{notice}</p>
            </div>
          </div>
          <footer id={`${prefix}-footer`} className='onboarding-footer'>
            <p id={`${prefix}-copyright`} className='onboarding-copyright'>© {new Date().getFullYear()} Palindrome Lists</p>
            <nav id={`${prefix}-legal-links`} className='onboarding-legal-links' aria-label='Legal Information'>
              <Link href={landingLinks.privacy} asChild><WebAnchor id={`${prefix}-privacy-link`} className='onboarding-legal-link'><Icon name='shield' size={12} color={palette.leaf} /><span>Privacy</span></WebAnchor></Link>
              <Link href={landingLinks.terms} asChild><WebAnchor id={`${prefix}-terms-link`} className='onboarding-legal-link'><Icon name='file' size={12} color={palette.action} /><span>Terms</span></WebAnchor></Link>
            </nav>
            <a id={`${prefix}-piratechs`} className='onboarding-piratechs' href='https://piratechs.com/' target='_blank' rel='noopener noreferrer' aria-label='Made by Piratechs, Opens in a New Tab'><Icon name='external' size={12} /><span>Piratechs</span></a>
          </footer>
        </section>
      </main>
      <ScrollToTop visible={showScrollTop} onPress={scrollToTop} />
    </div>
  );
};

const OnboardingPage = ({ mode }: OnboardingProps) => <OnboardingPageView key={mode} mode={mode} />;

export default OnboardingPage;
