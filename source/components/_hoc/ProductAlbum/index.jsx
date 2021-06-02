import React, { Component } from 'react';
import connect from "react-redux/es/connect/connect";

import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'

import { productTypesGetAction, productSaveDataAction, productGetThemeDataAction } from "components/_pages/ProductPage/actions";
import {
    productsSelector,
    productsSelectedSelector,
    productsSelectedThemeSelector,
    productsSelectedGroupIdSelector,
    productsSelectedLoadingThemesSelector
} from "components/_pages/ProductPage/selectors";

import { userRoleSelector } from "selectors/user";

import lexem from 'libs/lexems';
import {findProductByCoverAndBindingType} from 'libs/helpers';

import Spinner from 'components/Spinner';
import { GALLERY_FORMAT, GALLERY_TYPE } from 'const/metrics'
import sendMetric from 'libs/metrics'
import { generateLayoutAction }  from 'actions/layout';
import { modalGalleryThemeInfoAction } from "components/_pages/GalleryPage/actions/themes";

/**
 * HOC Компонент, получения и сохранения параметров альбома
 */
class ProductAlbum extends Component {
    products = [];

    /**
     * Устанавливаем выбранную тему в redux
     * @param theme
     */
    setThemeSelected = ( theme ) => {
        this.props.productSaveDataAction({
            groupId: theme.groupId,
            theme: {
                name: theme.name,
                id: theme.id,
                [`preview_format_${theme.groupId}_${theme.formatId}`]: {
                    id: theme.id,
                    preview: theme.previewCover
                },
            }
        });
    };

    /**
     * выставляем выбранный продукт по его id
     * так же вычисляем доступный формат и меням, если выбранный не подходит
     * @param id
     */
    setProductTypeSelected = ( id ) => {

        const product = this.getProductById( id ),
              { formatId } = this.props.productsSelectedSelector;

        if ( product ) {
            sendMetric( GALLERY_TYPE );
            const format = this.getFormatDataByFormatId( {formats: product.formats, id: formatId } );
            this.props.productSaveDataAction({
                id: id,
                bindingType: product.bindingType,
                coverType: product.coverType,
                formatId:  format.id,
                pages: product.pages
            });
        }
    };

    /**
     * получить доступные форматы по текущему выбранному продукту
     * @returns {array}
     */
    getAvailableFormatsBySelectedProduct = () => {
        const { id } = this.props.productsSelectedSelector,
              product = this.getProductById( id );
        return product && product.formats;
    };

    /**
     * получить id доступных форматов по текущему выбранному продукту
     * @returns {array}
     */
    getAvailableFormatsBySelectedProductOnlyIdsArray =() => {
        const arr = this.getAvailableFormatsBySelectedProduct();
        if (arr && arr.length) {
            return arr.map(( item ) => item.id);
        }
        return [];
    };

    /**
     * получить продукт по id
     * @param id
     * @returns {*}
     */
    getProductById = ( id ) => {
        let product = null;
        for ( let i = 0; i < this.products.length; i++ ) {
            if (this.products[i].id === id) {
                product = this.products[i];
                break;
            }
        }
        return product;
    };

    getCurrentProduct = () => this.getProductById( this.props.productsSelectedSelector.id );

    /**
     * сохраняем выбранные пользователем паратемры в redux
     * @param data
     */
    HOCProductSaveDataAction = ( data ) => {
        const d = {
            id: data.id,
            pages: data.pages,
            bindingType: data.bindingType,
            coverType: data.coverType,
            formatData: data.format,
            formatId: data.format && data.format.id,
            coverLaminationType: data.coverLaminationType,
        };

        if (data.paperPagesDestiny) d.paperPagesDestiny = data.paperPagesDestiny;

        return this.props.productSaveDataAction(d);
    };

    /**
     * установить выбранный формат
     * @param formatId
     */
    setFormatSelected = ( formatId ) => {
        sendMetric(GALLERY_FORMAT);
        this.props.productSaveDataAction({
            formatId: formatId
        });
    };

    /**
     * получаем продукт по обложке и переплету
     * @param products
     * @param coverType
     * @param bindingType
     * @returns {*}
     */
    getProductByCoverAndBindingType = ( {
                                            products = this.products,
                                            coverType = this.props.productsSelectedSelector.coverType,
                                            bindingType = this.props.productsSelectedSelector.bindingType
                                        } ) => {

        return findProductByCoverAndBindingType( {
                                                     products: products,
                                                     coverType: coverType,
                                                     bindingType: bindingType
                                                 } );
    };

