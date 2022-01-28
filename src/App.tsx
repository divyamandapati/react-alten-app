import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Communications, localStore} from "./helpers";
import { loginUser} from "./store/actions/auth.action";
import {ToastContainer} from "react-toastify";

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmComponent from "./components/core/ConfirmComponent";

// @ts-ignore
import packageData from '../package.json';
import MainRouter from './navigation/navigator';


const APP_VERSION = packageData.version;

const App = () => {
    const dispatch = useDispatch();
    const [isPageLoading, setIsPageLoading] = useState(false);
    useEffect(() => {
        let user = null;
        const userString = localStore.getItem('currentUser');
        if (userString) {
            try {
                user = JSON.parse(userString);
            } catch (e) {
                user = null;
            }
        }
        const token = localStore.getItem('token');
        if (token) {
            dispatch(loginUser(user, token));
        }
    }, [dispatch])

    useEffect(() => {
        const pageLoadingSub = Communications.PageLoadingStateSubject.subscribe(isPageLoading => {
            setIsPageLoading(isPageLoading);
        })
        return () => {
            pageLoadingSub.unsubscribe();
        }
    }, []);

    return (
        <div className="App">
            <ConfirmComponent/>
            <ToastContainer position={"top-right"} newestOnTop={true}/>
            {isPageLoading && <div className="page-loading"/>}
            <MainRouter/>
            <div className={'app_version_wrapper'}>v{APP_VERSION}</div>
        </div>
    );
}

export default App;
