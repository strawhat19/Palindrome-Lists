import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type WebAnchorProps = ComponentPropsWithoutRef<'a'> & {
  onPress?: unknown;
};

const WebAnchor = forwardRef<HTMLAnchorElement, WebAnchorProps>((props, ref) => {
  const anchorProps = { ...props };
  // Expo Link also supplies onClick for web; its native event must stay off the DOM.
  delete anchorProps.onPress;

  return <a {...anchorProps} ref={ref} />;
});

WebAnchor.displayName = `WebAnchor`;

export default WebAnchor;
