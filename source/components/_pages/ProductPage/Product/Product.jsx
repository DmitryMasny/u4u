import React, {useState, useEffect, forwardRef, useImperativeHandle, memo, useRef} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useRouteMatch, useHistory } from "react-router-dom";

import { generatePath } from 'react-router';
import styled, {css} from 'styled-components';

import Spinner from 'components/Spinner';
import {Btn, Tooltip, Select} from "components/_forms";
import FilterBtnProductIcon from 'components/FilterBtnProductIcon';
import {IconRotateL, IconRotateR, IconHelp} from 'components/Icons';
import Table from "components/Table";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import {FullScreenLoaderAction} from 'components/FullScreenLoader/actions'

import LINKS from "config/links";
import TEXT from 'texts/main';
import TEXT_PRODUCT from 'texts/product';
import WS from 'server/ws.es6';
import ProductPreview from './ProductPreview'
import ProductMetaTags from './ProductMetaTags'
import {COLORS} from 'const/styles'
import { PRODUCT_TYPES, PRODUCT_ID_SLUG_MAP, SLUGS } from 'const/productsTypes'
import {getProductType} from 'libs/helpers';
import { generateThemesUrl, rotateFormatId, urlParamsToString } from "__TS/libs/tools";

import {productsSelector, selectedThemeSelector} from "../selectors";
import {
    productSetSelectByIdAction,
    productSetFormatSelectByIdAction,
    productSetFormatRotationAction,
    productSetOptionAction
} from "components/_pages/ProductPage/actions";

import {userIdSelector} from 'selectors/user';
import {windowIsMobileSelector} from "components/_editor/_selectors";

import {productLayoutSelector} from "__TS/selectors/layout";
import { generateAllProductPreview } from "components/LayoutConstructor/preview.js";

import {createLayoutTS} from '__TS/libs/layout';
import {getLayoutByIdAction, updateProductAndFormatInLayout} from '__TS/actions/layout';
import { selectThemeAction } from '__TS/actions/themes';
import { THEME_PRODUCT_GROUP } from 'const/productsTypes';

// import { showFutureSelector } from "selectors/global";


import {
    THEMES_PUT_THEME_DATA
} from 'const/actionTypes';


//получение по id
const getItemById = (items, id) => {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id.toString() === id.toString()) return items[i];
    }
    return null;
};

/**
 * Styles
 */
const StyledProductDescription = styled.div`    
    margin-bottom: 30px;
    font-size: 14px;    
`;
const StyledProduct = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    ${({isMobile}) => isMobile && css`
        flex-direction: column;
        margin-bottom: 15px;
    `}
    ${({isModal}) => isModal && css`
        margin-bottom: -20px;
    `}
`;
const RightCol = styled.div`
    width: 50%;
    padding-left: 20px;
    //align-items: center;
    margin-bottom: 30px;
    ${({theme}) => theme.media.sm`
        width: 100%;
        padding-left: 0;
    `};
    ${({isModal}) => isModal && css`
        margin-bottom: 0;
    `}
`;
const LeftCol = styled.div`
    width: 50%;
    padding-right: 20px;
    ${({theme}) => theme.media.sm`
        width: 100%;
        margin-bottom: 30px;
        padding-right: 0;
    `};
`;

const AttentionText = styled.div`
    width: 100%;
    padding: 10px 0;
    font-size: 21px;
    color: ${COLORS.TEXT_INFO};
    ${({theme}) => theme.media.sm`
        font-size: 18px;
    `};
`;

const StyledProductStatus = styled.div`
    width: 100%;
    margin: 15px 0;
    .titleCol {
      margin-right: 10px;
    }
    .item {
        display: block;
        margin-bottom: 3px;
    }
    .label {
        color: ${COLORS.TEXT_INFO};
    }
    .price {
        color: ${COLORS.TEXT_INFO};
    }
    .productionTime {
        //margin-top: 10px;
        //color: ${COLORS.TEXT_INFO};
    }
`;


const StyledProductTitle = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: 600;
`;

const RotateFormatBtn = styled(Btn)`
    display: inline-flex;
    align-items: center;
    color: ${COLORS.NEPAL};
    fill: ${COLORS.NEPAL};
    padding-left: 8px;
    margin-left: 10px;
    & > span {
        font-size: 13px;
        text-transform: none;
        font-weight: normal;
    }
`;
const BtnsBlock = styled.div`
    margin: 10px -5px;
    .btn{
        margin: 0 5px 10px;
    }
`;

const StyledProductTotalPrice = styled.span`
    font-size: 24px;
    font-weight: 600;
    margin-right: 20px;
`;

const StyledFormatFiltersName = styled.div`
    text-align:center;
    font-size: 13px;
    .size{
      font-size: 12px;
      color: ${COLORS.NEPAL};
    }
    // выбранная в выпадающем списке
    .selectedTitle & {
      display: flex;
      justify-content: center;
      font-size: 16px;
        .size{
          font-size: 14px;
          margin-left: 10px;
        }
    }
`;

