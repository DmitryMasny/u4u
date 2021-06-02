import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import store from 'libs/reduxStore';

import { StaticRouter, Switch, Route } from 'react-router-dom';

//import s from 'scss/common.scss';
import { ROUTE_COMPONENTS_LINKS } from 'config/routesServer';

import styled, { createGlobalStyle } from 'styled-components';

//компоненты
import InitHOC from 'hoc/Init';
//import LocationViewerHOC from 'hoc/LocationViewer';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ErrorBoundary from 'components/App/ErrorBoundary';
//import ModalManager from 'components/ModalManager';
//import Breadcrumbs from 'components/Breadcrumbs';
//import FullScreenLoader from 'components/FullScreenLoader';
import SEOblock from 'components/SEO';
//import Analytics from 'components/Analytics';

//const PageMaintenance = lazy( () => import('pages/PageMaintenance') );

//function getRandomInt( max ) {
//    return Math.floor(Math.random() * Math.floor(max));
//}

//const scriptJs = '<script type="text/javascript" src="/js_spa/start.js?v=' + getRandomInt( 1000000 ) + '></script>';

const GlobalStyle = createGlobalStyle`
    body {
        height: 100%;
        background: #fff;
        color: #3d4c62;
        fill: #3d4c62;
        font-family: 'Gilroy',-apple-system,'Helvetica Neue',sans-serif;
        font-size: 16px;
        line-height: 1.2;
        cursor: default;
        overflow: hidden;
        font-weight: 400;
        -webkit-user-drag: none;
    }
  
    // Колонна с ограничением по ширине, используется,
    // если нам не надо растягивать содержимое на весь широкий экран
    .section {
        position: relative;
        max-width: (1240 + 10 * 2 * 2);
        padding: 0 (10 * 2);
        height: auto;
        width: 100%;
        margin: 0 auto;
    }
    a {
        color: #137ed5;
        text-decoration: none;
        cursor: pointer;
        transition: color .1s ease-out;
        &:hover {
            color: #137ed5;
            text-decoration: none;
        }
    }    
`;
const MainWrap = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;     
`;
const GrayScale = styled( 'div' )`
    filter: grayscale(100%);
`;
const LoadingMessage = styled('div')`    
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    //bottom: 0;
    z-index: 100000;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    background: rgba(255,255,255,1);
`;
const LoadingMessageBg = styled('span')`
  display: flex;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #777;
`;

const linksForRoute = ROUTE_COMPONENTS_LINKS.map( ( route, key ) => {
    //console.log( 'route.path', route.path, 'props.path', props.path, '===', route.path === props.path, route.component );
    if ( !route.component ) return null;
    //console.log( 'route', route.path, route.component );
    return <Route path={route.path}
                  exact={route.exact}
                  component={() => route.component}
                  key={key} />
} );

const AppServerRender = props => {
    console.log( 'РЕНДЕР СЕРВЕР! props', props.pathUrl );
    return (
    <Fragment>
        <GlobalStyle />
        <Provider store={store}>
            <GrayScale>
                <StaticRouter location={props.pathUrl}>
                    <MainWrap id='main-wrap'>
                        <Header/>
                        <Switch>
                            {linksForRoute}
                            {/*<Route path="*" component={() => <PageMaintenance/>}/>  /!* Технические работы *!/*/}
                        </Switch>
                        <SEOblock/>
                        <Footer/>
                    </MainWrap>
                </StaticRouter>
                <LoadingMessage>
                    <LoadingMessageBg>Загрузка...</LoadingMessageBg>
                </LoadingMessage>
            </GrayScale>
        </Provider>
        <script type="text/javascript" src="/js_spa/start.js" />
    </Fragment>);
};

export default AppServerRender;

export { store }