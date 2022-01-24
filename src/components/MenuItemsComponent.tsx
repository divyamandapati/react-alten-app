import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { SUPER_ADMIN, CLINIC_ADMIN, DOCTOR, TEAM_MEMBER, HOSPITAL_VIEW } from '../helpers/common-service';
import AccessControlComponent from './core/AccessControl';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewModuleOutlinedIcon from '@material-ui/icons/ViewModuleOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import HomeIcon from '@material-ui/icons/Home';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import GroupIcon from '@material-ui/icons/Group';
import EventNoteIcon from '@material-ui/icons/EventNote';
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewListOutlinedIcon from '@material-ui/icons/ViewListOutlined';
import { useTranslation } from 'react-i18next';

export interface Menu {
    state: string;
    name: string;
    type: string;
    outlineIcon: any;
    filledIcon: any;
    id:any;
    allowed_roles: ('admin' | 'hospital_admin' | 'doctor' | 'team_member' | 'hospital_view')[];
}

export const MENUITEMS: Menu[] = [
    {
        state: '/users/list',
        name: 'Users',
        type: 'link',
        outlineIcon: <GroupOutlinedIcon />,
        filledIcon: <GroupIcon />,
        id:"users",
        allowed_roles: [ SUPER_ADMIN, TEAM_MEMBER ]
    },
    {
        state: '/client/list',
        name: 'Client',
        type: 'link',
        outlineIcon: <GroupOutlinedIcon />,
        filledIcon: <GroupIcon />,
        id:"users",
        allowed_roles: [ SUPER_ADMIN, TEAM_MEMBER ]
    },
];
const MenuItemsComponent = (props: any) => {
    const {t}=useTranslation()
    return (
        <List>
            {MENUITEMS &&
                MENUITEMS.length > 0 &&
                MENUITEMS.map((item, index) => {
                    return (
                        <AccessControlComponent key={index + '-menu-item'} role={item.allowed_roles}>
                            <ListItem button component={NavLink} to={item.state} id={"menu_"+item.id}>
                                <ListItemIcon className={'inactive-icon'}>{item.filledIcon}</ListItemIcon>
                                <ListItemIcon className={'active-icon'}>{item.outlineIcon}</ListItemIcon>
                                <ListItemText primary={t(item.name)} />
                            </ListItem>
                        </AccessControlComponent>
                    );
                })}
        </List>
    );
};

export default MenuItemsComponent;
