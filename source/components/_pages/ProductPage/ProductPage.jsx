import React from 'react';
import { withRouter } from 'react-router-dom';

import { Page, PageInner} from 'components/Page';
import Reviews from 'components/Reviews';
import Product from './Product/';
import Album from './_Album';

import ProductAlbumHOC from 'hoc/ProductAlbum';


import { PRODUCT_TYPE_PHOTOBOOK, PRODUCT_TYPES } from 'const/productsTypes';

const ProductPage = props => {
    let product = null,
        productType = null;

    const { productSlug, match, ...others } = props;
    //выбираем компонент про типу продукта
    switch ( productSlug ) {
        case PRODUCT_TYPE_PHOTOBOOK:
            product = <ProductAlbumHOC {...others}><Album /></ProductAlbumHOC>;
            if (match.params && match.params.coverType && match.params.bindingType ) {
                productType = `${PRODUCT_TYPES.PHOTOBOOK}_${match.params.coverType}_${match.params.bindingType }`;
            }
            break;
        case PRODUCT_TYPES.POSTER:
        case PRODUCT_TYPES.PHOTO:
        case PRODUCT_TYPES.CANVAS:
        default:
        // case PRODUCT_TYPES.PUZZLE:
            // product = PRODUCT_TYPE_POSTER;
            product = <Product/>;
            // product = <ProductPoster productSlug={productSlug} />;
            // info    = props.calculator ? <ProductTable /> : <ProductInfo/>;
            break;

        // default:
        //     return false;
    }

    return (<Page>
                <PageInner>
                    {product}
                    <Reviews productSlug={productType || productSlug}/>
                </PageInner>
            </Page>);
};

export default withRouter( ProductPage );
