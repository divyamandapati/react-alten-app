import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React,{PropsWithChildren,useState,useEffect,useCallback} from 'react';
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "formik-material-ui";
import { ENV } from "../../../constants";
import CommonService from "../../../helpers/common-service";
import "./UserAddComponent.scss"
import InputAdornment from '@material-ui/core/InputAdornment';
const isPhone = new RegExp('(^[6789][0-9]{9})');

const formValidation = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string().min(10, 'Invalid Phone Number').max(10, 'Invalid Phone Number').matches(isPhone, 'Phone number is not valid').required('Required'),
    name: Yup.string().min(4, "Invalid name").max(100, "Invalid name").test('alphabets', 'Name must only contain alphabets', (value: any) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }).required("Required"),
    position: Yup.string().min(4, "Invalid position").max(100, "Invalid position").test('alphabets', 'Name must only contain alphabets', (value: any) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }).required("Required"),
})

export interface UserAddComponentProps {
    cancel: () => void,
    confirm: () => void,
}

const UserAddComponent = (props: PropsWithChildren<UserAddComponentProps>) => {

    const [selectedFile, setSelectedFile] = React.useState();

    const changeHandler = (event : any) => {
        setSelectedFile(event.target.files[0]);
    };


    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;

    const onAdd = (payload: any, { setSubmitting, setErrors,resetForm }: FormikHelpers<any>) => {
        payload.image = selectedFile;
        console.log(payload);
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('image', payload.image);
        formData.append('email', payload.email);
        formData.append('phone', payload.phone);
        formData.append('position', payload.position);
        console.log(formData);
        console.log(formData.get("name"))
        CommonService._api.post(ENV.API_URL + 'candidate', formData, {
            'Content-Type': false,
            Accept: 'application/json'
        } ).then((resp) => {
            setSubmitting(false);
            if (afterConfirm) {
                afterConfirm();
                resetForm({})
            }
        }).catch((err) => {
            CommonService.handleErrors(setErrors, err);
            setSubmitting(false);
        })
    }

    const cancel = (resetForm:any) => {
        if (afterCancel) {
            afterCancel();
           resetForm()
        }
    }

    return (
        <div className={"user-add"}>
            <DialogTitle id="alert-dialog-title">{('Add Candidate Details')}</DialogTitle>
            <Formik initialValues={{ email: '', name: '',phone: "", position: "", image: "" }} validateOnChange={true}
                validationSchema={formValidation} onSubmit={onAdd}>
                {({ isSubmitting, isValid,resetForm }) => (<Form className={'form-holder'}>
                    <DialogContent>
                        <div className="form-field">
                            <FormLabel className={'form-label'}>{('Full Name')}*</FormLabel>
                            <Field name='name' type={'text'} component={TextField} variant={"outlined"} id="input_user_add_full_name"
                                color={"primary"} className="search-cursor"   inputProps={{maxLength :100}}
                                placeholder={'Enter Full Name'} autoComplete="off"/>
                        </div>
                        <div className="form-field">
                            <FormLabel className={'form-label'}>{('Phone Number')}*</FormLabel>
                            <Field name='phone' type={'string'} component={TextField} variant={"outlined"}
                                color={"primary"} className="search-cursor"
                                inputProps={{maxLength :10}}
                                autoComplete="off"
                                id="input_user_add_phone"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            +91
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder={'8888888888'} />
                        </div>
                        <div className="form-field">
                            <FormLabel className={'form-label'}>{('Email ID')}*</FormLabel>
                            <Field name='email' type={'email'} component={TextField} variant={"outlined"}
                                id="input_user_add_email"
                                color={"primary"} className="search-cursor"   inputProps={{maxLength :100}}
                                placeholder={'test@gmail.com'} autoComplete="off"/>
                        </div>

                        <div className="form-field">
                            <FormLabel className={'form-label'}>{('Position')}*</FormLabel>
                            <Field name='position' type={'text'} component={TextField} variant={"outlined"} id="input_user_position"
                                   color={"primary"} className="search-cursor"   inputProps={{maxLength :100}}
                                   placeholder={'Enter position'} autoComplete="off"/>
                        </div>


                        <div className="upload-icon mrg-top-20">
                            <FormLabel className={'form-label'}>{('Upload Image')}</FormLabel>
                            <div className="margin-top" id="file_Upload_Image">
                                <input type="file" name="file" onChange={(event) =>changeHandler(event)} />
                            </div>
                        </div>
                        {/*<img src={selectedFile} />*/}


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>cancel(resetForm)} color="secondary" id="btn_user_add_cancel">
                            {('Cancel')}
                        </Button>
                        <Button type={"submit"} className={"submit"} disabled={isSubmitting || !isValid} variant={"contained"} color="secondary" autoFocus id="btn_user_add_submit">
                            {('ADD Candidate')}
                        </Button>
                    </DialogActions>
                </Form>)}
            </Formik>
        </div>
    )
};


export default UserAddComponent;
