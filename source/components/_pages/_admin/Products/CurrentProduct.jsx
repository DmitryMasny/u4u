import React, {useState, useEffect, memo, useRef} from 'react';
import {useSelector} from "react-redux";

import { NavLink } from 'react-router-dom'

import {Row, Col} from 'const/styles'
import {StyledProductName} from '../_styles'
import {PRODUCT_TABS} from './_config'
import CurrentProductInfo from './CurrentProductInfo';
import CurrentProductFormats from './CurrentProductFormats';
import CurrentProductAreas from './CurrentProductAreas';
import CurrentProductPrices from './CurrentProductPrices';

import {currentProductSelector, disableNavSelector} from "./_selectors";
import {getProductByIdAction, resetProductAction} from "./_actions";
import Navbar from "components/Navbar";
import TEXT_ADMIN from "texts/admin";
import { clickOutsideListener } from 'libs/helpers';
import { generateProductUrl } from '__TS/libs/tools';

/**
 * Компонент настроек продукта
 */
const CurrentProduct = ({currentProductId, setUrl, tab, format}) => {
    const currentProduct = useSelector(state => currentProductSelector(state));
    const disableNav = useSelector(state => disableNavSelector(state));
    // const isMobile = useSelector( state => windowIsMobileSelector( state ) );
    const isNewProduct = currentProductId === 'new';
    const productLink = !isNewProduct && generateProductUrl({productType: currentProductId});

    const currentProductDOM = useRef(null);
    useEffect(() => {
        if (currentProduct === null || currentProductId !== currentProduct.id) {
            if (isNewProduct){
                resetProductAction();
            } else getProductByIdAction( currentProductId);
        }
    }, [currentProductId, currentProduct]);

    clickOutsideListener(currentProductDOM, disableNav);   // прослушка клика вне компонента

    if (!isNewProduct && (!currentProduct || (currentProductId !== currentProduct.id))) return null;

    const setTab = (tb) => {
        if (tb && tab === tb) return null;
        setUrl({ tab: tb || PRODUCT_TABS.ABOUT, format: format || null, name: currentProduct && currentProduct.name });
    };

    if (tab < 0) {
        setTab();
    }

    const PRODUCT_NAVBAR_TABS = [
        {id: PRODUCT_TABS.ABOUT, title: TEXT_ADMIN.ABOUT},
        {id: PRODUCT_TABS.FORMATS, title: TEXT_ADMIN.FORMATS, disabled: isNewProduct},
        {id: PRODUCT_TABS.PRICES, title: TEXT_ADMIN.PRICES, disabled: isNewProduct},
        {id: PRODUCT_TABS.AREAS, title: TEXT_ADMIN.AREAS, disabled: true},
    ];


    return (
        <div ref={currentProductDOM}>
            <Row>
                <Col w={2}>
                    <Navbar selectTabAction={setTab}
                            currentTab={tab}
                            isMobile={false}
                            tabs={PRODUCT_NAVBAR_TABS}
                            disabled={disableNav}
                            margin={"bottom"}
                    />
                </Col>
                <Col w={2}>
                    <StyledProductName>
                        {isNewProduct ? 'Новый продукт' :
                            <NavLink to={productLink}>
                                {currentProduct && currentProduct.name}
                            </NavLink>
                        }
                    </StyledProductName>
                </Col>
            </Row>

            <ProductContent isNew={isNewProduct} tab={tab} format={format} currentProduct={currentProduct} setUrl={setUrl}/>
        </div>
    )
};
const techOptions = [{
    "id": "1",
    "name": "Постер",
    "type": "poster",
    "pages": [
        {
            "type": "poster_page",
            "shadow": "none",
            "editable": true,
            "w": "$formatWidht$ + $printMarginLeft$ + $printMarginRight$",
            "h": "$formatHeight$ + $printMarginTop$ + $printMarginBottom$",
            "x": "- $printMarginLeft$",
            "y": "- $printMarginTop$",
        }
    ],
    "printOptions": {
        "printMarginTop": 3,
        "printMarginBottom": 3,
        "printMarginLeft": 3,
        "printMarginRight": 3,
    }
}, {
    "id": "gf67gre",
    "name": "Постер2",
    "type": "poster2",
    "pages": [
        {
            "type": "poster_page",
            "shadow": "none",
            "editable": true,
            "w": "$formatWidht$ + $printMarginLeft$ + $printMarginRight$",
            "h": "$formatHeight$ + $printMarginTop$ + $printMarginBottom$",
            "x": "- $printMarginLeft$",
            "y": "- $printMarginTop$",
        }
    ],
    "printOptions": {
        "printMarginTop": 3,
        "printMarginBottom": 3,
        "printMarginLeft": 3,
        "printMarginRight": 3,
    }
},
];

const ProductContent = memo(({tab, format, currentProduct, isNew, setUrl}) => {
    if (!tab || !currentProduct && !isNew) return null;

    const info = !isNew ? {
        productInfo: currentProduct.productInfo || [],
        productImages: currentProduct.productImages || [],
        name: currentProduct.name,
        description: currentProduct.description,
        productSlug: currentProduct.productSlug,
        productGroup: currentProduct.productGroup || '',
        visible: currentProduct.visible,
    } : {
        productInfo: [{id: 1}, {id: 2}, {id: 3}],
        productImages: [{id: 1}],
        productGroup: '',
        visible: true
    };

    switch (tab) {
        case PRODUCT_TABS.ABOUT:
            return <CurrentProductInfo data={info} productId={currentProduct && currentProduct.id} setUrl={setUrl}/>;
        // case PRODUCT_TABS.IMAGES: return <CurrentProductImages data={currentProduct.images}/>;
        case PRODUCT_TABS.FORMATS:
            return <CurrentProductFormats data={currentProduct.formats} productId={currentProduct.id}/>;
        case PRODUCT_TABS.AREAS:
            return <CurrentProductAreas data={techOptions} productId={currentProduct.id}/>;
        case PRODUCT_TABS.PRICES:
            return <CurrentProductPrices data={currentProduct.formats} format={format} setUrl={setUrl} productId={currentProduct.id}/>;
        default:
            return null;
    }
});

export default CurrentProduct;