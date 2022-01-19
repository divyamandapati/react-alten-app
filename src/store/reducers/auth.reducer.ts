import { LOGIN_USER, LOGOUT_USER, UPDATE_LOGIN_USER, UPDATE_TEMP_ROLE, UPDATE_VIEW,APP_LANGUAGE } from '../actions/auth.action';
import { Communications, localStore } from '../../helpers';

export interface AuthParams {
    user?: any;
    token?: string;
    view?: string;
    language?:string;
}

const initialData: AuthParams = {
    user: undefined,
    token: undefined,
    view: localStore.getItem('view') || undefined,
    language:"en",
};

const authReducer = (state = initialData, action: any): AuthParams => {
    switch (action.type) {
        case LOGIN_USER:
            state = { ...state, user: action.user, token: action.token };
            localStore.setItem('currentUser', action.user);
            // localStore.setItem('roleAccess', action.user.role);
            localStore.setItem('token', action.token);
            Communications.updateLoginUserTokenSubject.next(action.token);
            return state;
        case UPDATE_LOGIN_USER:          
            state = { ...state, user: action.user };
            localStore.setItem('currentUser', action.user);
            return state;
        case UPDATE_TEMP_ROLE:
            state.user = {
                ...state.user,
                role: action.role
            };
            return state;
        case UPDATE_VIEW:
            state = {
                ...state,
                view: action.view
            };
            localStore.setItem('view', action.view);
            return state;
        case APP_LANGUAGE:
            state={
                ...state,
                language:action.lang
            }
            localStore.setItem('language', action.lang);
             return state;
        case LOGOUT_USER:
            localStore.removeItem('currentUser');
            localStore.removeItem('token');
            localStore.removeItem('roleAccess');
            localStore.removeItem('view');
            localStore.removeItem('language');
            localStore.removeItem('image_url');
            state = {
                user: undefined,
                token: undefined
            };
            Communications.updateLoginUserTokenSubject.next();
            return state;
        default:
            return state;
    }
};

export default authReducer;
