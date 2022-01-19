import Communications from './communications-service';
import queryString from 'querystring';
import { FormikErrors } from 'formik';
import { toast, ToastOptions, TypeOptions } from 'react-toastify';
import { TsConfirmationConfig } from '../constants/CommonTypes';
import axios, { CancelTokenSource } from 'axios';
import ApiService from './api-service';

export const SUPER_ADMIN = 'admin';
export const TEAM_MEMBER = 'team_member';
export const CLINIC_ADMIN = 'hospital_admin';
export const DOCTOR = 'doctor';
export const HOSPITAL_VIEW = 'hospital_view';
const parseQueryString = (q: string): any => {
    return queryString.parse(q.replace('?', ''));
};
const getBytesInMB = (bytes: number) => {
    return bytes / (1024 * 1024);
};
const formatSizeUnits = (bytes: number, decimals = 2) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
const getRandomID = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const showToast = (msg: string, type: TypeOptions="info" , options: ToastOptions = {}) => {
    switch (type) {
        case 'info':
            toast.info(msg, options);
            break;
        case 'success':
            toast.success(msg, options);
            break;
        case 'error':
            toast.error(msg, options);
            break;
        case 'warning':
            toast.warning(msg, options);
            break;
        default:
            toast.dark(msg, options);
            break;
    }
};
const handleErrors = (setErrors: (errors: FormikErrors<any>) => void, err: any) => {
    if (err.errors) {
        const errors: any = {};
        for (let field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                errors[field] = err.errors[field][0];
            }
        }
        setErrors(errors);
    } else if (err.error) {
        showToast(err.error,"error");
    }
};
const onConfirm = (config: TsConfirmationConfig = {}) => {
    const defaultConfig: TsConfirmationConfig = {
        confirmationText: 'Are you sure ?',
        yes: { text: 'Yes, Confirm', color: 'default' },
        no: { text: 'No, Cancel', color: 'primary' }
    };
    config = { ...defaultConfig, ...config };
    return new Promise((resolve, reject) => {
        Communications.ConfirmStateSubject.next({ config, promise: { resolve, reject } });
    });
};
const openDialog = (component: any) => {
    return new Promise((resolve, reject) => {
        Communications.DialogStateSubject.next({ component, promise: { resolve, reject } });
    });
};
const getCancelToken = (): CancelTokenSource => {
    return axios.CancelToken.source();
};
const getFormDataFromJSON = (json: any): FormData => {
    const payload = new FormData();
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            payload.append(key, json[key]);
        }
    }
    return payload;
};

const CommonService = {
    parseQueryString,
    handleErrors,
    onConfirm,
    openDialog,
    showToast,
    formatSizeUnits,
    getRandomID,
    getBytesInMB,
    getCancelToken,
    getFormDataFromJSON,

    _api: ApiService,
    _communications: Communications
};
export default CommonService;
