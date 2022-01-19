import { SET_TEMP_ROLE, SET_TEMP_ID, SET_PHONE_NUMBER, SET_IMAGE_URL } from '../actions/others.action';
import { localStore } from '../../helpers';

export interface OtherParams {
    roleAccess?: any;
    hospital_id?: any;
    phone_number?: any;
    image_url?: any;
}

const initialData: OtherParams = {
    roleAccess: localStore.getItem('roleAccess') || undefined,
    hospital_id: undefined,
    phone_number: localStore.getItem('phone_number') || undefined,
    image_url:localStore.getItem('image_url') || undefined
};
const othersReducer = (state = initialData, action: any): OtherParams => {
    switch (action.type) {
        case SET_TEMP_ROLE:
            state = { ...state, roleAccess: action.roleAccess };
            localStore.setItem('roleAccess', action.roleAccess);
            return state;
        case SET_TEMP_ID:
            state = { ...state, hospital_id: action.id };
            return state;
        case SET_PHONE_NUMBER:
            state = { ...state, phone_number: action.phone };
            localStore.setItem('phone_number', action.phone);
            return state;
        case SET_IMAGE_URL:
            state = { ...state, image_url: action.url };
            if(action.url!==undefined){
            localStore.setItem('image_url', action.url);
            }else{
                state = { ...state, image_url: undefined }; 
            }
            return state;
        default:
            return state;
    }
};

export default othersReducer;
