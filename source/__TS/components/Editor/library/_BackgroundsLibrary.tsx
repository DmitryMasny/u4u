// @ts-ignore
import React, { useMemo, memo, useEffect, useCallback } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';
// @ts-ignore
import Accordion from '__TS/components/_misc/Accordion';
// @ts-ignore
import styled, { css } from 'styled-components';
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';

// @ts-ignore
import { useDrag, DragSourceMonitor } from 'react-dnd';

// @ts-ignore
import { createBackgroundLinkThumb } from "__TS/libs/backgrounds";

import {
    backgroundsPacksSelector,
    backgroundsInSelectedPackSelector,
    backgroundConfigSelector,
    backgroundsPacksSelectedIdSelector
// @ts-ignore
} from "__TS/selectors/backgrounds";

import {
    setSelectedBackgroundsPackAction,
    deleteBackgroundFromThemeByIdAction
    // @ts-ignore
} from "__TS/actions/backgrounds";
// @ts-ignore
import { IBackgroundConfig } from "__TS/interfaces/backgrounds";

// @ts-ignore
import { IconDelete2 } from "components/Icons";
// @ts-ignore
import { userRoleIsAdmin } from "__TS/selectors/user";
import { windowIsMobileSelector } from "../_selectors";
import { productLayoutThemeId } from "../../../selectors/layout";

// @ts-ignore
import { COLORS } from "const/styles";


/** interfaces */
interface IBackgroundItem {
    id: string;
    packId: string;
    backgroundConfig: IBackgroundConfig;
    ext: string;
    isAdmin?: boolean;
    height?: number;
}

interface IBackgroundsCollection {
    id: string;
    isAdmin?: boolean;
}

/** styles */
const BgWrapper = styled( 'div' )`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    margin: 0 -3px;
    width: 100%;
    //transform: rotate3d(0, 0, 0, 0);
`;

const BgItemDiv = styled( 'div' )`
    width: ${({height}:{height?: number}) => height ? `${height}px` : 'initial'};
    height: ${({height}:{height?: number}) => height ? `${height}px` : 'initial'};
    margin: 0;
    font-size: 0;
    transition: opacity 0.2s ease-out;
    
    ${ ( { isDragging }: { isDragging: boolean } ) => isDragging && css`
        position: fixed;
        z-index: 777;
        pointer-events: none;
    ` };
    & > img {
      height: 100%;
    }
`;

const BgItem = styled( 'div' )`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-width: 50px;
    max-width: 500px;
    margin: 0 3px 6px;
    user-select: none;
    border: 1px solid ${COLORS.LINE};
    cursor: pointer;
    background: transparent;
    &:hover {
        .btn{
          opacity: .7;
        }
    }
    &:active .btn{
      opacity: 0;
    }
    .btn {
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
    .btnsWrap {
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

/**
 * Компонент фона
 * @param id
 * @param packId
 * @param backgroundConfig
 * @param ext
 * @param height
 * @constructor
 */
const BackgroundItem = memo( ( { id, packId, height = 100, backgroundConfig, ext, isAdmin }: IBackgroundItem ) => {
    const themeId: string = useSelector( productLayoutThemeId );
    const showAdminActions = isAdmin && packId === 'theme';

    const [ { isDragging, currentOffset }, drag ] = useDrag( {
        item: {
            bgId: id,
            bgSetId: packId,
            type: 'background'
        },
        canDrag: true,
        collect: ( monitor: DragSourceMonitor ) => ({
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
            //getDropResult: monitor.getDropResult(),
            //getItem: monitor.getItem(),
            //getItemType: monitor.getItemType(),
            //didDrop: monitor.didDrop(),
        }),
    } );

    useEffect( () => {
        if ( isDragging ) {
            document.body.classList.add( "layout-drop-only-background" );
        } else {
            document.body.classList.remove( "layout-drop-only-background" );
        }
    }, [ isDragging ] );

    //строим и запоминаем url на изображение
    const imageUrl: string = useMemo( () => createBackgroundLinkThumb( {
        backgroundConfig: backgroundConfig,
        id: id,
        ext: ext
    } ), [] );

    const deleteBackgroundHandler = useCallback( () => {
        deleteBackgroundFromThemeByIdAction( { id: id, packId: themeId } )
    },[ id, themeId ])

    return (
        <BgItem key={ id }>
            <BgItemDiv ref={ drag }
                       height={ height }
                       style={ { left: currentOffset && currentOffset.x, top: currentOffset && currentOffset.y } }
                       isDragging={ isDragging }>
                <img src={ imageUrl } alt={ '' }/>
            </BgItemDiv>
            { showAdminActions && <div className="btnsWrap">
              <div className="btn delete" onClick={ deleteBackgroundHandler }>
                <IconDelete2/>
              </div>
            </div> }
        </BgItem>
    )
} );

/**
 * Коллекция фонов в библиотеке
 */
const BackgroundsCollection = memo( ( { id, isAdmin }: IBackgroundsCollection ) => {
    const backgroundConfig: IBackgroundConfig = useSelector( backgroundConfigSelector );
    const backgroundsInPack = useSelector( state => backgroundsInSelectedPackSelector( state, id ) );
    const isMobile = useSelector( windowIsMobileSelector );

    if ( !Object.keys( backgroundsInPack ).length ) return <Spinner size={ 50 }/>;

    return <BgWrapper>
        { backgroundsInPack.map( bg => <BackgroundItem
            key={ bg.id }
            backgroundConfig={ backgroundConfig }
            packId={ id }
            id={ bg.id }
            ext={ bg.ext }
            isAdmin={ isAdmin }
            height={ isMobile ? 75 : 100 }
        /> ) }
    </BgWrapper>
} );

/**
 * Библиотека фонов
 * @constructor
 */
const BackgroundsLibrary = memo( () => {
    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const backgroundsPacks = useSelector( backgroundsPacksSelector );
    const backgroundsPacksIdSelected: string = useSelector( backgroundsPacksSelectedIdSelector );

    if ( !Object.keys( backgroundsPacks ).length ) return <Spinner size={ 50 }/>;

    //handler назначаем id выбранного пака в redux для его отображения
    const handlerOpenPack = ( packId ) => {
        const selectPackId = backgroundsPacksIdSelected === packId ? 0 : packId;
        setSelectedBackgroundsPackAction( selectPackId );
    }

    return <Scrollbars>
        { backgroundsPacks.map( pack =>
            <Accordion title={ pack.name }
                       content={ <BackgroundsCollection id={ pack.id } isAdmin={ isAdmin }/> }
                       isOpen={ backgroundsPacksIdSelected === pack.id }
                       onOpen={ () => handlerOpenPack( pack.id ) }
                       key={ pack.id }/>
        ) }
    </Scrollbars>;
});

export default BackgroundsLibrary;