import React from 'react';
import PropTypes from 'prop-types';
import {Link as ReactRouterLinkLink} from 'react-router-dom';

const Link = React.forwardRef(({to, children, disabled, ...props}, ref) =>
  disabled ? (
    <span {...props}>{children}</span>
  ) : /^https ? :\/\/.*/g.test(to) ? (
    <a href={to} {...props}>
      {children}
    </a>
  ) : (
    <ReactRouterLinkLink innerRef={ref} to={to} {...props}>
      {children}
    </ReactRouterLinkLink>
  ),
);

Link.propTypes = {
  to: PropTypes.string,
  disabled: PropTypes.bool,
};

export default React.memo(Link);
