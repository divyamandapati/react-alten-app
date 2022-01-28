import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { SUPER_ADMIN, CLINIC_ADMIN, DOCTOR, TEAM_MEMBER, HOSPITAL_VIEW } from '../helpers/common-service';
import AccessControlComponent from './core/AccessControl';
import GroupIcon from '@material-ui/icons/Group';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import { useTranslation } from 'react-i18next';

export interface Menu {
    state: string;
    name: string;
    type: string;
    outlineIcon: any;
    filledIcon: any;
    id:any;
    allowed_roles: ('admin')[];
}

export const MENUITEMS: Menu[] = [
    {
        state: '/users/list',
        name: 'Users',
        type: 'link',
        outlineIcon: <GroupOutlinedIcon />,
        filledIcon: <GroupIcon />,
        id:"users",
        allowed_roles: [ SUPER_ADMIN ]
    },
    {
        state: '/client/list',
        name: 'Client',
        type: 'link',
        outlineIcon: <GroupOutlinedIcon />,
        filledIcon: <GroupIcon />,
        id:"client",
        allowed_roles: [ SUPER_ADMIN]
    },
    {
        state: '/profile',
        name: 'Profile',
        type: 'link',
        outlineIcon: <GroupOutlinedIcon />,
        filledIcon: <GroupIcon />,
        id:"profile",
        allowed_roles: [ SUPER_ADMIN]
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
