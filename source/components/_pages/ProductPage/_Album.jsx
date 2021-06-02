import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import { Wrapper } from 'components/Page';
import Select from 'components/_forms/Select';
import FilterBtn from 'components/FilterBtn';
import CoverPreview from 'components/CoverPreview';
import CoverFormatsPreview from 'components/CoverFormatsPreview';
import { Btn, Slider } from 'components/_forms';

import FilterBtnProductIcon from 'components/FilterBtnProductIcon';
import {IconHelp} from 'components/Icons';
import s from './product.scss';

import styled, { css } from 'styled-components';

import { NavLink } from 'react-router-dom'

import LINKS_MAIN from "config/links";
import TEXT from 'texts/main';
import TEXT_PRODUCT from 'texts/product';
import TEXT_GALLERY from 'texts/gallery';
import lexem from 'libs/lexems';
import Pencil from 'components/Pencil'
import HelpHover from 'components/HelpHover'

let yaMetric = null;
//если server рендер, не подключаем yandexEcommerce
if ( !process.env.server_render ) {
    yaMetric = import('libs/yandexEcommerce');
}

import { objectToBase64 } from 'libs/converters';
import ProductInfo from './_Info';
import ProductTable from './_Table';

/** styles */
const ProductDiv = styled('div')`
    display: flex;
    @media only screen and (max-width: 767px) { //$media-sm
        flex-wrap: wrap;
        margin: 0 0 15px; //$main-margin-bottom;
    }
`;
const ProductDivLeft = styled( 'div' )`
    width: 50%;
    padding: 0 80px 0 70px;
    margin-top: 10px;
    align-items: center;
    @media only screen and (max-width: 991px) { //$media-md
        padding: 0 40px;
    }
    @media only screen and (max-width: 767px) { //$media-sm 
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 30px;//$main-margin;
        padding: 0;
    }
`;
const ProductDivRight = styled( 'div' )`
    width: 50%;
    padding-left: 40px;
    @media only screen and (max-width: 991px) { //$media-md
        padding-left: 20px;
    }
    @media only screen and (max-width: 767px) { //$media-sm
        padding-left: 0;
        width: 100%;
    }
`;

const ProductDivPreview = styled('div')`
    position: relative;
    max-width: 320px;
    margin: 30px 0 30px;
    @media only screen and (max-width: 767px) { //$media-sm 
        width: 50%;
        padding-right: 10px;//$main-padding;
    }
    @media only screen and (max-width: 577px) { //$media-sx
        width: 100%;
        padding: 0 10px;//$main-padding;
        min-width: 280px;
    }
    
    // тема выбрана - меняем высоту с учетом кнопок
    ${( { themeChosen } ) => themeChosen && css` 
         margin-bottom: 60px;
    `};
    
    //фиксы для форматов превью 
    ${( { productPreviewSelectedFormatId } ) => {
        // 1 фикс для 30x30
        // 2 фикс для 20x20
        // 3 фикс для 30x20
        // 4 фикс для 20x30        
        switch ( productPreviewSelectedFormatId ) {
            case 3:
                return css`
                    margin-top: 80px;
                `;
            case 4:
                return css`
                    max-width: 218px;
                    margin-left: auto;
                    margin-right: auto;
                    min-width: 200px;
                `;
            default:
                return null;
        }
    }};
    
    
    
`;
const ProductSpanStatus = styled( 'span' )`
    width: 100%;
    margin-top: 20px;
    @media only screen and (max-width: 767px) { //$media-sm 
        width: 50%;
        padding-left: 10px;//$main-padding;
        margin-top: 50px;
    }
    @media only screen and (max-width: 577px) { //$media-xs
        width: 100%;
        padding: 0 10px;//$main-padding;
        margin-top: 20px;
    }
`;
const ProductSpanStatusItem = styled( 'span' )`
    display: block;
    margin-bottom: 3px;
    
    ${( { typeTime } ) => typeTime && css`
        color: #2598cd; //$color-text-info;
        margin-top: 10px;
    `};        
`;
const ProductSpanStatusLabel = styled( 'span' )`
    color: #6e7a8e;//$color-raven;
`;
const ProductDivTitle = styled('div')`
    font-size: 18px;
    margin-bottom: 10px;//$main-padding;
    text-transform: uppercase;
    font-weight: 600;
    &:not(:first-child) {
        margin-top: 30px;//$main-margin;
    }     
`;
const ProductDivPagedNeed = styled( 'div' )`
    margin-top:10px;
    margin-left:10px;
    color: #2598cd;//$color-text-info;
`;
const ProductDivFilterRow = styled( 'div' )`
        padding: 2px;
        max-height: 350px;
        overflow-x:hidden;
        overflow-y:auto;
        margin-bottom: 10px;// $main-padding;
        @media only screen and (max-width: 991px) { //$media-md
            max-height: 260px;
        }
`;


