import React, { Component, Fragment, lazy } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Btn} from 'components/_forms';
import { IconChevronLeft, IconChevronRight, IconInfo } from 'components/Icons';
import s from './GalleryPage.scss';

import TEXT from 'texts/main';
import TEXT_GALLERY from 'texts/gallery';
import TEXT_PRODUCT from 'texts/product';
import LINKS_MAIN from "config/links";
import lexem from 'libs/lexems';

import ProductAlbum from 'hoc/ProductAlbum';

import { modalThemeInfoSelector } from 'selectors/modals'
import { modalGalleryThemeInfoAction } from './actions/themes';

import { GALLERY_CREATE, GALLERY_SHOW_BGS } from 'const/metrics'
import sendMetric from 'libs/metrics'
import { retry } from 'libs/helpers';

const PreviewAlbum = lazy(() => retry(() => import('components/PreviewAlbum')));
const PreviewBackgrounds = lazy(() => retry(() => import('components/PreviewBackgrounds')));

import PropTypes from "prop-types";

import { productsSavedDataSelector } from 'pages/ProductPage/selectors';

import { objectToBase64 } from 'libs/converters';

import { userRoleSelector } from "selectors/user";

import  {copyToClipboard} from "libs/helpers";
import { toast } from '__TS/libs/tools';


const copyToClipboardHandler = ( text ) => {
    copyToClipboard(text);
    toast.info('Ссылка на альбом скопирована', {
        autoClose: 3000
    });
};

const ThemeActions = ( { coverLaminationType, selectThisTheme, showBacks, showBackgroundsToggle, fastLink = false  } ) => {
        return (
            <div className={'bp3-dialog-footer-actions ' + s.themeModalFooter}>
                { showBacks ?
                    <Btn className={s.themeInfoBtn} large onClick={() => showBackgroundsToggle(false)}>
                        {TEXT_GALLERY.SHOW_BOOK}
                    </Btn>
                    :
                    <Btn className={s.themeInfoBtn} large onClick={() => showBackgroundsToggle(true)}>
                        {TEXT_GALLERY.SHOW_BGS}
                    </Btn>
                }
                {fastLink &&
                    <Btn className={s.themeInfoBtn} large onClick={() => copyToClipboardHandler(window.location + objectToBase64(fastLink))}>
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
                <span className={s.themeInfoAboutTypeLabel}>{TEXT.FORMAT}:&nbsp;</span>
                <span className={s.themeInfoAboutTypeValue}>{format.width} x {format.height} см.</span>

                <span className={s.themeInfoAboutTypeLabel}>{TEXT_PRODUCT.PAGE_QUANTITY}:&nbsp;</span>
                <span className={s.themeInfoAboutTypeValue}>{pages.min} - {pages.max}</span>
            </div>
        </div>
    );
};


class ThemeModal extends Component {
    static contextTypes = {
        setModalTitle: PropTypes.func.isRequired,
        setCloseActionChild: PropTypes.func.isRequired
    };
    state = {
        showBacks:false
    };

    showBackgroundsToggle = ( bool ) => {
        const isBacks = (bool === undefined ? !this.state.showBacks : bool);
        this.context.setModalTitle( `${isBacks ? TEXT_GALLERY.BACKS_EXAMPLE : TEXT_GALLERY.THEME_EXAMPLE} "${this.props.modalThemeInfoSelector.name}"`);
        if (isBacks) sendMetric(GALLERY_SHOW_BGS);
        this.setState( { showBacks: isBacks } );

    };

    componentDidMount () {
        const { modalThemeInfoSelector } = this.props;

        //задаем заголовок модальному окну
        if (modalThemeInfoSelector.name) {
            this.context.setModalTitle( `${this.state.showBacks ? TEXT_GALLERY.BACKS_EXAMPLE : TEXT_GALLERY.THEME_EXAMPLE} "${modalThemeInfoSelector.name}"`);
        }

        //проброс экшена на закрытие в модальное окно родителя
        this.context.setCloseActionChild( this.props.modalGalleryThemeInfoCloseAction );
    }
    selectThisTheme = ( create = false ) => {

        this.props.setThemeSelected( this.props.modalThemeInfoSelector );

        const { coverLaminationType, coverType, bindingType } = this.props.productsSelected; //тип ламинации должен быть, если пришли с выбора продукта

        sendMetric(GALLERY_CREATE);

        if (!coverLaminationType || !create) {
            this.props.history.push(LINKS_MAIN.PHOTOBOOKS.replace( ':coverType-:bindingType', [coverType, bindingType ].join( '-' )));
            this.props.modalGalleryThemeInfoCloseAction();
        } else {
            this.props.generateLayoutAction( this.props.modalThemeInfoSelector, this.props.productsSelected );
        }
    };

    render () {
        const { modalThemeInfoSelector, productsSelected } = this.props;

        //если нет id, то не рендерим
        if ( !modalThemeInfoSelector.id ) return null;

        let fastLink = null;
        if ( this.props.userRoleSelector === 'admin' ) {
            fastLink = {
                formatId: modalThemeInfoSelector.formatId,
                groupId: modalThemeInfoSelector.groupId,
                id: modalThemeInfoSelector.id,
                name: modalThemeInfoSelector.name,
                type: 'showPreviewAlbum'
            };
        }

        return (<Fragment>
                    <div className='bp3-dialog-body'>
                        { this.state.showBacks ?
                            <PreviewBackgrounds formatId={productsSelected.formatId}/>
                            :
                            <PreviewAlbum id={modalThemeInfoSelector.id}
                                          coverType={productsSelected.coverType}
                                          bindingType={productsSelected.bindingType}
                                          sizeFix={!!productsSelected.coverLaminationType}
                            />
                        }
                    </div>
                    {!modalThemeInfoSelector.onlyPreview &&
                        <div className='bp3-dialog-footer'>
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

const ThemeModalDecorator = ( props ) => <ProductAlbum {...props}><ThemeModal/></ProductAlbum>;

export default withRouter(connect(
    state => ({
        modalThemeInfoSelector: modalThemeInfoSelector( state ),
        productsSavedDataSelector: productsSavedDataSelector( state ),
        userRoleSelector: userRoleSelector( state ),
    }),
    dispatch => ({
        modalGalleryThemeInfoCloseAction: () => dispatch( modalGalleryThemeInfoAction( null ) )
    })
)( ThemeModalDecorator ));
