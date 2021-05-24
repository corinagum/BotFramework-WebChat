// In dev mode, draw a green tick when test succeeded.

const dumpLogs = require('../../common/dumpLogs');
const override = require('../utils/override');

// Send the completion back to the browser console.
module.exports = (webDriver, done) =>
  override(done, undefined, async function done() {
    /* istanbul ignore next */
    await webDriver.executeScript(() => {
      console.log(
        '%c✔️ DONE%c',
        'background-color: green; border-radius: 4px; color: white; font-size: 200%; padding: 2px 4px;',
        ''
      );

      const div = document.createElement('div');

      div.setAttribute(
        'style',
        'align-items: center; background-color: green; border: solid 4px black; border-radius: 10px; bottom: 10px; display: flex; font-size: 60px; height: 100px; justify-content: center; position: fixed; right: 10px; width: 100px;'
      );

      div.textContent = '✔️';

      document.body.appendChild(div);
    });

    await dumpLogs(webDriver, { clear: true });

    global.__logs = [];
  });
