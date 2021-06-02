// @ts-ignore
import React, { memo, useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';
// @ts-ignore
import styled, {css} from 'styled-components';

// @ts-ignore
import TEXT_MY_PHOTOS from 'texts/my_photos';


import PhotoItem from './_PhotoItem';
import EmptyLibrary from './_EmptyLibrary';

// @ts-ignore
import { showPreviewPhotoSliderAction, removePhotoInPreviewAction, removePhotoInProgressAction } from "__TS/actions/photo";
// @ts-ignore
import { removePhotoInLayoutLibraryByIdAndSaveOnServerAction } from "__TS/actions/layout";
// @ts-ignore
import { layoutBlockSelector, productLayoutFormatDPISelector } from "__TS/selectors/layout";
import {
    currentControlElementIdSelector,
    photoLibraryShowOnlyNotUsedSelector,
    windowIsMobileSelector
} from "../_selectors";

import { IPhoto, IPhotosArray } from '../../../interfaces/photo';
// @ts-ignore
import { checkPhotoQuality } from "__TS/libs/layout";
// @ts-ignore
import { ILayoutBlock } from "__TS/interfaces/layout";

/** Interfaces */
interface ILibPhoto extends IPhoto{
    isBadQuality?: boolean
}

/** Styles */
const PhotoLibraryBlock = styled( 'div' )`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    margin: 0 -3px;
    width: 100%;
    transition: opacity 0.2s ease-out 0.2s;
`;


/**
 * Библиотека фотографий
 */
const PhotoLibrary: React.FC<IPhotosArray> = ( { photosList } ) => {
    // const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const photoLibraryShowOnlyNotUsed = useSelector( photoLibraryShowOnlyNotUsedSelector );
    const isMobile = useSelector( windowIsMobileSelector );
    const currentControlElementId: string | number = useSelector( currentControlElementIdSelector );
    const selectedBlock: ILayoutBlock | null = useSelector( (s) => layoutBlockSelector(s, currentControlElementId) );
    const formatDPI: number = useSelector( productLayoutFormatDPISelector );

    const [ filteredPhotosList, setFilteredPhotosList ] = useState( [] )

    const showPreviewPhotoSliderHandler = useCallback((photoId)=>{
        showPreviewPhotoSliderAction(photoId, [
            {
                title: TEXT_MY_PHOTOS.DELETE,
                action: ({photoId})=>{
                    removePhotoInProgressAction();
                    removePhotoInLayoutLibraryByIdAndSaveOnServerAction(photoId, ()=>removePhotoInPreviewAction(photoId)); // удаляем из редактора и превью
                },
                intent: 'danger',
                showTitleOnMobile: true
            }
        ]);
    }, []);

    useEffect(()=> {
        if (selectedBlock && selectedBlock.type === "photo") {
            setFilteredPhotosList( photosList.map( photo => {
                const goodQuality = checkPhotoQuality( {
                    dpi: formatDPI / 2,
                    pxWidth: photo.sizeOrig.pxWidth,
                    pxHeight: photo.sizeOrig.pxHeight,
                    mmWidth: selectedBlock.w,
                    mmHeight: selectedBlock.h
                } );
                return goodQuality ? photo : { ...photo, isBadQuality: true }
            }) )
        } else setFilteredPhotosList( photosList )

    }, [photosList, selectedBlock]);

    //если нет фотографий, то ставим загрушку
    if ( !filteredPhotosList.length ) return <EmptyLibrary type={'photo'}/>;

    return <Scrollbars>
                <PhotoLibraryBlock>
                    { filteredPhotosList.map( ( photo: ILibPhoto ) => {
                            if ( photoLibraryShowOnlyNotUsed && photo.usedCount ) return null;

                            return <PhotoItem key={ photo.photoId }
                                       photoId={ photo.photoId }
                                       photoUrl={ photo.url }
                                       photoImportFrom={ photo.importFrom }
                                       usedCount={ photo.usedCount }
                                       isBadQuality={ photo.isBadQuality }
                                       height={ isMobile ? 75 : 100 }
                                       isMobile={isMobile}
                                       actionClickRemovePhoto={ removePhotoInLayoutLibraryByIdAndSaveOnServerAction }
                                       actionClickPreviewPhoto={ showPreviewPhotoSliderHandler }
                            />
                    }) }
                </PhotoLibraryBlock>
            </Scrollbars>

};

export default memo( PhotoLibrary );