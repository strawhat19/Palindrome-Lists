import { Link } from 'expo-router';
import { useEffect } from 'react';
import Icon from '../Icon';
import useContactPage from './useContactPage';
import PageMetadata from '../PageMetadata';
import Footer from '../Footer/index.web';
import Header from '../Header/index.web';
import PinkCta from '../PinkCta/index.web';
import WebAnchor from '../WebAnchor/index.web';
import FlipContent from '../FlipContent/index.web';
import ScrollToTop from '../ScrollToTop/index.web';
import { landingLinks } from '../../shared/routes';
import type { ContactField } from './types';
import { useTheme } from '../../shared/themeContext/useTheme';
import usePageShell from '../ContentPage/useContentPage.web';
import { contactLimits, contactGuides, contactTopics, contactQuestions } from './data';
import '../LandingPage/styles.scss';
import './styles.scss';

const ContactPage = () => {
  const form = useContactPage();
  const { palette } = useTheme();
  const { theme, rootRef, heroRef, scrolled, themeStyle, showScrollTop, scrollToTop } = usePageShell(`contact`);
  const { values, errors, validated, showSource } = form;

  useEffect(() => {
    if (validated) document.getElementById(`contact-form-feedback`)?.focus({ preventScroll: true });
  }, [validated]);

  const renderField = (field: Exclude<ContactField, `topic` | `message`>, label: string, placeholder: string, optional = false) => (
    <div id={`contact-field-${field}`} className={`contact-field${field === `subject` || field === `source` ? ` contact-field--wide` : ``}`}>
      <label id={`contact-label-${field}`} className='contact-label' htmlFor={`contact-input-${field}`}>{label}{optional && <span>Optional</span>}</label>
      <input
        name={field}
        value={values[field]}
        required={!optional}
        placeholder={placeholder}
        className='contact-input'
        maxLength={contactLimits[field]}
        id={`contact-input-${field}`}
        aria-invalid={Boolean(errors[field])}
        autoComplete={field === `name` || field === `email` ? field : `off`}
        onChange={(event) => form.setField(field, event.target.value)}
        aria-describedby={errors[field] ? `contact-error-${field}` : field === `source` ? `contact-source-hint` : undefined}
        type={field === `email` ? `email` : field === `source` ? `url` : `text`}
      />
      {field === `source` && <p id='contact-source-hint' className='contact-field-hint'>Link to the entry, original source, or page you’re referring to.</p>}
      {errors[field] && <p id={`contact-error-${field}`} role='alert' className='contact-field-error'>{errors[field]}</p>}
    </div>
  );

  return (
    <div id='contact-page' ref={rootRef} data-theme={theme} style={themeStyle} className='palindrome-landing contact-page'>
      <PageMetadata page='contact' />
      <a id='contact-skip' className='skip-link' href='#contact-main'><FlipContent id='contact-skip-content'><Icon name='down' size={16} /><span>Skip to Contact</span></FlipContent></a>
      <Header scrolled={scrolled} />
      <main id='contact-main' tabIndex={-1}>
        <section id='contact-hero' ref={heroRef} className='landing-container contact-page-hero' aria-labelledby='content-title-contact'>
          <nav id='contact-breadcrumb' className='contact-breadcrumb' aria-label='Breadcrumb'>
            <Link href={landingLinks.home} asChild><WebAnchor id='contact-home-link'><Icon name='repeat' size={13} color={palette.leaf} /><span>Home</span></WebAnchor></Link>
            <span aria-hidden='true'>/</span><span aria-current='page'>Contact</span>
          </nav>
          <p id='contact-eyebrow' className='contact-eyebrow'><Icon name='mail' size={15} color={palette.leaf} /><span>Keep The Conversation Going</span></p>
          <h1 id='content-title-contact' tabIndex={-1} className='contact-title'>Good conversations<br /><span>start with a hello.</span></h1>
          <p id='contact-introduction' className='contact-introduction'>A palindrome to share, a correction to make, or an idea to explore. We’d love to hear what’s on your mind.</p>
        </section>
        <div id='contact-layout' className='landing-container contact-page-layout'>
          <aside id='contact-support' className='contact-support' aria-labelledby='contact-support-title'>
            <h2 id='contact-support-title' className='contact-support-title'>A little direction.</h2>
            <p id='contact-support-copy' className='contact-support-copy'>Every good conversation starts with a little context. Here’s where yours might begin.</p>
            <div id='contact-guides' className='contact-guides'>
              {contactGuides.map((guide, index) => (
                <article id={`contact-guide-${guide.id}`} className='contact-guide' key={guide.id}>
                  <span id={`contact-guide-icon-${guide.id}`} className='contact-guide-icon'><Icon size={20} name={guide.icon} color={index % 2 ? palette.leaf : palette.action} /></span>
                  <div id={`contact-guide-content-${guide.id}`}>
                    <h3 id={`contact-guide-title-${guide.id}`} className='contact-guide-title'>{guide.title}</h3>
                    <p id={`contact-guide-copy-${guide.id}`} className='contact-guide-copy'>{guide.copy}</p>
                  </div>
                </article>
              ))}
            </div>
            <a id='contact-piratechs-project' className='contact-project-link' href='https://piratechs.com/' target='_blank' rel='noopener noreferrer' aria-label='Visit Piratechs, Opens in a New Tab'><Icon name='external' size={16} color={palette.leaf} /><span>Meet the team at Piratechs</span></a>
            <div id='contact-wordplay' className='contact-wordplay' aria-label='Level reads the same in both directions'><span>level</span><Icon name='repeat' size={21} color={palette.leaf} /><span>level</span></div>
          </aside>
          <section id='contact-form-card' className='contact-form-card' aria-labelledby='contact-form-title'>
            <div id='contact-form-heading' className='contact-form-heading'>
              <span id='contact-form-icon' className='contact-form-icon'><Icon name='mail' size={23} color={palette.action} /></span>
              <div id='contact-form-heading-copy'><h2 id='contact-form-title' className='contact-form-title'>Send a message.</h2><p id='contact-form-description' className='contact-form-description'>Tell us a little about you and what you have in mind.</p></div>
            </div>
            <div id='contact-preview' className='contact-preview'>
              <Icon name='info' size={18} color={palette.leaf} />
              <div><strong className='contact-preview-title'>Messaging is coming soon</strong><span className='contact-preview-copy'>Preview the form and check your details. Nothing is sent or saved.</span></div>
            </div>
            <form
              noValidate
              id='contact-form'
              className='contact-form'
              aria-labelledby='contact-form-title'
              aria-describedby='contact-preview'
              onSubmit={(event) => {
                event.preventDefault();
                const invalidField = form.submit();
                if (invalidField) document.getElementById(`contact-input-${invalidField}`)?.focus();
              }}
            >
              <div id='contact-form-fields' className='contact-form-fields'>
                {renderField(`name`, `Your name`, `Your name`)}
                {renderField(`email`, `Email address`, `you@example.com`)}
                <div id='contact-field-topic' className='contact-field contact-field--wide'>
                  <label id='contact-label-topic' className='contact-label' htmlFor='contact-input-topic'>What’s this about?</label>
                  <div id='contact-select-wrap' className='contact-select-wrap'>
                    <select required name='topic' id='contact-input-topic' className='contact-input' value={values.topic} aria-invalid={Boolean(errors.topic)} aria-describedby={errors.topic ? `contact-error-topic` : undefined} onChange={(event) => form.setField(`topic`, event.target.value)}>
                      <option value='' disabled>Choose an inquiry type</option>
                      {contactTopics.map((topic) => <option key={topic.id} id={`contact-topic-${topic.id}`} value={topic.id}>{topic.label}</option>)}
                    </select>
                    <Icon name='chevron' size={16} color={palette.action} />
                  </div>
                  {errors.topic && <p id='contact-error-topic' role='alert' className='contact-field-error'>{errors.topic}</p>}
                </div>
                {renderField(`subject`, `Subject`, `Give your message a short title`)}
                {showSource && renderField(`source`, `Source or page link`, `https://example.com`, true)}
                <div id='contact-field-message' className='contact-field contact-field--wide'>
                  <label id='contact-label-message' className='contact-label' htmlFor='contact-input-message'>Your message</label>
                  <textarea
                    required
                    rows={6}
                    name='message'
                    minLength={10}
                    value={values.message}
                    id='contact-input-message'
                    className='contact-textarea'
                    maxLength={contactLimits.message}
                    aria-invalid={Boolean(errors.message)}
                    placeholder={showSource ? `Include the exact palindrome and the suggestion or correction you have in mind…` : `Tell us about your question, project, or idea…`}
                    onChange={(event) => form.setField(`message`, event.target.value)}
                    aria-describedby={`contact-message-hint${errors.message ? ` contact-error-message` : ``}`}
                  />
                  <div id='contact-message-meta' className='contact-message-meta'><span id='contact-message-hint' className='contact-field-hint'>At least 10 characters</span><span id='contact-character-count' className='contact-character-count'>{values.message.length.toLocaleString(`en-US`)} / 2,000</span></div>
                  {errors.message && <p id='contact-error-message' role='alert' className='contact-field-error'>{errors.message}</p>}
                </div>
              </div>
              <p id='contact-form-note' className='contact-form-note'><Icon name='shield' size={15} color={palette.leaf} /><span>Your details stay on this page for the preview. <Link href={landingLinks.privacy} asChild><WebAnchor id='contact-form-privacy-link'>Read our privacy policy</WebAnchor></Link></span></p>
              <div id='contact-form-actions' className='contact-form-actions'>
                <button id='contact-submit' type='submit' className='contact-submit'><Icon name='mail' size={17} color={theme === `dark` ? palette.searchInk : palette.lime} /><span>Send message</span></button>
                <button id='contact-reset' type='button' className='contact-reset' onClick={form.reset}><Icon name='repeat' size={15} color={palette.leaf} /><span>Clear form</span></button>
              </div>
              {validated && (
                <div id='contact-form-feedback' role='status' tabIndex={-1} aria-live='polite' className='contact-form-feedback'><Icon name='check' size={21} color={palette.leaf} /><div><h3 id='contact-feedback-title' className='contact-feedback-title'>Your Message Looks Ready</h3><p id='contact-feedback-copy' className='contact-feedback-copy'>Nothing has been sent. Message delivery is coming soon.</p></div></div>
              )}
            </form>
          </section>
        </div>
        <PinkCta
          id='contact-cta'
          eyebrow='Keep Exploring'
          href={landingLinks.palindromes}
          label='Explore the collection'
          title='Find your next favorite palindrome.'
          copy='From everyday words to unexpected phrases, there’s always another way to look at language.'
        />
        <section id='contact-faq' className='landing-container contact-faq' aria-labelledby='contact-faq-title'>
          <h2 id='contact-faq-title' className='contact-faq-title'>Frequently Asked Questions</h2>
          <p id='contact-faq-copy' className='contact-faq-copy'>A few helpful answers to get the conversation started.</p>
          <div id='contact-faq-list' className='contact-faq-list'>
            {contactQuestions.map((question) => (
              <details id={`contact-faq-${question.id}`} className='contact-faq-item' key={question.id}>
                <summary id={`contact-faq-question-${question.id}`} className='contact-faq-question'><Icon name='chevron' size={17} color={palette.action} /><span>{question.title}</span></summary>
                <p id={`contact-faq-answer-${question.id}`} className='contact-faq-answer'>{question.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop visible={showScrollTop} onPress={scrollToTop} />
    </div>
  );
};

export default ContactPage;
