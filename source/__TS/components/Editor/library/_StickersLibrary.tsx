// @ts-ignore
import React, { useMemo, memo, useEffect } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';
// @ts-ignore
import {IconDelete2} from 'components/Icons/index';

// @ts-ignore
import styled, { css } from 'styled-components';

// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';

// @ts-ignore
import { useDrag, DragSourceMonitor } from 'react-dnd';

// @ts-ignore
import { userRoleIsAdmin } from "__TS/selectors/user";
import {
    stickerConfigSelector,
    stickersInSelectedPackSelector,
    stickersPacksSelectedIdSelector
    // @ts-ignore
} from "__TS/selectors/stickers";

import {
    updateStickersAction,
    deleteStickerAction,
    // @ts-ignore
} from "__TS/actions/admin/adminStickers";

// @ts-ignore
import { ISticker, IStickerConfig } from '__TS/intefraces/stickers';

// @ts-ignore
import { createStickerLinkThumb } from "__TS/libs/sticker";

// @ts-ignore
import { COLORS } from "const/styles";
import { windowIsMobileSelector } from "../_selectors";
import { productLayoutThemeId } from "../../../selectors/layout";

/** Styles */

const StickerBlock = styled( 'div' )`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    width: 100%;    
    //transform: rotate3d(0, 0, 0, 0);
`;
const Sticker = styled( 'div' )`
    position: relative;
    text-align: center;
    padding: 3px;
    border: 2px solid transparent;
    border-radius: 2px;
    user-select: none;
    background: transparent;
    ${ ( { isDragging }: { isDragging: boolean } ) => isDragging && css`
          border-color: ${COLORS.WARNING};
    `};
    & svg {
        width: 100%;
        height: 100%;
    }
    &:hover .stickerItemBtn{
      opacity: .7;
    }
    &:active .stickerItemBtn{
      opacity: 0;
    }
    .stickerItemBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity .2s ease-out;
        z-index: 300;
        width: 26px;
        height: 26px;
        margin: 2px;
        padding: 1px;
        border-radius: 4px;
        cursor: pointer;
        background-color: ${COLORS.WHITE};
        box-shadow: 1px 1px 4px rgba(5,10,20,.2);
        pointer-events: auto;
        &:hover{
            opacity: 1;
        }
        &.delete {
            fill: ${COLORS.TEXT_DANGER};
        }
    }
    .stickerItemBtnsWrap {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        left: 0;
        right: 0;
        bottom: 5px;
        font-size: 0;
        pointer-events: none;
    }
`;
const StickerDiv = styled( 'div' )`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: ${( { size }: { size: number } ) => size}px;
    height: ${( { size }: { size: number } ) => size}px;
    //transform: rotate3d(0, 0, 0, 0); //для принудительной отрисовки видеоадаптером, ускоряет обработку
    ${ ( { isDragging }: { isDragging: boolean } ) => isDragging && css`
          //position: fixed;
          z-index: 777;
          pointer-events: none;
          //box-shadow: 1px 2px 8px rgba(5,10,20,0.2);
    `};
    
    img {
       width: 100%;
       height: 100%;
       object-fit: contain;
    }
`;

/** interface */
interface Props {
    sticker: ISticker;
    stickerConfig: IStickerConfig;
    size?: number;
}

const SvgConstrainProportions: React.FC = () =>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="2.5" width="13" height="13" rx="0.5" fill="white" stroke="#2B7ED5"/>
        <path d="M7.5 4.5H4.5V7.5" stroke="#2B7ED5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 13.5L13.5 13.5L13.5 10.5" stroke="#2B7ED5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>;
