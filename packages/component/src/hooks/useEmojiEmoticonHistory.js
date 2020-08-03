import { useCallback, useState } from 'react';

import useCursorLocation from './useCursorLocation';
import useSendBoxValue from './useSendBoxValue';
import useStyleOptions from './useStyleOptions';

export default function useEmojiEmoticonHistory() {
  // first parameter: type of action
  //    set (push)
  //    remove - depends on index
  //    update index
  //    update state (emoji vs emoticon)
  //    if all textbox is deleted, wipe history
  //
  // const [cursorLocation] = useCursorLocation();
  // const [sendBoxValue] = useSendBoxValue();
  const [{ emojiSet }] = useStyleOptions();
  const [emojiEmoticonHistory, setEmojiEmoticonHistory] = useState([]);

  // indexObj data structure:
  // indexObj = {
  //     emoji: undefined,
  //     emoticon: undefined
  //   }

  if (!!!emojiSet) {
    return false;
  }

  const setter = useCallback(
    ({ emoji, emoticon, index, type }) => {
      switch (type) {
        case 'add':
          const indexObj = { [index]: { emoji, emoticon } };
          console.log(indexObj);

          // emojiEmoticonHistory.push(indexObj);
          // setEmojiEmoticonHistory(emojiEmoticonHistory);
          setEmojiEmoticonHistory(emojiEmoticonHistory => {
            return [...emojiEmoticonHistory, indexObj];
          });
          console.log('pushed?', emojiEmoticonHistory);

          break;

        default:
          break;
      }
    },
    [setEmojiEmoticonHistory]
  ); // end callBack
  return [emojiEmoticonHistory, setter];
}
