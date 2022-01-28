

import { Button, DialogActions, DialogContent, DialogTitle, InputAdornment } from '@material-ui/core';
import React, { PropsWithChildren, useState, useEffect } from 'react';
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "formik-material-ui";
import { ENV } from "../../../constants";
import CommonService from "../../../helpers/common-service";
import "./ClientEdit.scss"

const formValidation = Yup.object({
    name: Yup.string().min(4, "Invalid name").test('alphabets', 'Name must only contain alphabets', (value: any) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }).required("Required")
})

export interface ClientEditComponentProps {
    cancel: () => void,
    confirm: () => void,
    clientDetails: any,
}


const ClientEdit = (props: PropsWithChildren<ClientEditComponentProps>) => {

    const [selectedFile, setSelectedFile] = React.useState();

    const changeHandler = (event : any) => {
        setSelectedFile(event.target.files[0]);
    };


    const afterCancel = props?.cancel;
    const afterConfirm = props?.confirm;
    const clientDetails = props?.clientDetails;
    console.log(clientDetails)

    const onAdd = (payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
        payload = {
            ...payload,
            "client_id": clientDetails?._id
        }
        payload.image = selectedFile;
        console.log(payload);
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('logo', payload.logo);
        formData.append('phone', payload.phone);
        CommonService._api.put(ENV.API_URL + 'candidate/' + clientDetails._id, formData).then((resp) => {
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
        <div className={"client-edit"}>
            <DialogTitle id="alert-dialog-title">{('Edit Candidate Details')}</DialogTitle>
            {clientDetails && clientDetails!==null?
                <Formik initialValues={{ name: clientDetails?.name, logo: clientDetails?.imgPath }} validateOnChange={true}
                        validationSchema={formValidation} onSubmit={onAdd}>
                    {({ isSubmitting, isValid }) => (<Form className={'form-holder'}>
                        <DialogContent>
                            <div className="form-field">
                                <FormLabel className={'form-label'}>{('Name')}*</FormLabel>
                                <Field name='name' type={'text'} component={TextField} variant={"outlined"} id="input_client_edit_full_name"
                                       color={"primary"}
                                       autoComplete="off" inputProps={{ maxLength: 100 }}
                                       placeholder={'Enter Name'} />
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
                            <Button onClick={cancel} color="secondary" id="btn_client_edit_cancel">
                                {('Cancel')}
                            </Button>
                            <Button type={"submit"} className={"submit"} disabled={isSubmitting || !isValid} variant={"contained"} color="secondary" id="btn_client_edit_submit">
                                {('Save Changes')}
                            </Button>
                        </DialogActions>
                    </Form>)}
                </Formik>
                :<></>}
        </div>
    )
};


export default ClientEdit;
