// @ts-ignore
import React, { memo, useMemo, forwardRef, useEffect } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import styled, { css } from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles'
// @ts-ignore
import { hexToRgbA } from "libs/helpers";

//import { IPhoto } from "__TS/interfaces/photo";
// @ts-ignore
import { IconEye, IconClose, IconSelect, IconBlur } from "components/Icons/index";
// @ts-ignore
import ImageLoader from "components/ImageLoader/index";
// @ts-ignore
import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd';
// @ts-ignore
//import MultiBackend, { Preview } from 'react-dnd-multi-backend';

import Tooltip from '__TS/components/_misc/Tooltip';
import { windowIsMobileSelector } from "../_selectors";

/** Interfaces */
interface IProps {
    photoId,
    photoUrl,
    photoImportFrom: string;
    actionClickPreviewPhoto: any;
    actionClickRemovePhoto: any;
    height: number;
    usedCount?:number;
    isDragging?: boolean;
    isMobile?: boolean;
    isBadQuality?: boolean;
}

interface IStyleHeight {
    height: number
}

/** Styles */
const Icon = styled('div')`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    opacity: 0;
    font-size: 0;
    color: #fff;   
    fill: #fff; 
    user-select: none;
    cursor: pointer;
    transition: opacity 0.2s ease-out;
`
const IconPreviewBlock = styled( Icon )`
    bottom: 2px;
    left: 2px;
    background-color: ${hexToRgbA(COLORS.TEXT, .9)}  
`;
const IconRemoveBlock = styled( Icon )`
    bottom: 2px;
    right: 2px;
    background-color: ${hexToRgbA(COLORS.DANGER, .9)}   
`;
const IconUsedBlock = styled( Icon )`
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: ${hexToRgbA(COLORS.PRIMARY, .9)};
    cursor: default;
    opacity: .7;
    ${({isMobile}:{isMobile: boolean})=>isMobile && css`
        pointer-events: none;
    `};
`;
const IconBlurBlock = styled( IconUsedBlock )`
    left: auto;
    right: 2px;
    background-color: ${hexToRgbA(COLORS.DANGER, .9)};
`;

const PhotoBlock = styled('div')`
    margin: 0;
    font-size: 0;
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
    ${ ( { isDragging } ) => isDragging && css`
       filter: grayscale(50%);
       opacity: .7;
    `};
    height: ${({height}:{height?: number}) => height ? `${height}px` : 'initial'};
    & > img {
      height: 100%;
    }
`;

const PhotoItemBlock = styled('div')`
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
    max-width: 500px;
    margin: 0 3px 6px;
    user-select: none;
    border: 1px solid ${COLORS.LINE};
    cursor: pointer;
    ${ ({ isBadQuality }: IProps) => isBadQuality && css`
        ${PhotoBlock} {
          opacity: .5;
          image-rendering: pixelated;
        }
        &:hover {
          ${PhotoBlock} {
              transform: scale(4);
            }
        }
    ` }
    &:hover {
        ${PhotoBlock} {
          opacity: .8;
        }
        ${IconPreviewBlock}, ${IconRemoveBlock} {
            opacity: .8;
            &:hover {
                opacity: 1;
            }
        }
        ${IconUsedBlock}, ${IconBlurBlock} {
            opacity: .9;
        }
    }
           
`;


const PhotoPreviewImage =  styled('img')`
  position: fixed;
  z-index: 10;
  pointer-events: none;
`;
/**
 * Компонент рендера превью
 * @param photoUrl
 * @param x
 * @param y
 * @param height
 * @constructor
 */
const PhotoPreview = ( { photoUrl, x, y, height }: { photoUrl: string, x: number, y: number, height: number } ) => {
    return <PhotoPreviewImage src={ photoUrl } style={ { left: x, top: y, height: height } }/>
};

/**
 * Компонент рендера изображения в галлерее
 */
