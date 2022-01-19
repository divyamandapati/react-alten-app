import { BehaviorSubject, Subject } from 'rxjs';
import { TsConfirmationConfig } from '../constants/CommonTypes';
import {RemoteTrack} from "twilio-video";

const logoutSubject: Subject<void> = new Subject();
const updateLoginUserTokenSubject: Subject<string> = new Subject<string>();
const updateActiveUserIdSubject: Subject<string> = new Subject<string>();
const NetworkChangeSubject: Subject<boolean> = new Subject<boolean>();
const ReloadStateSubject: Subject<boolean> = new Subject<boolean>();
const PageLoadingStateSubject: Subject<boolean> = new Subject<boolean>();

const ConfirmStateSubject: Subject<{
    config: TsConfirmationConfig;
    promise: { resolve: any; reject: any };
}> = new Subject<{ config: TsConfirmationConfig; promise: { resolve: any; reject: any } }>();
const DialogStateSubject: Subject<{ component: any; promise: { resolve: any; reject: any } }> = new Subject<{
    component: any;
    promise: { resolve: any; reject: any };
}>();

const SetUserColorScheme: Subject<'light' | 'dark'> = new Subject<'light' | 'dark'>();
const pageBackButtonSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
const pageTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
const accessRoleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
const accessRoleLinkSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
const accessRoleIdSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
const acccessRoleDoctorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

const streamSubscribedSubject: Subject<{ track: RemoteTrack | null, userId: string }> = new Subject<{ track: RemoteTrack | null, userId: string }>();
const streamUnsubscribedSubject: Subject<{ track: RemoteTrack | null, userId: string }> = new Subject<{ track: RemoteTrack | null, userId: string }>();
const mediaAvailabilitySubject: Subject<{ mode: string, is_available: boolean, error?: any }> = new Subject<{ mode: string, is_available: boolean, error?: any }>();
const webRtcConnectedSubject: Subject<boolean> = new Subject();
const participantDisconnected: Subject<boolean> = new Subject<boolean>();
const accessDoctorLinkSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
const Communications = {
    logoutSubject,
    updateActiveUserIdSubject,
    updateLoginUserTokenSubject,
    NetworkChangeSubject,
    ReloadStateSubject,
    SetUserColorScheme,
    PageLoadingStateSubject,
    pageBackButtonSubject,
    pageTitleSubject,
    accessRoleIdSubject,
    accessRoleLinkSubject,
    accessRoleSubject,
    ConfirmStateSubject,
    accessDoctorLinkSubject,
    DialogStateSubject,
    acccessRoleDoctorSubject,


    streamSubscribedSubject,
    streamUnsubscribedSubject,
    mediaAvailabilitySubject,
    webRtcConnectedSubject,
    participantDisconnected
};

export default Communications;
