import React from 'react';
import { useSelector } from 'react-redux';
import { FullScreenLoaderSelector } from './selectors';

import styled from 'styled-components'
import Spinner from 'components/Spinner';
import {hexToRgbA} from "libs/helpers";
import {COLORS} from "const/styles";

export const Overlay = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    background-color: ${hexToRgbA(COLORS.WHITE, .8)};
    transition: opacity .25s ease-in-out;
    overflow: hidden;
    opacity: ${({isOpen})=>isOpen ? 1 : 0};
    pointer-events: ${({isOpen})=>isOpen ? 'auto' : 'none'};
`;

export const Center = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FullScreenLoader = () => {
    const isOpen = useSelector( (state) => FullScreenLoaderSelector( state ));
    return (isOpen ?
        <Overlay isOpen={isOpen}>
            <Center>
                <Spinner delay={0} fill/>
            </Center>
        </Overlay> : null
    )};

export default FullScreenLoader;