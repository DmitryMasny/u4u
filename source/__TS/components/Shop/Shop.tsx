// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { withRouter } from 'react-router-dom';
// @ts-ignore
import styled from 'styled-components';

// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import {Page, PageInnerDiv} from "components/Page";

// @ts-ignore
import Paginator from "components/Paginator";

// @ts-ignore
import { COLORS } from 'const/styles';
// @ts-ignore
import LINKS from "config/links";
// @ts-ignore
import ProductDescription from "components/_pages/ProductPage/Product/ProductDescription";

// @ts-ignore
import LINKS_MAIN from "config/links";
// @ts-ignore
import {MY_PRODUCTS_CART} from "const/myProducts";
// @ts-ignore
import {productGetName} from "libs/helpers";
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';


// @ts-ignore
import SideMenu from 'components/SideMenu';
// @ts-ignore
import {IconTune} from 'components/Icons';

// @ts-ignore
import BorderBtn from 'components/BorderBtn';
// @ts-ignore
import { Select } from 'components/_forms';


import CategoriesList from "./_CategoriesList";
import ProductSets from "../ProductSets/ProductSets";
import ProductSet from "../ProductSet/ProductSet";

import {
    windowIsMobileSelector,
    currentProductSetsListSelector,
    filtersCategoriesSelector,
    filtersProductTypesSelector,
    filtersFormatsSelector,
    selectedCategorySelector,
    selectedProductTypeSelector,
    selectedFormatSelector,
    selectedPageSelector,
} from "../../selectors/shop";

import {getShopFiltersAction, getShopPageAction, setShopFiltersAction } from "../../actions/shop";

import {PRODUCT_DESC_DATA} from "./_config";
// @ts-ignore
import FilterBtnProductIcon from 'components/FilterBtnProductIcon';

import {
    Props,
    ShopWrapProps,
    IIconSizes,
    IFormatIcon,
    Iredirect
    // @ts-ignore
} from '__TS/interfaces/shop';


/** Styles */
const ShopWrap = styled(PageInnerDiv)`
    display: flex;
    .shopSideBlock {
        display: ${ ({ isMobile }: ShopWrapProps) => isMobile ? 'none' : 'block' };
        width: 200px;
        padding-right: 20px;
    }
    .shopMainBlock {
        width: ${ ({ isMobile }: ShopWrapProps) => isMobile ? '100%' : 'calc(100% - 200px)' };
    }
    .shopTopPanel {
        display: flex;
        width: 100%;
        height: 50px;
        align-items: flex-start;
        .padding {
             width: 20px;
        }
    }
    .mobMenuBtn {
        text-align: right;
    }
    .divider {
        flex-grow: 1;
        min-width: 10px;
    }
`;
const MobileMenu = styled('div')`
    padding: 0 10px;
    .padding {
         height: 10px;
    }
`;
const ShopHeader = styled('h3')`
    display: flex;
    align-items: center;
    font-size: 18px;
    text-transform: uppercase;
`;


const FormatIcon: React.FC<IFormatIcon> = ({format}) => {
    if (!format) return null;
    const fArray = format.split('_');

    const iconSizes: IIconSizes = {
        aspect: fArray[0] && ((parseInt(fArray[0]) || 1) / (parseInt(fArray[1]) || 1))
    };
    if (iconSizes.aspect > 1) {
        iconSizes.w = 28;
        iconSizes.h = Math.round(28/iconSizes.aspect);
    } else {
        iconSizes.h = 28;
        iconSizes.w = Math.round(28*iconSizes.aspect);
    }
    return <FilterBtnProductIcon width={iconSizes.w} height={iconSizes.h} type={'poster'}/>
};

/**
 * Корневой Витрины
 */
