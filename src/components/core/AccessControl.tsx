import React, {PropsWithChildren} from 'react';
import {useSelector} from "react-redux";
import {StateParams} from "../../store/reducers";

export interface AccessControlComponentProps {
    role: ('admin' | 'hospital_admin' | 'doctor' | 'team_member' | 'hospital_view')[],
}

const AccessControlComponent = (props: PropsWithChildren<AccessControlComponentProps>) => {
    const {user,view} = useSelector((state: StateParams) => state.auth);
    const {other}:any = useSelector((state: StateParams) => state)

    if(other.roleAccess===undefined){
    }else{
        user.role=other.roleAccess
    }
    if(view==="VIEW AS DOCTOR" && user.role==="doctor" && user.is_admin===true ){
        user.role='doctor'
    }else if(view && user.role==="doctor" && user.is_admin===true){
        user.role='hospital_admin'
    }
   
    return (
        <>
            {user && props.role.indexOf(user.role) > -1 && props.children}
        </>
    )
};

export default AccessControlComponent;
