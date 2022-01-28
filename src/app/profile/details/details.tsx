import React, {useCallback, useEffect, useState} from 'react';
import CommonService from "../../../helpers/common-service";
import {ENV} from "../../../constants";
import {Communications} from "../../../helpers";
import DialogComponent from "../../../components/core/DialogComponent";
import EditProfile from "../edit-profile/edit-profile";
import {Button} from "@material-ui/core";
import "./details.scss"
import ChangePasswordComponent from "../change-password/change-password";

export default function Details(props: any) {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [userInfo, setUserInfo] = React.useState<any | null>(null)


    const init = useCallback(
        () => {
            CommonService._api.get(ENV.API_URL + '/profile').then((resp) => {
                setUserInfo(resp.data);
            });
        },
        [],
    )
    useEffect(() => {
        init();
        Communications.pageTitleSubject.next('Profile');
        Communications.accessRoleSubject.next('');
    }, [init])

    const onReload = useCallback((page = 1) => {
        if (userInfo) {
            init()

        } else {
            setUserInfo((prevState: any) => {
                prevState?.reload(page);
                return prevState;
            })
        }
    }, [userInfo, init]);



    const openEdit =useCallback (() => {
        setIsEditOpen(true);
    },[])

    const cancelEdit = useCallback(() => {
        setIsEditOpen(false);
        onReload(1)
    },[onReload])

    const confirmEdit = useCallback(() => {
        setIsEditOpen(false);
        onReload(1);
    }, [onReload])

    const openChangePassword =useCallback (() => {
        setIsChangePasswordOpen(true);
    },[])

    const cancelChangePassword = useCallback(() => {
        setIsChangePasswordOpen(false);
        onReload(1)
    },[onReload])

    const confirmChangePassword = useCallback(() => {
        setIsChangePasswordOpen(false);
        onReload(1);
    }, [onReload])

    return(
        <>
         <DialogComponent class={'dialog-side-wrapper'} open={isEditOpen} cancel={cancelEdit}>
            <EditProfile cancel={cancelEdit} confirm={confirmEdit} userInfo={userInfo}/>
        </DialogComponent>
            <DialogComponent class={'dialog-side-wrapper'} cancel={cancelChangePassword} open={isChangePasswordOpen}>
                <ChangePasswordComponent/>
            </DialogComponent>
        <div className={'details-screen'}>
            <div>
                <h3>Profile</h3>
                <div className={'profile-section-row'}>
                    <div className={'profile-section-row-title'}>Name :</div>
                    <div className={'profile-section-row-value'}>Divya</div>
                </div>
                <div className={'profile-section-row'}>
                    <div className={'profile-section-row-title'}>Phone :</div>
                    <div className={'profile-section-row-value'}>45347583453</div>
                </div>
                <div className={'profile-section-row'}>
                    <div className={'profile-section-row-title'}>Email : </div>
                    <div className={'profile-section-row-value'}>DIVYA@GMAIL.COM</div>
                </div>
                <div className={'profile-section-row'}>
                    <div className={'profile-section-row-title'}>Role :</div>
                    <div className={'profile-section-row-value'}>ADMIN</div>
                </div>
            </div>

            <div className="actions">
                <Button variant={"contained"} color="secondary" id="btn_edit_detaisl" className={"edit_details-button"} onClick={openEdit}>
                    {('Edit Details')}
                </Button> &nbsp;&nbsp;
                <Button variant={"contained"} color="secondary" id="btn_change_password" className={"change_password-button"} onClick={openChangePassword}>
                    {('Change Password')}
                </Button>
            </div>

        </div>
        </>
    )

}