    /** получения данных формата по id
     *
     * @param formats
     * @param id
     */
    getFormatDataByFormatId = ({formats, id}) => {
        //если нет id, то возвращаем первый формат из списка
        if (!id && id!==0) return formats[0];

        for ( let i = 0; i < formats.length; i++ ) {
            if ( formats[ i ].id === id ) return formats[ i ];
        }

        //если формата не нашли, возвращаем первый
        return formats[0]
    };

    getCurrentFormat = () => {
        const { id, formatId } = this.props.productsSelectedSelector,
              product = this.getProductById( id );

        return this.getFormatDataByFormatId({formats: product.formats, id:formatId});
    };

    componentDidMount() {
        const { productsSelector, productTypesGetAction } = this.props;

        //если продуктов еще нет, получаем их
        if ( !productsSelector || !productsSelector[ PRODUCT_TYPE_PHOTOBOOK ]) {
            productTypesGetAction( PRODUCT_TYPE_PHOTOBOOK );
        }
    }
    render() {

        const {
            userRoleSelector,
            children,
            productsSelector,
            productsSelectedSelector,
            productTypesGetAction,
            generateLayoutAction,
            productsSelectedThemeSelector,
            productsSelectedGroupIdSelector,
            productGetThemeDataAction,
            productsSelectedLoadingThemesSelector,
            modalGalleryThemeInfoAction,
            ...other
        } = this.props;


        if ( !productsSelector ) return <Spinner/>;

        //если есть данные фотокниг и есть их типы
        if ( !this.products.length) {
            productsSelector.map( ( item, index ) => {
                this.products[index] = {...item}; //копируем данные в новый объект, что бы убрать ссылки на redux store
                this.products[index].name = lexem( PRODUCT_TYPE_PHOTOBOOK, 'type', item.coverType, item.bindingType );
            } );
        }

        return React.Children.map(children, child =>
                    React.cloneElement(child, {
                        ...other,
                        userRoleSelector: userRoleSelector,
                        productsSelected: productsSelectedSelector,
                        generateLayoutAction: generateLayoutAction,
                        HOCProductSaveDataAction: this.HOCProductSaveDataAction,
                        getCurrentProduct: this.getCurrentProduct,
                        getProductByCoverAndBindingType: this.getProductByCoverAndBindingType,
                        getFormatDataByFormatId: this.getFormatDataByFormatId,
                        setFormatSelected: this.setFormatSelected,
                        setProductTypeSelected: this.setProductTypeSelected,
                        getAvailableFormatsBySelectedProduct: this.getAvailableFormatsBySelectedProduct,
                        getAvailableFormatsBySelectedProductOnlyIdsArray: this.getAvailableFormatsBySelectedProductOnlyIdsArray,
                        setThemeSelected: this.setThemeSelected,
                        getCurrentFormat: this.getCurrentFormat,
                        productsList: this.products,
                        productsSelectedThemeSelector: productsSelectedThemeSelector,
                        productsSelectedGroupIdSelector: productsSelectedGroupIdSelector,
                        productGetThemeDataAction: productGetThemeDataAction,
                        productsSelectedLoadingThemesSelector: productsSelectedLoadingThemesSelector,
                        modalGalleryThemeInfoAction: modalGalleryThemeInfoAction
                    } )
               );
    }
}
export default connect(
    state => ({
        userRoleSelector: userRoleSelector( state ),
        productsSelector: productsSelector( state, PRODUCT_TYPE_PHOTOBOOK ),
        productsSelectedSelector: productsSelectedSelector( state, PRODUCT_TYPE_PHOTOBOOK ),
        productsSelectedThemeSelector: ( formatId ) => productsSelectedThemeSelector( state, PRODUCT_TYPE_PHOTOBOOK, formatId ),
        productsSelectedGroupIdSelector: productsSelectedGroupIdSelector( state, PRODUCT_TYPE_PHOTOBOOK ),
        productsSelectedLoadingThemesSelector: productsSelectedLoadingThemesSelector( state, PRODUCT_TYPE_PHOTOBOOK )
    }),
    dispatch => ({
        productTypesGetAction: () => dispatch( productTypesGetAction( PRODUCT_TYPE_PHOTOBOOK ) ),
        productSaveDataAction: (data) => dispatch( productSaveDataAction( PRODUCT_TYPE_PHOTOBOOK, data ) ),
        generateLayoutAction:  ( theme, product ) => dispatch( generateLayoutAction( theme, product )),
        productGetThemeDataAction: ( groupId ) => dispatch( productGetThemeDataAction( PRODUCT_TYPE_PHOTOBOOK, groupId ) ),
        modalGalleryThemeInfoAction: ( params ) => {dispatch( modalGalleryThemeInfoAction( params ) )},
    })
)( ProductAlbum );