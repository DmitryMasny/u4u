import React, {useEffect, useContext, useState, useRef, memo} from 'react';
import styled, {css} from 'styled-components';
import Draggable, {DraggableCore} from 'react-draggable';

import { NavLink } from 'react-router-dom'
import LINKS_MAIN from "config/links";
import { NAV } from "const/help";

import {useSelector} from "react-redux";
import {modalProductPhotoQuality} from 'selectors/modals'
import {ModalContext} from "components/Modal";
import {TYPES} from "const/types";
import {IconMove} from 'components/Icons';
import {COLORS} from "const/styles";
import {windowWidthSelector} from "components/_editor/_selectors";

/** Styles **/
const QualityPreviewBlock = styled.div`
    position: relative;
    overflow: hidden;
    margin-bottom: 15px;
    .page {
        position: absolute;    
        overflow: hidden;
        cursor: move;
        cursor: -webkit-grab;
    }
    .image {
        position: absolute;
        img{
            width: 100%;
            -webkit-user-drag: none;
            //image-rendering: pixelated;
        }
    }

    .dragIcon {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0;
        transition: opacity .1s ease-out;
        pointer-events: none;
        fill: #fff;
    }
    &:hover .dragIcon{
        opacity: .6;
    }
    &:active .dragIcon{
        opacity: 0;
    }
    &:active .page{
        cursor: -webkit-grabbing;
    }

    ${({previewSize, preview})=>css`
        width: 100%;
        height: ${previewSize[1]}px;
        .page {
            width: ${preview.pageW}%;
            height: ${preview.pageH}%;
        }
        .image {
            width: ${preview.imageW}%;
            height: ${preview.imageH}%;
            left: ${preview.imageX}%;
            top: ${preview.imageY}%;
        }
    `}
`;

const DangerText =  styled.p`
        color: ${COLORS.TEXT_DANGER};
`;

const ProductPhotoQuality = () => {

    const modalSelector = useSelector(modalProductPhotoQuality);
    const windowWidth = useSelector(windowWidthSelector);

    const {setModal, closeModal} = useContext(ModalContext);

    const [preview, setPreview] = useState({pageW: 100, pageH: 100});
    const [previewSize, setPreviewSize] = useState([400, 300]);
    const previewBlockRef = useRef(null);

    useEffect(() => {

        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                // {type: TYPES.BTN, text: 'Изменить настройки формата', action: openConfigAction, primary: true},
                {type: TYPES.BTN, text: 'Закрыть', action: closeModal},
                {type: TYPES.DIVIDER},

            ]
        });

    }, []);

    useEffect(() => {
        if (previewBlockRef.current) {
            const previewWidth = previewBlockRef.current.offsetWidth || 400;
            setPreviewSize([previewWidth, Math.min(Math.round(previewWidth*0.68),400)]);
        }
    }, [windowWidth, previewBlockRef]);

    useEffect(() => {
        if (modalSelector) {
            console.log('window.devicePixelRatio',window.devicePixelRatio);
            const devicePixelRatio = window.devicePixelRatio || 1;
            const previewW_mm = previewSize[0]/96*25.4 / devicePixelRatio,
                previewH_mm = previewSize[1]/96*25.4 / devicePixelRatio,
                pageImageAspect = modalSelector.content.w / modalSelector.pageW;
            const pageW_px = previewSize[0] / previewW_mm * modalSelector.pageW;
            const pageH_px = previewSize[1] / previewH_mm * modalSelector.pageH;

            const bounds = {
                left: previewSize[0] - pageW_px,
                right:  0,
                top: previewSize[1] - pageH_px,
                bottom: 0
            };
            setPreview({
                previewW_mm: previewW_mm,
                previewH_mm: previewH_mm,
                pageW: modalSelector.pageW/previewW_mm*100,
                pageH: modalSelector.pageH/previewH_mm*100,
                imageW: pageImageAspect * 100,
                imageH: modalSelector.content.h / modalSelector.pageH * 100,
                imageX: modalSelector.content.x / modalSelector.pageW * 100,
                imageY: modalSelector.content.y / modalSelector.pageH * 100,
                bounds: bounds
            });

        }
    }, [modalSelector, previewSize]);

    if (!preview || !modalSelector) return null;

    return <div>

        <QualityPreviewBlock previewSize={previewSize} preview={preview} ref={previewBlockRef}>
            <Draggable
                disabled={modalSelector.pageW <= preview.previewW_mm}
                bounds={preview.bounds}
            >
                <div className="page">
                    <div className="image">
                        <img src={modalSelector.content.orig}/>
                    </div>
                </div>
            </Draggable>

            <div className="dragIcon"><IconMove size={48}/></div>

        </QualityPreviewBlock>
        <DangerText>
            Ваша фотография недостаточного разрешения, это отрицательно отразится на качестве печати.
        </DangerText>
        <p>
            В этом окне демонстрируется реальный масштаб фотографии, для оценки ожидаемого результата. Но не отражает абсолютного сходства с печатью.
        </p>
        <p>
            <NavLink target="_blank" to={LINKS_MAIN.HELP.replace( /:tab/, NAV.POSTER_EDITOR) }>
                Подробнее о позиционировании фотографии и недостаточном качестве
            </NavLink>
        </p>
    </div>;
};

export default memo(ProductPhotoQuality);