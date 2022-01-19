export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGIN_CHECK = 'LOGIN_CHECK';
export const UPDATE_LOGIN_USER = 'UPDATE_LOGIN_USER';
export const UPDATE_TEMP_ROLE = 'UPDATE_TEMP_ROLE';
export const UPDATE_VIEW = 'UPDATE_VIEW';
export const APP_LANGUAGE="APP_LANGUAGE"

export const loginUser = (user: any, token: string) => {
    return { type: LOGIN_USER, user, token };
};

export const updateLoginUser = (user: any) => {
    return { type: UPDATE_LOGIN_USER, user };
};

export const logoutUser = () => {
    return { type: LOGOUT_USER };
};