class Product extends Component {
    constructor( props ) {
        super(props);

        const { productsList,
                productsSelected,
                match: { params:url },
                getProductByCoverAndBindingType,
                getFormatDataByFormatId
        } = props;
        //если это не калькулятор, но смена типа обложки сопровождается сменой URL, добавляем ссылки в продукты
        if (!props.calculator) productsList.map( prod => prod.link = {
            path: LINKS_MAIN.PHOTOBOOKS.replace( ':coverType-:bindingType', [ prod.coverType, prod.bindingType ].join( '-' ) )
        });

        //получим текущий продукт по выбранному переплету и креплению
        const currentProduct = getProductByCoverAndBindingType({
            products: productsList,
            bindingType: url.bindingType,
            coverType:   url.coverType
        });

        //получим текущий выбранный формат
        const format = getFormatDataByFormatId( {formats: currentProduct.formats, id: productsSelected.formatId });

        //созданим локальный state по выбранным параметрам
        this.state = {
            selected: this.createSelectedProductObject({ currentProduct: currentProduct, productsSelected: productsSelected, format:format}),
            formats: currentProduct.formats,
            coverLaminationTypes: currentProduct.coverLaminationTypes,
            countOfPages: 0,  //для калькулятора
            products: productsList,
            selectedTypeKey: currentProduct.id || 0,
            pagesNum: currentProduct.pages.fix, //начальное значение страниц для калькулятора
        };

        if (!this.props.calculator) {
            if ( yaMetric ) {
                yaMetric.then(( t )=> {
                    t.YaMetric_ShowProduct( {
                                                       id: this.state.selected.id,
                                                       bindingType: this.state.selected.bindingType,
                                                       coverType: this.state.selected.coverType,
                                                       coverLaminationType: this.state.selected.coverLaminationType,
                                                       format: [ this.state.width, this.state.height ].join( 'x' ),
                                                       price: this.state.selected.format.price
                                                   } );
                });

            }
        }
    }
    createSelectedProductObject = ( { currentProduct, productsSelected, format, id } ) => {

        let currentSelectedLamination = null;

        if (!~currentProduct.coverLaminationTypes.indexOf(productsSelected.coverLaminationType) || productsSelected.coverLaminationType ) {
            currentSelectedLamination = currentProduct.coverLaminationTypes[0];
        } else {
            currentSelectedLamination = productsSelected.coverLaminationType;
        }

        return {
            bindingType: currentProduct.bindingType,
            coverType: currentProduct.coverType,
            format: format,
            pages: currentProduct.pages,
            coverLaminationType: currentSelectedLamination,
            id: id || currentProduct.id,
        }
    };
    setFormats( {bindingType, coverType, products, selected } ) {
        const {
            productsSelected,
            getProductByCoverAndBindingType,
            getFormatDataByFormatId
        } = this.props;
        const currentProduct = getProductByCoverAndBindingType( {
                                                                    products: products,
                                                                    bindingType: bindingType,
                                                                    coverType: coverType
                                                                } );

        //получим текущий выбранный формат
        const format = getFormatDataByFormatId( {formats: currentProduct.formats, id: selected.format.id });

        this.setState({
                          selected: this.createSelectedProductObject({
                                                                         currentProduct: currentProduct,
                                                                         productsSelected: productsSelected,
                                                                         format: format
                                                                     }),
                          formats: currentProduct.formats,
                          pagesNum: currentProduct.pages.fix,
                          coverLaminationTypes: currentProduct.coverLaminationTypes,
                      });
    }

