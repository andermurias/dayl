import React from 'react';
import {Link as ReactRouterLinkLink} from 'react-router-dom';

const Link = React.forwardRef(({to, children, ...props}, ref) =>
  /^https?:\/\/.*/g.test(to) ? (
    <a href={to} {...props}>
      {children}
    </a>
  ) : (
    <ReactRouterLinkLink innerRef={ref} to={to} {...props}>
      {children}
    </ReactRouterLinkLink>
  ),
);

export default React.memo(Link);
