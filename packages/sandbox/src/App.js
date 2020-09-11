import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';
import { createStoreWithDevTools } from 'botframework-webchat-core';
import './App.css';

function App() {
  const REDUX_STORE_KEY = 'REDUX_STORE';

  const store = useMemo(
    () =>
      createStoreWithDevTools({}, ({ dispatch }) => next => action => {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
          dispatch({
            type: 'WEB_CHAT/SEND_EVENT',
            payload: {
              name: 'webchat/join',
              value: {
                language: window.navigator.language
              }
            }
          });
        }
        return next(action);
      }),
    []
  );

  store.subscribe(() => {
    sessionStorage.setItem(REDUX_STORE_KEY, JSON.stringify(store.getState()));
  });

  const [token, setToken] = useState();
  /*
  /// CONNECTIVITY
  */

  const handleUseMockBot = useCallback(
    async url => {
      try {
        const directLineTokenRes = await fetch(`${url}/directline/token`, { method: 'POST' });

        if (directLineTokenRes.status !== 200) {
          throw new Error(`Server returned ${directLineTokenRes.status} when requesting Direct Line token`);
        }

        const { token } = await directLineTokenRes.json();

        setToken(token);
      } catch (err) {
        console.log(err);
        alert(`Failed to get Direct Line token for ${url} bot`);
      }
    },
    [setToken]
  );
  // TODO: remember if user was connected to official mock bot or local, then fetch token from that
  const handleResetClick = useCallback(() => {
    window.sessionStorage.removeItem('REDUX_STORE');
    window.location.reload();
  }, []);

  const handleStartConversationWithOfficialMockBot = useCallback(() => {
    handleUseMockBot('https://webchat-mockbot.azurewebsites.net');
  }, [handleUseMockBot]);

  const handleStartConversationWithLocalMockBot = useCallback(() => {
    handleUseMockBot('http://localhost:3978');
  }, [handleUseMockBot]);

  /// END CONNECTIVITY

  useEffect(() => {
    handleStartConversationWithOfficialMockBot();
  }, [handleStartConversationWithOfficialMockBot]);

  const directLine = useMemo(() => createDirectLine({ token }), [token]);

  return (
    <React.Fragment>
      <ReactWebChat className="webchat" directLine={directLine} store={store} />
      <div className="button-bar">
        <h2>Connectivity</h2>
        <button onClick={handleStartConversationWithOfficialMockBot} type="button">
          Official MockBot
        </button>
        <button onClick={handleStartConversationWithLocalMockBot} type="button">
          Local MockBot
        </button>
        <button onClick={handleResetClick} type="button">
          Reset session
        </button>
      </div>
    </React.Fragment>
  );
}

export default App;
