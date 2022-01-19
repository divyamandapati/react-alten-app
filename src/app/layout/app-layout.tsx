import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { ImageConfig } from '../../constants';
import { Link } from 'react-router-dom';
import './app-layout.scss';
import { ENV } from '../../constants';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/actions/auth.action';
import { setTempRole, setTempId } from '../../store/actions/others.action';
import MenuItemsComponent from '../../components/MenuItemsComponent';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import Communications from '../../helpers/communications-service';
import CommonService from '../../helpers/common-service';
import { useSelector } from 'react-redux';
import { StateParams } from '../../store/reducers';
import { loginUser } from '../../store/actions/auth.action';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export interface AppLayoutProps { }
const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
        // Render a complete state
        return (
            <div>
                <p>meeting has started</p>
            </div>
        );
    } else {
        // Render a countdown
        return (
            <>
                <p className="timings">Meeting starts in </p>
                <p className="timings">{minutes} mins:&nbsp;{seconds} &nbsp;sec</p>
            </>

        );
    }
};

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0
        },
        drawerPaper: {
            width: drawerWidth
        },
        drawerContainer: {
            overflow: 'auto'
        },
        content: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2)
        },
        button: {
            display: 'block',
            marginTop: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 80,
        },
        underline: {
            "&&&:before": {
                borderBottom: "none"
            },
            "&&:after": {
                borderBottom: "none"
            }
        }
    })
);

const AppLayout = (props: PropsWithChildren<AppLayoutProps>) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const { user } = useSelector((state: StateParams) => state.auth);
    const { other } = useSelector((state: StateParams) => state);
    const [pageTitle, setPageTitle] = useState<string | null>(null);
    const [pageBackButtonLink, setPageBackButtonLink] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(matches);
    const { t } = useTranslation()
    let d = new Date();
    const history = useHistory();
    const toggleDrawer = () => {
        setIsDrawerOpen((s) => !s);
    };
    useEffect(
        () => {
            setIsDrawerOpen(matches);
        },
        [matches]
    );

    useEffect(() => {
        const pageTitleSubscription = Communications.pageTitleSubject.subscribe((title) => {
            setPageTitle(title);
        });
        const pageBackButtonSubscription = Communications.pageBackButtonSubject.subscribe((buttonLink) => {
            setPageBackButtonLink(buttonLink || null);
        });


        return () => {
            pageTitleSubscription.unsubscribe();
            pageBackButtonSubscription.unsubscribe();
        };
    }, []);
    const classes = useStyles();
    const logout = () => {
        dispatch(setTempRole(undefined));
        dispatch(setTempId(''));
        dispatch(logoutUser());
        history.push("/login")
        // return <Redirect to={'/login'} />;
    };
    return (
        <div className={classes.root + ' app-layout'}>
            <CssBaseline />
            <AppBar position="fixed" color={'inherit'} variant={'elevation'} elevation={1} className={classes.appBar}>
                <Toolbar>
                    <div className="brand">
                        <IconButton
                            onClick={toggleDrawer}
                            edge="start"
                            className={'menuButton'}
                            color="inherit"
                            aria-label="menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Link to={'/'}>
                            {
                                user?.role !== "admin" && other?.image_url ? <div className={'no-repeat-background hospital-logo'} style={{ objectFit: "fill", backgroundImage: 'url(' + other?.image_url + ')' }} ></div> : <img src={ImageConfig.logo} alt={''} />
                            }
                        </Link>
                    </div>
                    <div className="back-title-holder">
                        {pageBackButtonLink && (
                            <IconButton color={'primary'} component={Link} to={pageBackButtonLink} id="link_back_arrow">
                                <ArrowBackOutlined />
                            </IconButton>
                        )}
                        {pageTitle && <div className={pageBackButtonLink ? "page-title-text" : "page-title-text mrg-left-30"}>&nbsp;{pageTitle}</div>}
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer + (isDrawerOpen ? ' drawerOpened ' : ' drawerClosed ')}
                variant={'permanent'}
                classes={{
                    paper: classes.drawerPaper
                }}
                onClose={console.log}
                open={isDrawerOpen}
            >
                <Toolbar />
                <div className={"drawerContainer"}>
                    <MenuItemsComponent />
                    <div className="powered-by-holder">
                        <div className="logout-wrapper">
                            <Button variant="contained" onClick={logout} id="btn_logout">
                                <img src={ImageConfig.Logout_logo} alt="" />
                                &nbsp;{t('Logout')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                <div className="page-container">{props.children}</div>
            </main>
        </div>
    );
};

export default AppLayout;
