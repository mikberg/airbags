import React from 'react';

export default function ssrify(ssrId) {
  return ComposedComponent => class SsrRenderedComponent extends React.Component {
    static __SSR_ID = ssrId;

    static fetchData(props) {
      return ComposedComponent.fetchData(props);
    }

    getStateFromGlobalVariable() {
      const cache = global.__SSR_DATA;
      if (cache && cache[ssrId]) {
        return cache[ssrId];
      }
    }

    render() {
      const finalProps = Object.assign(
        {},
        this.props,
        this.getStateFromGlobalVariable()
      );

      return <ComposedComponent {...finalProps} />;
    }
  };
}
