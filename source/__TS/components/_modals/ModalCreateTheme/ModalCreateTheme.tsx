// @ts-ignore
import React, {useState, useEffect, useContext, memo, useCallback} from 'react';
// @ts-ignore
import {useSelector} from "react-redux";
// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import { useHistory } from "react-router-dom";
import { generateThemesUrl } from "__TS/libs/tools";

// @ts-ignore
import {Input, Select, FormGroup} from 'components/_forms';
// @ts-ignore
import { ModalContext} from 'components/Modal';

// @ts-ignore
import styled from 'styled-components';


import {
    themesAdminCategoriesSelector,
    themesProductTypesSelector,
    themesAdminProductGroupsSelector
} from // @ts-ignore
        "__TS/components/Themes/_selectors";
import {createNewThemeAction} from // @ts-ignore
        "__TS/components/Themes/_actions";

import { modalCreateThemeSelector } from "../../../selectors/modals";
import Spinner from "../../_misc/Spinner/Spinner";

/** Actions */

/** Interfaces */
interface ImodalUploadStickers {

}
interface IproductType {
    id: string;
    title: string;
}

/** Styles */

const ModalCreateThemeStyled = styled('div')`
    .marginBlock {
        margin-bottom: 15px;
    }
`;

/**
 * Модалка загрузки стикеров
 */
const ModalCreateTheme: React.FC<ImodalUploadStickers> = () => {
    const {setModal, closeModal} = useContext(ModalContext);
    const modalCreateThemeData = useSelector(modalCreateThemeSelector);

    const productTypes: IproductType[] = useSelector(themesAdminProductGroupsSelector);
    const categories = useSelector(themesAdminCategoriesSelector);

    const [loading, setLoading] = useState(false);
    const [themeName, setThemeName] = useState('');
    const [productType, setProductType] = useState(null);
    const [themeCategory, setThemeCategory] = useState(0);

    const history = useHistory();

    const createThemeHandler = useCallback(()=>{
        setLoading(true);
        createNewThemeAction({themeName, productType, themeCategory, callback: (r)=> {
            // console.log('createTheme callback',r);
            history.replace(generateThemesUrl({isAdmin: true, productType: productType, themeId: r.themeId }));
            closeModal();
        }})
    }, [themeName, productType, themeCategory]);

    /** Обновление футера модалки */
    useEffect(()=>{
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: loading ? <Spinner delay={0} size={24} /> : 'Готово', intent: 'primary', action: createThemeHandler, disabled: loading || !themeName || !productType || !themeCategory },
                {type: TYPES.DIVIDER},
            ]
        });
    }, [themeName, productType, themeCategory, loading]);
    useEffect(()=>{
        if (!productType && productTypes) {
            setProductType(modalCreateThemeData || productTypes[0].id);
        }
    }, [productType, productTypes]);

    if (!productTypes || !categories) return null;

    return <ModalCreateThemeStyled>
        <Input label={'Название темы'}
               disabled={loading}
               value={themeName || ''}
               onChange={(e)=>setThemeName(e.target.value)}
               autoFocus
        />
        <FormGroup label={'Тип продукта'}>
            <Select
                list={productTypes}
                onSelect={setProductType}
                selectedId={productType}
                label={'тип продукта'}
                disabled={loading}
            />
        </FormGroup>
        <FormGroup label={'Категория'}>
            <Select
                list={categories}
                onSelect={setThemeCategory}
                selectedId={themeCategory}
                disabled={loading}
            />
        </FormGroup>
    </ModalCreateThemeStyled>;

};

export default memo(ModalCreateTheme);



