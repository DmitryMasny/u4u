import React, {useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch} from "react-redux";
import styled from 'styled-components';
import Gesture from 'rc-gesture';


// @ts-ignore
import { hexToRgbA } from "libs/helpers";
import {COLORS} from 'const/styles';

import { IconChevronLeft, IconChevronRight, IconClose } from 'components/Icons';
import {Btn} from 'components/_forms';
import Spinner from 'components/Spinner';

import 'components/PreviewAlbum/preview.scss';
import prepareData from 'components/PreviewAlbum/prepareData';
import TurnJs from 'components/PreviewAlbum/turnjs';

import {modalSimplePreviewSelector} from 'selectors/modals';
import ProductPreview from "components/_pages/ProductPage/Product/ProductPreview";
import { modalSimplePreviewAction } from 'actions/modals';

import {
    getPreviewAlbumServerAction,
    previewAlbumInProgressSelector,
    previewAlbumSelector
} from "../PreviewAlbum/actions";
import {useKeyPress} from "libs/hooks";

/**
 * Styles
 */
const SimpleModal = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${hexToRgbA(COLORS.BLACK, .7)};
    backdrop-filter: blur(3px);
    transition: opacity .3s ease-out;
    user-select: none;
    z-index: 1;
    opacity: ${({isOpen})=>isOpen ? 1 : 0};
    .block {
        position: absolute;
        text-align: center;
        top: 70px;
        left: 30px;
        right: 30px;
        bottom: 80px;
        //pointer-events: none;
    }
    .header {
        position: absolute;
        display: flex;
        align-items: center;
        padding: 5px 20px;
        top: 0;
        right: 0;
        left:0;
        height: 68px;
        font-size: 21px;
        color: #fff;
        background-color: ${hexToRgbA(COLORS.BLACK, .5)};
    }
    
    .closeBtn {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        right: 0;
        fill: #fff;
        height: 68px;
        width: 68px;
        background-color: transparent;
        transition: background-color .2s ease-out;
        cursor: pointer;
        &:hover {
          background-color: ${hexToRgbA(COLORS.BLACK, .5)};
        }
    }
    .arrowBtn {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 70px;
        bottom: 80px;
        width: 50px;
        height: 200px;
        margin: auto;
        max-height: 60%;
        fill: ${COLORS.WHITE};
        background-color: ${hexToRgbA(COLORS.BLACK, .33)};
        opacity: .6;
        transition: opacity .2s ease-out;
        cursor: pointer;
        &:hover{
          opacity: .8;
        }
        &:active{
          opacity: 1;
        }
        &.prev {
            left: 0;
            border-radius: 0 50px 50px 0;
        }
        &.next {
            right: 0;
            border-radius: 50px 0 0 50px;
        }
    }
    .btnBlock {
        position: absolute;
        bottom: 15px;
        right: 10px;
        left: 10px;
        display: flex;
        justify-content: center;
        .btnBlockInner {
            display: flex;
            align-items: center;
            background-color: ${hexToRgbA(COLORS.BLACK, .5)};
            border-radius: 30px;
            height: 60px;
        }
        .btn {
            margin: 0 5px;
            height: 50px;
            border-radius: 25px;
            &.danger:hover {
                color: ${COLORS.TEXT_DANGER};
                background-color: #efd8dd;
            }
            &.warning:hover {
                color: ${COLORS.TEXT_WARNING};
                background-color: #efe3d8;
            }
            &:active {
                opacity: .95;
            }
        }
    }
