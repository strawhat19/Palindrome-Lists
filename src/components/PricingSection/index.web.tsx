import { Link } from 'expo-router';
import Icon from '../Icon';
import type { PricingSectionProps } from './types';
import FlipContent from '../FlipContent/index.web';
import WebAnchor from '../WebAnchor/index.web';
import { landingLinks } from '../../shared/routes';
import { pricingPlans, pricingNotice } from '../../shared/pricing/plans';
import './styles.scss';

const PricingSection = ({ variant = `landing` }: PricingSectionProps) => {
  const prefix = `pricing-${variant}`;
  const PlanHeading = variant === `page` ? `h2` : `h3`;

  return (
    <section
      id={prefix}
      tabIndex={-1}
      className={`pricing-section pricing-section--${variant}`}
      aria-describedby={`${prefix}-note`}
      aria-label={variant === `page` ? `Compare Palindrome Lists Plans` : undefined}
      aria-labelledby={variant === `landing` ? `${prefix}-heading` : undefined}
    >
      <div id={`${prefix}-content`} className='landing-container pricing-section__content'>
        {variant === `landing` && (
          <div id={`${prefix}-header`} className='pricing-section__header'>
            <p id={`${prefix}-eyebrow`} className='pricing-section__eyebrow'>
              <Icon size={15} name='repeat' />
              <span id={`${prefix}-eyebrow-label`} className='pricing-section__eyebrow-label'>Plans & possibilities</span>
            </p>
            <h2 id={`${prefix}-heading`} className='pricing-section__heading' data-split='heading'>A little more wordplay.</h2>
            <p id={`${prefix}-description`} className='pricing-section__description'>
              Explore for free. Keep your favorites. Make room for more.
            </p>
          </div>
        )}
        <div id={`${prefix}-table`} className='pricing-section__table'>
          {pricingPlans.map((plan, planIndex) => {
            const planId = `${prefix}-${plan.id}`;
            const actionLabel = plan.id === `free` ? `Explore free` : `Ask about ${plan.name}`;

            return (
              <article
                key={plan.id}
                id={planId}
                aria-labelledby={`${planId}-name`}
                className={`pricing-plan pricing-plan--${plan.id}${plan.highlighted ? ` pricing-plan--highlighted` : ``}`}
              >
                {plan.highlighted && (
                  <span id={`${planId}-badge`} className='pricing-plan__badge'>More wordplay</span>
                )}
                <p id={`${planId}-audience`} className='pricing-plan__audience'>{plan.audience}</p>
                <div id={`${planId}-heading`} className='pricing-plan__heading'>
                  <Icon size={27} name={plan.icon} />
                  <PlanHeading id={`${planId}-name`} className='pricing-plan__name'>{plan.name}</PlanHeading>
                </div>
                <p id={`${planId}-summary`} className='pricing-plan__summary'>{plan.summary}</p>
                <div id={`${planId}-pricing`} className='pricing-plan__pricing'>
                  <div id={`${planId}-price-row`} className='pricing-plan__price-row'>
                    <p id={`${planId}-price`} className='pricing-plan__price'>{plan.price}</p>
                    <span id={`${planId}-period`} className='pricing-plan__period'>{plan.period}</span>
                  </div>
                  <p id={`${planId}-detail`} className='pricing-plan__detail'>{plan.detail}</p>
                </div>
                <ul id={`${planId}-features`} className='pricing-plan__features'>
                  {plan.features.map((feature, index) => (
                    <li
                      key={feature}
                      className='pricing-plan__feature'
                      id={`${planId}-feature-${index}`}
                    >
                      <Icon size={15} name='check' />
                      <span id={`${planId}-feature-label-${index}`} className='pricing-plan__feature-label'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div id={`${planId}-footer`} className='pricing-plan__footer'>
                  <span id={`${planId}-number`} className='pricing-plan__number'>
                    {`${String(planIndex + 1).padStart(2, `0`)} / ${String(pricingPlans.length).padStart(2, `0`)}`}
                  </span>
                  <Link href={plan.id === `free` ? landingLinks.home : landingLinks.contact} asChild>
                    <WebAnchor id={`${planId}-action`} className='pricing-plan__action'>
                      <FlipContent id={`${planId}-action-label`}>
                        <span>{actionLabel}</span><Icon size={14} name='right' />
                      </FlipContent>
                    </WebAnchor>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <p id={`${prefix}-note`} className='pricing-section__note'>
          <Icon size={15} name='info' />
          <span id={`${prefix}-note-label`} className='pricing-section__note-label'>{pricingNotice}</span>
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
