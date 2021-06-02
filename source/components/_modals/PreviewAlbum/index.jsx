import React, { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';


import {ModalContext} from 'components/Modal';
import Spinner from 'components/Spinner';
import {TYPES} from 'const/types';

import 'components/PreviewAlbum/preview.scss';
import prepareData from 'components/PreviewAlbum/prepareData';
import TurnJs from 'components/PreviewAlbum/turnjs';

import { modalPreviewAlbumSelector } from 'selectors/modals';
import { previewAlbumSelector,
         previewAlbumInProgressSelector,
         getPreviewAlbumServerAction } from './actions';
// import PosterPreview from "components/_pages/ProductPage/Poster/PosterPreview";
import ProductPreview from "components/_pages/ProductPage/Product/ProductPreview";


/**
 * Styles
 */
const SvgWrap = styled.div`
    //height: calc(90vh - 200px);
    margin: 0 auto 10px;
    overflow-y: auto;
    overflow-x: hidden;
`;

/**
 * Компонент модального окна предпросмотра альбома
 */
const PreviewAlbumModal = ( props ) => {
    const [isNewProducts, setIsNewProducts] = useState( null );
    const { setModal, closeModal } = useContext( ModalContext );
    const dispatch = useDispatch();
    const modalPreviewAlbum = useSelector( modalPreviewAlbumSelector );
    const previewAlbum = useSelector( previewAlbumSelector );
    const previewAlbumInProgress = useSelector( previewAlbumInProgressSelector );

    useEffect(() => {
        setIsNewProducts( modalPreviewAlbum.isNew );

        if ( !modalPreviewAlbum.isNew && modalPreviewAlbum.id ) {
            dispatch( getPreviewAlbumServerAction( modalPreviewAlbum.id ) );
        }

        const actionBtn = modalPreviewAlbum && modalPreviewAlbum.actions && modalPreviewAlbum.actions[ 0 ];

        setModal({
            title: modalPreviewAlbum.productTypeName + ': ' + modalPreviewAlbum.isNew ? modalPreviewAlbum.name : previewAlbum && previewAlbum.name,
            footer: actionBtn && [
                {type: TYPES.DIVIDER},
                {
                    type: TYPES.BTN,
                    text: actionBtn.title,
                    action: actionBtn.action,
                    primary: true,
                    modalClosingBtn: true
                },
                {type: TYPES.DIVIDER},
            ] || null
        });
    },[]);

    useEffect(() => {
        if ( previewAlbum && previewAlbum.name ) setModal( {
            title: previewAlbum.name
        });
    }, [previewAlbum] );

    // console.log('===>', {
    //     modalPreviewAlbum, previewAlbum, isNewProducts
    // });

return isNewProducts ?
    (modalPreviewAlbum.svgPreview && //TODO: Если есть svgPreview то до  сюда даже не доходит - т.к. в главном компоненте вызывается другая модалка
        <SvgWrap>

            <ProductPreview
                svg={modalPreviewAlbum.svgPreview}
                size={{ h: modalPreviewAlbum.formatHeight, w: modalPreviewAlbum.formatWidth }}
                options={modalPreviewAlbum}
                inModal
            />
            {/* <PosterPreview
                svg={modalPreviewAlbum.svgPreview}
                size={{ h: modalPreviewAlbum.formatHeight, w: modalPreviewAlbum.formatWidth }}
                options={modalPreviewAlbum}
                inModal
            />
            */}
        </SvgWrap> || null)
    :
    !previewAlbumInProgress && previewAlbum
        ?
        <TurnJs layout={prepareData( previewAlbum )}/>
        :
        <Spinner size={90} fill/>;

};

export default PreviewAlbumModal;