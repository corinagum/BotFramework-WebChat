import createActivitiesStyle from './StyleSet/Activities';
import createActivityStyle from './StyleSet/Activity';
import createAvatarStyle from './StyleSet/Avatar';
import createBubbleStyle from './StyleSet/Bubble';
import createCodeCardStyle from './StyleSet/CodeCard';
import createMicrophoneButtonStyle from './StyleSet/MicrophoneButton';
import createMultipleAttachmentActivityStyle from './StyleSet/MultipleAttachmentActivity';
import createSendBoxStyle from './StyleSet/SendBox';
import createSendBoxTextBoxStyle from './StyleSet/SendBoxTextBox';
import createSingleAttachmentActivityStyle from './StyleSet/SingleAttachmentActivity';
import createSuggestedActionsStyle from './StyleSet/SuggestedActions';
import createSuggestedActionsStyleSet from './StyleSet/SuggestedActionsStyleSet';
import createSuggestedActionStyle from './StyleSet/SuggestedAction';
import createTextCardStyle from './StyleSet/TextCard';
import createTimestampStyle from './StyleSet/Timestamp';
import createUploadButtonStyle from './StyleSet/UploadButton';

const DEFAULT_OPTIONS = {
  accent: '#69F',

  bubbleBackground: 'White',
  bubbleImageHeight: 240,
  bubbleMaxWidth: 480, // screen width = 600px
  bubbleMinWidth: 250, // min screen width = 300px, Edge requires 372px (https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/13621468/)

  sendBoxHeight: 40,

  timestampColor: 'rgba(0, 0, 0, .2)'
};

export default function createStyleSet(options = DEFAULT_OPTIONS) {
  return {
    activity: createActivityStyle(options),
    activities: createActivitiesStyle(options),
    avatar: createAvatarStyle(options),
    bubble: createBubbleStyle(options),
    codeCard: createCodeCardStyle(options),
    microphoneButton: createMicrophoneButtonStyle(options),
    multipleAttachmentActivity: createMultipleAttachmentActivityStyle(options),
    options: {
      ...options,
      suggestedActionsStyleSet: createSuggestedActionsStyleSet(options)
    },
    sendBox: createSendBoxStyle(options),
    sendBoxTextBox: createSendBoxTextBoxStyle(options),
    singleAttachmentActivity: createSingleAttachmentActivityStyle(options),
    suggestedAction: createSuggestedActionStyle(options),
    suggestedActions: createSuggestedActionsStyle(options),
    textCard: createTextCardStyle(options),
    timestamp: createTimestampStyle(options),
    uploadButton: createUploadButtonStyle(options)
  };
}