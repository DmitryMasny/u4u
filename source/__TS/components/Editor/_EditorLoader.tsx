// @ts-ignore
import React, { memo } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';

import { fullscreenLoaderSelector } from './_selectors';

/** interface */
interface Props {
    overlay?: boolean   //Загрузчик будет полупрозрачный поверх редактора, если true
    show?: boolean      //Загрузчик будет показан, если true, независимо от redux state
}

/** Styles */
const EditorLoaderWrap = styled('div')`
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: ${COLORS.LAVENDERMIST};
        transition: opacity .2s ease-in-out;
        opacity: ${({overlay, show}: Props)=>show ? (overlay ? 0.8 : 1) : 0};
        z-index: 999;
        ${({show}: Props) => !show && 'pointer-events: none'}
`;

const EditorLoader: React.FC<Props> = ( { show = false, overlay = false } ) => {
    const fullscreenLoader: boolean = useSelector( fullscreenLoaderSelector );

    return <EditorLoaderWrap overlay={overlay} show={show || fullscreenLoader}>
                <Spinner/>
                {/*<div>{ fullscreenLoader || 'Загрузка редактора' }</div>*/}
           </EditorLoaderWrap>;
};
export default memo( EditorLoader );