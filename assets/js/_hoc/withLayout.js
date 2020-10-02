import React from 'react';

export const withLayout = (Layout) => (Component) => (props) => (
  <Layout>
    <Component {...props} />
  </Layout>
);
