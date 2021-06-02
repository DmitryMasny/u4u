import React, { useEffect, useContext, useRef } from 'react';
import Product from 'components/_pages/ProductPage/Product';
import { ModalContext } from 'components/Modal';
import { TYPES } from 'const/types';
import { PosterContext } from "contexts/posterContext";
import TEXT_MAIN from 'texts/main';
import { useSelector } from "react-redux";
import { modalPosterConfigSelector } from "selectors/modals";

/**
 * Настройка формата постера
 */
const PosterConfigModal = () => {
    const { setModal, closeModal } = useContext( ModalContext );
    const modalPosterConfig = useSelector( modalPosterConfigSelector );
    const childPoster = useRef();

    const acceptAction = () => {
        childPoster.current.handlerUpdateLayoutProduct();
        closeModal();
    };

    useEffect(() => {
        setModal( {
            title: modalPosterConfig.modalTitle,
            footer: [
                { type: TYPES.DIVIDER },
                { type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeModal },
                { type: TYPES.BTN, text: TEXT_MAIN.SAVE, action: () => acceptAction(), primary: true },
            ]
        } );
    }, [] );

    return <PosterContext.Provider>
                <Product modal={true} closeModal={closeModal} ref={childPoster} url={modalPosterConfig.url} preview={modalPosterConfig.preview}/>
           </PosterContext.Provider>;
};

/*
<PosterContext.Provider value={{setAcceptAction: (x)=>setAcceptState(x)}}>
<Poster config={true}
                        src={modalSelector.src}
                        usedFormat={modalSelector.selectedFormat}
                        selectedOptions={modalSelector.selectedOptions}
                        closeModal={closeModal}/>
 */

export default PosterConfigModal;