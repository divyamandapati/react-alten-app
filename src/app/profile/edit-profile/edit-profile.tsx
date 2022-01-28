import { Button, DialogActions, DialogContent, DialogTitle, InputAdornment } from '@material-ui/core';
import React, { PropsWithChildren, useState, useEffect } from 'react';
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "formik-material-ui";
import { ENV } from "../../../constants";
import CommonService from "../../../helpers/common-service";
import "./edit-profile.scss"
const isPhone = new RegExp('(^[6789][0-9]{9})');

const formValidation = Yup.object({
    name: Yup.string().min(4, "Invalid name").test('alphabets', 'Name must only contain alphabets', (value: any) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }).required("Required"),
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string().min(10, 'Invalid Phone Number').max(10, 'Invalid Phone Number').matches(isPhone, 'Phone number is not valid').required('Required'),
})

export interface UserEditComponentProps {
    cancel: () => void,
    confirm: () => void,
    userDetails: any,
}


const EditProfile = (props: PropsWithChildren<UserEditComponentProps>) => {
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const userDetails = props?.userDetails;
    console.log(userDetails)

    const onEdit = (payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
        CommonService._api.put(ENV.API_URL + 'candidate/' , payload).then((resp) => {
            // console.log(resp);
            setSubmitting(false);
            if (afterConfirm) {
                afterConfirm();
                CommonService.showToast(resp.msg || 'Success', 'success');
            }
        }).catch((err) => {
            CommonService.handleErrors(setErrors, err);
            setSubmitting(false);
        })
    }

    const cancel = () => {
        if (afterCancel) {
            afterCancel();
        }
    }

    return (
        <div className={"user-edit"}>
            <DialogTitle id="alert-dialog-title">{('Edit Candidate Details')}</DialogTitle>
            {userDetails && userDetails!==null?
                <Formik initialValues={{ name: userDetails?.name, email: userDetails?.email, phone: userDetails?.phone, position: userDetails?.position, image: userDetails?.imgPath }} validateOnChange={true}
                        validationSchema={formValidation} onSubmit={onEdit}>
                    {({ isSubmitting, isValid }) => (<Form className={'form-holder'}>
                        <DialogContent>
                            <div className="form-field">
                                <FormLabel className={'form-label'}>{('Full Name')}*</FormLabel>
                                <Field name='name' type={'text'} component={TextField} variant={"outlined"} id="input_user_edit_full_name"
                                       color={"primary"}
                                       autoComplete="off" inputProps={{ maxLength: 100 }}
                                       placeholder={'Enter Name'} />
                            </div>
                            <div className="form-field">
                                <FormLabel className={'form-label'}>{('Phone Number')}*</FormLabel>
                                <Field name='phone' type={'text'} component={TextField} variant={"outlined"}
                                       color={"primary"}
                                       inputProps={{ maxLength: 10 }}
                                       id="input_user_edit_phone"
                                       autoComplete="off"
                                       InputProps={{
                                           startAdornment: (
                                               <InputAdornment position="start">
                                                   +91
                                               </InputAdornment>
                                           ),
                                       }}
                                       placeholder={'Enter Phone Number'} />
                            </div>
                            <div className="form-field">
                                <FormLabel className={'form-label'}>{('Email ID')}*</FormLabel>
                                <Field name='email' type={'email'} component={TextField} variant={"outlined"}
                                       color={"primary"} inputProps={{ maxLength: 100 }}
                                       autoComplete="off"
                                       id="input_user_edit_email"
                                       placeholder={'Enter Email Address'} />
                            </div>
                            {/*<img src={selectedFile} />*/}


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={cancel} color="secondary" id="btn_user_edit_cancel">
                                {('Cancel')}
                            </Button>
                            <Button type={"submit"} className={"submit"} disabled={isSubmitting || !isValid} variant={"contained"} color="secondary" id="btn_user_edit_submit">
                                {('Save Changes')}
                            </Button>
                        </DialogActions>
                    </Form>)}
                </Formik>
                :<></>}
        </div>
    )
};


export default EditProfile;
