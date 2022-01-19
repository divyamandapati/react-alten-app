import React from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import './LoginScreen.scss';
import { Link } from 'react-router-dom';
import FormLabel from '@material-ui/core/FormLabel';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { ENV } from '../../../constants';
import IconButton from '@material-ui/core/IconButton';
import CommonService from '../../../helpers/common-service';
import { loginUser } from '../../../store/actions/auth.action';
import { setImageUrl } from '../../../store/actions/others.action';
const isPhone = new RegExp('(^[6789][0-9]{9})');

const loginFormValidation = Yup.object({
    password: Yup.string().required('Required')
});

const LoginScreen = (props: any) => {
    const dispatch = useDispatch();
    const [ values, setValues ] = React.useState({
        showPassword: false
    });
    const onLogin = (payload: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
        payload={
            ...payload,
            username:payload?.username.trim()
        }
        CommonService._api
            .post(ENV.API_URL + '/login', payload)
            .then((resp) => {
                setSubmitting(false);
                dispatch(loginUser(resp.data.user, resp.data.token));
                dispatch(setImageUrl(resp.data.user.logo));
            })
            .catch((err) => {
                CommonService.handleErrors(setErrors, err);
                // console.log(err);
               // CommonService.showToast(err.error || 'Error', 'error');
                setSubmitting(false);
            });
    };
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    return (
        <div className="main-auth-wrapper login-screen screen">
            <div className="auth-header">LOGIN</div>
            <Formik
                initialValues={{ username: '', password: '' }}
                validateOnChange={true}
                validate={(values) => {
                    const errors: { username?: string; password?: string } = {};
                    if (!values.username) {
                        errors.username = 'Required';
                    } else {
                        try {
                            const username = Number(values.username);
                            if (isNaN(username)) {
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.username)) {
                                    errors.username = 'Invalid email address';
                                }
                            } else if (!isPhone.test(username.toString())) {
                                errors.username = 'Invalid phone number';
                            }
                        } catch (e) {}
                    }
                    return errors;
                }}
                validationSchema={loginFormValidation}
                onSubmit={onLogin}
            >
                {({ isSubmitting, isValid }) => (
                    <Form className={'loginFormHolder form-holder'}>
                        <div className="form-field">
                            <FormLabel className={'form-label'}>Email ID / Phone Number</FormLabel>
                            <Field
                                name="username"
                                type={'text'}
                                component={TextField}
                                size={'small'}
                                variant={'outlined'}
                                id={"login_email_phone"}
                                color={'primary'}
                                placeholder={'Enter Email Id/Phone Number'}
                                className="input-cursor"
                            />
                        </div>
                        <div className="form-field position-relative">
                            <FormLabel className={'form-label'}>Password</FormLabel>
                            <Field
                                name={'password'}
                                component={TextField}
                                type={values.showPassword ? 'text' : 'password'}
                                placeholder={'Enter the Password'}
                                max={16}
                                id={"login_password"}
                                variant={'outlined'}
                                color={'primary'}
                                className="input-cursor"
                            />
                            <div className={'eye_btn_wrapper'}>
                                <IconButton
                                    size={'small'}
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    id="login_password_show_hide_btn"
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? 'Hide' : 'Show'}
                                </IconButton>
                            </div>
                        </div>

                        <div className="form-field">
                            <Button
                                disabled={isSubmitting || !isValid}
                               color="secondary"
                                variant={'contained'}
                                id="login_button"
                                type={'submit'}
                                size={'medium'}
                                className={'login-button'}
                            >
                                Login
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginScreen;
