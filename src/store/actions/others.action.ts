export const SET_TEMP_ROLE = 'SET_TEMP_ROLE';
export const SET_TEMP_ID = 'SET_TEMP_ID';
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const SET_IMAGE_URL = 'SET_IMAGE_URL';
export const setTempRole = (roleAccess: any) => {
    return { type: SET_TEMP_ROLE, roleAccess };
};
export const setTempId = (id: any) => {
    return { type: SET_TEMP_ID, id };
};

export const setPhoneNumber = (phone: any) => {
    return { type: SET_PHONE_NUMBER, phone };
};

export const setImageUrl = (url: any) => {
    return { type: SET_IMAGE_URL, url };
};
