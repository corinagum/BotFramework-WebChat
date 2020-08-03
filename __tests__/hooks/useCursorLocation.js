import { Key } from 'selenium-webdriver';

import { timeouts } from '../constants.json';
import getTranscript from '../setup/elements/getTranscript';
import uiConnected from '../setup/conditions/uiConnected';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

jest.setTimeout(timeouts.test);

test('getter should return 0 for cursorLocation if focus is on empty sendbox', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);

  const transcript = await getTranscript(driver);

  await transcript.click();
  await pageObjects.typeInSendBox('h', Key.BACK_SPACE);

  const [cursorIndex] = await pageObjects.runHook('useCursorLocation');

  expect(cursorIndex).toBe(0);
});

test('getter should return false for cursorLocation if focus is not in sendbox', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);

  const [cursorIndex] = await pageObjects.runHook('useCursorLocation');

  expect(cursorIndex).toBe(false);
});

test("getter should return 2 for cursorLocation if 'hi' is typed in sendbox", async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);

  const transcript = await getTranscript(driver);

  await transcript.click();
  await pageObjects.typeInSendBox('hi');

  const [cursorIndex] = await pageObjects.runHook('useCursorLocation');

  expect(cursorIndex).toBe(2);
});

test("getter should return 1 for cursorLocation if 'hi' is typed in sendbox and left arrow is pressed once", async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);

  const transcript = await getTranscript(driver);

  await transcript.click();
  await pageObjects.typeInSendBox('hi', Key.ARROW_LEFT);

  const [cursorIndex] = await pageObjects.runHook('useCursorLocation');

  expect(cursorIndex).toBe(1);
});

test("getter should return 0 for cursorLocation if ':)' is typed in sendbox and left arrow is pressed once", async () => {
  const { driver, pageObjects } = await setupWebDriver({
    props: {
      styleOptions: { emojiSet: true }
    }
  });

  await driver.wait(uiConnected(), timeouts.directLine);

  const transcript = await getTranscript(driver);

  await transcript.click();
  await pageObjects.typeInSendBox(':)', Key.ARROW_LEFT);

  const [cursorIndex] = await pageObjects.runHook('useCursorLocation');

  expect(cursorIndex).toBe(0);
});
