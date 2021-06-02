import React, { useState, useEffect, memo } from 'react';
import { useDispatch } from "react-redux";
//import styled from 'styled-components';

import {TYPES} from 'const/types';
import { Btn } from 'components/_forms';

import {IconClose} from "components/Icons";

import { ModalContext } from './_context';
import {ModalWrap, ModalBlock, ModalHeader, ModalBody, ModalFooter, ModalNavbar, Divider, StyledText, ModalBg} from "./_styles";
import Navbar from "components/Navbar";


/**
 * Элемент футера модалки
 * const modalFooter = [
 *     {type: TYPES.COMPONENT, component: <Example/>},
 *     {type: TYPES.DIVIDER},
 *     {type: TYPES.TEXT, text: 'text'},
 *     {type: TYPES.BTN, text: 'close', action: closeModal},
 *     {type: TYPES.BTN, text: 'cancel', intent: "danger", action: closeModal},
 *     {type: TYPES.BTN, text: 'OK', action: acceptAction, primary: true },
 * ];
 */
const FooterItem = memo( ( { item, closeAction } ) => {

    const btnAction = () => {
        if (item.action) item.action();
        if (item.modalClosingBtn) closeAction(true);
    };

    if ( !item || !item.type ) return null;
    switch ( item.type ) {
        case TYPES.COMPONENT:
            return item.component;

        case TYPES.DIVIDER:
            return <Divider/>;

        case TYPES.TEXT:
            return <StyledText>{item.text}</StyledText>;

        case TYPES.BTN:
            return <Btn intent={item.primary ? 'primary' : item.intent}
                        disabled={item.disabled}
                        width={item.width}
                        onClick={btnAction}>{item.icon}{item.text}</Btn>;
    }
} );

/**
 * Модальное окно
 */
const Modal = memo((props) => {
    // const modalRef = React.createRef();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState( props.isOpen );
    const [title, setTitle] = useState( props.title );
    const [size, setSize] = useState( props.size );
    const [blocked, setBlocked] = useState( props.blocked );
    const [footer, setFooter] = useState( props.footer );
    const [navigation, setNavigation] = useState( props.navigation );
    const [zIndex, setZIndex] = useState( props.zIndex || 1 );

    if ( !props.action ) console.error( 'Отсутствует Modal props.action!!!!!!!' );

    const setModalProps = ( { title, size, footer, blocked = null, navigation } ) => {
        // console.log('setModalProps footer',footer);
        if ( title ) setTitle( title );
        if ( size ) setSize( size );
        if ( footer ) setFooter( footer );
        if ( blocked !== null ) setBlocked( blocked );
        if ( navigation ) setNavigation( navigation );
        if ( zIndex ) setZIndex( zIndex );
    };

    const closeModal = (forceClose) => {
        if ( blocked && !forceClose ) return null;

        setIsOpen( false );
        setTimeout( () => {
            dispatch( props.action( false ) );
        }, 250 );
    };

    useEffect(() => {
        setIsOpen(props.isOpen);
    },[props.isOpen]);

    useEffect(() => {
        if (props.footer) setFooter(props.footer);
    },[props.footer]);

    useEffect(() => {
        const keyControll = ( event ) => {
            // Enter
            if ( event.keyCode === 13 && footer) {
                const primaryEl = footer.find( ( item ) => item.primary );
                primaryEl && primaryEl.action && primaryEl.action();
            }

            // Esc
            if ( event.keyCode === 27 ) {
                closeModal();
            }
        };
        // setIsOpen(true);
        document.addEventListener( 'keydown', keyControll );
        return () => {
            document.removeEventListener( 'keydown', keyControll );
        }
    },[footer]);

    return <ModalContext.Provider value={{ setModal: setModalProps, closeModal: () => closeModal() }}>

        <ModalWrap
            isOpen={isOpen}
            // ref={modalRef}
            style={{opacity: isOpen ? 1 : 0, zIndex: zIndex}}
        >
            <ModalBg onClick={closeModal} />
            <ModalBlock isOpen={isOpen} size={size}>
                <ModalHeader>
                    <div className={'title'}>{title}</div>
                    {!blocked && <Btn intent="minimal" onClick={closeModal}><IconClose/></Btn>}
                </ModalHeader>
                {navigation &&
                    <ModalNavbar>
                        <Navbar selectTabAction={navigation.selectTabAction}
                                currentTab={navigation.currentTab}
                                tabs={navigation.tabs}
                                height={30}
                                margin={"bottom"}
                        />
                    </ModalNavbar>
                }

                <ModalBody navigation={navigation}>
                    {props.children}
                </ModalBody>

                {footer &&
                <ModalFooter>
                    {footer.map( ( item, i ) => <FooterItem item={item} key={i} closeAction={closeModal}/> )}
                </ModalFooter>}
            </ModalBlock>

        </ModalWrap>
    </ModalContext.Provider>;
});

export { ModalContext };
export default Modal;