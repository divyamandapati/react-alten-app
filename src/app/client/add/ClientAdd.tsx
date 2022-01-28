import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React,{PropsWithChildren,useState,useEffect,useCallback} from 'react';
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import FormLabel from "@material-ui/core/FormLabel";
import { TextField } from "formik-material-ui";
import { ENV } from "../../../constants";
import CommonService from "../../../helpers/common-service";
import "./ClientAdd.scss"
import InputAdornment from '@material-ui/core/InputAdornment';

const formValidation = Yup.object({
    name: Yup.string().min(4, "Invalid name").max(100, "Invalid name").test('alphabets', 'Name must only contain alphabets', (value: any) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }).required("Required")
})

export interface ClientAddProps {
    cancel: () => void,
    confirm: () => void,
}

const ClientAdd = (props: PropsWithChildren<ClientAddProps>) => {

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
        formData.append('logo', payload.logo);
        console.log(formData);
        console.log(formData.get("name"))
        CommonService._api.post(ENV.API_URL + '/client', formData, {
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
        <div className={"Client-add"}>
            <DialogTitle id="alert-dialog-title">{('Add Client Details')}</DialogTitle>
            <Formik initialValues={{  name: '', image: "" }} validateOnChange={true}
                    validationSchema={formValidation} onSubmit={onAdd}>
                {({ isSubmitting, isValid,resetForm }) => (<Form className={'form-holder'}>
                    <DialogContent>
                        <div className="form-field">
                            <FormLabel className={'form-label'}>{('Client Name')}*</FormLabel>
                            <Field name='name' type={'text'} component={TextField} variant={"outlined"} id="input_user_add_full_name"
                                   color={"primary"} className="search-cursor"   inputProps={{maxLength :100}}
                                   placeholder={'Enter Client Name'} autoComplete="off"/>
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
                            {('ADD Client')}
                        </Button>
                    </DialogActions>
                </Form>)}
            </Formik>
        </div>
    )
};


export default ClientAdd;
