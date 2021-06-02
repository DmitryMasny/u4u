// @ts-ignore
import React, { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import { useHistory } from "react-router-dom";
// @ts-ignore
import { generatePath } from 'react-router';
// @ts-ignore
import styled, {css} from 'styled-components'
// @ts-ignore
import { COLORS } from 'const/styles'
import {EDITOR_SIZES, LS_RECOVER_LAYOUT} from './_config'

// @ts-ignore
import { toast } from '__TS/libs/tools';

import { tooltipWarningText, tooltipDangerText } from './_Tooltips';
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import { Tooltip, Btn } from 'components/_forms/';
// @ts-ignore
import { EditorHeaderBtn } from '__TS/styles/editor';
import EditorAlerts from './_EditorAlerts';

// @ts-ignore
import TEXT_PRODUCTS from "texts/my_products";
// @ts-ignore
import TEXT_PRODUCT from "texts/product";
// @ts-ignore
import { IconSettings, IconClose, IconSave } from 'components/Icons';
//import TEXT_EDITOR from "texts/editor.js";
// @ts-ignore
import { isPoster, isPhoto, isCanvas, isCalendar } from 'libs/helpers';
// @ts-ignore
import { productLayoutIsCompletedSelector, productLayoutSlug, productLayoutSelector, changesCountSelector } from "__TS/selectors/layout";
// @ts-ignore
import { ILayout } from "__TS/interfaces/layout";
// @ts-ignore
import {setShowFormatModalAction, setExitConfirmModalAction } from "./_actions";
// @ts-ignore
import {clearThemesAction} from "__TS/actions/themes";
// @ts-ignore
import { makeOrderActionOnlyForUser, productLayoutSetIsCompletedAction, justUpdateLayoutOnServerAction } from "__TS/actions/layout";
// @ts-ignore
import { resetMyProjectToDefaultStateAction } from "__TS/actions/products";


// @ts-ignore
import { generateAllProductPreview } from "components/LayoutConstructor/preview";
import { notAcceptedPhotosSelector, exitConfirmModalSelector } from "./_selectors";
// @ts-ignore
import LINKS from "config/links";
import {userRoleIsAdmin} from "../../selectors/user";
// @ts-ignore
import { modalSimplePreviewAction } from '__TS/actions/modals';

// @ts-ignore
import { IThemesSelected } from "__TS/interfaces/themes";
import { generateThemesUrl } from "../../libs/tools";

// @ts-ignore
import {dialogAddAction} from '__TS/actions/modals';
// @ts-ignore
import ModalExitConfirm from "./_ModalExitConfirm";


/** Interfaces */
interface Props {
    isMobile: boolean; //мобильный режим или нет
    themeParams: IThemesSelected|null;
}
interface ILayoutInfoBlock {
    layout: ILayout;
    inModal?: boolean;
}

/** Styles */
const EditorHeaderActionsWrap = styled( 'div' )`
    display: flex;
    align-items: center;
    flex-grow: ${ ( { isMobile }: Props ) => isMobile ? 1 : 0 };
    justify-content: flex-end;
    height: ${ ( { isMobile }: Props ) => isMobile ? EDITOR_SIZES.HEADER_XS : EDITOR_SIZES.HEADER }px;
    margin: 0 10px;
    & > *:not(:first-child) {
        margin-left: ${ ( { isMobile }: Props ) => isMobile ? 1 : 5}px;
    }; 
    .exitBtn {
        margin-left: 0;
        margin-right: -10px;
    }
`;

const StyledLayoutInfoBlock = styled( 'div' )`
    display: flex;
    ${ ( { inModal }: ILayoutInfoBlock ) => inModal ? css`
          flex-direction: row;
          align-items: center;
          color: ${ COLORS.NEPAL };
          height: 100%;
    ` : css`
          flex-direction: column;
          max-width: 400px;
    ` };
    .item {
        padding: 5px 10px;
    }
`;


/**
 * Компонент подсказки по выбранному продукту
 * @constructor
 */
const LayoutInfoBlock: React.FC<ILayoutInfoBlock> = ( { layout, inModal } ) => {
    if ( !layout ) return null;

    let optionsPrice: number = 0;

    return <StyledLayoutInfoBlock inModal={inModal}>
        <div className="item">{layout.name}</div>
        <div className="item">{layout.format.width}мм x {layout.format.height}мм</div>
        {layout.options && layout.options.length && layout.options.map((o) => {
            if (o.price) optionsPrice += o.price;
            return !inModal && <div className="item" key={o.id}>{o.nameSelected}</div>
        })}
        {inModal ? <div className="item price">{optionsPrice}руб.</div> :
            optionsPrice ? <div className="item">Стоимость: {optionsPrice}руб.</div>
                : null}
    </StyledLayoutInfoBlock>;
};


/**
 * Кнопки шапки редактора
 */
const EditorHeaderActions: React.FC<Props> = ( { isMobile, themeParams } ) => {

    const isCompleted: boolean = useSelector( productLayoutIsCompletedSelector );
    const productSlug: string = useSelector( productLayoutSlug );
    const layout: ILayout = useSelector( productLayoutSelector );
    const changesCount: number = useSelector( changesCountSelector );
    const exitConfirmModal: any = useSelector( exitConfirmModalSelector );

    const notAcceptedPhotos = useSelector( notAcceptedPhotosSelector );
    const disableOrder = notAcceptedPhotos && notAcceptedPhotos.length;
    const isAdmin: boolean = useSelector( userRoleIsAdmin );

    const [ savingProduct, setSavingProduct ] = useState( false );

    // useEffect( () => {
    //     const lsSizes = useRef( JSON.parse(localStorage.getItem('editor_library')) || null );
    //     localStorage.setItem('editor_library', JSON.stringify({ w:libraryWidth, h: libraryHeight }));
    // }, [] )


    const history = useHistory();

    // открыть модалку настройки формата
    const showFormatConfig = () => {
        //checkProductsAndPoster( true );
        let title = '';
        if ( isPoster( productSlug ) ) {
            title = 'Настройка формата постера';
        } else if ( isPhoto( productSlug ) ) {
            title = 'Настройка формата фотографии';
        } else if ( isCanvas( productSlug ) ) {
            title = 'Настройка формата холста';
        }

        //создаем svg превью
        const svgPreview = generateAllProductPreview( {
            productData: {
                layout
            }
        }, true );

        //показываем модальное окно выбора формата
        setShowFormatModalAction({
            title: title,
            preview: svgPreview.split( '/%IMAGESIZE%/' ).join( isMobile ? 'w400' : "w250" )
        })
    };
    // Статус готовности заказа
    useEffect( () => {
        productLayoutSetIsCompletedAction( { isCompleted: !disableOrder } );
    }, [ disableOrder ] )

    // Удаляем модалку подтверждения выхода перед выходом из редактора
    useEffect( () => {
        return () => {
            if (exitConfirmModal) setExitConfirmModalAction( null )
        }
    }, [ exitConfirmModal ] )

    const saveHandler = useCallback( () => {

        if ( savingProduct ) return;

        setSavingProduct( true );

        const isAdminPosterTheme = isAdmin && themeParams && !!themeParams.themeId && !themeParams.isNewProduct;

        justUpdateLayoutOnServerAction( { isAdmin: isAdminPosterTheme, saveToRedux: true } )
            .then( () => {

                setSavingProduct( false );

                if ( isAdminPosterTheme ) {
                    clearThemesAction();
                } else {
                    resetMyProjectToDefaultStateAction();
                }

            })
            .catch( (err) => {
                setSavingProduct( false );
                if ( isAdminPosterTheme ) {
                    toast.error('Не удалось сохранить! =(')
                } else {
                    // Если не удалось сохранить на сервере, сохраняем layout в LS
                    if (err.layout) localStorage.setItem( LS_RECOVER_LAYOUT, JSON.stringify(err.layout) );

                    dialogAddAction({
                        title: 'Внимание!',
                        text: [
                            'К сожалению ваш проект не удалось сохранить на сервере. Проверьте ваше интернет-соединение и попробуйте снова.',
                            'Ваши изменения сохранены на этом устройстве, и вы сможете восстановить ваш проект позже.'
                        ],
                        actions: [{
                            text: 'Ок',
                            primary: true,
                            width: 100
                        }],
                        // TODO svg import
                        svgImage: <svg width="100%" height="100%" viewBox="0 0 58 58"  xmlns="http://www.w3.org/2000/svg">
                            <g id="Page-1" fill="none" fill-rule="evenodd">
                                <g id="041---Disk-Alert" fill-rule="nonzero">
                                    <path id="Shape"
                                          d="m52 51.98v-47.98c0-2.209139-1.790861-4-4-4h-44c-2.209139 0-4 1.790861-4 4v44c0 2.209139 1.790861 4 4 4h15.93z"
                                          fill="#2980ba"/>
                                    <path id="Shape" d="m13 18c-2.209139 0-4-1.790861-4-4v-14h34v14c0 2.209139-1.790861 4-4 4z" fill="#285680"/>
                                    <path id="Shape" d="m43 0v14c0 2.209139-1.790861 4-4 4h-17c-2.209139 0-4-1.790861-4-4v-14z" fill="#a5a5a4"/>
                                    <circle id="Oval" cx="27" cy="31" fill="#a5a5a4" r="8"/>
                                    <circle id="Oval" cx="27" cy="31" fill="#2c3e50" r="1"/>
                                    <path id="Shape" d="m27 52h-19v-5c0-1.6568542 1.34314575-3 3-3h16z" fill="#f9eab0"/>
                                    <g fill="#2c3e50">
                                        <path id="Shape"
                                              d="m34 8v-2c0-1.1045695.8954305-2 2-2h1c1.1045695 0 2 .8954305 2 2v6c0 1.1045695-.8954305 2-2 2h-1c-1.1045695 0-2-.8954305-2-2z"/>
                                        <path id="Shape"
                                              d="m4 49c-.55228475 0-1-.4477153-1-1v-1c0-.5522847.44771525-1 1-1s1 .4477153 1 1v1c0 .5522847-.44771525 1-1 1z"/>
                                        <path id="Shape"
                                              d="m4 45c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1s1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1z"/>
                                        <path id="Shape"
                                              d="m5 7c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1s1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1z"/>
                                        <path id="Shape"
                                              d="m47 7c-.5522847 0-1-.44771525-1-1v-2c0-.55228475.4477153-1 1-1s1 .44771525 1 1v2c0 .55228475-.4477153 1-1 1z"/>
                                    </g>
                                    <path id="Shape"
                                          d="m57.713 54.823-17.841-30.753c-.3902726-.6632965-1.102406-1.0705464-1.872-1.0705464s-1.4817274.4072499-1.872 1.0705464l-17.841 30.753c-.3777992.6616658-.3722452 1.4750032.014555 2.1314477.3868002.6564446 1.0955811 1.055416 1.857445 1.0455523h35.682c.7618639.0098637 1.4706448-.3891077 1.857445-1.0455523.3868002-.6564445.3923542-1.4697819.014555-2.1314477z"
                                          fill="#f0c419"/>
                                    <path id="Shape"
                                          d="m38 45c-1.1675722.0321302-2.1674456-.8303528-2.307-1.99l-.681-7.66c-.0334174-.6246681.1968417-1.2346899.63469-1.6814738.4378482-.446784 1.0430943-.6893185 1.66831-.6685262h1.37c.6258986-.0219408 1.2322202.220088 1.6709615.6670069.4387413.446919.6695329 1.0576064.6360385 1.6829931l-.681 7.66c-.1396837 1.1612159-1.1419141 2.0242355-2.311 1.99z"
                                          fill="#2c2f38"/>
                                    <rect id="Rectangle-path" fill="#2c2f38" height="4" rx="1" width="4" x="36" y="49"/>
                                </g>
                            </g>
                        </svg>
                    });
                }
                console.error('Не удалось сохранить!', err && err.error)
            })
    }, [ themeParams ] );

    const exitHandler = useCallback( () => {
        const isAdminPosterTheme = isAdmin && themeParams && !!themeParams.themeId && !themeParams.isNewProduct;

        const redirectFromEditor = () => {
            // history.goBack(); //TODO
            if ( isAdminPosterTheme ) {
                history.push(generateThemesUrl({
                    isAdmin: true,
                    productType: themeParams.productType,
                    format: themeParams.format,
                    category: themeParams.category,
                    page: themeParams.page,
                    themeId: themeParams.themeId,
                }));
            } else {
                history.push( generatePath( LINKS.MY_PRODUCTS, { tab: 'new' } ) );
            }
        }

        if (changesCount && !isAdmin) {
            setExitConfirmModalAction({callback: (isSave) =>{
                    if (isSave) {

                        setSavingProduct( true );

                        justUpdateLayoutOnServerAction( { isAdmin, saveToRedux: true } )
                            .then( () => {

                                setSavingProduct( false );

                                if ( isAdmin ) {
                                    clearThemesAction();
                                } else {
                                    resetMyProjectToDefaultStateAction();
                                }
                                redirectFromEditor();

                                toast.success(`Сохранено`);

                            })
                            .catch( () => {
                                setSavingProduct( false );
                                redirectFromEditor();

                                toast.error(`Ошибка сохранения`);

                                console.error('Не удалось сохранить!')
                            })
                    } else redirectFromEditor();
                }});
        } else redirectFromEditor()

    }, [ themeParams, changesCount ]);


    const showPreviewModal = useCallback(() => {
        //создаем svg превью
        const svgPreview = generateAllProductPreview( {
            productData: {
                layout
            }
        } );

        modalSimplePreviewAction({
            name: layout.name,
            id: layout.id,
            svgPreview: svgPreview,
            productSlug: layout.productSlug,
            actions: [
                {
                    component: <LayoutInfoBlock layout={layout} inModal/>
                },
                {
                    title: disableOrder ? 'Нельзя заказать' : TEXT_PRODUCTS.MAKE_ORDER,
                    intent: disableOrder ? 'default' : 'success',
                    action: ()=>{
// @ts-ignore
                        makeOrderActionOnlyForUser({
                            layoutId: layout.id,
                            history: history,
// @ts-ignore
                            productSlug: layout.productSlug,
                            needSaveLayoutBeforeOrder: true
                        });
                    },
                    disabled: disableOrder,
                    closeModal: true
                }
            ],
            format: {
                w: parseInt(layout.format.width),
                h: parseInt(layout.format.height),
            },
            isNew: true,
        });

    }, [layout, history, isCompleted]);


    return (
        <EditorHeaderActionsWrap isMobile={ isMobile }>
            { isAdmin || !isCalendar( productSlug ) &&
            <Tooltip tooltip={ <LayoutInfoBlock layout={ layout }/> } placement="bottom">
                <EditorHeaderBtn onClick={ showFormatConfig }>
                    <IconSettings/>
                    { !isMobile && <span>Настроить</span> }
                </EditorHeaderBtn>
            </Tooltip>
            }

            { !isAdmin && <EditorAlerts/> }

            <Tooltip tooltipShown={ changesCount === 50 || changesCount === 100 } tooltip={'Вы давно не сохраняли изменения!'} placement="bottom">
                <EditorHeaderBtn intent="info" onClick={ () => saveHandler() } disabled={ !changesCount || savingProduct } width={isMobile ? 44 : 100}>
                    { savingProduct ? <Spinner delay={ 0 } size={ 24 }/> : isMobile ? <IconSave/> : TEXT_PRODUCT.SAVE }
                </EditorHeaderBtn>
            </Tooltip>

            { !isAdmin && (
                disableOrder ?
                <Tooltip trigger={ [ 'click', 'hover' ] } tooltip={ tooltipDangerText } placement="bottom">
                    <EditorHeaderBtn intent="warning"
                         disabled={ true }
                         onClick={ () => {
                         } }
                    >
                        { TEXT_PRODUCTS.MAKE_ORDER }
                    </EditorHeaderBtn>
                </Tooltip>
                :
                <EditorHeaderBtn intent={ isCompleted ? 'primary' : 'warning' } onClick={ showPreviewModal }>
                    { isCompleted ? TEXT_PRODUCTS.MAKE_ORDER : TEXT_PRODUCTS.VIEW }
                </EditorHeaderBtn>
            ) }

            <Tooltip tooltip={ 'Выйти из редактора' } placement="left">
                <EditorHeaderBtn intent="danger" intentOnHover className="exitBtn" onClick={ () => exitHandler() } disabled={ savingProduct }>
                    <IconClose/>
                </EditorHeaderBtn>
            </Tooltip>

            {/* Модалка подтверждения выхода */ }
            <ModalExitConfirm modalData={ exitConfirmModal } closeCallback={ () => setExitConfirmModalAction( null ) }/>

        </EditorHeaderActionsWrap>
    )
};

export default EditorHeaderActions;