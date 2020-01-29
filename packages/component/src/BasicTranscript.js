import { Composer as SayComposer } from 'react-say';
import { css } from 'glamor';
import { Panel as ScrollToBottomPanel } from 'react-scroll-to-bottom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import connectToWebChat from './connectToWebChat';
import ScrollToEndButton from './Activity/ScrollToEndButton';
import SpeakActivity from './Activity/Speak';
import useActivities from './hooks/useActivities';
import useDirection from './hooks/useDirection';
import useGroupTimestamp from './hooks/useGroupTimestamp';
import useStyleOptions from './hooks/useStyleOptions';
import useStyleSet from './hooks/useStyleSet';
import useWebSpeechPonyfill from './hooks/useWebSpeechPonyfill';

import {
  speechSynthesis as bypassSpeechSynthesis,
  SpeechSynthesisUtterance as BypassSpeechSynthesisUtterance
} from './Speech/BypassSpeechSynthesisPonyfill';

const ROOT_CSS = css({
  overflow: 'hidden',
  position: 'relative'
});

const PANEL_CSS = css({
  display: 'flex',
  flexDirection: 'column',
  WebkitOverflowScrolling: 'touch'
});

const FILLER_CSS = css({
  flex: 1
});

const LIST_CSS = css({
  listStyleType: 'none',

  '& > li.hide-timestamp .transcript-timestamp': {
    display: 'none'
  }
});

const DEFAULT_GROUP_TIMESTAMP = 300000; // 5 minutes

function sameTimestampGroup(activityX, activityY, groupTimestamp) {
  if (groupTimestamp === false) {
    return true;
  } else if (activityX && activityY) {
    groupTimestamp = typeof groupTimestamp === 'number' ? groupTimestamp : DEFAULT_GROUP_TIMESTAMP;

    if (activityX.from.role === activityY.from.role) {
      const timeX = new Date(activityX.timestamp).getTime();
      const timeY = new Date(activityY.timestamp).getTime();

      return Math.abs(timeX - timeY) <= groupTimestamp;
    }
  }

  return false;
}

const BasicTranscript = ({ activityRenderer, attachmentRenderer, className, dir }) => {
  const [{ activities: activitiesStyleSet, activity: activityStyleSet }] = useStyleSet();
  const [{ hideScrollToEndButton }] = useStyleOptions();
  const [activities] = useActivities();
  const [direction] = useDirection(dir);
  const [groupTimestamp] = useGroupTimestamp();
  const [{ speechSynthesis, SpeechSynthesisUtterance } = {}] = useWebSpeechPonyfill();

  // We use 2-pass approach for rendering activities, for show/hide timestamp grouping.
  // Until the activity pass thru middleware, we never know if it is going to show up.
  // After we know which activities will show up, we can compute which activity will show timestamps.
  // If the activity does not render, it will not be spoken if text-to-speech is enabled.
  const activityElements = activities.reduce((activityElements, activity) => {
    const element = activityRenderer({
      activity,
      timestampClassName: 'transcript-timestamp'
    })(({ attachment }) => attachmentRenderer({ activity, attachment }));

    element &&
      activityElements.push({
        activity,
        element
      });

    return activityElements;
  }, []);

  return (
    <div className={classNames(ROOT_CSS + '', className + '')} dir={direction} role="log">
      <ScrollToBottomPanel className={PANEL_CSS + ''}>
        <div className={FILLER_CSS} />
        <SayComposer
          // These are props for passing in Web Speech ponyfill, where speech synthesis requires these two class/object to be ponyfilled.
          speechSynthesis={speechSynthesis || bypassSpeechSynthesis}
          speechSynthesisUtterance={SpeechSynthesisUtterance || BypassSpeechSynthesisUtterance}
        >
          <ul
            aria-atomic="false"
            aria-live="polite"
            aria-relevant="additions text"
            className={classNames(LIST_CSS + '', activitiesStyleSet + '')}
            role="list"
          >
            {activityElements.map(({ activity, element }, index) => (
              <li
                // Because of differences in browser implementations, aria-label=" " is used to make the screen reader not repeat the same text multiple times in Chrome v75 and Edge 44
                aria-label=" "
                className={
                  (activityStyleSet + '',
                  {
                    // Hide timestamp if same timestamp group with the next activity
                    'hide-timestamp': sameTimestampGroup(
                      activity,
                      (activityElements[index + 1] || {}).activity,
                      groupTimestamp
                    )
                  })}
                key={(activity.channelData && activity.channelData.clientActivityID) || activity.id || index}
                role="listitem"
              >
                {element}
                {// TODO: [P2] We should use core/definitions/speakingActivity for this predicate instead
                activity.channelData && activity.channelData.speak && <SpeakActivity activity={activity} />}
              </li>
            ))}
          </ul>
        </SayComposer>
      </ScrollToBottomPanel>
      {!hideScrollToEndButton && <ScrollToEndButton />}
    </div>
  );
};

BasicTranscript.defaultProps = {
  className: ''
};

BasicTranscript.propTypes = {
  activityRenderer: PropTypes.func.isRequired,
  attachmentRenderer: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default connectToWebChat(({ activityRenderer, attachmentRenderer }) => ({
  activityRenderer,
  attachmentRenderer
}))(BasicTranscript);
