import React, { PropsWithChildren } from 'react';
import './auth-layout.scss';
import { ImageConfig } from '../../constants';

export interface AuthLayoutProps {}

const AuthLayout = (props: PropsWithChildren<AuthLayoutProps>) => {
    return (
        <div className={'auth-layout'}>
            <div className="container auth-layout-wrapper position-realtive">
                <div className="auth-layout-card">
                    <div className="main-auth-holder">
                        {/* <div className="logo">
                            <img src={ImageConfig.logo} alt={''} />
                        </div> */}
                        {props.children}
                    </div>
                    {/*<div className="powered-by-wrapper">*/}
                    {/*    <div>Powered by:&nbsp;&nbsp;<img src={ImageConfig.logo} alt={''} height="20"/></div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
