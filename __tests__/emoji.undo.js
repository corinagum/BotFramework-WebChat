import { Key } from 'selenium-webdriver';

import { imageSnapshotOptions, timeouts } from './constants.json';
import useEmojiEmoticonHistory from './useEmojiEmoticonHistory';
import getTranscript from './setup/elements/getTranscript.js';
import uiConnected from './setup/conditions/uiConnected';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

jest.setTimeout(timeouts.test);

test('Typing CTRL + Z in an empty sendbox will have no effect on sendbox value or emojiEmoticonHistory', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);

  const transcript = await getTranscript(driver);

  await transcript.click();

  await driver
    .actions()
    .keyDown(Key.CONTROL)
    .sendKeys('z')
    .keyUp(Key.CONTROL)
    .perform();

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);

  await pageObjects.typeInSendBox('So long and thanks for all the fish');

  const base64PNG2 = await driver.takeScreenshot();

  expect(base64PNG2).toMatchImageSnapshot(imageSnapshotOptions);
});

test('Typing CTRL + Z in an sendbox with just text will remove all text from sendbox', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await driver.wait(uiConnected(), timeouts.directLine);

  const transcript = await getTranscript(driver);

  await transcript.click();

  await pageObjects.typeInSendBox('So long and thanks for all the fish');

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);

  await driver
    .actions()
    .keyDown(Key.CONTROL)
    .sendKeys('z')
    .keyUp(Key.CONTROL)
    .perform();

  const base64PNG2 = await driver.takeScreenshot();

  expect(base64PNG2).toMatchImageSnapshot(imageSnapshotOptions);
});

test('Typing a string with multiple emoticons will add the index of each emoticon and emoji in array emoticonEmojiHistory', async () => {
  const { driver, pageObjects } = await setupWebDriver({
    props: {
      styleOptions: { emojiSet: true }
    }
  });

  await driver.wait(uiConnected(), timeouts.directLine);
  await pageObjects.typeInSendBox('hi :) ;)');

  const [emojiEmoticonHistory] = useEmojiEmoticonHistory();

  expect(emojiEmoticonHistory).toBe([
    { 2: { emoji: '😊', emoticonState: ':)' } },
    { 5: { emoji: '😉', emoticonState: ';)' } }
  ]);

  const base64PNG2 = await driver.takeScreenshot();

  expect(base64PNG2).toMatchImageSnapshot(imageSnapshotOptions);
});

// test('Using cursorLocation on sendBoxValue will indicate whether there is emoji to the left', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);
// type in sendbox: :)
// focus sendbox
// get currentLocation
// check: currentLocation -1 = emoji at emojiEmoticonHistory[currentLocation-1].emoji
// });

// test('Using cursorLocation on sendBoxValue will indicate when there is no emoji to the left', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);
// type in sendbox: hi
// focus sendbox
// get currentLocation
// check: currentLocation -1 = emoji at emojiEmoticonHistory[currentLocation-1].emoji
// });

// test('Ctrl + Z will trigger an Undo event', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);

// perform Ctrl Z

// CHECK EVENT?????
// });

// test('Undo will revert an emoji at the end of a string to an emoticon if cursor is to the right of it, and pop the index emoji node off of the array', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);

// type in sendbox: So long and thanks for :) the fish <3
// get currentLocation
// check: currentLocation -1 = emoji at emojiEmoticonHistory[currentLocation-1].emoji
// emojiEmoticonHistory: [{22: {emoji: 😊, emoticonState: ':)'}}, {34: {emoji: 😊, emoticonState: ':)'}}]

// snapshot: So long and thanks for :) the fish <-- with space or no space?
// });

// test('Undo will revert an emoji in the middle of a string to an emoticon if cursor is to the right of it, remove from history, and recalculate trailing emoji indices', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);

// type in sendbox: So long and thanks for :) the fish <3
// emojiEmoticonHistory: [{22: {emoji: 😊, emoticonState: ':)'}}, {34: {emoji: 😊, emoticonState: ':)'}}]

// snapshot: So long and thanks for :) the fish <-- with space or no space?
// });

// test('Typing an escaped emoticon into the sendbox will not convert the emoticon and save the emojiState value to false and show the emoticon in the sendbox without escapes', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);

// get escapedEmoticon list
// Type \:)
// if regex matches with an escaped emoticon,
// Store in array: {0: {emoji: false, emoticonState: ':)'}} (show no escapes)
// snapshot result: :)

// });

// test('Undoing escaped emoticon at the beginning of string will remove the emoticon from sendBoxValue and the emoticonEmojiHistory array and recalculate remaining indices', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);
// Type \:) <3 hi
// press undo when cursor is to right of \:)
// snapshot result: (heart) hi
// });

// test('Undoing escaped emoticon in the middle of a string will update the new indices of remaining emoji/emoticons', async () => {
//   const { driver, pageObjects } = await setupWebDriver({
//     props: {
//       styleOptions: { emojiSet: true }
//     }
//   });

//   await driver.wait(uiConnected(), timeouts.directLine);

// type Thanks for \:) the fish <3
// history: [{10: {emoji: false, emoticonState: ':)'}}, {21: {emoji: 😊, emoticonState: ':)'}}]

// snapshot result: Thanks for the fish (heart)
// });
