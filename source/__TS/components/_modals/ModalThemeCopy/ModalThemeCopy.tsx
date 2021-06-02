// @ts-ignore
import React, { useState, useEffect, useContext, memo, useCallback } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import { TYPES } from 'const/types';
// @ts-ignore
import { useHistory } from "react-router-dom";
// @ts-ignore
import { generateThemesUrl } from "__TS/libs/tools";

// @ts-ignore
import { Input, Select, FormGroup } from 'components/_forms';
// @ts-ignore
import { ModalContext } from 'components/Modal';

// @ts-ignore
import styled from 'styled-components';

// @ts-ignore
import { themesAdminProductGroupsSelector } from "__TS/components/Themes/_selectors";

// @ts-ignore
import { copyThemeAction } from "__TS/actions/themes";

// @ts-ignore
import { modalAdminThemeCopySelector } from "__TS/selectors/modals";

// @ts-ignore
import Spinner from "__TS/components/_misc/Spinner/Spinner";

/** Actions */

/** Interfaces */
interface IproductType {
    id: string;
    title: string;
}

/** Styles */
const ModalCreateThemeStyled = styled( 'div' )`
    .marginBlock {
        margin-bottom: 15px;
    }
`;

/**
 * Модалка загрузки стикеров
 */
const ModalThemeCopy = () => {
    const { setModal, closeModal } = useContext( ModalContext );
    const modalData = useSelector( modalAdminThemeCopySelector );

    const productTypesSelector: IproductType[] = useSelector( themesAdminProductGroupsSelector );

    const [ loading, setLoading ] = useState( false );
    const [ themeName, setThemeName ] = useState( '' );
    const [ productType, setProductType ] = useState( null );
    const [ productTypes, setProductTypes ] = useState( null );

    const history = useHistory();

    const createThemeHandler = useCallback( () => {
        setLoading( true );
        copyThemeAction( {
            themeId: modalData.themeId,
            themeName: themeName,
            productType: productType,
            callback: (r) => {
                closeModal()
                modalData.onClose && modalData.onClose()
                // history.push( generateThemesUrl( { isAdmin: true, productType: productType, themeId: r.newThemeId } ) );
            }
        } )
    }, [ productType, themeName, history ] );

    /** Обновление футера модалки */
    useEffect( () => {
        setModal( {
            footer: [
                { type: TYPES.DIVIDER },
                {
                    type: TYPES.BTN, text: loading ? <Spinner delay={ 0 } size={ 24 }/> : 'Создать копию',
                    primary: true, action: createThemeHandler, disabled: loading || !productType
                },
                { type: TYPES.DIVIDER },
            ]
        } );
    }, [ productType, loading, themeName ] );

    useEffect( () => {
        if ( !productTypes && productTypesSelector && modalData ) {
            setProductTypes( productTypesSelector );
        }
        if ( !themeName && modalData ) {
            setThemeName( modalData.themeName );
        }
    }, [ productTypes, productTypesSelector, modalData ] );

    useEffect( () => {
        if ( !productType && productTypes ) {
            setProductType( modalData.productGroup || productTypes[0].id );
        }
    }, [ productType, productTypes ] );

    if ( !productTypes ) return null;

    return <ModalCreateThemeStyled>
        <Input label={'Название темы'}
               disabled={loading}
               value={themeName || ''}
               onChange={(e)=>setThemeName(e.target.value)}
               autoFocus
        />
        <FormGroup label={ 'Новый тип продукта' }>
            <Select
                list={ productTypes }
                onSelect={ setProductType }
                selectedId={ productType }
                disabled={ loading }
            />
        </FormGroup>
    </ModalCreateThemeStyled>;

};

export default memo( ModalThemeCopy );



