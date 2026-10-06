import { Link } from 'expo-router';
import Icon from '../Icon';
import PricingSection from '../PricingSection';
import FlipContent from '../FlipContent/index.web';
import WebAnchor from '../WebAnchor/index.web';
import { landingLinks } from '../../shared/routes';
import './styles.scss';

const steps = [
  { id: `read`, number: `01`, title: `Start with a little wordplay.`, text: `A word, a name, or a whole phrase. All belong here.` },
  { id: `simplify`, number: `02`, title: `Let the letters do the talking.`, text: `Ignore spaces, punctuation, and uppercase letters.` },
  { id: `reverse`, number: `03`, title: `Read it the other way.`, text: `If the letters match in reverse, it’s a palindrome.` },
];

const guides = [
  { key: `words`, label: `Palindrome words` },
  { key: `names`, label: `Palindrome names` },
  { key: `phrases`, label: `Palindrome phrases` },
] as const;

const questions = [
  {
    id: `palindrome`,
    question: `What makes something a palindrome?`,
    answer: `Its letters read the same from either direction. “Level” is a word palindrome; “Anna” is a name palindrome; “Never odd or even” is a phrase palindrome when you remove spaces and punctuation.`,
  },
  {
    id: `sources`,
    question: `Where do these entries come from?`,
    answer: `This starter collection contains familiar examples selected for their letter patterns. “Editorial example” describes how an entry joined this collection. It does not establish its origin; unknown original authors and first-recorded dates stay marked as unknown.`,
  },
  {
    id: `accounts`,
    question: `Can I save, vote, or leave a comment?`,
    answer: `Those features are planned for a future release. You can search, filter, and explore the collection now. Activity counters are preview placeholders and do not represent a live community.`,
  },
];

const LandingSections = () => (
  <div id='landing-sections' className='landing-sections'>
    <section id='about' tabIndex={-1} className='about-section' aria-labelledby='about-title'>
      <div id='about-inner' className='landing-container section-inner'>
        <div id='about-heading' className='section-heading'>
          <p id='about-eyebrow' className='section-eyebrow' data-reveal='section'>A LITTLE WORDPLAY</p>
          <h2 id='about-title' className='section-title' data-split='heading'>Some things come full circle.</h2>
          <p id='about-copy' className='section-copy' data-reveal='section'>
            A palindrome reads the same forward and backward. Start with level, try a name like Anna,
            or look beneath the spaces in Never odd or even. Each has the same small surprise.
          </p>
        </div>
        <ol id='palindrome-steps' className='palindrome-steps'>
          {steps.map((step) => (
            <li id={`palindrome-step-${step.id}`} className='palindrome-step' data-reveal='step' key={step.id}>
              <span id={`step-number-${step.id}`} className='step-number'>{step.number}</span>
              <h3 id={`step-title-${step.id}`} className='step-title'>{step.title}</h3>
              <p id={`step-copy-${step.id}`} className='step-copy'>{step.text}</p>
            </li>
          ))}
        </ol>
        <div id='palindrome-example' className='palindrome-example' data-reveal='panel' aria-label='Level reads the same forward and backward'>
          <span id='palindrome-example-forward' className='example-word'>level</span>
          <Icon name='repeat' size={20} />
          <span id='palindrome-example-backward' className='example-word'>level</span>
        </div>
        <nav id='palindrome-guide-links' className='palindrome-guide-links' aria-label='Palindrome Guides'>
          {guides.map((guide) => (
            <Link key={guide.key} href={landingLinks[guide.key]} asChild>
              <WebAnchor id={`guide-link-${guide.key}`} className='text-action'>
                <FlipContent id={`guide-link-content-${guide.key}`}>
                  <span>{guide.label}</span><Icon name='right' size={16} />
                </FlipContent>
              </WebAnchor>
            </Link>
          ))}
        </nav>
      </div>
    </section>

    <section id='api' tabIndex={-1} className='api-section' aria-labelledby='api-title'>
      <div id='api-inner' className='landing-container api-inner'>
        <div id='api-content' className='api-content'>
          <p id='api-eyebrow' className='section-eyebrow' data-reveal='section'>FOR THE CURIOUS & THE BUILDERS</p>
          <h2 id='api-title' className='section-title' data-split='heading'>A little wordplay for your next idea.</h2>
          <p id='api-copy' className='section-copy' data-reveal='section'>
            A public API is on the way. For now, explore the collection and imagine what you might make with it.
          </p>
          <Link href={landingLinks.api} asChild>
            <WebAnchor id='api-developer-guide' className='text-action' data-reveal='section'>
              <FlipContent id='api-developer-guide-content'>
                <span>Read the developer guide</span><Icon name='right' size={16} />
              </FlipContent>
            </WebAnchor>
          </Link>
        </div>
        <div id='api-preview' className='api-preview' data-reveal='panel' aria-label='Illustrative Data Preview, API Coming Soon'>
          <div id='api-preview-header' className='api-preview-header'>
            <span id='api-preview-label' className='api-preview-label'><Icon name='code' size={17} />Data preview</span>
            <span id='api-preview-status' className='coming-soon-badge'>Coming soon</span>
          </div>
          <pre id='api-preview-code' className='api-preview-code'><code>{`{
  "text": "level",
  "type": "word",
  "letters": 5
}`}</code></pre>
          <p id='api-preview-note' className='api-preview-note'>Illustrative data. The API is not available yet.</p>
        </div>
      </div>
    </section>

    <PricingSection />

    <section id='faq' className='faq-section' aria-labelledby='faq-title'>
      <div id='faq-inner' className='landing-container faq-inner'>
        <div id='faq-heading' className='section-heading'>
          <p id='faq-eyebrow' className='section-eyebrow' data-reveal='section'>A FEW QUICK ANSWERS</p>
          <h2 id='faq-title' className='section-title' data-split='heading'>Good questions. Clear answers.</h2>
        </div>
        <div id='faq-list' className='faq-list'>
          {questions.map((item) => (
            <details id={`faq-${item.id}`} className='faq-item' data-reveal='panel' key={item.id}>
              <summary id={`faq-question-${item.id}`} className='faq-question'>
                <FlipContent id={`faq-question-content-${item.id}`}>{item.question}</FlipContent>
                <Icon name='chevron' size={17} />
              </summary>
              <p id={`faq-answer-${item.id}`} className='faq-answer'>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section id='contact' tabIndex={-1} className='contact-section' aria-labelledby='contact-title'>
      <div id='contact-inner' className='landing-container contact-inner'>
        <div id='contact-heading' className='contact-heading'>
          <p id='contact-eyebrow' className='section-eyebrow' data-reveal='section'>KEEP THE CONVERSATION GOING</p>
          <h2 id='contact-title' className='section-title' data-split='heading'>Have a word worth repeating?</h2>
          <p id='contact-copy' className='section-copy' data-reveal='section'>For project enquiries, find us at Piratechs.</p>
        </div>
        <Link href={landingLinks.contact} asChild>
          <WebAnchor id='contact-project' className='contact-button' data-reveal='section'>
            <FlipContent id='contact-project-content'>
              <span>Get in touch</span><Icon name='mail' size={16} />
            </FlipContent>
          </WebAnchor>
        </Link>
      </div>
    </section>
  </div>
);

export default LandingSections;
