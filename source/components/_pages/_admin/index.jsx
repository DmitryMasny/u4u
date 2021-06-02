import React, { useState, useEffect, memo } from 'react';
import {withRouter} from "react-router-dom";
import {StyledAdminMainPage} from './_styles'
import LINKS_MAIN from "config/links";
import TEXT from "texts/main";
import { Page, PageInner } from 'components/Page';
import OnlyAuth from 'hoc/OnlyAuth';

/**
 * AdminPage
 */
const AdminPage = (props) => {

    const ADMIN_LINKS = [
        [
            {link: LINKS_MAIN.ADMIN_PRODUCTS_MAIN, name: TEXT.PRODUCTS},
            {link: LINKS_MAIN.ADMIN_OPTIONS, name: TEXT.OPTIONS},
            {link: LINKS_MAIN.ADMIN_THEMES, name: TEXT.THEMES},
            {link: LINKS_MAIN.ADMIN_STICKERS, name: TEXT.STICKERS},
        ],
        [
            {link: '/profile/admin/', name: 'старая админка', external: true},
        ]
    ];

    const goToLink = (link, external) => {
        if (external) {
            document.location.replace(link);
        } else props.history.push(link)
    };

    return <OnlyAuth onlyAdmin>
        <Page>
            <PageInner>
                <StyledAdminMainPage >
                    { ADMIN_LINKS.map((rowData, i)=><AdminPageRow data={rowData} onClick={goToLink} key={i}/>)}
                </StyledAdminMainPage>
            </PageInner>
        </Page>
    </OnlyAuth>;
};
const AdminPageRow = memo(({data, onClick}) =>  <div className={"row"}>
        { data.map((item, i)=> <AdminPageLinkItem data={item} onClick={()=>onClick(item.link, item.external)} key={i}/>)}
    </div>);

const AdminPageLinkItem = ({data, onClick}) => <div className={"item"}>
        <div className={"item-inner"} onClick={onClick}>
            {data.name}
        </div>
    </div>;

export default withRouter(AdminPage);