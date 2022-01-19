import { combineReducers } from 'redux';
import authReducer, { AuthParams } from './auth.reducer';
import othersReducer, { OtherParams } from './others.reducer';

export interface StateParams {
    auth: AuthParams;
    other: OtherParams;
}

const rootReducer = combineReducers({
    auth: authReducer,
    other: othersReducer
});

export default rootReducer;
