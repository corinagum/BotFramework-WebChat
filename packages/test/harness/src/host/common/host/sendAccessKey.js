const { Key } = require('selenium-webdriver');

module.exports = webDriver => {
  return function sendAccessKey(key) {
    return webDriver
      .actions()
      .keyDown(Key.ALT)
      .keyDown(Key.SHIFT)
      .sendKeys(key)
      .keyUp(Key.SHIFT)
      .keyUp(Key.ALT)
      .perform();
  };
};
