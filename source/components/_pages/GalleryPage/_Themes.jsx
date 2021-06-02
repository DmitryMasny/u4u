import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { modalGalleryThemeInfoAction, getThemesFromServerAction } from './actions/themes';
import {
    galleryThemesSelector,
    galleryThemesDataSelector,
    galleryThemesDataByParamsSelector,
    galleryPageSelector,
    //galleryCurrentFormatSelector,
    specProjectSelector,
    galleryInProgressSelector,
} from './selectors';

import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'

import CoverPreview from 'components/CoverPreview';

import Spinner from 'components/Spinner';

import s from './GalleryPage.scss';
// import TEXT from 'texts/main';

const ThemesElements = ( { themes, clickCallback, formatId, bindingType, coverType } ) => themes.map( ( theme ) => (
    <div className={`${s.theme} ${s['s' + formatId]}`} key={theme.id} onClick={()=>clickCallback( {
                                                                                                      id: theme.id,
                                                                                                      name: theme.productGroup && theme.productGroup.name || theme.name,
                                                                                                      previewCover: theme.previewCover,
                                                                                                      groupId: theme.productGroup.id,
                                                                                                      formatId: formatId
                                                                                                  } )}>
        <CoverPreview className={s.themeThumbImg}
                      classNameLoader={s.themeThumbLoader}
                      src={theme.previewCover}
                      formatId={formatId}
                      bindingType={bindingType}
                      coverType={coverType}
                      key={theme.id}
        />
        <div className={s.themeName}>
            {theme.productGroup && theme.productGroup.name || theme.name}
        </div>
    </div>
));


class Themes extends Component {
    prevPageData = null;
    prevFormatData = null;

    /*соотношение названия пропорции по id
    formatsIdToName = {
        '3': 'H',
        '4': 'V',
        '2': 'Q',
        '5': 'Q'
    };*/
    componentDidMount() {
        const { formatId } = this.props.productsSelected;

        if ( !this.props.themesDataSelector ) {
            this.props.getThemesFromServerAction({
                category: parseInt( this.props.categoryId ),
                format: parseInt( formatId ),
                page: this.props.pageSelector,
                pageSize: this.props.itemsByPage,
                specProject: this.props.specProjectSelector
            });
        }
    }

    shouldComponentUpdate( nextProps, nextState ) {
        const { pageSelector, productsSelected, categoryId, specProjectSelector } = this.props;

        const { productsSelected: { formatId: nextFormatId } } = nextProps;

        const isCategoryChanged = nextProps.categoryId !== categoryId,
              isFormatChanged   = nextFormatId !== productsSelected.formatId,
              isPageChanged     = nextProps.pageSelector !== pageSelector,
              isSpecProjectChanged = nextProps.specProjectSelector !== specProjectSelector;


        if ( isFormatChanged || isCategoryChanged || isPageChanged || isSpecProjectChanged ) {

            //если изменился формат, то запрашиваем первую страницу
            const takePage = (isFormatChanged || isCategoryChanged ? 1 : nextProps.pageSelector);

            if ( !nextProps.themesDataByParamsSelector ) {
                this.props.getThemesFromServerAction( {
                    category: nextProps.categoryId,
                    format: nextFormatId,
                    page: takePage,
                    pageSize: this.props.itemsByPage,
                    specProject: nextProps.specProjectSelector
                } );
            }
        }
        return nextProps !== this.props
    }
    render() {
        const { productsSelected: { formatId, bindingType, coverType}, themesDataSelector, modalGalleryThemeInfoAction } = this.props;

        //скролим в вверх при переключении страниц
        if ( this.prevPageData && themesDataSelector !== this.prevPageData ) {
            document.querySelector( '#spa' ).scrollTo( 0, 0 );
        }

        if ( themesDataSelector ) {
            this.prevPageData = themesDataSelector;
            this.prevFormatData = formatId;
        }

        //console.log('themesDataSelector', themesDataSelector);
        //console.log('this.prevPageData', this.prevPageData);
        const isLoadClass = (!themesDataSelector && this.prevPageData ? s.loadingLayout : '');

        return (<div className={`${s.themes} ${isLoadClass}`}>
                    {this.prevPageData
                            ? <ThemesElements clickCallback={( params )=>modalGalleryThemeInfoAction( {...params, ...formatId} )}
                                              themes={this.prevPageData}
                                              formatId={formatId}
                                              bindingType={bindingType || 'glue'}
                                              coverType={coverType || 'hard'}
                              />
                            : <Spinner size={90} />}
                </div>);
    }
}

export default withRouter(connect(
    (state, ownProps) => {
        const categoryId = ownProps.match.params.categoryId || 0;

        const page = galleryPageSelector( state );

        const { productsSelected: { formatId: nextFormatId } } = ownProps,
              params = { category: categoryId,
                         format: nextFormatId,
                         page: ownProps.pageSelector || page};

        return {
            specProjectSelector: specProjectSelector( state ),
            pageSelector: page,
            themesSelector: galleryThemesSelector( state, PRODUCT_TYPE_PHOTOBOOK, categoryId ),
            themesDataSelector: galleryThemesDataSelector( state, PRODUCT_TYPE_PHOTOBOOK, categoryId ),
            categoryId: categoryId,
            galleryInProgressSelector: galleryInProgressSelector( state ),
            themesDataByParamsSelector: galleryThemesDataByParamsSelector( state, params ),
        }
    },
    dispatch => ({
        modalGalleryThemeInfoAction: ( params ) => {dispatch( modalGalleryThemeInfoAction( params ) )},
        getThemesFromServerAction: ( page ) => {dispatch( getThemesFromServerAction( page ) )}
    })
)(Themes));



