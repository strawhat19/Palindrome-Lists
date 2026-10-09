import Icon from '../Icon';
import { Link } from 'expo-router';
import type { PinkCtaProps } from './types';
import WebAnchor from '../WebAnchor/index.web';
import './styles.scss';

const PinkCta = ({ id, href, copy, title, label, eyebrow, icon = `book` }: PinkCtaProps) => (
  <section id={id} className='pink-cta' aria-labelledby={`${id}-title`}>
    <div id={`${id}-decoration`} className='pink-cta-decoration' aria-hidden='true'>
      <span id={`${id}-ring-outer`} className='pink-cta-ring pink-cta-ring--outer' />
      <span id={`${id}-ring-inner`} className='pink-cta-ring pink-cta-ring--inner' />
      <span id={`${id}-word-level`} className='pink-cta-word pink-cta-word--level'>level</span>
      <span id={`${id}-word-radar`} className='pink-cta-word pink-cta-word--radar'>radar</span>
    </div>
    <div id={`${id}-inner`} className='landing-container pink-cta-inner'>
      <div id={`${id}-content`} className='pink-cta-content'>
        <p id={`${id}-eyebrow`} className='pink-cta-eyebrow'><Icon name='repeat' size={15} color='#000000' /><span>{eyebrow}</span></p>
        <h2 id={`${id}-title`} className='pink-cta-title'>{title}</h2>
        <p id={`${id}-copy`} className='pink-cta-copy'>{copy}</p>
      </div>
      <Link href={href} asChild>
        <WebAnchor id={`${id}-link`} className='pink-cta-link'><Icon name={icon} size={18} color='#000000' /><span>{label}</span><Icon name='right' size={17} color='#000000' /></WebAnchor>
      </Link>
    </div>
  </section>
);

export default PinkCta;