    shouldComponentUpdate( nextProps, nextState ) {
        const {
            match: { params:currentUrl }
        } = this.props;
        const { products, selected } = this.state;
        const { match: { params:nextUrl } } = nextProps;
        const { selected:nextSelected } = nextState;

        const productPreviewDataNext = nextProps.productsSelectedThemeSelector( nextState.selected.format.id );
        if ( products && (currentUrl.bindingType !== nextUrl.bindingType || currentUrl.coverType !== nextUrl.coverType) ) {

            this.setFormats({
                                products: products,
                                bindingType: nextUrl.bindingType,
                                coverType: nextUrl.coverType,
                                selected: selected
                            });

            return false;
        }

        //если нет данных о других форматах группы, получаем данные с сервера
        if ( !productPreviewDataNext && !nextState.calculator && !nextProps.productsSelectedLoadingThemesSelector && nextProps.productsSelectedGroupIdSelector ) {
            nextProps.productGetThemeDataAction( nextProps.productsSelectedGroupIdSelector );
        }

        //для калькулятора
        if ( nextProps.calculator ) {
            const idChangedBindingCoverType = (selected.bindingType !== nextSelected.bindingType || selected.coverType !== nextSelected.coverType);
            if ( idChangedBindingCoverType ) {

                this.setFormats({
                                    products: products,
                                    bindingType: nextSelected.bindingType,
                                    coverType: nextSelected.coverType,
                                    selected: selected
                                });
                return false;
            }
        } else {
            if (!nextProps.serverRender) {
                //если это не калькулятор, отправляем статистику в Ya.Metrik.Ecommerce
                if ( yaMetric ) {
                    yaMetric.then(( t )=> {
                        t.YaMetric_ShowProduct( {
                                                           id: nextSelected.id,
                                                           bindingType: nextSelected.bindingType,
                                                           coverType: nextSelected.coverType,
                                                           coverLaminationType: nextSelected.coverLaminationType,
                                                           format: [ nextSelected.format.width, nextSelected.format.height ].join( 'x' ),
                                                           price: nextSelected.format.price
                                                       } );
                    });
                }
            }
        }

        /*
        if (productPreviewDataPrev !== productPreviewDataNext) {
            if ( productPreviewDataNext && productPreviewDataNext.id ) {
                this.setState( prevState => {

                    console.log('prevState', prevState);
                    const selected = nextState.selected;
                    selected.id = productPreviewDataNext.id;

                    return {
                        selected: selected
                    }
                });
                return false;
            }
        }*/

        return true;
    }

    /**
     * Собираем объект выбранных параметров
     * @param product
     */
    constructorSelectedData = ( product ) => {
        let selected = product,
            sameFormat = null;

        const formatCurrent = this.state.selected.format;

        //найдем такой же формат, если нет то будем ставить активным первый по списку
        if ( formatCurrent ) {
            Object.values( product.formats ).map( ( item ) => {
                if ( item.width === formatCurrent.width && item.height === formatCurrent.height ) {
                    sameFormat = item;
                }
            } );
        }

        selected.format = sameFormat || product.formats[0];
        selected.coverLaminationType = product.coverLaminationTypes[0];
        return selected;
    };

    /**
     * обновляем выбранный тип книги
     * @param key {Number}
     */
    handlerSelectProductType  = ( key )  => {
        //обновляме локальный state
        const newProductSelected = this.constructorSelectedData( this.state.products.find((p)=>p.id === key));
        this.setState({
            selected: newProductSelected,
            selectedTypeKey: key,
            pagesNum: newProductSelected.pages.fix
        });
        this.props.history.push( this.props.match.path.replace( ':coverType-:bindingType', [newProductSelected.coverType, newProductSelected.bindingType ].join( '-' )));
    };
    /**
     * обновляем тип выбранного формата
     * @param format
     */
    handlerSelectProductFormat = ( format ) => {
        this.setState(
            {
                selected : {
                    ...this.state.selected,
                    format: format
                }
            }
        )
    };
    handlerSelectCoverLamination  = ( coverLaminationType ) => {
        this.setState(
            {
                selected : {
                    ...this.state.selected,
                    coverLaminationType: coverLaminationType
                }
            }
        )
    };