const StyledProductFilterBlock = styled.div`
    margin-bottom: 20px;
`;

const StyledTooltipText = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 400px;
    .item {
        padding: 5px 10px;
    }
`;

const WarningMessage = styled.div`
    color: ${COLORS.DANGER};
    padding-top: ${({isMobile}) => isMobile ? 0 : 20}px;
    padding-bottom: 30px;
    font-weight: 700;
`;


/**
 * Собираем цены и строим таблицу
 * @param products
 */
const priceConstructor = (products) => {
    const formats = {},
        formatsArr = [];

    const setFormatObj = ( { id, w, h, price, pId }) => {
        formats[id] = {
            w: w,
            h: h,
            price: {
                ...(formats[id] && formats[id].price || {}),
                [pId]: price
            }
        };
    }

    products.map((p) => {
        p.formats.map((f) => {
            setFormatObj({
                id: f.width + 'x' + f.height,
                w: f.width,
                h: f.height,
                price: f.defaultPrice,
                pId: p.id
            });
            if (f.allowRotate) {
                setFormatObj({
                    id: f.height + 'x' + f.width,
                    w: f.height,
                    h: f.width,
                    price: f.defaultPrice,
                    pId: p.id
                });
            }
        });
    });

    //создадим массив форматов
    Object.keys(formats).map((key) => formatsArr.push(formats[key]));

    //сортируем массив форматов в порядке возростания формата (ширина * высота)
    formatsArr.sort((a, b) => a.w * a.h - b.w * b.h);

    const formatsList = ['Цены/Форматы'],
        productsList = [];

    formatsArr.map((item, key) => {
        formatsList.push(`${item.w}мм&nbsp;x&nbsp;${item.h}мм`);
    });

    products.map((p, k) => {
        const z = [];
        z.push(p.name);
        formatsArr.map((f) => {
            const currentFormat = formats[f.w + 'x' + f.h]
                z.push(
                    (currentFormat && currentFormat.price[p.id]) ? 'от ' + currentFormat.price[p.id] + 'руб.' : ' - '
                );
            }
        );
        productsList.push(z);
    });

    return [
        formatsList,
        ...productsList
    ];

};

/**
 * Список информации о выбранном продукте
 */
const ProductStatus = memo(({ selectedFormat, selectedOptions, isRotated, productSlug }) => {
    if (!selectedFormat || !selectedOptions) return null;

    const size = {
        width: (isRotated ? selectedFormat.height : selectedFormat.width),
        height: (isRotated ? selectedFormat.width : selectedFormat.height)
    };

    let status = [{
        label: 'Формат',
        value: `${size.width} мм x ${size.height} мм`,
        price: 0
    }];

    let sum = 0;

    const options = Object.keys(selectedOptions).map((key) => {
        const o = selectedOptions[key];
        const isExtraPrice = !!sum;
        if (o.price) sum += o.price;
        return {
            label: o.description,
            value: o.selectedName,
            price: o.name === 'paper' ? 0 : o.price,
            isExtraPrice
        }
    }).filter((item) => !!item);

    status = [...status, ...options];

    return <StyledProductStatus>
        {status.map((item, key) =>
            <span className={'item'} key={key}>
                {item.label && <span className={'label'}>{item.label}:&nbsp;</span>}
                {item.value && <span className={'value'}>{item.value}</span>}
                {!!item.price && item.price !== sum && <span className={'price'}>&nbsp;{item.isExtraPrice ? '+' : ''}{item.price}руб.</span>}
            </span>
        )}
        <span className={'item productionTime'}>
            <span className={'label'}>Срок изготовления:&nbsp;</span>
            <span className={'value'}>{productSlug === SLUGS.PUZZLE ? '3' : '1-2'} рабочих дня</span>
        </span>
    </StyledProductStatus>
});


/**
 * Кнопка подсказка к опции
 */
const LabelInfoBtn = ({data}) => {
    const tooltip = data.map((p, i) => <StyledTooltipText key={i}>
        <div className="item"><b>{p.name}</b> {p.description && <span>- {p.description}</span>} {!!p.price &&
        <i>- {p.price}руб.</i>}</div>
    </StyledTooltipText>);

    return <Tooltip tooltip={tooltip}>
        <Btn intent="minimal" small iconed><IconHelp intent={'info'} size={18}/></Btn>
    </Tooltip>
};

/**
 * Конструктор опций
 * @param options
 * @param selectedOptions
 * @param selectAction
 * @returns {null|*}
 * @constructor
 */
const OptionsBuilder = memo(({options, selectAction}) => {
    if (!options) return null;

    // return options.map((filter) => !filter.isHidden &&
    return options.map(filter => {
        if (!filter.parameters) return null;
        const selectedOption = filter.parameters.find((item) => item.selected);

        return <ProductFilterBlock list={filter.parameters}
                                   selectedId={selectedOption.id}
                                   onSelect={(id) => selectAction({id: id, filterId: filter.id})}
                                   label={`${filter.description}:`}
                                   labelBtn={<LabelInfoBtn data={filter.parameters}/>}
                                   compact={filter.parameters.length > 3}
                                   key={filter.optionSlug + filter.id}
        />
    });
});


/**
 * Название формата
 */
const FormatTitle = memo(({format, isRotated}) => (
    <StyledFormatFiltersName>
        {format.name}
        <div className="size">({isRotated ? `${format.height} x ${format.width}` : `${format.width} x ${format.height}`})
        </div>
    </StyledFormatFiltersName>));

/**
 * Блок фильтра продукта
 */
const ProductFilterBlock = memo(({list, onSelect, selectedId, label, labelBtn, compact, grid, maxWidth, large, fullHeight, showAlways}) => {
    if (!list || !list.length || (!showAlways && list.length < 2)) return null;

    return <StyledProductFilterBlock borders={!compact && grid}>
                {
                    label &&
                    <StyledProductTitle>
                        {label}&nbsp;
                        {labelBtn}
                    </StyledProductTitle>
                }
                <Select list={list}
                        onSelect={onSelect}
                        selectedId={selectedId}
                        showAllGridItems={!compact}
                        fullHeight={fullHeight}
                        grid={grid}
                        large={large}
                        maxWidth={maxWidth}
                />
            </StyledProductFilterBlock>;
});


const productTypesName = (productSlug, singular = false) => {
    switch (productSlug) {
        case PRODUCT_TYPES.POSTER:
            return (singular ? 'постер' : 'постера');
        case PRODUCT_TYPES.PHOTO:
            return (singular ? 'фотографию' : 'фотографии');
        case PRODUCT_TYPES.CANVAS:
            return (singular ? 'холст' : 'холста');
        case PRODUCT_TYPES.CALENDAR:
            return (singular ? 'календарь' : 'календаря');
        case PRODUCT_TYPES.PUZZLE:
            return (singular ? 'пазл' : 'пазла');
        default:
            return (singular ? 'продукт' : 'продукта');

    }
};

// находим выбранный формат в темах
const getSelectedThemeFormat = (themeLayouts, formatSlug, isRotated) => {
    if (!themeLayouts || !formatSlug) return null;
    return themeLayouts.find((l)=>l.format && l.format.formatSlug === (isRotated ? rotateFormatId(formatSlug) : formatSlug) );
};

/**
 * Выбор продукта
 */
const Product = forwardRef(({ modal = false, url = null, preview = null}, ref) => {

    const dispatch = useDispatch();
    const match = useRouteMatch();
    const history = useHistory();
    // const location = useLocation();
    const lastProductSlug = useRef( null );

    const [productState, setProductState] = useState(null);
    
    //получаем тип постера из роутера
    const productTypeId = match && match.params && match.params.productType;
    const productThemeId = match && match.params && match.params.themeId;
    const format = match && match.params && match.params.format;

    // const [productSlug, setProductSlug] = useState(PRODUCT_ID_SLUG_MAP[productTypeId] || '');
    let productSlug = PRODUCT_ID_SLUG_MAP[productTypeId] || '';

    //id user
    const userId = useSelector(userIdSelector);

    //user's token
    //const userToken = useSelector( userTokenSelector);

    const isMobile = useSelector(windowIsMobileSelector);       //мобильный или нет клиент
    const selectedTheme = useSelector(selectedThemeSelector);   //выбранная тема если есть
    // const showFuture = useSelector(showFutureSelector);

    const [showPriceInfo, setShowPriceInfo] = useState(false);

    let layout = modal ? useSelector((state) => productLayoutSelector(state)) : null;


    // useEffect(()=>{
    //     if (layout && layout.productSlug !== productSlug) {
    //         setProductSlug(layout.productSlug);
    //     } else if (productTypeId && PRODUCT_ID_SLUG_MAP[productTypeId] !== productSlug) setProductSlug(PRODUCT_ID_SLUG_MAP[productTypeId]);
    // }, [layout, productTypeId]);

    if (layout && layout.productSlug !== productSlug) {
        productSlug = layout.productSlug;
    } else if (productTypeId && PRODUCT_ID_SLUG_MAP[productTypeId] !== productSlug) productSlug = PRODUCT_ID_SLUG_MAP[productTypeId];

    const productCategory = getProductType(productSlug);

    /**
     * Назначаем выбранный формат
     */
    const handlerSelectProductFormat = (formatSlug) => {
        if (modal) {
            const p = [...productState];
            p.getSelected().formats.setSelectedByFormatSlug(formatSlug);
            setProductState(p);
        } else {
            redirectToUrl(0, history.location.state.name, formatSlug);
            const selectedFormat = productSelected && productSelected.formats.find((f)=>f.formatSlug === formatSlug);
            dispatch(productSetFormatSelectByIdAction(selectedFormat.id, productSlug));
        }
    };


    //редирект на правильный продукт
    const redirectToUrl = (productType, name, f) => {
        if (match.params && match.params.seo) {
            let url = match.path.replace(':productType?', productType);
            url = url.replace(':seo+', match.params.seo);
            history.replace(url, {name: name});
        } else {
            history.replace(generatePath( match.path, {
                    productType: productType || productTypeId,
                    format: f || format || 0,
                    themeId: productThemeId || 0
                }
            ), name && {name: name});
        }
    };

    //Переназначил на внутренний type, для совместимости с текущей галлереей
    const productSelectorRedux = useSelector(state => productsSelector(state, productCategory));
    let productSelector = modal && productState || productSelectorRedux;

    let currentProductByURL = null;
    let productSelected = null;
    let productThemeType = null;
    let formatSelected = null;
    let themeFormatSelected = null;
    let canFormatsRotate = null;
    let optionsSelected = null;
    let isLaminable = false;   // возможность ламинации
    let totalCost = 0;
    let tablePriceData = null;

    let differentFormat = false;


    /**
     * Смотрим на изменение product group slug при изменении продукт id, если group slug  отличается, то сбрасываем выбранную тему
     * так как тема применима только в пределах одного group slug
     */
    useEffect( () => {
        // console.log('productSelector', productSelector);
        if ( productSelector ) {
            const productSelected = productSelector.getSelected();
            const productSlug = productSelected.productGroup;
            // console.log('productSlug', productSlug);
            if ( lastProductSlug.current !== productSlug ) {
                dispatch( {
                    type: THEMES_PUT_THEME_DATA,
                    payload: null
                } )
            }

            lastProductSlug.current = productSlug;
            // Сбрасываем поворот, чтобы при выборе темы отображался формат верной ориентации
            if ( productSelected && productSelected.rotatedFormats ) dispatch(productSetFormatRotationAction(productSelected.productSlug));
        }
    }, [productTypeId] );
    // }, [productTypeId, productSelector] );



    if ( productSelector ) {
        //если в  постерах есть элементы массива
        if (productSelector.length) {

            //если модальное окно и не выставлен state, нужно установить state
            if (modal && !productState) setProductState(JSON.parse(JSON.stringify(productSelector)));

            tablePriceData = priceConstructor(productSelector);

            if (!modal) {
                //если нет productTypeId, или он не соответсвует текущей категории то нужно назначить
                if (!productTypeId || !productSelector.some(x => x.id === productTypeId) ) {
                    redirectToUrl(productSelector[0].id, productSelector[0].name, );
                    return <Spinner/>;
                }

                //берем текущий продукт по URL
                currentProductByURL = productSelector.getById(productTypeId);

                //если постера с id productTypeId нет или нет имени для хлебных крошек, назначаем
                if (!currentProductByURL || !history.location.state || !history.location.state.name) {
                    // console.log('PROBLEM', {
                    //     productTypeId, currentProductByURL, productSelector
                    // });
                    if (currentProductByURL) {
                        redirectToUrl(productTypeId, currentProductByURL.name);
                    } else {
                        redirectToUrl(  productTypeId || productSelector[0].id, productSelector[0].name);
                    }
                    return <Spinner/>;
                }
            }

            //БИЗНЕС ЛОГИКА

            //берем текущий продукт по selected в redux
            productSelected = productSelector.getSelected();

            //если не модальное окно и продукт по URL отличается от selected, назанчаем selected
            if (!modal && currentProductByURL && productSelected.id !== currentProductByURL.id) {
                // console.log('==>', {productSelector, productSelected, currentProductByURL, productCategory});
                dispatch(productSetSelectByIdAction(currentProductByURL.id, productSlug));
                return <Spinner/>;
            }
            //получаем выбранный формат
            formatSelected = productSelected.formats.getSelected();

            if (!formatSelected) return null;

            // Назначаем формат, если его formatSlug указан в url и отличается от formatSlug выбранного формата
            if (!modal && format && format !== '0' && format !== formatSelected.formatSlug) {
                const selectedFormat = productSelected.formats.find((f)=>f.formatSlug === format);
                const rotatedFormatId = !selectedFormat && rotateFormatId(format);
                const rotatedFormat = rotatedFormatId && productSelected.formats.find((f)=>f.formatSlug === rotatedFormatId);

                if (selectedFormat) {
                    handlerSelectProductFormat( selectedFormat.formatSlug )
                } else {
                    //Если нет такого формата проверяем, что это может быть повернутый формат. Иначе выбираем первый встречный
                    if (rotatedFormat) {
                        redirectToUrl(0, history.location.state.name, rotatedFormatId);
                        setTimeout(()=>{
                            if (!productSelected.rotatedFormats) dispatch(productSetFormatRotationAction(productSlug))
                        }, 0)
                    } else {
                        const firstFormat = productSelected.formats[0];
                        redirectToUrl(0, history.location.state.name, firstFormat && firstFormat.formatSlug || '0');
                    }
                }
                return <Spinner/>;
            }

            // Тип группы продуктов для темы, если нет, то не показываем кнопку "Смотреть темы"
            productThemeType = productSelected.productGroup;
            // TODO временно отключаем кнопку на темы постеров т.к. их пока нет
            if ( productThemeType === 'decor' ) productThemeType = '';

            // Если выбрана тема, надо отыскать в ее форматах текущий выбранный
            themeFormatSelected = selectedTheme && selectedTheme.themeLayouts && selectedTheme.themeLayouts.find(
                (f) => productSelected.rotatedFormats && formatSelected.allowRotate ?
                    // если формат повернут, то пытаемся найти id  костылем
                    rotateFormatId(formatSelected.formatSlug) === f.formatSlug
                    :
                    formatSelected.formatSlug === f.formatSlug
            ) || null;

            if (modal && productState) {
                const productSelectorReduxSelected = productSelectorRedux.getSelected();
                const productSelectorReduxSelectedFormat = productSelectorReduxSelected.formats.getSelected();


                if (productSelected.rotatedFormats === productSelectorRedux.rotatedFormats) {
                    if (formatSelected.width !== productSelectorReduxSelectedFormat.width ||
                        formatSelected.height !== productSelectorReduxSelectedFormat.height
                    ) {
                        differentFormat = true;
                    }
                } else {
                    if (formatSelected.width !== productSelectorReduxSelectedFormat.height ||
                        formatSelected.height !== productSelectorReduxSelectedFormat.width
                    ) {
                        differentFormat = true;
                    }
                }
            }

            //проверяем, есть ли в данном формате те, которые можно вопернуть (при значении >0 можно крутить).
            canFormatsRotate = productSelected.formats.filter(f => f.allowRotate).length;

            //собираем выбранные опции
            optionsSelected = {};

            if (formatSelected && Array.isArray(formatSelected.options)) {

                for (let i = 0; i < formatSelected.options.length; i++) {
                    const o = formatSelected.options[i];
                    if (o.type === 'paper') {
                        const selected = o.parameters && o.parameters.getSelected();
                        if (selected.technicalDescription.laminable) { // Условие показа опции ламинации
                            isLaminable = true;
                        }
                        break;
                    }
                }

                formatSelected.options.map(({id, name, description, type, parameters}) => {
                    const selected = parameters.getSelected();
                    if (isLaminable || type !== 'lamination') { // если бумага не ламинируется, ламинацию не учитываем
                        totalCost += selected.price;

                        optionsSelected[type] = {
                            name,
                            description,
                            id: selected.optionId,
                            optionFormatId: selected.id,
                            optionCategoryId: selected.optionCategoryId,
                            selectedName: selected.name,
                            selectedDescription: selected.description,
                            technicalDescription: selected.technicalDescription,
                            optionSlug: selected.optionSlug,
                            price: selected.price
                        };
                    }
                });
            }
        } else {
            console.error('Нет продуктов')
        }
    }

    /**
     * Назначаем выбранный постер
     */
    const handlerSetProductType = ( id ) => {
        if (modal) {
            // const p = [...productState];
            // p.setSelectedById(id);
            //
            // setProductState(p);
        } else {
            const productSelected = productSelector.getSelected();

            if ( id === productSelected.id ) return ;

            const product = getItemById(productSelector, id);
            redirectToUrl(product.id, product.name);
        }
    };
    /**
     * Поворачиваем форматы
     */
    const handlerRotateFormats = () => {
        if (modal) {
            const p = [...productState];
            p.map((prod) => {
                if (prod.rotatedFormats) {
                    delete (prod.rotatedFormats);
                } else {
                    prod.rotatedFormats = true;
                }
                return prod;
            });
            setProductState(p);
        } else {
            dispatch(productSetFormatRotationAction(productSlug));
        }
    };
    /**
     * Назначаем выбраную опции
     */
    const handlerSelectOption = ({id, filterId}) => {
        if (modal) {
            const p = [...productState];
            p.getSelected().formats.getSelected()
                .options.getById(filterId)
                .parameters.setSelectedById(id);

            setProductState(p);
        } else {
            dispatch(productSetOptionAction({
                id: id,
                formatId: formatSelected.id,
                filterId: filterId,
                productSlug: productSlug
            }));
        }
    };

    //Методы доступные из родительского компонента
    if (modal && layout) {
        useImperativeHandle(ref, () => ({
            //Обновляем layout по выбранным параметрам
            handlerUpdateLayoutProduct() {

                updateProductAndFormatInLayout({
                    data: {
                        format: formatSelected,
                        options: optionsSelected,
                        productDescription: productSelected.description,
                        productName: productSelected.name,
                        productId: productSelected.id,
                        productSlug: productSelected.productSlug,
                        formatRotated: productSelected.rotatedFormats,
                    }
                });

            }
        }));
    }


    // Создать продукт
    const createNewProductAction = (themeLayout) => {
        // console.log('createNewProductAction productSelected', productSelected);
        const layout = createLayoutTS({
            // photosArray: photo,
            format: formatSelected,
            options: optionsSelected,
            formatRotated: productSelected.rotatedFormats,
            productDescription: productSelected.description,
            productName: productSelected.name,
            productId: productSelected.id,
            productSlug: productSelected.productSlug,
            productGroupSlug: productSelected.productGroup || '',
            userId: userId,
            themeLayout: themeLayout
        });

        const state = {
            productData: {
                layout
            }
        };

        //Создаем продукт на сервере по WebSocket
        if (themeLayout) {
            WS.createProductLayoutFromTheme( layout, themeLayout.previewList && themeLayout.previewList[0] || themeLayout.preview, selectedTheme.themeId ).then( result => {
                dispatch( FullScreenLoaderAction( false ) );
                history.push( generatePath( LINKS.EDIT, {
                    productId: result.layout.id
                } ) );
            }).catch(err => {
                //убираем лоадер
                dispatch(FullScreenLoaderAction(false));
                console.error('>>>>> error from server', err);
            });
        } else {
            WS.createLayoutPoster( layout, generateAllProductPreview( state ) ).then( result => {
                //сохраняем данные в redux
                //dispatch( productCreateLayoutAction( result ) );

                //показываем лоадер
                dispatch(FullScreenLoaderAction(false));

                //переадресация на раздел редактора-постера
                //history.replace( LINKS.POSTER_EDITOR.replace( ':productId', result.id ) );
                history.push( generatePath( LINKS.EDIT, {
                        productId: result.layout.id,
                        themeParams: urlParamsToString({
                            isNewProduct: true
                        })
                    }
                ) );
            }).catch(err => {
                //убираем лоадер
                dispatch(FullScreenLoaderAction(false));
                console.error('>>>>> error from server', err);
            });
        }


    };

    // Создать продукт-постер/фотография после выбора фотографии
    const handlerCreateNewProductProduct = () => {
        // console.log('selectedTheme', selectedTheme);
        // console.log('formatSelected', formatSelected);
        dispatch(FullScreenLoaderAction(true));
        const selectedThemeFormat = getSelectedThemeFormat(selectedTheme && selectedTheme.themeLayouts, formatSelected.formatSlug, productSelected.rotatedFormats && formatSelected.allowRotate);
        const themeLayoutId = selectedThemeFormat ? selectedThemeFormat.layoutId : selectedTheme && selectedTheme.themeLayouts && selectedTheme.themeLayouts[0] && selectedTheme.themeLayouts[0].layoutId;

        if ( themeLayoutId ) {
            getLayoutByIdAction( {
                layoutId: themeLayoutId,
                relatedObjects: [],
                isThemeLayout:true,
            } ).catch( err => {
                console.error( 'Ошибка получения theme layout:', err );
            } ).then( result => {
                console.log('Тема получена: ',result);
                if (result && result.layout) createNewProductAction(result.layout);
            });
        } else createNewProductAction();

    };


    // перейти на страницу выбора темы
    const redirectToThemeAction = () => {
        history.push(generateThemesUrl({
                productType: productThemeType,
                format:  productSelected.rotatedFormats ?
                    `${formatSelected.height}_${formatSelected.width}`
                    :
                    `${formatSelected.width}_${formatSelected.height}`,
                category: 0
            }
        ));
    };

    let previewSrc = url || null;

    //RENDER
    if (!productSelector || !productSelected || !formatSelected) return <Spinner/>;

    // console.log('+>+>+>+>', {
    //     productSelected, formatSelected, productSelector
    // });

    //const selectedFormat = isMobile && productSelected.formats && productSelected.formats.getSelected();

    const formatRotateBtn = canFormatsRotate ?
        <RotateFormatBtn onClick={handlerRotateFormats}>
            {productSelected.rotatedFormats ? <IconRotateL/> : <IconRotateR/>}
            <span>Повернуть</span> </RotateFormatBtn>
        : null;

    const formatsList = productSelected.formats && Object.values(productSelected.formats).map((f) => {
        const isRotated = productSelected.rotatedFormats && f.allowRotate;
        const iconSizes = {
            aspect: f.height && f.width / f.height
        };
        if (iconSizes.aspect > 1) {
            iconSizes.w = 32;
            iconSizes.h = Math.round(32 / iconSizes.aspect);
        } else {
            iconSizes.h = 32;
            iconSizes.w = Math.round(32 * iconSizes.aspect);
        }
        return {
            id: f.formatSlug,
            name: <FormatTitle format={f} isRotated={isRotated}/>,
            icon: iconSizes.aspect && <FilterBtnProductIcon width={iconSizes.w} height={iconSizes.h} type={'product'}/>,
            isRotated: isRotated,
        }
    });

    let productsList = [];
    if (modal && layout) {
        //фильтруем по типу продукта, если это модальное окно
        productsList = productSelector.filter(item => getProductType(item.productSlug) === productCategory);
    } else {
        productsList = productSelector;
    }

    const productsInfoList = productsList.map((p) => ({
        name: p.name,
        description: p.productInfo && p.productInfo[0] && p.productInfo[0].description
    }));
    // для некоторых продуктов нельзя создать пустой, без темы
    const canCreateOnlyFromTheme = [
        'CALENDAR_WALL_SIMPLE',
        'CALENDAR_WALL_FLIP',
        'CALENDAR_TABLE_FLIP'
    ].some(x => x === productSelected.productSlug);
    // console.log('productSelected',productSelected);
    const svgPreview = differentFormat ? '<g/>' : themeFormatSelected && themeFormatSelected.preview || preview;
    const themeIsSelected = productThemeId && (productThemeId !== '0') && selectedTheme;

    return <>
        <StyledProduct isMobile={isMobile} isModal={modal}>
            <ProductMetaTags product={productSelected}/>

            {isMobile ?
                <>
                    {/* МОБ.ВЕРСИЯ */}
                    <LeftCol>
                        {/* ТИПЫ ПРОДУКТА */}
                        {!modal && <ProductFilterBlock list={productsList}
                                            selectedId={productSelected.id}
                                            onSelect={handlerSetProductType}
                                            label={`Тип продукта:`}
                                            labelBtn={<LabelInfoBtn data={productsInfoList}/>}
                                            maxWidth={400}
                                            large
                                            showAlways
                        />}

                        {/* ФОРМАТЫ */}
                        <ProductFilterBlock list={formatsList}
                                            selectedId={formatSelected.formatSlug}
                                            onSelect={handlerSelectProductFormat}
                                            label={`${TEXT.FORMAT}:`}
                                            labelBtn={formatRotateBtn}
                                            isRotatedFormats={productSelected.rotatedFormats}
                                            grid
                                            compact
                                            showAlways
                        />

                        {differentFormat &&
                        <WarningMessage isMobile={true}>Внимание! Выбранный формат отличается от текущего. При
                            сохранении параметров, рабочая область будет очищена.</WarningMessage>}

                        {/* ПРЕВЬЮ */}
                        {formatSelected && <ProductPreview
                            svg={svgPreview}
                            inProductConfig={true}
                            src={previewSrc}
                            size={productSelected.rotatedFormats && formatSelected.allowRotate ? {
                                h: formatSelected.width,
                                w: formatSelected.height
                            } : {w: formatSelected.width, h: formatSelected.height}}
                            options={optionsSelected}
                            productSlug={productSelected && productSelected.productSlug}
                        />}

                        {/* ОПЦИИ */}
                        {formatSelected && formatSelected.options && <OptionsBuilder
                            options={isLaminable ? formatSelected.options : formatSelected.options.filter((o) => o.type !== 'lamination')}
                            selectAction={handlerSelectOption}
                        />}

                    </LeftCol>

                    <RightCol isModal={modal}>

                        {/* ОПИСАНИЕ ПРОДУКТА */}
                        {productSelected.productInfo && productSelected.productInfo[0] && productSelected.productInfo[0].description &&
                        <StyledProductDescription>{productSelected.productInfo[0].description}</StyledProductDescription>
                        }

                        {/* СПИСОК ВЫБРАННЫХ ОПЦИЙ */}
                        {/*<StyledProductTitle>Выбранно:</StyledProductTitle>*/}
                        {formatSelected &&
                        <ProductStatus selectedFormat={formatSelected} selectedOptions={optionsSelected}
                                       productSlug={productSelected.productSlug}
                                       isRotated={!!(productSelected.rotatedFormats && formatSelected.allowRotate)}/>}

                        {/* ЦЕНА И КНОПКИ */}
                        <StyledProductTitle>
                            {TEXT_PRODUCT.PRICE}:&nbsp;
                            <StyledProductTotalPrice>
                                {totalCost} руб.
                            </StyledProductTotalPrice>
                        </StyledProductTitle>

                        {!modal && <BtnsBlock>
                            {(!canCreateOnlyFromTheme || selectedTheme) && <Btn large intent="primary" className='btn' onClick={handlerCreateNewProductProduct}>
                                {TEXT_PRODUCT.CREATE + ' ' + productTypesName(productCategory, true)}
                            </Btn>}
                            {productThemeType && <Btn large className='btn' intent={canCreateOnlyFromTheme && !themeIsSelected && 'primary'} onClick={redirectToThemeAction}>{themeIsSelected ? TEXT_PRODUCT.RECHOOSE_THEME : TEXT_PRODUCT.CHOOSE_THEME }</Btn>}
                            <Btn className='btn' large onClick={() => setShowPriceInfo(!showPriceInfo)}>
                                {showPriceInfo ? TEXT_PRODUCT.PRODUCT_INFO : TEXT_PRODUCT.PRICES_N_SIZES}
                            </Btn>
                        </BtnsBlock>}

                        { canCreateOnlyFromTheme && selectedTheme && <AttentionText>
                            Обратите внимание на выбранный формат и тип {productTypesName(productCategory)}. После создания макета, вы не сможете их поменять!
                        </AttentionText>}

                    </RightCol>
                </>
                :
                <>
                    {/* ДЕСКТОП ВЕРСИЯ */}
                    <LeftCol>

                        {/* ТИПЫ ПРОДУКТА */}
                        {!modal && <ProductFilterBlock list={productsList}
                                            selectedId={productSelected.id}
                                            onSelect={handlerSetProductType}
                                            label={`Тип ${productTypesName(productCategory)}:`}
                                            labelBtn={<LabelInfoBtn data={productsInfoList}/>}
                                            maxWidth={400}
                                            large
                                            showAlways
                        />}

                        {/* ФОРМАТЫ */}
                        <ProductFilterBlock list={formatsList}
                                            selectedId={formatSelected.formatSlug}
                                            onSelect={handlerSelectProductFormat}
                                            label={`${TEXT.FORMAT}:`}
                                            labelBtn={formatRotateBtn}
                                            isRotatedFormats={productSelected.rotatedFormats}
                                            grid
                                            fullHeight={productSlug === PRODUCT_TYPES.CANVAS}
                                            showAlways
                        />

                        {/* ОПЦИИ */}
                        {formatSelected && formatSelected.options && <OptionsBuilder
                            options={isLaminable ? formatSelected.options : formatSelected.options.filter((o) => o.type !== 'lamination')}
                            selectAction={handlerSelectOption}
                        />}

                        { canCreateOnlyFromTheme && selectedTheme && <AttentionText>
                            Обратите внимание на выбранный формат и тип {productTypesName(productCategory)}. После создания макета, вы не сможете их поменять!
                        </AttentionText>}

                    </LeftCol>

                    <RightCol>

                        {/* ПРЕВЬЮ */}
                        {formatSelected && <ProductPreview
                            svg={svgPreview}
                            inProductConfig={true}
                            src={previewSrc}
                            size={productSelected.rotatedFormats && formatSelected.allowRotate ? {
                                h: formatSelected.width,
                                w: formatSelected.height
                            } : {w: formatSelected.width, h: formatSelected.height}}
                            options={optionsSelected}
                            productSlug={productSelected && productSelected.productSlug}
                        />}

                        {/* СПИСОК ВЫБРАННЫХ ОПЦИЙ */}
                        {formatSelected &&
                        <ProductStatus selectedFormat={formatSelected} selectedOptions={optionsSelected}
                                       productSlug={productSelected.productSlug}
                                       isRotated={!!(productSelected.rotatedFormats && formatSelected.allowRotate)}/>}

                        {/* ЦЕНА И КНОПКИ */}
                        <StyledProductTitle>
                            {TEXT_PRODUCT.PRICE}:&nbsp;
                            <StyledProductTotalPrice>
                                {totalCost} руб.
                            </StyledProductTotalPrice>
                        </StyledProductTitle>

                        {differentFormat &&
                        <WarningMessage>Внимание! Выбранный формат отличается от текущего. При сохранении параметров,
                            рабочая область будет очищена.</WarningMessage>}
                        {!modal && <BtnsBlock>
                            {(!canCreateOnlyFromTheme || selectedTheme) && <Btn large intent="primary" className='btn'
                                 onClick={handlerCreateNewProductProduct}>
                                {TEXT_PRODUCT.CREATE + ' ' + productTypesName(productCategory, true)}
                            </Btn>}
                            {productThemeType && <Btn large className='btn' intent={canCreateOnlyFromTheme && !themeIsSelected && 'primary'} onClick={redirectToThemeAction}>{themeIsSelected ? TEXT_PRODUCT.RECHOOSE_THEME : TEXT_PRODUCT.CHOOSE_THEME }</Btn>}
                            <Btn large className='btn' onClick={() => setShowPriceInfo(!showPriceInfo)}>
                                {showPriceInfo ? TEXT_PRODUCT.PRODUCT_INFO : TEXT_PRODUCT.PRICES_N_SIZES}
                            </Btn>
                        </BtnsBlock>}


                    </RightCol>
                </>
            }

            {/* ОПИСАНИЕ ПРОДУКТА */}
            {productSelected && <ProductDescription product={productSelected}/>}

        </StyledProduct>


        {!modal && (showPriceInfo ?
                <Table data={tablePriceData} fill responsive hover emptyCell={'-'} flipTable
                       title={`Цена ${productTypesName(productCategory)}:`} small/>
                :
                productSelected.productInfo && <ProductInfo title={productSelected.name}
                                                           title2={productSelected.productImages && productSelected.productImages[0].description}
                                                           info={productSelected.productInfo}
                                                           formats={productSelected.formats}
                                                           productSlug={productSelected.productSlug}/>

        ) || null}
    </>
});


export default Product;