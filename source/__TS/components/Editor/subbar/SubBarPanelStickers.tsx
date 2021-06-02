// @ts-ignore
import React, {useMemo, useEffect} from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import styled, {css} from 'styled-components';

// @ts-ignore
import { userRoleIsAdmin } from "__TS/selectors/user";
import {
    showUploadStickersModalAction,
} from "../_actions";

// @ts-ignore
import { productLayoutThemeId } from "__TS/selectors/layout";
// @ts-ignore
import { SubBarButton, SubBarDivider } from "__TS/styles/editor";

// @ts-ignore
import { setSelectedStickerAction } from "__TS/actions/stickers";
// @ts-ignore
import { IStickerConfig, IStickerPack } from "__TS/interfaces/stickers";
import {
    stickerConfigSelector,
    stickersPacksSelectedIdSelector,
    stickersPacksSelector,
    themeStickersCountSelector
    // @ts-ignore
} from "__TS/selectors/stickers";
// @ts-ignore
import { createStickerLinkThumb } from "__TS/libs/sticker";

// @ts-ignore
import { IconAddSticker} from 'components/Icons';

// @ts-ignore
import { COLORS, StyledScrollbar } from 'const/styles';

// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import { Tooltip } from "components/_forms";

// @ts-ignore
import ImageLoader from "components/ImageLoader";



/** Styles */
const SubBarSticker = styled( 'div' )`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2px;
    user-select: none;
    height: 48px;
    width: 48px;
    flex-shrink: 0;
    cursor: pointer;
    &>div {
        max-height: 100%;
    }
    & svg {
        width: 100%;
        height: 100%;
    }
    .iconBlock {
        padding: 3px;
        border: 3px solid transparent;
        border-radius: 3px;
        min-width: 32px;
        height: 100%;
        font-size: 12px;
    }
    .textBlock {
        display: flex;
        align-items: center;
        height: 100%;
    }
    ${ ( { isActive } ) => isActive && css`
        cursor: default;
        .iconBlock {
            border: 3px solid ${COLORS.WARNING};
        }
    `} 
    ${ ( { isThemeStickers }: {isThemeStickers: boolean} ) => isThemeStickers && css`
        padding-right: 5px;
        margin-right: 5px;
        border-right: 1px solid ${COLORS.LINE};
        border-radius: 5px;
        width: auto;
    `}    
`;



const StickerPackListStyled = styled( StyledScrollbar )`
    height: 100%;
    padding: 0 10px 15px;
    margin-right: -10px;
    margin-left: ${ ({isAdmin}: {isAdmin: boolean})=> isAdmin ? -11 : -10}px;
    border-left: 1px solid ${COLORS.LINE};
    flex-grow: 1;
    .stickerPackListInner {
        display: flex;
        height: 100%;
    }
`;

const selectNonThemeStickerPackAction = (stickersPacks) => {
    const nonThemeStickerPacks = stickersPacks.filter((pack)=>pack.id !== 'theme');
    if (nonThemeStickerPacks[0] && nonThemeStickerPacks[0].id) setSelectedStickerAction( nonThemeStickerPacks[0].id )
}

/**
 * Компонент суб-меню наборов стикеров
 */
const SubBarPanelStickers: React.FC = () => {
    const stickersPacks: IStickerPack[] = useSelector( stickersPacksSelector );
    const stickersPacksSelectedId: string = useSelector( stickersPacksSelectedIdSelector );
    const themeStickersCount: number = useSelector( themeStickersCountSelector );
    const stickerConfig: IStickerConfig = useSelector( stickerConfigSelector );
    const themeId: string = useSelector( productLayoutThemeId );
    const isAdmin: boolean = useSelector( userRoleIsAdmin );

    useEffect(()=>{
        if (!stickersPacksSelectedId && stickersPacks && stickersPacks.length ) {
            if (themeStickersCount) {
                setSelectedStickerAction( 'theme' )
            } else {
                selectNonThemeStickerPackAction(stickersPacks)
            }
        } else if (stickersPacksSelectedId === 'theme' && !themeStickersCount && stickersPacks && stickersPacks.length) {
            selectNonThemeStickerPackAction(stickersPacks)
        }
    }, [stickersPacks, themeStickersCount, stickersPacksSelectedId]);

    const stickersPacksMemos = useMemo( () => {
// @ts-ignore
        return <>
            { isAdmin && themeId && <SubBarButton onClick={ () => showUploadStickersModalAction( themeId ).then(()=>{setSelectedStickerAction( 'theme' )}) }>
                <IconAddSticker/>Загрузить стикеры
            </SubBarButton>}

            { isAdmin && themeId && <SubBarDivider/> }

            <StickerPackListStyled isAdmin={isAdmin}>
                <div className="stickerPackListInner">
                    {stickersPacks.map( ( pack: IStickerPack ) =>
                        pack.id === 'theme' ?
                            (themeStickersCount &&
                                <SubBarSticker key={ 'theme' }  isThemeStickers
                                               isActive={ stickersPacksSelectedId === 'theme' }
                                               onClick={ () => setSelectedStickerAction( 'theme' ) }>
                                    <div className={ 'iconBlock' }>
                                        <div className={ 'textBlock' }>
                                            Стикеры темы
                                        </div>
                                    </div>
                                </SubBarSticker> || null)
                            :
                            <SubBarSticker key={ pack.id }
                                           isActive={stickersPacksSelectedId === pack.id}
                                           onClick={ () => setSelectedStickerAction( pack.id ) }>
                                <Tooltip trigger={ 'hover' } tooltip={`Набор стикеров "${pack.name}"`} placement="bottom" styleParent={ { display: 'flex' } }>
                                    { pack.thumb.svg ?
                                        <div className={ 'iconBlock' } dangerouslySetInnerHTML={ { __html: pack.thumb.svg } }/>
                                        :
                                        <div className={ 'iconBlock' }>
                                            <ImageLoader className={false}
                                                         src={createStickerLinkThumb( { stickerConfig: stickerConfig, id: pack.thumb.pngId } )}
                                                         showLoader={false}
                                                         authId={null}
                                                         light
                                            />
                                        </div>
                                    }
                                </Tooltip>
                            </SubBarSticker>
                    )}
                </div>
            </StickerPackListStyled>
        </>;

    }, [stickersPacks, stickersPacksSelectedId]);

    return  <>
        {stickersPacksSelectedId.length ? stickersPacksMemos : <Spinner size={50} />}
    </>
};


export default SubBarPanelStickers;