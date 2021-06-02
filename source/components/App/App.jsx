import React, { lazy, useEffect, Suspense, Fragment, useRef, forwardRef } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from 'libs/reduxStore';
import { createPortal } from "react-dom";
import { ThemeProvider } from 'styled-components'
//import LINKS from "config/links";

import { ToastProvider } from 'react-toast-notifications'

import { MEDIA } from 'const/styles';

import s from 'scss/common.scss';
import { ROUTE_COMPONENTS_LINKS } from 'config/routes';

import StackdriverErrorReporter from 'stackdriver-errors-js';
import { retry } from 'libs/helpers';

//компоненты
import InitHOC from 'hoc/Init';
import LocationViewerHOC from 'hoc/LocationViewer';
import ResizeHOC from 'hoc/Resize';
import WebSocket from 'hoc/WebSocket';
import PageLoader from 'components/PageLoader';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ErrorBoundary from 'components/App/ErrorBoundary';
import ModalManager from 'components/ModalManager';
import Breadcrumbs from 'components/Breadcrumbs';
import FullScreenLoader from 'components/FullScreenLoader';
import ToTopBtn from 'components/ToTopBtn';
import Analytics from 'components/Analytics';
import Jivosite from 'components/Jivosite';
import AdminBtn from 'components/AdminBtn';
//import {MY_PHOTOS_IFRAME} from 'const/myPhotos';
import HOCNeedFooterHeaderWrapper from './NeedFooterHeaderWrapper';

//import AlertMessage from 'components/Alert';

const Page404 = lazy( () => retry( () => import('pages/Page404') ) );
//const PageMaintenance = lazy( () => import('pages/PageMaintenance') );

const SpaTop = forwardRef( ( props, ref ) =>
               createPortal( <div id='spa-top' ref={ref}>{props.children}</div>, document.body ) );

const createRouteLinksArray = ROUTE_COMPONENTS_LINKS.map( ( route, key ) => {
                                    if ( !route.component ) return null;
                                    return <Route path={route.path}
                                                  exact={route.exact}
                                                  key={key}>
                                                {route.component}
                                           </Route>
                                });
const App = () => {
    const spaTopRef = useRef( null );
    window.__react_toast_provider = useRef( null );

    useEffect(()=>{
        if ( !process.env.server_render ) {
            const spa = document.querySelector('#spa');
            spa.removeAttribute( 'style' );
        }
    }, []);

    return <Fragment>
        <Provider store={store}>
            <WebSocket>
                <ThemeProvider theme={{media: MEDIA}}>
                    <ToastProvider autoDismiss={true} autoDismissTimeout={3000}  ref={window.__react_toast_provider}>
                    <ResizeHOC>
                        <InitHOC/>
                        <div className={s.mainWrap} id='main-wrap'>
                            <BrowserRouter>
                                <HOCNeedFooterHeaderWrapper>
                                    <SpaTop ref={spaTopRef}>
                                        <AdminBtn />
                                        <ToTopBtn />
                                        <Jivosite />
                                        <FullScreenLoader />
                                        <ModalManager/>
                                    </SpaTop>
                                    <ErrorBoundary>
                                        <Header spaTopRef={spaTopRef}/>
                                        <Breadcrumbs/>
                                        <Suspense fallback={<PageLoader/>}>
                                            <Switch>
                                                {/*<Route path="*" component={() => <PageMaintenance/>}/>  /!* Технические работы *!/*/}
                                                {createRouteLinksArray}
                                                <Route path="*">
                                                    <Page404 />
                                                </Route>
                                            </Switch>
                                        </Suspense>
                                        <Footer />
                                        <LocationViewerHOC />
                                    </ErrorBoundary>
                                </HOCNeedFooterHeaderWrapper>
                            </BrowserRouter>
                        </div>
                    </ResizeHOC>
                    </ToastProvider>
                </ThemeProvider>
            </WebSocket>
            <Analytics />
        </Provider>
        {/* headerFooterWrap && <Analytics/> */}
    </Fragment>
};


//Запускаем логирование ошибок если не localhost;
if ( location.hostname !== 'localhost' && location.hostname.slice( 0, 10 ) !== '192.168.88' ) {
    const errorHandler = new StackdriverErrorReporter();
    errorHandler.start({
        key: 'AIzaSyC5s0FNYoAEwRhyfsG4tpDahMp8zSUugks',
        projectId: 'u4u-project',
        service: 'front-end-spa',                   // (optional)
        version: location.hostname,                 // (optional)
        // reportUncaughtExceptions: false          // (optional) Set to false to stop reporting unhandled exceptions.
        // reportUnhandledPromiseRejections: false  // (optional) Set to false to stop reporting unhandled promise rejections.
        // disabled: true                           // (optional) Set to true to not report errors when calling report(), this can be used when developing locally.
        // context: {user: 'user1'}                 // (optional) You can set the user later using setUser()
    });
}
window.sendErrorLog = function ( errorName, errorData ) {

    //убираем отправку ошибок с localhost
    if (location.hostname === 'localhost' || !errorHandler) return;

    let errUser = null;

    if (window.localStorage.auth_token) {
        errUser = JSON.parse(window.atob(window.localStorage.authToken.split('.')[1]));
    }

    if (errUser) errorHandler.setUser(errUser.dev);
    errorHandler.report(JSON.stringify({
        url: location.href,
        errorName: errorName,
        errorData: errorData,
        user: errUser
    }));
};

export default App;
export { store }