import { timeouts } from '../constants.json';

import uiConnected from '../setup/conditions/uiConnected';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

jest.setTimeout(timeouts.test);

test('getter should get the emojiEmoticonHistory array', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);
  await pageObjects.typeInSendBox(':)');
  await expect(pageObjects.runHook('useEmojiEmoticonHistory', [], result => result[0])).resolves.toBe([
    { 0: { emoji: '😊', emoticon: ':)' } }
  ]);
});

test('getter should get the emojiEmoticonHistory array', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);
  await pageObjects.typeInSendBox('hi :-)');
  await expect(pageObjects.runHook('useEmojiEmoticonHistory', [], result => result[0])).resolves.toBe([
    { 3: { emoji: '😊', emoticon: ':-)' } }
  ]);
});

test('setter should set the emojiEmoticonHistory array', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);
  await pageObjects.runHook('useEmojiEmoticonHistory', [], result => result[1](':)'));
  await expect(pageObjects.getEmojiEmoticonHistory()).resolves.toBe([[{ 0: { emoji: '😊', emoticon: ':)' } }]]);
});

test('setter should set the emojiEmoticonHistory array', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);
  await pageObjects.runHook('useEmojiEmoticonHistory', [], result => result[1]('hi :-)'));
  await expect(pageObjects.getEmojiEmoticonHistory()).resolves.toBe([[{ 3: { emoji: '😊', emoticon: ':-)' } }]]);
});
