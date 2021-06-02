import React, { useState,  useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Page, PageInner } from 'components/Page';
import OnlyAuth from 'hoc/OnlyAuth';

import CurrentProduct from './CurrentProduct';
import ProductsList from './ProductsList';
import LINKS from "config/links";

/**
 * Admin Products
 */
const AdminProducts = (props) => {
    // const isMobile = useSelector( state => windowIsMobileSelector( state ) );

    const setUrl = ({ productId = false, tab = false, format = false, name }) => {
        // console.log('setUrl', {
        //     productId:productId,
        //     tab:tab,
        //     format:format,
        // });
        const params = props.match.params;
        const newUrl = LINKS.ADMIN_PRODUCTS.replace(':productId?', productId || (productId === null ? '-1' : params.productId) || '-1')
            .replace(':tab?', tab || (tab === null ? '-1' : params.tab) || '-1')
            .replace(':format?', Number.isInteger(format) ? format : (format === null ? '-1' :  params.format) || '-1');

        props.history.push({pathname:newUrl, state:{name: name }});
    };

    const locationParams = props.match.params;
    return <OnlyAuth onlyAdmin>
        <Page>
            <PageInner>
                {locationParams.productId > 0 || locationParams.productId === 'new' ?
                    <CurrentProduct setUrl={setUrl} currentProductId={locationParams.productId} tab={locationParams.tab} format={locationParams.format}/>
                    :
                    <ProductsList history={props.history} setUrl={setUrl}/>
                }
            </PageInner>
        </Page>
    </OnlyAuth>
};

export default withRouter(AdminProducts);