const SvgConstrainProportions2: React.FC = () =>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="14" height="8" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M2.5 4C2.10218 4 1.72064 4.15804 1.43934 4.43934C1.15804 4.72064 1 5.10218 1 5.5L1 12.5C1 12.8978 1.15804 13.2794 1.43934 13.5607C1.72064 13.842 2.10218 14 2.5 14H15.5C15.8978 14 16.2794 13.842 16.5607 13.5607C16.842 13.2794 17 12.8978 17 12.5V5.5C17 5.10218 16.842 4.72064 16.5607 4.43934C16.2794 4.15804 15.8978 4 15.5 4H2.5ZM3.5 6C3.36739 6 3.24021 6.05268 3.14645 6.14645C3.05268 6.24021 3 6.36739 3 6.5V9.5C3 9.63261 3.05268 9.75979 3.14645 9.85355C3.24021 9.94732 3.36739 10 3.5 10C3.63261 10 3.75979 9.94732 3.85355 9.85355C3.94732 9.75979 4 9.63261 4 9.5V7H6.5C6.63261 7 6.75979 6.94732 6.85355 6.85355C6.94732 6.75979 7 6.63261 7 6.5C7 6.36739 6.94732 6.24021 6.85355 6.14645C6.75979 6.05268 6.63261 6 6.5 6H3.5ZM14.5 12C14.6326 12 14.7598 11.9473 14.8536 11.8536C14.9473 11.7598 15 11.6326 15 11.5V8.5C15 8.36739 14.9473 8.24021 14.8536 8.14645C14.7598 8.05268 14.6326 8 14.5 8C14.3674 8 14.2402 8.05268 14.1464 8.14645C14.0527 8.24021 14 8.36739 14 8.5V11H11.5C11.3674 11 11.2402 11.0527 11.1464 11.1464C11.0527 11.2402 11 11.3674 11 11.5C11 11.6326 11.0527 11.7598 11.1464 11.8536C11.2402 11.9473 11.3674 12 11.5 12H14.5Z" fill="#F68225"/>
    </svg>;

/**
 * Компонент стикера
 */
const StickerItem: React.FC<Props> = memo(( { sticker, stickerConfig, size = 100 } ) => {
    const themeId: string = useSelector( productLayoutThemeId );
    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const stickersPacksSelectedId: string = useSelector( stickersPacksSelectedIdSelector );
    const showAdminActions = isAdmin && stickersPacksSelectedId === 'theme';
    // const [loading, setLoading] = useState(false);

    const [ { isDragging, currentOffset }, drag, preview ] = useDrag( {
        item: {
            stickerId: sticker.id,
            stickerSet: stickersPacksSelectedId,
            type: 'sticker',
            width: size,
            height: size
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

    useEffect(()=> {
        if ( isDragging ) {
            document.body.classList.add("layout-photo-not-events-off-all");
        } else {
            document.body.classList.remove("layout-photo-not-events-off-all");
        }
    }, [isDragging]);

    const deleteStickerHandler = () => deleteStickerAction( {
        id: sticker.id,
        stickerSetId: themeId,
        inEditor: true
    })
    const updateStickerHandler = () => updateStickersAction( {
        id: sticker.id,
        // stickerSetId: themeId,
        data: { constrain_proportions: !sticker.constrainProportions },
        inEditor: true
    })

    const pngUrl = useMemo( () => createStickerLinkThumb( { stickerConfig: stickerConfig, id: sticker.id } ), [] );

    return <Sticker isDragging={isDragging}>
                <StickerDiv
                     size={size}
                     ref={ drag }
                     style={ { left: currentOffset && currentOffset.x, top: currentOffset && currentOffset.y } }
                     isDragging={ isDragging }>
                    { sticker.svg ?
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width={sticker.width }
                             height={ sticker.height }
                             viewBox={ `0 0 ${ sticker.viewBoxWidth } ${ sticker.viewBoxHeight }` }
                             dangerouslySetInnerHTML={ { __html: sticker.svg } }/>
                        :
                        <img alt={ '' }
                             src={ pngUrl }
                        />
                    }
                </StickerDiv>
                {showAdminActions && <div className="stickerItemBtnsWrap">
                    <div className="stickerItemBtn constrainProportions" onClick={updateStickerHandler} title={ sticker.constrainProportions ? 'Пропорции сохраняются' : 'Пропорции не сохраняются'}>
                        {sticker.constrainProportions ? <SvgConstrainProportions/> : <SvgConstrainProportions2/>}
                    </div>
                    <div className="stickerItemBtn delete" onClick={deleteStickerHandler}>
                        <IconDelete2/>
                    </div>
                </div>}
           </Sticker>
});

/**
 * Библиотека стикеров
 */
const StickersLibrary: React.FC = () => {
    const stickersInSelectedPack: ISticker[] = useSelector( stickersInSelectedPackSelector );
    const stickerConfig: IStickerConfig = useSelector( stickerConfigSelector );
    const isMobile: boolean = useSelector( windowIsMobileSelector );

    return useMemo( () => {
        if ( !Object.keys( stickersInSelectedPack ).length ) return <Spinner size={ 50 }/>;
        return <Scrollbars>
                    <StickerBlock>
                        { stickersInSelectedPack.map( sticker => <StickerItem sticker={sticker} key={sticker.id} stickerConfig={stickerConfig} size={isMobile ? 75 : 100}/> ) }
                    </StickerBlock>
               </Scrollbars>

    }, [ stickersInSelectedPack ] );
}

export default StickersLibrary;