const Shop: React.FC<Props> = ({match, history}) => {
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const { content, totalPages}: any = useSelector( currentProductSetsListSelector );
    const filtersCategories: any = useSelector( filtersCategoriesSelector );
    const filtersProductTypes: any = useSelector( filtersProductTypesSelector );
    const filtersFormats: any = useSelector( filtersFormatsSelector );

    const category: string = useSelector( selectedCategorySelector );
    const productType: string = useSelector( selectedProductTypeSelector );
    const format: string = useSelector( selectedFormatSelector );
    const page: number = useSelector( selectedPageSelector );

    const [filters, setFilters] = useState({categories: null, productTypes: null, formats: null});
    const [backToShopUrl, setBackToShopUrl] = useState(LINKS.SHOP_MAIN);

    let productId = match.params.productId;

    const redirect: Iredirect = (props) => {
        let link = LINKS.SHOP_MAIN;

        if (props) link+= [
            props.id || productId || 0,
            props.page || page || 0,
            props.category || category || 0,
            props.productType || productType || 0,
            props.format || format || 0,
        ].join('/');

        if (props.replace) {
            history.replace(link, {name: props.pageName});
        } else history.push(link, {name: props.pageName});
    };

    if ( productId === '0') productId = 0;


    // Загружаем и назначаем категории
    useEffect(() => {
        if (filtersCategories && filtersCategories !== 'loading') {
            const categories = [{id: 0, name: 'Все категории'}, ...filtersCategories.map((c)=>({id: c.queryValue, name: c.verboseName}))];
            const productTypes = [{id: 0, name: 'Все продукты'}, ...filtersProductTypes.map((c)=>({id: c.queryValue, name: productGetName(c.verboseName)}))];
            // const productTypes = filtersProductTypes.map((c)=>({id: c.queryValue, title: productGetName(c.verboseName)}));
            const formats = [{id: 0, name: 'Все форматы'}, ...filtersFormats.map((c)=>({id: c.queryValue, name: c.verboseName, icon: <FormatIcon format={c.queryValue}/>}))];

            setFilters({categories, productTypes, formats});
        } else if (filtersCategories !== 'loading') getShopFiltersAction();
    }, [filtersCategories]);


    // Выбор фильтра
    const setPageFiltersHandler = (props: any): any => {
        if (!props) {
            history.push(LINKS.SHOP_MAIN);

        } else {
            const {category:c, productType:pt, format:f, page:p, pageName, replace} = props;
            redirect({
                replace: replace,
                category: c === 0 ? '0' : c || category,
                productType: pt === 0 ? '0' : pt  || productType,
                format: f === 0 ? '0' : f  || format,
                page: p === 0 ? '0' : p || 1,
                ...(pageName && {pageName: pageName} || {})
            })
        }
    };


    // Обновляем redux state из url
    useEffect(() => {
        setShopFiltersAction({
            category: match.params.category === '0' ? 0 : match.params.category,
            productType: match.params.productType === '0' ? 0 : match.params.productType,
            format: match.params.format === '0' ? 0 : match.params.format,
            page: match.params.page === '0' ? 0 : match.params.page,
        });
    }, [match.params]);


    // Запрашиваем страницу витрины если нет
    useEffect(() => {
        if (!content ) getShopPageAction({category, productType, format, page});
    }, [content, category, productType, format, page]);

    if (!filters.categories) return <Spinner fill/>;

    // Выбор фильтра: категория
    const setCategoryHandler = (id) => {
        setPageFiltersHandler({category: id});
    };
    // Выбор фильтра: тип продукта
    const setProductTypeHandler = (id) => {
        setPageFiltersHandler({productType: id});
    };
    // Выбор фильтра: формат
    const setFormatHandler = (id) => {
        setPageFiltersHandler({format: id});
    };
    // Выбор фильтра: страница
    const setPageHandler = (id) => {
        setPageFiltersHandler({page: id});
    };

    // Выбор коллекции на витрине
    const selectProductSetHandler = (id, pageName) => {
        setBackToShopUrl(match.url);
        redirect({id, pageName});
    };
    // Редирект в корзину
    const handlerGoToCart = () => {
        history.push( LINKS_MAIN.MY_PRODUCTS.replace(':tab',MY_PRODUCTS_CART))
    };
    // назад
    const handlerGoBack = () => {
        history.push(backToShopUrl);
    };

    let descTitle = productType && filters.productTypes && filters.productTypes.find((item)=>item.id === productType);
    descTitle = descTitle && descTitle.name || '';


// @ts-ignore
    return <Page>
        {!productId ?      // Список товаров
            <ShopWrap isMobile={isMobile}>
                {!isMobile && <div className={'shopSideBlock'}>
                    <ShopHeader>Категории:</ShopHeader>
                    <CategoriesList isMobile={false} category={category} setCategory={setCategoryHandler} categoriesList={filters.categories}/>
                </div>}
                <div className={'shopMainBlock'}>
                    {isMobile ?
                        <SideMenu
                            button={
                                <BorderBtn className="">
                                    <IconTune/> Фильтры
                                </BorderBtn>
                            }
                            title={'Фильтры'}
                            className={'mobMenuBtn'}
                        >
                            <MobileMenu>
                                <ShopHeader>Тип продукта:</ShopHeader>
                                <Select
                                    list={filters.productTypes}
                                    onSelect={setProductTypeHandler}
                                    selectedId={productType}
                                />
                                <div className="padding"/>

                                <ShopHeader>Формат:</ShopHeader>
                                <Select
                                    list={filters.formats}
                                    onSelect={setFormatHandler}
                                    selectedId={format}
                                />
                                <div className="padding"/>

                                <ShopHeader>Категория:</ShopHeader>
                                <CategoriesList isMobile category={category} setCategory={setCategoryHandler} categoriesList={filters.categories}/>
                                <div className="padding"/>

                            </MobileMenu>
                        </SideMenu>
                        :
                        <div className={'shopTopPanel'}>
                            <div className="divider"/>

                            <ShopHeader>Фильтры:</ShopHeader>
                            <div className="padding"/>

                            <Select
                                list={filters.productTypes}
                                onSelect={setProductTypeHandler}
                                selectedId={productType}
                            />
                            <div className="padding"/>
                            <Select
                                list={filters.formats}
                                onSelect={setFormatHandler}
                                selectedId={format}
                            />
                        </div>
                    }

                    <ProductSets productSetsList={content} isMobile={isMobile} onSelect={selectProductSetHandler}/>

                    {totalPages && totalPages > 1 && page &&
                    <Paginator
                        currentPage={page}
                        totalPages={totalPages}
                        onSelectPage={setPageHandler}
                        portal
                    /> || null}

                    {/* ОПИСАНИЕ ПРОДУКТА */}
                    {// @ts-ignore
                    <ProductDescription productSlug={productType} data={PRODUCT_DESC_DATA} title={descTitle}/> }

                </div>
            </ShopWrap>
            :      // конкретный товар
            <ShopWrap isMobile={isMobile}>
                <ProductSet id={productId} productType={productType} format={format} onSelectRedirect={setPageFiltersHandler} goToCart={handlerGoToCart} goBack={handlerGoBack}/>
            </ShopWrap>
        }
    </Page>;
};

export default withRouter(Shop);
