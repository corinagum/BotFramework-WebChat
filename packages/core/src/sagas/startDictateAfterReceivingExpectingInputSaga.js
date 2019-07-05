import { put, select, takeEvery } from 'redux-saga/effects';

import selectActivities from '../selectors/activities';
import startDictate from '../actions/startDictate';
import whileConnected from './effects/whileConnected';

export default function* startDictateReceivingExpectingInputSaga() {
  yield whileConnected(function* whileConnectedReceiveActivities() {
    yield takeEvery(
      ({ type, payload: { activity: { inputHint } = {} } = {} } = {}) =>
        type === 'DIRECT_LINE/INCOMING_ACTIVITY' && (inputHint === 'expectingInput' || inputHint === 'acceptingInput'),
      function* startDictateAfterReceivingExpectingInput() {
        const activities = yield select(selectActivities);
        console.log('activities: ', activities);

        yield put(startDictate());
      }
    );
  });
}
