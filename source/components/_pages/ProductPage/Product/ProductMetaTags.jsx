import React, { memo } from 'react';
import { Helmet } from 'react-helmet'


const ProductMetaTags = ( { product } ) => {

    if ( !product ) return null;

    const title = `U4U - ${product.name}. ${product.productInfo && product.productInfo[0].description}`

    return <Helmet>
        <title>{ title }</title>
        <meta name="title" content={ title }/>
        <meta name="description" content={ product.description }/>
        <meta property="title" content={ title }/>
        <meta property="description" content={ product.description }/>
        <meta property="og:title" content={ title }/>
        <meta property="og:description" content={ product.description }/>
    </Helmet>
};

export default memo(ProductMetaTags);