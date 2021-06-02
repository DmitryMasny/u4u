import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'
import {COLORS} from 'const/styles'

import EditorLoader from './EditorLoader';
import EditorHeader from './EditorHeader';
import EditorLibrary from './EditorLibrary';
import EditorPages from './EditorPages';
import EditorView from './EditorView';
import EditorActions from './EditorActions';
import EditorNavbar from './EditorNavbar';
import EditorMenu from './EditorMenu';
import {windowIsMobileSelector, windowMediaSelector, windowHeightSelector } from "./_selectors";
import {PageInner} from "../Page";


/** Styles */
const EditorMainWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-direction: ${({isMobile})=>isMobile ? 'column':'row'};
    height: ${({isMobile, height})=>(isMobile && height) ? `${height}px`:'100vh'};
    width: 100%;
    transform: translateZ(0);
    overflow: hidden;
    background: ${COLORS.LAVENDERMIST}
`;
const EditorViewWrap = styled.div`
    position: relative;
    flex-grow: 1;
`;



/**
 * Редактор
 */
const Editor = (props) => {
    const [isLoaded, setIsLoaded] = useState(null);
    const isMobile = useSelector( state => windowIsMobileSelector( state ) );
    const windowMedia = useSelector( state => windowMediaSelector( state ) );
    const windowHeight = useSelector( state => windowHeightSelector( state ) );

    useEffect(() => {
        const loadTimeout = setTimeout( () => setIsLoaded( true ), 100 );

        document.ontouchmove = event => event.preventDefault();

        return ()=>{
            clearTimeout( loadTimeout );
        }
    },[]);

    if ( isLoaded === null || windowMedia === null ) {
        return <EditorLoader/>;
    }

    return isLoaded ?
        isMobile ?
            <EditorMainWrap isMobile={isMobile} height={windowHeight}>
                <EditorHeader/>
                <EditorViewWrap>
                    <EditorPages/>
                    <EditorView/>
                </EditorViewWrap>
                <EditorLibrary/>
                <EditorActions/>
                <EditorNavbar/>
            </EditorMainWrap>
            :
            <EditorMainWrap>
                <EditorHeader/>
                <EditorActions/>
                <EditorLibrary/>
                <EditorViewWrap>
                    <EditorView/>
                    <EditorPages/>
                </EditorViewWrap>
            </EditorMainWrap>
        :
        <EditorLoader status={'data-load'}/>;
};

export default Editor;