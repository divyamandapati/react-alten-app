import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import NotFoundComponent from '../components/NotFoundComponent';
import AppLayout from '../app/layout/app-layout';
import AuthLayout from '../app/layout/auth-layout';
import LoginScreen from '../app/auth/login/LoginScreen';
import { useDispatch, useSelector } from 'react-redux';
import { StateParams } from '../store/reducers';
import CommonService from '../helpers/common-service';
import { Communications } from '../helpers';
import { logoutUser } from '../store/actions/auth.action';
import UsersListScreen from '../app/users/list/UsersListScreen';
import ClientList from "../app/client/list/ClientList";
// @ts-ignore
const AuthLayoutRoute = ({ component: Component, ...rest }) => {
    let doneUrl = '/users/list';
    const { token } = useSelector((state: StateParams) => state.auth);
    // const {user} = useSelector((state: StateParams) => state.auth);
    if (!!token) {
        const query = CommonService.parseQueryString(rest.location.search);
        // console.log('AuthLayoutRoute', query);
        if (query.hasOwnProperty('done')) {
            doneUrl = query.done;
        }
        return <Redirect to={doneUrl} />;
    }
    return (
        <Route
            {...rest}
            render={(matchProps) => (
                <AuthLayout>
                    <Component {...matchProps} />
                </AuthLayout>
            )}
        />
    );
};

// @ts-ignore
const AppLayoutRoute = ({ component: Component, ...rest }) => {
    // const query = new URLSearchParams(rest.location.search);
    // console.log(rest, 'AppLayoutRoute');
    // console.log(query);
    const { token } = useSelector((state: StateParams) => state.auth);
    if (!!token) {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <AppLayout>
                        <Component {...matchProps} />
                    </AppLayout>
                )}
            />
        );
    }
    return <Redirect to={'/login?done=' + encodeURIComponent(rest.location.pathname)} />;
};

const MainRouter = () => {
    return (
        <BrowserRouter>
            <Navigator />
        </BrowserRouter>
    );
};
const Navigator = (props: any) => {
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(
        () => {
            const reloadSubjectSub = Communications.ReloadStateSubject.subscribe(() => {
                history.push('/users/list');
            });
            const logoutSubject = Communications.logoutSubject.subscribe(() => {
                //         dispatch(setTempRole(undefined));
                // dispatch(setTempId(''));
                dispatch(logoutUser());
                history.push('/login');
            });
            return () => {
                reloadSubjectSub.unsubscribe();
                logoutSubject.unsubscribe();
            };
        },
        [dispatch, history]
    );
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to={'/users/list'} />
            </Route>

            <AuthLayoutRoute path="/login" component={LoginScreen} />
            <AppLayoutRoute path="/users/list" component={UsersListScreen} />
            <AppLayoutRoute path="/client/list" component={ClientList} />
            <Route path="/not-found">
                <NotFoundComponent />
            </Route>
            <Route path="*">
                <Redirect to={'/not-found'} />
            </Route>
        </Switch>
    );
};

export default MainRouter;
