// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas
import authSaga from './auth.saga';

// Redux Saga: Root Saga
export function* rootSaga() {
    yield all([fork(authSaga)]);
}
