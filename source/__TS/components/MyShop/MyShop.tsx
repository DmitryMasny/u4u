// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { withRouter } from 'react-router-dom';
// @ts-ignore
import { useSelector } from "react-redux";
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';
// @ts-ignore
import {Page, PageInner} from "components/Page";
// @ts-ignore
import OnlyAuth from 'hoc/OnlyAuth';


// @ts-ignore
import Paginator from "components/Paginator";
// import MyShopTopPanel from "./_MyShopTopPanel";

import ProductSets from "../ProductSets/ProductSets";
import MyProductSet from "../MyProductSet/MyProductSet";

// import {MY_SHOP_STATUSES} from "./_config";
// @ts-ignore
import LINKS from "config/links";

import {
    windowIsMobileSelector,
    myShopCurrentPageSelector,
    productSetCategoriesSelector,
    myShopPagesSelector,
} from "../../selectors/shop";
import {getProductSetsPage, getProductSetCategoriesAction, setPageAction} from "../../actions/shop";
// @ts-ignore
import {
    Props,
    Ipages,
} from '../../interfaces/admin/adminShop';

/** Styles */
const MyShopWrap = styled(PageInner)`

`;


/**
 * Корневой Витрины
 */
const MyShop: React.FC<Props> = ({match, history}) => {
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const productSetsList: any = useSelector( myShopCurrentPageSelector );
    const productSetCategories: any = useSelector( productSetCategoriesSelector );
    const pages: Ipages = useSelector( myShopPagesSelector );

    // const [tab, setTab] = useState( MY_SHOP_STATUSES[0].id );
    const [categoriesList, setCategoriesList] = useState(null);


    const productId = match.params.productId;

    const redirect: (id:string, name?:string)=>any = (id, name) => {
        history.push( LINKS.MY_SHOP.replace(':productId', id), { name: name } );
    };

    if ( productId === ':productId') {
        redirect('');
        return null;
    }

    // const history = useHistory();
    // const {productId} = useParams();

    //
    // useEffect(() => {
    //     setProductSet(productSetData);
    // }, [productSetsList]);


    useEffect(() => { // TODO: in selector
        setTimeout(()=>{
            if (productSetCategories) {
                setCategoriesList(productSetCategories.map((c)=>({id: c.slug, name: c.name})));
            } else getProductSetCategoriesAction();
        }, 100);
    }, [productSetCategories]);

    useEffect(() => {
        if (!productSetsList && pages.current) getProductSetsPage(pages.current);
    }, [productSetsList]);

    const selectProductSetHandler = (id, name) => {
        redirect(id, name);
    };

// @ts-ignore
    return <OnlyAuth onlyAdmin>
        {/*// @ts-ignore*/}
    <Page>
        { !productId ?
            <MyShopWrap isMobile={ isMobile }>

                {/*<MyShopTopPanel tab={tab} setTab={setTab} isMobile={isMobile}/>*/}

                <ProductSets productSetsList={productSetsList}
                             isMobile={isMobile}
                             onSelect={selectProductSetHandler}
                             onCreate={selectProductSetHandler}
                             isAdmin
                />

                {pages.current && pages.total > 1 && pages.current &&
                <Paginator
                    currentPage={pages.current}
                    totalPages={pages.total}
                    onSelectPage={setPageAction}
                    portal
                /> || null}

            </MyShopWrap>
                :
            <MyShopWrap isMobile={ isMobile }>

                <MyProductSet id={productId} redirect={redirect} categoriesList={categoriesList}/>

            </MyShopWrap>
        }
    </Page>
    </OnlyAuth>;
};
// @ts-ignore
export default withRouter(MyShop);
