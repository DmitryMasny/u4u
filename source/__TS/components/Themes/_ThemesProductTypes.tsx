// @ts-ignore
import React, {useEffect} from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import { IThemesProductTypes } from "__TS/interfaces/themes";

import {
    themesProductTypesSelector,
    windowIsMobileSelector,
    themesAdminProductGroupsSelector
} from "./_selectors";
import {ThemesProductTypesStyled} from "./_styles";
// @ts-ignore
import Navbar from 'components/Navbar';

// @ts-ignore
import { Select } from 'components/_forms';

/**
 * Список типов продуктов галереи тем
 */
const ThemesProductTypes: React.FC<IThemesProductTypes> = ({compact, selectedProductType, setProductTypeAction, isAdmin = false}) => {

    // const productTypes = useSelector(themesProductTypesSelector);
    const productTypes = isAdmin ? useSelector(themesAdminProductGroupsSelector) : useSelector(themesProductTypesSelector);

    const isMobile = useSelector(windowIsMobileSelector);

    useEffect(()=>{
        if (!selectedProductType && productTypes && productTypes.length) setProductTypeAction(productTypes[0].id);
    }, [productTypes]);

    if (!productTypes || productTypes.length < 2) return null;

    return isMobile || compact ?
        <div className="filterGroup">
            <div className="filterTitle">Тип продукта:</div>
            <Select
                list={productTypes}
                onSelect={setProductTypeAction}
                selectedId={selectedProductType}
            />
        </div>
        :
        <ThemesProductTypesStyled>
            {/*// @ts-ignore*/}
            <Navbar selectTabAction={ id => setProductTypeAction( id ) }
                    currentTab={ selectedProductType }
                    tabs={ productTypes }
                    height={ 30 }
            />
    </ThemesProductTypesStyled>
}

export default ThemesProductTypes;