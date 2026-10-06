import Icon from '../Icon';
import FlipContent from '../FlipContent/index.web';
import './styles.scss';

type ScrollToTopProps = {
  visible: boolean;
  onPress: () => void;
};

const ScrollToTop = ({ visible, onPress }: ScrollToTopProps) => (
  <button
    id='scroll-to-top'
    type='button'
    disabled={!visible}
    onClick={onPress}
    aria-hidden={!visible}
    aria-label='Scroll to Top'
    className={`scroll-to-top${visible ? ` is-visible` : ``}`}
  >
    <FlipContent id='scroll-to-top-content'><Icon name='up' size={20} /></FlipContent>
  </button>
);

export default ScrollToTop;
