// @ts-ignore
import React, { memo, useEffect, useState } from 'react';
// @ts-ignore
import { withRouter, Prompt } from "react-router-dom";

// @ts-ignore
import { DndProvider } from 'react-dnd';
// @ts-ignore
import MultiBackend from 'react-dnd-multi-backend';
// @ts-ignore
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
// @ts-ignore
import { useBeforeunload } from 'react-beforeunload';

// @ts-ignore
import { EDITOR_SIZES, LS_RECOVER_LAYOUT } from './_config'

// @ts-ignore
import {urlStringToParams} from "__TS/libs/tools";
// @ts-ignore
import FilesDnD from "__TS/components/_misc/FilesDnD";

// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import styled, {css} from 'styled-components';
// @ts-ignore
import LINKS from "config/links";
// @ts-ignore
import { COLORS } from 'const/styles';

import EditorPageSlider from './_EditorPageSlider';
import EditorHeader from './_EditorHeader';
import EditorLibrary from './_EditorLibrary';
import EditorBlockControlsElements from './_EditorBlockControlsElements';
import EditorPageArrows from './_EditorPageArrows';

//import EditorSubBar from './subbar/Photo';

import { windowIsMobileSelector, windowHeightSelector, exitConfirmModalSelector } from "./_selectors";

// @ts-ignore
import { productLayoutAreasListSelector, changesCountSelector } from "__TS/selectors/layout";

// @ts-ignore
import { userRoleIsAdmin } from "selectors/user";
// @ts-ignore
import { productsSelector } from '__TS/selectors/products';
// @ts-ignore
import SubBarPanel from '__TS/components/Editor/_EditorSubBarPanel';

//import { currentControlElementIdSelector } from './_selectors';

//import { productPhotosSelector } from '__TS/selectors/photo';
//import { productsSelector } from '__TS/selectors/products';
import {
    getLayoutByIdAction,
    removeLayoutAndPhotosFromRedux,
    updateLibraryPhotosInProductLayoutOnServerAction
// @ts-ignore
} from "__TS/actions/layout";

// @ts-ignore
import LayoutConstructor from 'components/LayoutConstructor/';
import EditorNavBar from "./_EditorNavBar";

import EditorLoader from './_EditorLoader';
import { setFullscreenLoader, resetLayoutChangesCountAction, clearEditorThemeDataAction } from "./_actions";

// @ts-ignore
import { IThemesSelected } from "__TS/interfaces/themes";

// @ts-ignore
import { modalMyPhotosAction } from "__TS/actions/photo";
import { IPhoto } from "../../interfaces/photo";

/** Interfaces */
interface IProps {
    match: any;
    history: any;
}
interface IEditorMainWrapProps {
    isMobile: boolean; //флаг мобильного устройства
    height?: number; //выстота блока
    multiPages?: boolean; //панель страниц
}
interface IPhotoInPhoto {
    photo: IPhoto[]
}


/** Styles */
const EditorMainWrap = styled('div')`
    display: flex;
    flex-wrap: ${ ({ isMobile }: IEditorMainWrapProps) => isMobile ? 'nowrap' : 'wrap' };
    align-content: flex-start;
    flex-direction: ${ ({ isMobile }: IEditorMainWrapProps) => isMobile ? 'column' : 'row' };
    height: ${ ({ height }: IEditorMainWrapProps) => height ? `${ height }px` : '100vh' };
    width: 100%;
    overflow: hidden;
    background: ${COLORS.LAVENDERMIST};
    user-select: none;
    //transform: rotate3d(0, 0, 0, 0); //для принудительной отрисовки видеоадаптером, ускоряет обработку
`;

const EditorViewWrap = styled('div')`
    position: relative;
    flex-grow: 1;
    height: ${ ({ isMobile, multiPages }: IEditorMainWrapProps) => isMobile ? `${100 + (multiPages ? EDITOR_SIZES.PAGES_HEIGHT : 0)}px` : '100%' };
    overflow: hidden;
`;

const EditorViewWrapInner = styled('div')`
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    ${ ( { isMobile, multiPages }: IEditorMainWrapProps ) => multiPages && (
        isMobile ? css`
            padding-top: ${ EDITOR_SIZES.PAGES_HEIGHT }px`
            :
            css`padding-bottom: ${ EDITOR_SIZES.PAGES_HEIGHT }px`
    ) };
`;

const EditorMainBlockWrap = styled('div')`
    display: flex;
    width: 100%;
    height: calc(100% - 105px);
`;

/*
function multiBackends( ...backendFactories ) {
    return function ( manager ) {
        const backends = backendFactories.map( b => b( manager ) );
        return {
            setup: ( ...args ) =>
                backends.forEach( b => b.setup.apply( b, args ) ),
            teardown: ( ...args ) =>
                backends.forEach( b => b.teardown.apply( b, args ) ),
            connectDropTarget: ( ...args ) =>
                backends.forEach( b => b.connectDropTarget.apply( b, args ) ),
            connectDragPreview: ( ...args ) =>
                backends.forEach( b => b.connectDragPreview.apply( b, args ) ),
            connectDragSource: ( ...args ) =>
                backends.forEach( b => b.connectDragSource.apply( b, args ) ),
        };
    };
}*/

/**
 * Корневой компонент Редактора
 */
