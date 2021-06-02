// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';
// @ts-ignore
import Navbar from 'components/Navbar';

import {MY_SHOP_STATUSES} from "./_config";

import {ImyShopTopPanel} from "../../interfaces/admin/adminShop";



/** Styles */
const MyShopTopPanelStyled = styled('div')`
    display: flex;
    width: 100%;
    height: 50px;
    align-items: flex-start;
`;


/**
 * Панель с фильтрами Витрины
 */
const MyShopTopPanel: React.FC<ImyShopTopPanel> = ( { isMobile, tab, setTab } ): any => {

    // @ts-ignore
    return <MyShopTopPanelStyled>
        {    // @ts-ignore

            <Navbar selectTabAction={ setTab }
                currentTab={ tab }
                // isMobile={ isMobile }
                tabs={ MY_SHOP_STATUSES }
                disabled={ false }
        />}

    </MyShopTopPanelStyled>;
};

export default MyShopTopPanel;
