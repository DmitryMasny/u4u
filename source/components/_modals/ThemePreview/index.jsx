import React, { useEffect, useContext, Component, Fragment, lazy } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from 'react-router-dom';

import { modalGalleryThemeInfoAction } from 'components/_pages/GalleryPage/actions/themes';
import { modalThemeInfoSelector } from 'selectors/modals'
import { productsSavedDataSelector } from 'components/_pages/ProductPage/selectors';

import lexem from 'libs/lexems';
import sendMetric from 'libs/metrics'
import TEXT_MAIN from 'texts/main';

import TEXT_GALLERY from 'texts/gallery';
import TEXT_PRODUCT from 'texts/product';
import LINKS_MAIN from "config/links";
//import {TYPES} from 'const/types';
import { GALLERY_CREATE, GALLERY_SHOW_BGS } from 'const/metrics'

import ProductAlbum from 'hoc/ProductAlbum';
import {ModalContext} from 'components/Modal';
import s from 'components/_pages/GalleryPage/GalleryPage.scss';
import { Btn } from 'components/_forms';

const PreviewAlbum = lazy(() => import('components/PreviewAlbum'));
const PreviewBackgrounds = lazy(() => import('components/PreviewBackgrounds'));

import { createGalleryShortLink } from 'libs/helpers';
import  {copyToClipboard} from "libs/helpers";
import { toast } from '__TS/libs/tools';


const copyToClipboardHandler = ( fastLink ) => {
    copyToClipboard(createGalleryShortLink(fastLink));
    toast.info('Ссылка на альбом скопирована', {
        autoClose: 3000
    });
};

const ThemeActions = ({ coverLaminationType, selectThisTheme, showBacks, showBackgroundsToggle, fastLink = false  }) => {

    return (
        <div className={s.themeModalFooter}>

            { showBacks ?
                <Btn className={s.themeInfoBtn} large onClick={() => showBackgroundsToggle(false)}>
                    {TEXT_GALLERY.SHOW_BOOK}
                </Btn>
                :
                <Btn className={s.themeInfoBtn} large onClick={() => showBackgroundsToggle(true)}>
                    {TEXT_GALLERY.SHOW_BGS}
                </Btn>
            }

            { fastLink &&
                <Btn className={s.themeInfoBtn} large onClick={() => copyToClipboardHandler(fastLink)}>
                    {TEXT_GALLERY.COPY_LINK}
                </Btn>
            }

            {coverLaminationType &&
            <Btn className={s.themeInfoBtn} large onClick={() => selectThisTheme()}>
                {TEXT_GALLERY.SET_BINDING}
            </Btn>
            }
            { coverLaminationType ?
                <Btn className={`${s.themeInfoBtn} ${s.themeInfoBtnCreate}`} intent="primary" large onClick={()=>selectThisTheme( true )}>
                    {TEXT_GALLERY.CREATE}
                </Btn>
                :
                <Btn className={s.themeInfoBtn} intent="primary" large onClick={()=>selectThisTheme()}>
                    {TEXT_GALLERY.CHOOSE}
                </Btn>
            }
        </div>

    );


};
const SelectedTypeInfo = ( {format, productsSelected} ) => {
    const {coverType, bindingType, pages } = productsSelected;
    return (
        <div className={s.themeInfoAboutType}>
            <div className={s.themeInfoAboutTypeRow}>
                        <span className={s.themeInfoAboutTypeLabel}>
                            {TEXT_PRODUCT.BINDING_TYPE}&nbsp;
                        </span>
                <span className={s.themeInfoAboutTypeValue}>{lexem('photobook_type',coverType, bindingType)}</span>
            </div>

            <div className={s.themeInfoAboutTypeRow}>
                <span className={s.themeInfoAboutTypeLabel}>{TEXT_MAIN.FORMAT}:&nbsp;</span>
                <span className={s.themeInfoAboutTypeValue}>{format.width} x {format.height} см.</span>

                <span className={s.themeInfoAboutTypeLabel}>{TEXT_PRODUCT.PAGES_QUANTITY}:&nbsp;</span>
                <span className={s.themeInfoAboutTypeValue}>{pages.min} - {pages.max}</span>
            </div>
        </div>
    );
};


class ThemeModal extends Component {

    state = {
        showBacks:false
    };

