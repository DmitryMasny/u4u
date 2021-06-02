// @ts-ignore
import React, {useState, useEffect} from 'react';
// @ts-ignore
import {useSelector, useDispatch} from "react-redux";

// @ts-ignore
import styled, {css} from 'styled-components';

// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';


// @ts-ignore
import {IconBack} from 'components/Icons';
// @ts-ignore
import {Btn} from "components/_forms";

// @ts-ignore
import FilterBtnProductIcon from 'components/FilterBtnProductIcon';

import ProductSetPreviewMain from './_ProductSetPreviewMain';

// @ts-ignore
import {COLORS} from 'const/styles';

import ProductSetFilter from "./_ProductSetFilter";
import OptionsBuilder from "./_OptionsBuilder";
import FormatTitle from "./_FormatTitle";
import ProductStatus from "./_ProductStatus";
import ProductMetaTags from "./_ProductMetaTags";
import {getProductsetAction,    buyProductAction} from "../../actions/shop";
import {currentProductsetSelector, windowIsMobileSelector} from "../../selectors/shop";
// @ts-ignore
import TEXT_MY_PRODUCTS from "texts/my_products";

// @ts-ignore
import { toast } from '__TS/libs/tools';

// @ts-ignore
import {userLoginShowAction} from "actions/user";
// @ts-ignore
import {userRoleIsVisitor} from "selectors/user";

// @ts-ignore
import {getProductType} from "libs/helpers";
// @ts-ignore
import {productsSelector} from "components/_pages/ProductPage/selectors";
// @ts-ignore
import ProductDescription from "components/_pages/ProductPage/Product/ProductDescription";

// @ts-ignore
import { modalSimplePreviewAction } from 'actions/modals';
// @ts-ignore
import { isPoster, isPhoto, isCanvas, isCalendar } from 'libs/helpers';

import {PRODUCT_DESC_DATA} from "./_config";
// @ts-ignore
import YaShare from "components/YaShare";

//получение по id
// const getItemById = ( items, id ) => {
//     for ( let i = 0; i < items.length; i++ ) {
//         if (items[i].id.toString() === id.toString()) return items[i];
//     }
//     return null;
// };

/** Interfaces */
interface Props {
    id: string;
    productType?: string;
    format?: string;
    onSelectRedirect?: any;
    goToCart?: any;
    goBack?: any;
}
/** Styles */
const StyledProductSet = styled('div')`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 30px;
    ${({isMobile}) => isMobile && css`
        flex-direction: column;
        margin-bottom: 15px;
    `}
    ul li:before {
      content: none;
    }
    .previewCol {
        width: 50%;
        padding-right: 20px;
        margin-bottom: 30px;
        ${({theme}) => theme.media.sm`
            width: 100%;
            padding-right: 0;
        `};
    }
    .settingsCol {
        width: 50%;
        padding-left: 20px;
        margin-bottom: 30px;
        ${({theme}) => theme.media.sm`
            width: 100%;
            padding-left: 0;
        `};
    }
    .settingsWrap {
      min-height: 150px;
    }
`;


const StyledTitle = styled('div')`
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: 600;
    .totalPrice {
        font-size: 24px;
        margin-right: 20px;
    }
    &.header {
        font-size: 24px;
    }
`;
const StyledBtnsBlock = styled('div')`
    margin: 10px -5px;
    .btn{
        margin: 0 5px 10px;
        max-width: 320px;
    }
`;

const StyledNotFound = styled('div')`
    padding: 50px 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    text-align: center;
    .title {
        color: ${COLORS.TEXT_MUTE};
        font-size: 24px;
    }
    .description {
        margin-top: 30px;
    }
`;


/**
 * Страница продукта витрины
 */
