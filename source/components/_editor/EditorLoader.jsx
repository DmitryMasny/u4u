import React, { useState, useEffect } from 'react';
import Spinner from 'components/Spinner';
import styled from 'styled-components'
import {COLORS} from 'const/styles'

/** Styles */
const EditorLoaderWrap = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        background-color: ${COLORS.LAVENDERMIST};
`;



const EditorLoader = ({status}) => {
    let statusText = 'Загрузка редактора';
    if (status) {
        switch (status) {
            case 'data-load':
                statusText = 'Получение данных'
        }
    }
    return <EditorLoaderWrap>
            <Spinner/>
        <div>{statusText}</div>
    </EditorLoaderWrap>;
};
export default EditorLoader;