    showBackgroundsToggle = (bool) => {
        const isBacks = (bool === undefined ? !this.state.showBacks : bool);
        if ( isBacks ) sendMetric( GALLERY_SHOW_BGS );
        this.setState( { showBacks: isBacks } );
    };

    // componentDidMount () {
    // const { modalThemeInfoSelector } = this.props;

    //задаем заголовок модальному окну
    // if (modalThemeInfoSelector.name) {
    //     this.context.setModalTitle( `${this.state.showBacks ? TEXT_GALLERY.BACKS_EXAMPLE : TEXT_GALLERY.THEME_EXAMPLE} "${modalThemeInfoSelector.name}"`);
    // }

    // }
    selectThisTheme = ( create = false ) => {
        this.props.setThemeSelected( this.props.themeInfoSelector );

        const { coverLaminationType, coverType, bindingType } = this.props.productsSelected; //тип ламинации должен быть, если пришли с выбора продукта

        sendMetric(GALLERY_CREATE);

        if (!coverLaminationType || !create) {
            this.props.history.push( LINKS_MAIN.PHOTOBOOKS.replace( ':coverType-:bindingType', [coverType, bindingType].join( '-' ) ) );
            this.props.closeThemeInfoAction();
        } else {
            this.props.generateLayoutAction( this.props.themeInfoSelector, this.props.productsSelected );
        }
    };

    render() {
        const { themeInfoSelector, productsSelected } = this.props;

        if ( !themeInfoSelector || !themeInfoSelector.id ) return null;

        let fastLink = null;
        if ( this.props.userRoleSelector === 'admin' ) {

            fastLink = {
                modal: {
                    formatId: themeInfoSelector.formatId,
                    groupId: themeInfoSelector.groupId,
                    id: themeInfoSelector.id,
                    name: themeInfoSelector.name,
                    previewCover: themeInfoSelector.previewCover
                },
                product: {
                    bindingType: productsSelected.bindingType,
                    coverType: productsSelected.coverType,
                    formatId: productsSelected.formatId,
                    id: productsSelected.id,
                    pages: productsSelected.pages,
                    theme: productsSelected.theme || null
                },
                type: 'showPreviewAlbum'
            };
            /*
            fastLink = {
                formatId: productsSelected.formatId,
                groupId: productsSelected.groupId,
                id: productsSelected.id,
                name: productsSelected.name,
                type: 'showPreviewAlbum'
            };*/
        }

        return (<Fragment>
                    { this.state.showBacks ?
                        <PreviewBackgrounds formatId={productsSelected.formatId}/>
                        :
                        <PreviewAlbum id={themeInfoSelector.id}
                                      coverType={productsSelected.coverType}
                                      bindingType={productsSelected.bindingType}
                                      sizeFix={!!productsSelected.coverLaminationType}
                        />
                    }
                    {!themeInfoSelector.onlyPreview &&
                        <div>
                            <span className={s.themeDesc}>
                                {this.state.showBacks ? TEXT_GALLERY.THEME_BACKS_DESC : TEXT_GALLERY.THEME_PREVIEW_DESC}
                            </span>

                            { productsSelected.coverLaminationType &&
                                <SelectedTypeInfo format={this.props.getCurrentFormat()} productsSelected={productsSelected}/>
                            }

                            <ThemeActions coverLaminationType={productsSelected.coverLaminationType}
                                          selectThisTheme={this.selectThisTheme}
                                          showBackgroundsToggle={this.showBackgroundsToggle}
                                          showBacks={this.state.showBacks}
                                          fastLink={fastLink}
                            />
                        </div>
                    }
                </Fragment>);
    }
}

/**
 * Просмотр темы в галерее
 */
const ThemePreview = (props2) => {
    const { setModal, closeModal } = useContext( ModalContext );
    const dispatch = useDispatch();
    const props = {
        ...props2,
        themeInfoSelector: useSelector( modalThemeInfoSelector ),
        productsSavedDataSelector: useSelector( productsSavedDataSelector ),
        closeThemeInfoAction: () => dispatch( modalGalleryThemeInfoAction( false ) ),
    };

    useEffect(() => {
        setModal({
            title: props.themeInfoSelector && props.themeInfoSelector.name || ''
        });
    },[]);


    return <ProductAlbum {...props}><ThemeModal /></ProductAlbum>;
};

export default withRouter( ThemePreview );
// export default  ThemePreview;


