import type { ReactNode } from 'react';
import './styles.scss';

type FlipContentProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

const FlipContent = ({ id, children, className }: FlipContentProps) => (
  <span
    id={id}
    data-flip-content
    className={`flip-content${className ? ` ${className}` : ``}`}
  >
    <span id={`${id}-rotor`} className='flip-rotor' data-flip-rotor>
      <span id={`${id}-front`} className='flip-face flip-front'>{children}</span>
      <span id={`${id}-back`} aria-hidden='true' className='flip-face flip-back'>{children}</span>
    </span>
  </span>
);

export default FlipContent;
