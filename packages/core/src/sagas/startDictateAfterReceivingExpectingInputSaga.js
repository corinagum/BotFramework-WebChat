import { put, takeEvery } from 'redux-saga/effects';

import selectActivities from '../selectors/activities';
import speakingActivity from '../definitions/speakingActivity';
import startDictate from '../actions/startDictate';
import whileConnected from './effects/whileConnected';

function* startDictateAfterReceivingExpectingInput(activities) {
  const [currentActivity] = activities;
  if (
    currentActivity &&
    currentActivity.inputHint === 'expectingInput' &&
    !activities.some(activity => activity.id !== currentActivity.id && speakingActivity(activity))
  ) {
    yield put(startDictate());
  }
}

export default function* startDictateReceivingExpectingInputSaga() {
  yield whileConnected(function* whileConnectedReceiveActivities() {
    const activities = yield takeEvery(selectActivities);
    yield startDictateAfterReceivingExpectingInput(activities);
  });
}