const Editor: React.FC<IProps> = ( { match, history } ) => {
    const [ layoutLoaded, setLayoutLoaded ] = useState( false );
    const [ saveReset, saveResetSet ] = useState( false );
    const [ themeParams, setThemeParams ] = useState<IThemesSelected>( null );
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const windowHeight: number = useSelector( windowHeightSelector );
    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const changesCount: number = useSelector( changesCountSelector );
    const exitConfirmModal: any = useSelector( exitConfirmModalSelector );

    //const layout: any = useSelector( productLayoutSelector );
    const products: any = useSelector( productsSelector );

    const productLayoutAreasList: string[] = useSelector( productLayoutAreasListSelector );

    const multiPages = productLayoutAreasList.length > 1;


    //const photos: any = useSelector( productPhotosSelector );
    //const products: Array<any> | null = useSelector( productsSelector );

    //console.log( 'layout', layout );

    //функция редиректа на страницу 404
    const redirectTo404 = () => history.replace( LINKS.NOT_FOUND );

    useBeforeunload((event) => {
        if (changesCount) {
            event.preventDefault();
        }
    });

    //component did mount
    useEffect(() => {
        if ( !products || layoutLoaded ) return;
        //получаем themeParams из роута
        const themeParams: any = match && urlStringToParams( match.params.themeParams );
        //получаем id продукта из роута
        const productId: string = match && match.params.productId

        //если есть productId то запрашиваел layout по этому id
        if ( productId ) {
            clearEditorThemeDataAction();
            getLayoutByIdAction( {
                layoutId: productId,
                saveToRedux: true,
                isThemeLayout: isAdmin && themeParams && !themeParams.isNewProduct
            } ).catch( err => {
                console.error( 'Ошибка получения layout:', err );
                redirectTo404();
            } ).then( result => {
                setFullscreenLoader(false);
                setLayoutLoaded( true );
            });

        } else {
            redirectTo404();
        }

    }, [ products && products.length, layoutLoaded ] );

    useEffect( () => {
        if ( match ) setThemeParams( urlStringToParams( match.params.themeParams ) );
    }, [ match && match.params.themeParams ] )

    useEffect( () => {
        //component will unmount
        return () => {
            removeLayoutAndPhotosFromRedux();
        }
    }, [] )

    // Костыль сброса счетчика изменений, чтобы можно было выйти из редактора, когда мы только его открыли
    useEffect( () => {
        if ( layoutLoaded && !saveReset ) {
            setTimeout(resetLayoutChangesCountAction, 333);
            saveResetSet(true);
        }
    }, [layoutLoaded, saveReset] )

    const onFilesDropHandler = (f) => {
        if (f) {
            modalMyPhotosAction( {
                droppedFiles: f,
                callback: ( photosList: IPhotoInPhoto ) => updateLibraryPhotosInProductLayoutOnServerAction( {
                    photosList: photosList.photo,
                    isAdmin: isAdmin } ),
                    modalTitle: 'Выберите фотографии',
                    maxSelectCount: 10000
            } );
        }
    }

    //если нет продуктов и layout ждем получения
    // @ts-ignore
    if ( !products || !layoutLoaded  ) return <EditorMainWrap><EditorLoader show={true}/></EditorMainWrap>;

    return <EditorMainWrap isMobile={ isMobile } height={ windowHeight }>
        { <EditorHeader isMobile={ isMobile } themeParams={themeParams}/>}
                <Prompt
                    when={!!changesCount && !exitConfirmModal}
                    message={'Вы уверены, что хотите покинуть редактор без сохранения изменений?'}
                />
                <DndProvider backend={MultiBackend} options={HTML5toTouch} >
                    {isMobile ?
                        <>
                            <EditorViewWrap isMobile={isMobile} multiPages={multiPages}>
                                {/* ОБЛАСТЬ РЕДАКТИРОВАНИЯ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ */}
                                <EditorViewWrapInner isMobile={ isMobile } multiPages={multiPages}>
                                    {layoutLoaded && <LayoutConstructor />}
                                    {multiPages && <EditorPageSlider isMobile={ isMobile } />}
                                    {multiPages && <EditorPageArrows isMobile={ isMobile } /> }
                                </EditorViewWrapInner>

                                <EditorBlockControlsElements />

                            </EditorViewWrap>
                            <EditorLibrary isMobile={ isMobile } />
                            <SubBarPanel isMobile={ isMobile } isThemeLayout={themeParams && !themeParams.isNewProduct} />
                            <EditorNavBar/>
                        </>
                    :
                        <>
                            <SubBarPanel isThemeLayout={themeParams && !themeParams.isNewProduct} />
                            <EditorMainBlockWrap>

                                <EditorLibrary isMobile={ isMobile } />

                                <EditorViewWrap>
                                    {/* ОБЛАСТЬ РЕДАКТИРОВАНИЯ */}
                                    <EditorViewWrapInner isMobile={ isMobile }  multiPages={multiPages}>
                                        {layoutLoaded && <LayoutConstructor />}
                                        {multiPages && <EditorPageSlider isMobile={ isMobile } />}
                                        {multiPages && <EditorPageArrows /> }
                                    </EditorViewWrapInner>

                                    <EditorBlockControlsElements />

                                </EditorViewWrap>
                            </EditorMainBlockWrap>
                        </>
                }
                </DndProvider>

                <EditorLoader overlay/>

                <FilesDnD onDrop={onFilesDropHandler}/>

           </EditorMainWrap>;
};

export default memo( withRouter( Editor ) );
