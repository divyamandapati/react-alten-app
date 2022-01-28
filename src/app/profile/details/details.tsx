import React, {useCallback, useEffect, useState} from 'react';
import CommonService from "../../../helpers/common-service";
import {ENV} from "../../../constants";
import {Communications} from "../../../helpers";
import DialogComponent from "../../../components/core/DialogComponent";
import EditProfile from "../edit-profile/edit-profile";
import {Button} from "@material-ui/core";

export default function Details(props: any) {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [userDetails,setUserDetails] = useState<any>(null);
    const onReload = useCallback((page = 1) => {
        if (userDetails) {
            getUserDetails();
        }
        else{
            console.log("page not fount")
        }
    }, [userDetails]);

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


    useEffect(() => {
        getUserDetails();
        Communications.pageTitleSubject.next('Profile');
        Communications.pageBackButtonSubject.next(null);
    }, [])

    const getUserDetails = useCallback(()=>{
        CommonService._api.get(ENV.API_URL + '/profile').then((resp) => {
            setUserDetails(resp?.data);
            console.log(userDetails)
        }).catch((err)=>{
            CommonService.showToast(err?.error || 'Error', 'error');
        })
    },[])

    return(
        <>
         <DialogComponent class={'dialog-side-wrapper'} open={isEditOpen} cancel={cancelEdit}>
            <EditProfile cancel={cancelEdit} confirm={confirmEdit} userDetails={userDetails}/>
        </DialogComponent>
        <div className={'details-screen'}>
            <div>
                <h3>Profile</h3>
                <div className={'profile-section-row'}>
                    <div className={'profile-section-row-title'}>Name :</div>
                    <div className={'profile-section-row-value'}>DIVYA</div>
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
                </Button>
                <Button variant={"contained"} color="secondary" id="btn_change_password" className={"change_password-button"} onClick={openChangePassword}>
                    {('Change Password')}
                </Button>
            </div>

        </div>
        </>
    )

}