const ProductSet: React.FC<Props> = ({id, productType, format, onSelectRedirect, goToCart, goBack}) => {
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const currentProductset: any = useSelector( (state)=>currentProductsetSelector(state, id) );
    const userIsVisitor: boolean = useSelector( userRoleIsVisitor );
    const dispatch: any = useDispatch();

    const [currentProductType, setCurrentProductType] = useState(null); // Выранный тип продукта
    const [currentFormat, setCurrentFormat] = useState(null);           // Выбранный формат
    const [currentOptions, setCurrentOptions] = useState(null);         // Выбранные опции
    const [productError, setProductError] = useState('');               // Ошибка загрузки
    const [buyInProgress, setBuyInProgress] = useState(null);           // Для лоадера при покупке


    const posterSelector: any = useSelector( state => productsSelector( state, getProductType( currentProductType && currentProductType.id ) ) );
    let productSelected = null;
    let productSelectedInfo = null;
    if (posterSelector && currentProductType) {
        posterSelector.map((p)=>{
            if (p.productSlug === currentProductType.id) {
                productSelected = p;
                productSelectedInfo = {
                    title: p.name,
                    title2: p.productImages && p.productImages[0] && p.productImages[0].description,
                    info: p.productInfo
                }
            }
        });
    }


    // Обновляем redux из props (Запрашиваем продукт)
    useEffect(() => {

        if (!currentProductset && id) {
            getProductsetAction({id});
        }

    }, [id]);

    // Обновляем state из (redux->props) - выбранные фильтры продукта
    useEffect(() => {
        if (currentProductset) {
            //console.log('currentProductset',currentProductset);
            if (currentProductset.error) {
                setProductError('Продукт не найден');
            } else {
                const productTypeData = productType && currentProductset.products[productType] || currentProductset.products[currentProductset.defaultProduct.productSlug] || {};
                const formatData = productTypeData.formats && (format && productTypeData.formats[format] || productTypeData.formats[currentProductset.defaultProduct.formatSlug] ||  Object.keys(productTypeData.formats).map(key => productTypeData.formats[key])[0]) || {};
                setCurrentProductType( productTypeData);
                setCurrentFormat( formatData );
                if (!productType && productTypeData.id) onSelectRedirect({productType: productTypeData.id, replace: true});
                let defaultOptions = {
                    paper: null,
                    LAMINATION: null,
                };
                currentProductset.defaultProduct.layoutData.options && currentProductset.defaultProduct.layoutData.options.map((opt)=>{ defaultOptions[opt.name] = {...opt, layoutId: currentProductset.defaultProduct.layoutId}; });
                formatData.options && setCurrentOptions( defaultOptions );
            }
        }

    }, [productType, format, currentProductset]);


    if (productError) return <StyledProductSet>
            <StyledNotFound>
                <div className="title">{productError}</div>
                <div className="description">Перейти в <a onClick={()=>onSelectRedirect()}>Магазин</a></div>
            </StyledNotFound>
    </StyledProductSet>;

    if (!currentProductset || !currentProductType || !currentFormat) return <Spinner fill/>;

    // Список выбора типа продукта
    const productTypesList = Object.keys(currentProductset.products).map((key)=>({id:key, name: currentProductset.products[key].name})).sort((a,b)=>(('' + a.id).localeCompare(b.id)));

    // Список выбора формата
    const formatsList = Object.keys(currentProductType.formats).map((key)=>{
        const f = currentProductType.formats[key];
        const format = {
            w: f.format && parseInt(f.format.width || 0),
            h: f.format && parseInt(f.format.height || 0)
        };

        const iconSizes: any = {
            aspect: format.h && format.w/format.h
        };
        if (iconSizes.aspect > 1) {
            iconSizes.w = 32;
            iconSizes.h = Math.round(32/iconSizes.aspect);
        } else {
            iconSizes.h = 32;
            iconSizes.w = Math.round(32*iconSizes.aspect);
        }
        return {
            id: f.id,
            name: <FormatTitle format={f.format}/>,
            icon: iconSizes.aspect && <FilterBtnProductIcon width={iconSizes.w} height={iconSizes.h} type={'poster'}/>,
            format: format,
        }
    }).sort((a,b)=> {
        const diff = (a.format.w + a.format.h) - (b.format.w + b.format.h);
        return diff ? diff : b.format.w - a.format.w
    });

    // Список доступных опций для формата
    const optionsList = currentFormat.options && ['paper', 'LAMINATION'].map((key)=> {
        if (!currentFormat.options[key] || key === 'LAMINATION' && !currentOptions.paper.laminable) return null;
        let parameters = {};
        currentFormat.options[key].map((o)=>{
            if (!o) return null;
            parameters = {
                ...parameters,
                [o.formatOptionId]: {
                    id: o.layoutId,
                    name: o.optionName,
                    selected: currentOptions[key] && o.layoutId === currentOptions[key].layoutId,
                }
            };
        });
        return {
            id: key,
            name: currentFormat.options[key][0].name,
            parameters: Object.keys(parameters).map((k)=>parameters[k])
        };
    }).filter((x)=>x);

    let totalCost = 0;
    if (currentOptions) Object.keys(currentOptions).map((key) => {
        if (currentOptions[key] && currentOptions[key].price) totalCost += currentOptions[key].price;
    });

    /**
     * Выбор типа продукта
     */
    const handlerSelectProductType = (id) => {
        setBuyInProgress(null);
        onSelectRedirect({productType: id, pageName: currentProductset.name, replace: true });
    };
    /**
     * Выбор формата продукта
     */
    const handlerSelectProductFormat = (id) => {
        // console.log('currentProductset',currentProductset);
        setBuyInProgress(null);
        onSelectRedirect({format: id, pageName: currentProductset.name, replace: true});
    };
    /**
     * Выбор опции продукта
     */
    const handlerSelectProductOption = ({id, filterId}) => {
        // console.log('select optin',{id, filterId});
        // console.log('currentFormat.options',currentFormat.options);
        setBuyInProgress(null);
        setCurrentOptions({
            ...currentOptions,
            ...(filterId === 'paper' ? {LAMINATION: null} : {}),
            [filterId]: currentFormat.options[filterId] && currentFormat.options[filterId].find((opt)=>opt.layoutId === id)
        });
    };

    /**
     * Купить
     */
    const makeOrder = () => {
        setBuyInProgress(true);
        // @ts-ignore
        buyProductAction({
            id: id, layoutId: currentOptions.paper.layoutId, callback: () => {
                setBuyInProgress(false);
                toast.success(
                    <div>
                        <div style={{marginBottom: '5px'}}>Продукт {currentProductset.name || ''} успешно добавлен в корзину.</div>
                        <Btn small intent={"success"}
                             onClick={goToCart}>{TEXT_MY_PRODUCTS.MAKE_ORDER_SUCCESS_LINK}</Btn>
                    </div>,
                    {autoClose: 4000}
                );
            }
        });
    };
    const handlerBuyProduct = () => {
        if ( userIsVisitor ) {
            dispatch( userLoginShowAction(true, () => {
                makeOrder();
            }));
        } else makeOrder();
    };
    const handlerPreviewModal = () => {
        dispatch(modalSimplePreviewAction({
                name: currentProductset.name,
                id: currentOptions.paper && currentOptions.paper.layoutId,
                svgPreview: currentFormat.preview,
                // actions: productData.actions,
                isNew: isPoster( currentProductType.id ) || isPhoto( currentProductType.id ) || isCanvas( currentProductType.id ) || isCalendar( currentProductType.id ),
                productSlug: currentProductType.id,
                format: {
                    w: parseInt(currentFormat.format.width),
                    h: parseInt(currentFormat.format.height),
                }
            }));
    };

    // const productsInfoList = productsList.map((p)=>({
    //     name: p.name,
    //     description: p.productInfo && p.productInfo[0] && p.productInfo[0].description
    // }));

    const title = `U4U - ${currentProductset.name}. ${currentProductType.name} - ${currentFormat.format && `${currentFormat.format.name} ${currentFormat.format.width}x${currentFormat.format.height}мм`}`;
    const description = productSelectedInfo.info && productSelectedInfo.info[0].description

    return <StyledProductSet>
        <ProductMetaTags title={title} description={description}/>
        <div className="previewCol">
            {goBack && <StyledTitle className="header">
                <Btn intent="minimal" onClick={goBack}><IconBack/> НАЗАД</Btn>
            </StyledTitle>}

            {/* ПРЕВЬЮ */}
            {currentFormat && <ProductSetPreviewMain
                svg={currentFormat.preview}
                size={{w: parseInt(currentFormat.format.width), h: parseInt(currentFormat.format.height)}}
                options={currentOptions}
                showPreviewAction={handlerPreviewModal}
                isMobile={isMobile}
            />}
        </div>

        <div className="settingsCol">
            <div className="settingsWrap">
                <StyledTitle className="header">
                    {currentProductset.name}
                </StyledTitle>

                {/* ТИПЫ ПРОДУКТА */}
                <ProductSetFilter list={productTypesList}
                                  selectedId={currentProductType.id}
                                  onSelect={handlerSelectProductType}
                                  label={"Тип продукта:"}
                    // labelBtn={<LabelInfoBtn data={productsInfoList}/>}
                                  maxWidth={400}
                                  large
                                  noEmpty
                />

                {/* ФОРМАТЫ */}
                <ProductSetFilter list={formatsList}
                                  selectedId={currentFormat.id}
                                  onSelect={handlerSelectProductFormat}
                                  label={"Формат:"}
                    // labelBtn={formatRotateBtn}
                                  grid
                />

                {/* ОПЦИИ */}

                {optionsList && <OptionsBuilder
                    options={optionsList}
                    selectAction={handlerSelectProductOption}
                />}
            </div>

            {/* СПИСОК ВЫБРАННЫХ ОПЦИЙ */}
            {currentOptions && <ProductStatus selectedFormat={currentFormat.format}
                                              selectedOptions={currentOptions}
                                              productSlug={currentProductType.id}/>}

            {/* ЦЕНА И КНОПКИ */}
            <StyledTitle>
                Стоимость:&nbsp;
                <span className="totalPrice">
                    {totalCost}&nbsp;руб.
                </span>
            </StyledTitle>
            <StyledBtnsBlock>
                {buyInProgress ?
                    <Btn fill large intent="primary" disabled className="btn"><Spinner delay={0} light size={24}/></Btn>
                    : buyInProgress === false ?
                        <Btn fill large intent="success" className="btn" onClick={goToCart}>В корзине</Btn>
                        :
                        <Btn fill large intent="primary" className="btn" onClick={handlerBuyProduct}>Купить</Btn>
                }
            </StyledBtnsBlock>

            <YaShare title={`Смотри что я нашёл на U4U! "${currentProductset.name}"`} header={<StyledTitle>Поделиться:</StyledTitle>}/>

        </div>

        {/* ОПИСАНИЕ ПРОДУКТА */}
        {productSelected && // @ts-ignore
        <ProductDescription productSlug={productSelected.productSlug} data={PRODUCT_DESC_DATA} options={currentFormat.options}/> }

    </StyledProductSet>
};


export default ProductSet;