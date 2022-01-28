import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "formik-material-ui";
import IconButton from '@material-ui/core/IconButton';
import CommonService from "../../../helpers/common-service";
import {ENV} from "../../../constants";
import "./change-password.scss"

const formValidation = Yup.object({
    old_password: Yup.string().required('Old Password is required'),
    new_password: Yup.string()
        .matches(/\w*[a-z]\w*/, "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match').required("Required")
})

export interface ChangePasswordComponentProps {
    cancel: () => void,
    confirm: () => void,
}

const ChangePasswordComponent = (props: any) => {
    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);


    const onAdd = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<any>) => {
        CommonService._api.put(ENV.API_URL + '/changePassword', payload).then((resp) => {
            // console.log(resp);
            setSubmitting(false);
            if (afterConfirm) {
                CommonService.showToast(resp.msg || "Success", "success");
                afterConfirm();
                resetForm({})
            }
        }).catch((err : any) => {
            CommonService.handleErrors(setErrors, err);
            setSubmitting(false);
        })
    }

    const cancel = (resetForm: any) => {
        if (afterCancel) {
            afterCancel();
            resetForm()
        }
    }


    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    return (
        <div className={"change-password"}>
            <DialogTitle id="alert-dialog-title">{('Change Password')}</DialogTitle>
            <Formik initialValues={{ old_password: '', new_password: '', confirm_password: "" }} validateOnChange={true}
                    validationSchema={formValidation} onSubmit={onAdd}>
                {({ isSubmitting, isValid, resetForm }) => (<Form className={'form-holder'}>
                    <DialogContent>
                        <div className="form-field position-relative">
                            <FormLabel className={'form-label'}>{('Old Password')}*</FormLabel>
                            <Field name='old_password'   type={showPassword ? 'text' : 'password'} component={TextField} variant={"outlined"}
                                   color={"primary"}  autoComplete="off" id="input_old_password"
                                   placeholder={'Enter Old Password'} />
                            <div className={'eye_btn_wrapper'}>
                                <IconButton
                                    size={'small'}
                                    aria-label="toggle password visibility"
                                    id="btn_old_password_show"
                                    onClick={()=>setShowPassword(!showPassword)}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </IconButton>
                            </div>
                        </div>
                        <div className="form-field position-relative">
                            <FormLabel className={'form-label'}>{('New Password')}*</FormLabel>
                            <Field name='new_password'  type={showNewPassword ? 'text' : 'password'} component={TextField} variant={"outlined"}
                                   color={"primary"}  autoComplete="off" id="input_new_password"
                                   placeholder={'Enter New Password'} />
                            <div className={'eye_btn_wrapper'}>
                                <IconButton
                                    size={'small'}
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    onMouseDown={handleMouseDownPassword}
                                    id="btn_new_password_show"
                                >
                                    {showNewPassword ? "Hide" : "Show"}
                                </IconButton>
                            </div>
                        </div>
                        <div className="form-field position-relative">
                            <FormLabel className={'form-label'}>{('Confirm Password')}*</FormLabel>
                            <Field name='confirm_password'  type={showConfirmPassword ? 'text' : 'password'} component={TextField} variant={"outlined"}
                                   color={"primary"}  autoComplete="off" id="input_confirm_password"
                                   placeholder={'Confirm Password'} />
                            <div className={'eye_btn_wrapper'}>
                                <IconButton
                                    size={'small'}
                                    aria-label="toggle password visibility"
                                    id="btn_confirm_password_show"
                                    onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </IconButton>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>cancel(resetForm)} color="secondary" id="btn_change_password_cancel">
                            {('Cancel')}
                        </Button>
                        <Button type={"submit"} className={"submit"} disabled={isSubmitting || !isValid} id="btn_change_password_submit" variant={"contained"} color="secondary" autoFocus>
                            {('Change Password')}
                        </Button>
                    </DialogActions>
                </Form>)}
            </Formik>
        </div>
    )
};


export default ChangePasswordComponent;
