import { connect } from 'react-redux';
import React from 'react';

import WebChatAPIContext from 'botframework-webchat-api/lib/hooks/internal/WebChatAPIContext';
import WebChatReduxContext from 'botframework-webchat-api/lib/hooks/internal/WebChatReduxContext';

function removeUndefinedValues(map) {
  return Object.keys(map).reduce((result, key) => {
    const value = map[key];

    if (typeof value !== 'undefined') {
      result[key] = value;
    }

    return result;
  }, {});
}

function combineSelectors(...selectors) {
  return (...args) =>
    selectors.reduce(
      (result, selector) => ({
        ...result,
        ...removeUndefinedValues((selector && selector(...args)) || {})
      }),
      {}
    );
}

export default function connectToWebChat(...selectors) {
  const combinedSelector = combineSelectors(...selectors);

  // TODO: [P1] Instead of exposing Redux store via props, we should consider exposing via Context.
  //       We should also hide dispatch function.
  return Component => {
    const ConnectedComponent = connect(
      (state, { context, ...ownProps }) => combinedSelector({ ...state, ...context }, ownProps),
      null,
      null,
      {
        context: WebChatReduxContext
      }
    )(Component);

    const WebChatConnectedComponent = props => (
      <WebChatAPIContext.Consumer>
        {context => <ConnectedComponent {...props} context={context} />}
      </WebChatAPIContext.Consumer>
    );

    return WebChatConnectedComponent;
  };
}