    handlerChangePages = ( value ) => this.setState( { pagesNum : value } );

    calculatePrice = ( pagesConfig, formatConfig, pages ) => {
        const { fix } = pagesConfig,
              { price, more } = formatConfig;

        //сколько сраниц больше входящих в цену
        const overflow = pages - fix;

        return price + (overflow <= 0 ? 0 : overflow * more);
    };
    toggleCalculator = (  ) => {
        if (this.props.calculator) {
            const {coverType, bindingType} = this.state.selected;

            this.props.history.push( LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', [ coverType, bindingType ].join( '-' )) );
        } else this.props.history.push( LINKS_MAIN.PRICES );
    };

    saveData = () => {
        const productPreviewData = this.props.productsSelectedThemeSelector( this.state.selected.format.id );

        let theme = {};
        if ( productPreviewData ) {
            theme = productPreviewData
        } else {
            theme = this.props.productsSelected['theme'];
        }


        this.props.HOCProductSaveDataAction( this.state.selected );

        //если есть id выбранной темы
        if ( theme.id ) {
            //переадресация в редактор
            //так как в redux операция асинхронна, ждем завершения цикла для актуализации данных (пользуем timeout)
            setTimeout(()=> {
                this.props.generateLayoutAction( theme , this.state.selected );
            })
        } else {
            this.props.history.push( '/sozdat-fotoknigu/' );  //TODO: поставить правильный URL
        }
    };

    render () {
        //если не получили продукты и нет типа ФОТОНИГИ (PRODUCT_TYPE_PHOTOBOOK), прерываем
        if ( !this.state.products ) return null;

        const { calculator, productsSelectedThemeSelector, productsSelectedGroupIdSelector, productGetThemeDataAction, modalGalleryThemeInfoAction } =  this.props;
        const { theme } = this.props.productsSelected;

        //получаем типы продуктов
        const {
            products,
            coverLaminationTypes,
            formats,
            selected,
            pagesNum,
        } = this.state;

        //console.log('coverLaminationTypes', coverLaminationTypes);

        //фильтр форматов
        const photoBookFormatFilter = Object.values( formats ).map( ( f, key ) => {
            return <FilterBtn onClick={() => this.handlerSelectProductFormat( f )}
                              active={f.id === selected.format.id}
                              icon={
                                  <FilterBtnProductIcon width={f.width}
                                                        height={f.height}
                                                        type={selected.format}
                                  />
                              }
                              title={f.width + ' x ' + f.height}
                              type={selected.format}
                              key={key}/>
        } );

        //фильтр типов ламинации обложки
        const photoBookCoverLamination = coverLaminationTypes.map( ( item, key ) => {
            return <FilterBtn onClick={() => this.handlerSelectCoverLamination( item )}
                              active={item === selected.coverLaminationType}
                              title={lexem('COVER', item)}
                              key={key}/>
        } );

        //расчет стоимости продукта
        const productTotalPrice = this.calculatePrice( selected.pages, selected.format, pagesNum );

        //список информации о выбранном образце фотокниги
        const productStatus = [
            { value: TEXT[selected.name] },
            { label: 'Формат: ', value: `${selected.format.width} x ${selected.format.height} см.` },
            { label: 'Обложка: ', value: lexem('COVER', selected.coverLaminationType.toUpperCase()) },
            ... selected.paperPagesDestiny ? [{ label: 'Плотность бумаги страницы: ', value: `${selected.paperPagesDestiny} гр/м` }] : [],
            //{ label: 'Количество страниц: ', value: pagesNum },
            { label: `До ${selected.pages.fix} страниц  – `, value: `${selected.format.price} руб.` },
            { label: 'Дополнительная страница – ', value: `${selected.format.more} руб.` }
        ].map( ( item, key ) => {
            return (
                <ProductSpanStatusItem key={key}>
                    {item.label && <ProductSpanStatusLabel>{item.label}</ProductSpanStatusLabel>}
                    {item.value && <span>{item.value}</span>}
                </ProductSpanStatusItem>);
        } );

        let previewSrc = '';
        let pencilHeight = 30; // Высота карандашика для калькулятора (см.)
        if (!calculator){
            switch( selected.format.id ) {
                case 2:  //20x20
                    previewSrc = '/media/prodprev/3622/0_4d508e8b-06cb-475e-98bd-8b1cfdd2d3a5.jpg';
                    pencilHeight = 20;
                    break;
                case 3:  //30x20
                    previewSrc = '/media/prodprev/3632/0_95b35aa7-368f-4db5-aa74-a4df39c9b908.jpg';
                    pencilHeight = 20;
                    break;
                case 4:  //20x30
                    previewSrc = '/media/prodprev/3627/0_4f3e75f7-2359-4e63-98d6-2212a36ae31c.jpg';
                    pencilHeight = 30;
                    break;
                case 5:  //30x30
                    previewSrc = '/media/prodprev/3617/0_36302adb-17f1-4d03-aa8e-2d96b49d757f.jpg';
                    pencilHeight = 30;
                    break;
            }
        }

        // высота карандаша = (размер реал. карандаша(см)) / (высота книги в превью(см)) * 100%
        pencilHeight =  Math.round(18/pencilHeight * 100);

        const productPreviewData = productsSelectedThemeSelector( selected.format.id );
        const preview = productPreviewData && productPreviewData.preview || null;
        const themeId = productPreviewData && productPreviewData.id || null;

        // Блок генерации ссылки
        let fastLink = null;
        if ( this.props.userRoleSelector === 'admin' ) {

            const { bindingType, coverType, formatId, pages, id, groupId, theme } = this.props.productsSelected;

            const previewFormat = theme[`preview_format_${groupId}_${formatId}`];

            if (previewFormat) {
                fastLink = {
                    modal: {
                        formatId: formatId,
                        groupId: groupId,
                        id: theme.id,
                        name: theme.name,
                        previewCover: previewFormat.preview
                    },
                    product: {
                        bindingType: bindingType,
                        coverType: coverType,
                        formatId: formatId,
                        id: id,
                        pages: pages,
                        theme: theme || null
                    },
                    type: 'showPreviewAlbum'
                };
            }
        }

        /**
         const productPreviewClass = s.productPreview
         + ((!calculator ) ? ` ${s['productPreviewS'+selected.format.id] || ''}`: '')
         + (theme.id ? ` ${s.themeChosen}`: '');
        */

        return (
            <Wrapper>
                <ProductDiv>
                    <ProductDivLeft>
                        <ProductDivPreview themeChosen={!!theme.id} productPreviewSelectedFormatId={!calculator ? selected.format.id : null}>
                            {calculator
                                ?
                                <CoverFormatsPreview width={selected.format.width} height={selected.format.height} />
                                :

                                (themeId ?
                                    <Fragment>
                                        <CoverPreview clickChild={()=>modalGalleryThemeInfoAction({   name: theme.name,
                                                                                                      formatId: selected.format.id,
                                                                                                      id: themeId,
                                                                                                      onlyPreview: true
                                                                                                  })}
                                                      src={preview}
                                                      formatId={selected.format.id}
                                                      coverType={selected.coverType}
                                                      bindingType={selected.bindingType}
                                                      gloss={selected.coverLaminationType}
                                        />
                                        <div className={s.albumTitle}>
                                            Тема: {theme.name}
                                            <NavLink className={s.ml} to={LINKS_MAIN.GALLERY.replace(':categoryId?', '').replace(':categoryId', '')}>
                                                {TEXT.RESELECT_THEME}
                                            </NavLink>
                                        </div>
                                    </Fragment>
                                    :
                                    <CoverPreview src={previewSrc}
                                                  formatId={selected.format.id}
                                                  coverType={selected.coverType}
                                                  bindingType={selected.bindingType}
                                                  gloss={selected.coverLaminationType}
                                    />
                                )
                            }
                            <Pencil height={pencilHeight} isOldStyle={true}/>
                        </ProductDivPreview>
                        <ProductSpanStatus>
                            {productStatus}
                            <ProductSpanStatusItem typeTime={true} warning={selected.bindingType === 'glue'}>
                                <ProductSpanStatusLabel>Срок изготовления:&nbsp;</ProductSpanStatusLabel>
                                <span>{selected.bindingType === 'glue' ? '2-3 рабочих дня'  : '1-2 рабочих дня' }</span>
                            </ProductSpanStatusItem>
                        </ProductSpanStatus>
                    </ProductDivLeft>
                    <ProductDivRight>
                        <ProductDivTitle>{TEXT_PRODUCT.BINDING_TYPE}:</ProductDivTitle>

                        <Select
                            list={products}
                            selectedId={this.state.selectedTypeKey}
                            onSelect={this.handlerSelectProductType}
                        />
                        <ProductDivPagedNeed>от {selected.pages.min} до {selected.pages.max} страниц</ProductDivPagedNeed>

                        <ProductDivTitle>{TEXT.FORMAT}:</ProductDivTitle>
                        <ProductDivFilterRow>{photoBookFormatFilter}</ProductDivFilterRow>

                        <ProductDivTitle>{TEXT.COVER}:</ProductDivTitle>
                        <ProductDivFilterRow>{photoBookCoverLamination}</ProductDivFilterRow>

                        {/*<div className={s.productTitle}>Толщина бумаги:</div>*/}
                        {calculator &&
                            <Fragment>
                                <ProductDivTitle>
                                    {TEXT_PRODUCT.PAGES_QUANTITY}:
                                    <HelpHover>
                                        {TEXT_PRODUCT.TOOLTIP_TEXT}
                                    </HelpHover>
                                </ProductDivTitle>
                                <div className={s.pagesSlider}>
                                    <Slider min={selected.pages.min}
                                            max={selected.pages.max}
                                            value={pagesNum}
                                            step={selected.pages.step}
                                            onChange={this.handlerChangePages}
                                    />
                                </div>
                            </Fragment>
                        }


                        <ProductDivTitle>{TEXT_PRODUCT.PRICE}:</ProductDivTitle>
                        <div className={s.productTotalPrice}>
                            {!calculator && <span>От </span>}
                            {productTotalPrice.toString().replace( /(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ' )} руб.
                        </div>
                        <div>
                            {calculator ?
                                <Btn intent="primary" onClick={this.toggleCalculator} className={s.mr} large>
                                    {TEXT.CONTINUE}
                                </Btn>
                                :
                                <Btn intent="primary" className={s.mr} large onClick={()=>this.saveData()}>
                                    {theme.id ? TEXT.CREATE : TEXT_GALLERY.CHOOSE}
                                </Btn>
                            }

                            {!calculator && <NavLink className={s.mr} to={LINKS_MAIN.GALLERY.replace(':categoryId?', '')}>
                                <Btn  large >
                                    {theme.id ? TEXT.RESELECT_THEME : TEXT.SELECT_THEME}
                                </Btn>
                            </NavLink>}

                            {!calculator && <Btn onClick={this.toggleCalculator} large >
                                {TEXT.CALCULATOR}
                            </Btn>}
                        </div>
                    </ProductDivRight>
                </ProductDiv>

                {fastLink &&
                    <div>
                        <input type="text" style={{'position':'absolute', 'bottom':10, 'left': 10, width: '70%'}} value={window.location.origin + '/sozdat-fotoknigu/' + objectToBase64(fastLink)} />
                    </div>
                }

                {calculator ? <ProductTable /> : <ProductInfo/>}


            </Wrapper>);
    }
}

export default withRouter( Product );



