import React from 'react';

export function renderComponentWithProps(Component, props) {
  return React.renderToString(<Component {...props} />);
}
