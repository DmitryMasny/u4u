// @ts-ignore
import React from 'react';

import styled from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles';

// @ts-ignore
import { Select } from 'components/_forms';

import {
    IcategoryItemProps,
    IcategoriesList,
} from '__TS/interfaces/shop';


/** Styles */
const CategoriesListStyled = styled('div')`
    display: flex;
    flex-direction: column;
    padding-left: 10px;
`;

const CategoryItem = styled('div')`
    padding: 5px 0;
    color: ${ ({ active }: IcategoryItemProps) => active ? COLORS.TEXT_WARNING : COLORS.TEXT};
    cursor: ${ ({ active }: IcategoryItemProps) => active ? 'default' : 'pointer'};
    &:hover {
        color: ${ ({ active }: IcategoryItemProps) => active ? COLORS.TEXT_WARNING : COLORS.TEXT_PRIMARY};
    }
`;


/**
 * Панель с фильтрами Витрины
 */
const CategoriesList: React.FC<IcategoriesList> = ({isMobile, category, categoriesList, setCategory}): any => {
    if (!categoriesList) return null;

    // @ts-ignore
    return isMobile ?
        <Select
            list={categoriesList}
            onSelect={setCategory}
            selectedId={category}
        />
        :
        <CategoriesListStyled>
        {categoriesList.map((c)=>
            <CategoryItem onClick={()=>setCategory(c.id)} active={c.id === category} key={c.id}>
                {c.name}
            </CategoryItem>
        )}
    </CategoriesListStyled>;
};

export default CategoriesList;
