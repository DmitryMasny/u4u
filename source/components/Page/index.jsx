import React from 'react';
//import s from './page.scss';
import styled, { css } from 'styled-components';


const PageDiv = styled('div')`
    flex: 1 0 auto;
    background-color: #ffffff;//$main-page-bg;
    //background-color: #dde5ef;//$main-page-bg;
    @media only screen and (max-width: 577px) { //$media-xs
        min-height: calc(100vh - 100px);
        padding-bottom: 20px;
    }
`;
export const PageInnerDiv = styled('div')`
    position: relative;
    max-width: 1280px; //$media-lg + $main-grid-padding * 2  (1240+10*2*2);
    height: auto;
    width: 100%;
    margin: 0 auto;
    padding: 20px;// $main-grid-padding (10*2);
    @media only screen and (max-width: 577px) { //$media-xs
        padding: 10px 20px; //$main-padding $main-grid-padding;
    }
`;
const WrapperDiv = styled('div')`
    position: relative;
    max-width: 1052px; //$media-md + $main-margin*2;
    margin: 0 auto;
    padding: 20px;//$main-grid-padding;
    flex-grow: 1;
    @media only screen and (max-width: 577px) { //$media-xs
        padding: 10px 0; //$main-padding 0
    }
`;
const PageTitleDiv = styled('div')`
    display: inline-block;
    margin-bottom: 15px;
    margin-right: 30px;
    ${( { center } ) => center && css`
        text-align: center;
        width: 100%;
        margin-right: 0;            
    `}
`;
const PageH = styled('h1')`
    display: inline;
    //font-weight: 200;
    font-size: 28px;
    text-transform: uppercase;
    //border-bottom: 1px solid $color-text;
    @media only screen and (max-width: 577px) { //$media-xs
        font-size: 21px;
        line-height: 28px;
    }
`

export const Page = React.forwardRef(( { children, className, id }, ref ) => {
    return <PageDiv id={id} ref={ref}>{children}</PageDiv>;
    /*
    let thisClass = s.page;
    className && (thisClass += ` ${className}`);
    return (
        <div className={thisClass} id={id} ref={ref}>
            {children}
        </div>);
     */
});

export const PageInner = ( { children, className, id } ) => {
    return <PageInnerDiv id={id}>{children}</PageInnerDiv>
    /*
    let thisClass = s.pageInner;
    className && (thisClass += ` ${className}`);
    return (
        <div className={thisClass} id={id}>
            {children}
        </div>);
     */
};

export const Wrapper = ( { children, className, id } ) => {
    return <WrapperDiv id={id}>{children}</WrapperDiv>
    /*
    let thisClass = s.wrapper;
    className && (thisClass += ` $ {className}`);
    return (
        <div className={thisClass} id={id}>
            {children}
        </div>);
     */
};

export const PageTitle = ( { children, className, center, h2 = false, h3 = false  } ) => {
    return <PageTitleDiv center={center}>
                <PageH as={h2 && 'h2' || h3 && 'h3' || 'h1'}>{children}</PageH>
           </PageTitleDiv>
    /*
    let thisClass = s.pageTitle;
    className && (thisClass += ` ${className}`);
    center && (thisClass += ` ${s.center}`);
    return (
        <div className={thisClass}>
            {!h2 && !h3 && <h1 className={s.pageTitleH}>{children}</h1>}
            {h2 && <h2 className={s.pageTitleH}>{children}</h2>}
            {h3 && <h3 className={s.pageTitleH}>{children}</h3>}
        </div>);
     */
};

export default Page;