`;


import { getLayoutByIdAction } from "__TS/actions/layout";

/**
 * Компонент модального окна предпросмотра альбома
 */
const SimplePreviewModal = (props) => {
    const modalSimplePreview = useSelector(modalSimplePreviewSelector);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState( false );
    const [currentIndex, setCurrentIndex] = useState( 0 );
    const [previewList, setPreviewList] = useState( [] );
    const [isNewProducts, setIsNewProducts] = useState( null );
    const [actions, setActions] = useState( null );
    const previewAlbum = useSelector( previewAlbumSelector );
    const previewAlbumInProgress = useSelector( previewAlbumInProgressSelector );
    const keyEscape = useKeyPress(27);
    const keyPrev = useKeyPress(37);
    const keyNext = useKeyPress(39);

    useEffect(() => {
        if (keyEscape && closeModal) closeModal();
    },[keyEscape]);

    useEffect(() => {
        setIsOpen(true);
    },[]);

    useEffect(() => {
        if (keyPrev) {
            goToPrev();
        } else if (keyNext) {
            goToNext();
        }
    },[keyPrev, keyNext]);

    useEffect(() => {
        const newProducts = modalSimplePreview.isNew || modalSimplePreview.isPoster || modalSimplePreview.isPhoto || modalSimplePreview.isCanvas;
        setIsNewProducts( newProducts );

        if ( !newProducts && modalSimplePreview.id ) {
            dispatch( getPreviewAlbumServerAction( modalSimplePreview.id ) );
        }
        if (modalSimplePreview && modalSimplePreview.actions) setActions(modalSimplePreview.actions);
    },[]);

    useEffect(() => {
        if ( modalSimplePreview ) {
            if ( modalSimplePreview && modalSimplePreview.svgPreview ) {
                if ( Array.isArray( modalSimplePreview.svgPreview ) ) {
                    setPreviewList( modalSimplePreview.svgPreview );
                } else setPreviewList( [ modalSimplePreview.svgPreview ] )
            }
            // Если стоит флаг getLayoutById, то запрашиваем по WS весь layout, чтобы показать в превью все страницы
            if ( modalSimplePreview.getLayoutById && modalSimplePreview.id ) {
                getLayoutByIdAction( { layoutId: modalSimplePreview.id, relatedObjects:[] } ).catch( err => {
                    console.error( 'Ошибка получения layout:', err );
                } ).then( result => {
                    console.log('result ', result);
                    setPreviewList(result.layout && result.layout.previewList || result.layout.preview && [result.layout.preview] || []);
                } );
            }
        }
    }, [modalSimplePreview && modalSimplePreview.svgPreview, modalSimplePreview && modalSimplePreview.getLayoutById] );


    const closeModal = (e) => {
        if (modalSimplePreview.onClose) modalSimplePreview.onClose();
        setIsOpen(false);
        setTimeout(()=>{
            dispatch(modalSimplePreviewAction());
        }, 300)
    };
    const modalActionHandler = ({action, close}) => {
        close && closeModal();
        action && action(modalSimplePreview.id);
    };
    const goTo = (index) => {
        if (previewList.length > 1 && (index || index === 0)) {
            if (index > (previewList.length - 1)) index = previewList.length - 1;
            if (index < 0) index = 0;
            setCurrentIndex(index);
        }
    };
    const goToPrev = () => goTo(currentIndex - 1);
    const goToNext = () => goTo(currentIndex + 1);


    const gestureControl = useCallback(( status, type ) => {
        switch ( type ) {
            case 'swipe':
                switch ( status ) {
                    case 4:
                        goToPrev();
                        break;
                    case 2:
                        goToNext();
                        break;
                }
                break;

            // case 'pan':
            //     break;
            //
            // case 'panEnd':
            //     break;
        }
    }, []);
// console.log('modalSimplePreview', modalSimplePreview);
    return modalSimplePreview &&
        <Gesture onSwipe={ ( status ) => gestureControl( status.direction, 'swipe' ) }
                 onPan={ ( status ) => {
                     gestureControl( status.moveStatus, 'pan' )
                 } }
                 onPanEnd={ ( status ) => {
                     gestureControl( status, 'panEnd' )
                 } }
                 direction="horizontal">
            <SimpleModal isOpen={isOpen}>
                { modalSimplePreview.name && <div className={ "header" }>
                    { modalSimplePreview.name }
                </div> }
                <div className="block">

                    {/*Если новые продукты (постер, холст) то новое  превью*/ }
                    { isNewProducts ?
                        (previewList.length ?
                            <ProductPreview
                                svg={ previewList[currentIndex] }
                                size={ { h: modalSimplePreview.format.h, w: modalSimplePreview.format.w } }
                                options={ modalSimplePreview }
                                productSlug={modalSimplePreview.productSlug || 'decor'}
                                inModal noShadow
                            />
                            : null)
                        :
                        !previewAlbumInProgress && previewAlbum
                            ?
                            <TurnJs layout={ prepareData( previewAlbum ) }/>
                            :
                            <Spinner size={ 90 } fill/> }
                </div>
                <div className={ "closeBtn" } onClick={ closeModal }>
                    <IconClose size={ 48 }/>
                </div>
                { currentIndex > 0 && <div className={ "arrowBtn prev" } onClick={ goToPrev }>
                    <IconChevronLeft size={ 48 }/>
                </div> }
                { currentIndex < (previewList.length - 1) &&
                <div className={ "arrowBtn next" } onClick={ goToNext }>
                    <IconChevronRight size={ 48 }/>
                </div> }


                { actions && <div className={ "btnBlock" }>
                    <div className="btnBlockInner">
                        { actions.map( ( btn, i ) =>
                            btn.component ?
                                <div className={ `btn ${btn.className || ''}`} key={ i }>
                                    { btn.component }
                                </div>
                                :
                                <Btn className={ `btn ${btn.className || ''}`}
                                     disabled={ btn.disabled }
                                     onClick={ () => modalActionHandler( {
                                         action: btn.action,
                                         close: btn.closeModal
                                     } ) }
                                     key={ i }>
                                    { btn.title || null }
                                </Btn> ) }
                    </div>
                </div> }
            </SimpleModal>
        </Gesture>
        || <SimpleModal><Spinner fill/></SimpleModal>;
};

export default SimplePreviewModal;