const PhotoRender = memo( forwardRef( ({ isDragging, photoId, photoUrl, photoImportFrom, actionClickPreviewPhoto, actionClickRemovePhoto, height, usedCount, isBadQuality }: IProps, ref:any ) => {
    const isMobile = useSelector( windowIsMobileSelector );

    const toolTipText = useMemo(()=> {
        if ( usedCount ) {
            let countText = '';

            if ( usedCount > 4) {
                countText = 'раз'
            } else {
                countText = 'раза'
            }

            return usedCount < 2 ? 'Фотография размещена' : `Фотография размещена ${usedCount} ${countText}`
        } return null;
    }, [usedCount]);

    useEffect(()=> {
        if ( isDragging ) {
            document.body.classList.add("layout-photo-not-events-off");
        } else {
            document.body.classList.remove("layout-photo-not-events-off");
        }
    }, [isDragging]);

    return <PhotoItemBlock isBadQuality={isBadQuality} isDragging={ isDragging } onClick={ () => {isMobile && actionClickPreviewPhoto( photoId )} }>
        <PhotoBlock isDragging={ isDragging } ref={ ref } height={ height }>
            <ImageLoader className={ false }
                         src={ photoUrl }
                         showLoader={ false }
                         authId={ null }
                         light
            />
        </PhotoBlock>
        { !isDragging &&
        <>
            { !isMobile && <IconPreviewBlock onClick={ () => actionClickPreviewPhoto( photoId ) }>

                <Tooltip tooltip="Просмотр" intent="minimal" placement="bottom">
                    <IconEye/>
                </Tooltip>
                </IconPreviewBlock>
            }
            { !isMobile && <IconRemoveBlock onClick={ () => actionClickRemovePhoto( photoId ) }>

                <Tooltip tooltip="Удалить" intent="minimal" placement="bottom">
                    <IconClose/>
                </Tooltip>
            </IconRemoveBlock> }

            { isBadQuality && <IconBlurBlock isMobile={ isMobile }>
                <Tooltip tooltip="Фотография слишком мала для выделенного блока" intent="minimal" placement="bottom">
                    <IconBlur size={12}/>
                </Tooltip>
            </IconBlurBlock> }

            { usedCount ?
                <IconUsedBlock isMobile={ isMobile }>

                    <Tooltip tooltip={ toolTipText }
                             intent="minimal" placement="bottom">
                        <IconSelect size={12}/>
                    </Tooltip>
                </IconUsedBlock>
                :
                null
            }
        </>
        }
    </PhotoItemBlock>
}));

/**
 * Фотография для библиотеки
 * @param photoId
 * @param photoUrl
 * @param photoImportFrom
 * @param actionClickPreviewPhoto
 * @param actionClickRemovePhoto
 * @param height
 * @param isMobile
 * @param usedCount
 * @param isBadQuality
 * @constructor
 */

const PhotoItem: React.FC<IProps> = ( { photoId, photoUrl, isMobile, photoImportFrom, actionClickPreviewPhoto, actionClickRemovePhoto, height, usedCount, isBadQuality } ) => {
    const [ { isDragging, currentOffset }, drag, preview ] = useDrag( {
        item: {
            photoId: photoId,
            type: 'photo'
        },
        canDrag: true,
        collect: ( monitor: DragSourceMonitor ) => ( {
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
            //getDropResult: monitor.getDropResult(),
            //getItem: monitor.getItem(),
            //getItemType: monitor.getItemType(),
            //didDrop: monitor.didDrop(),
        }),
    } );

    const src = useMemo( () => {
        return `${ photoUrl }=h${ isMobile ? height*2 : height }`
    }, [ height, isMobile ] );

    return  <>
                {isDragging && currentOffset ? <PhotoPreview photoUrl={src} x={currentOffset.x} y={currentOffset.y} height={height} /> : null}
                <DragPreviewImage connect={preview} src={src} />
                <PhotoRender isDragging={isDragging}
                             ref={drag}
                             photoId={photoId}
                             photoUrl={src}
                             photoImportFrom={photoImportFrom}
                             actionClickPreviewPhoto={actionClickPreviewPhoto}
                             actionClickRemovePhoto={actionClickRemovePhoto}
                             height={height}
                             usedCount={usedCount}
                             isBadQuality={isBadQuality}
                />
            </>
};

export default memo( PhotoItem );