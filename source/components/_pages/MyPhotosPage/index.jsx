import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createPortal } from "react-dom";

import { Page, PageInner } from 'components/Page';
import Tabs from 'components/Tabs';
import OnlyAuth from 'hoc/OnlyAuth';
import { replaceTab } from 'libs/helpers';

import LINKS_MAIN from 'config/links';
import { MY_PHOTOS_ALL, MY_PHOTOS_FOLDERS, MY_PHOTOS_IFRAME } from 'const/myPhotos';
import TEXT_MY_PHOTOS from 'texts/my_photos';
import AllPhotos from './_AllPhotos';
import Folders from './_Folders';
import DropZone from './_DropZone';

import {
    myPhotosAddFolderSelector,
    myPhotosCurrentFolderPhotosSelector,
    myPhotosCurrentFolderSelector,
    myPhotosInProgressSelector,
    myPhotosSelectionSelector,
    myPhotosCountSelector
} from "./selectors";
import { getFolderPhotosAction, selectPhotosToggleAction } from "./actions";
import s from './MyPhotosPage.scss';
import { modalPhotosUploadAction } from "actions/modals";
import { IconUpload } from "components/Icons";
import { userRoleSelector } from "selectors/user";
import Navbar from "components/Navbar";

/**
 * Страница "Мои Фотографии"
 */
class MyPhotosPage extends Component {

    // Список табов (подразделов)
    tabs = [
        { id: MY_PHOTOS_ALL, title: TEXT_MY_PHOTOS.MY_PHOTOS_ALL, link: replaceTab( LINKS_MAIN.MY_PHOTOS, MY_PHOTOS_ALL ) },
        {
            id: MY_PHOTOS_FOLDERS,
            title: TEXT_MY_PHOTOS.MY_PHOTOS_FOLDERS,
            link: replaceTab( LINKS_MAIN.MY_PHOTOS, MY_PHOTOS_FOLDERS )
        }
    ];
    PHOTOS_PAGE_TABS = [
        { id: MY_PHOTOS_ALL,        title: TEXT_MY_PHOTOS.MY_PHOTOS_ALL},
        { id: MY_PHOTOS_FOLDERS,    title: TEXT_MY_PHOTOS.MY_PHOTOS_FOLDERS},
    ];
    state = {
        tab: '',
        iframe: null,
        host: null,
        visitor: false
    };

    /**
     * Обработка сообщений из редактора в iframe
     */
    receiveMessage = (event) => {
        if (event.source === window || event.source.origin !== event.origin ) {
            if (event.source.origin !== event.origin) console.log('event.source.origin',event.source.origin, 'event.origin=',event.origin);
            return null;  // Не обрабатываем запросы из этого же окна или cdn
        }
        // if ( this.state.host && this.state.host !== event.origin ) return null; // Не обрабатываем запросы из других источников

        // Сохраняем родителя ifram'a в state, чтобы слать ему сообщения
        if (!this.state.iframe) {
            !event.source.postMessage && console.log('@@@postMessage',event.source);

            this.setState({
                              iframe: event.source,
                              host: event.origin,
                          });
            this.props.selectPhotosToggleAction(true);

            if (this.props.userRoleSelector === 'visitor') {
                this.setState( { visitor: true } );
                this.props.showModalPhotosUploadAction({
                                                           visitor: true,
                                                           // photosAddAction: (list)=>this.addToAlbum(list),
                                                           // closeIframeAction: ()=>this.closeIframe(),
                                                       });
            }



        } else {
            console.log('this.state.iframe',this.state.iframe);
        }
    };

    // Кнопка Отмена - закрыть iframe с фотографиями
    closeIframe = () => {
        this.state.iframe && this.state.iframe.postMessage({command: 'close'}, this.state.host);
    };
    // Кнопка Добавить в альбом
    addToAlbum = (selection) => {
        this.state.iframe && this.state.iframe.postMessage({command: 'add', data: selection}, this.state.host);
    };
    // Кнопка Добавить в альбом
    selectTabAction = (id) => {
        if (this.state.iframe || this.state.iframe === false) {
            this.setState({tab: id});
        } else this.props.history.push( LINKS_MAIN.MY_PHOTOS.replace( ':tab', id ) );
    };

    componentDidMount () {
        if (this.props.userRoleSelector === 'visitor') {
            this.setState({visitor: true});
        }

        const tab = this.props.match.params.tab;
        if (tab){
            if (tab === MY_PHOTOS_IFRAME) {
                // если iFrame, то оставляем таб по-умолчанию и вкл. режим выделения фоток

                window.addEventListener("message", this.receiveMessage, false); // прослушка сообщений в iframe из редактора
                if (this.state.iframe) console.log('ОПАЧКИ! тут раньше была ошибка, мешающая загрузить фотографии');
                this.setState({iframe: this.state.iframe || false, tab: MY_PHOTOS_ALL}); // iframe: false - чтобы показывать страницу для iframe, но блокировать кнопки до полной загрузки

                if (window.parent && window.parent.xxyy){
                    window.parent.xxyy();
                } else window.sendErrorLog( 'Ошибка связи с iframe', {window: window} );

            } else {
                this.setState({tab: tab});
            }
        } else {
            this.props.history.push( LINKS_MAIN.MY_PHOTOS.replace( ':tab', MY_PHOTOS_ALL ) );
        }
    };
    componentWillUnmount () {
        window.removeEventListener("message", this.receiveMessage); // прослушка сообщений в iframe из редактора
    };

    shouldComponentUpdate( nextProps, nextState ) {
        // console.log('this.props',this.props);
        // console.log('nextProps',nextProps);
        // console.log('nextState',nextState);
        if ( nextProps.match.params.tab !== this.props.match.params.tab ) {
            this.setState({tab: nextProps.match.params.tab});
            return true;
        }

        if (this.props.addFolderSelector !== nextProps.addFolderSelector && nextProps.addFolderSelector && nextProps.match.params.tab === MY_PHOTOS_FOLDERS) {
            this.props.history.push( LINKS_MAIN.MY_PHOTOS.replace( ':tab', MY_PHOTOS_ALL ) );
            return false;
        } else if (this.props.currentFolderSelector !== nextProps.currentFolderSelector && nextProps.currentFolderSelector && nextProps.match.params.tab === MY_PHOTOS_ALL ) {
            this.props.history.push( LINKS_MAIN.MY_PHOTOS.replace( ':tab', MY_PHOTOS_FOLDERS ) );
            !nextProps.currentFolderPhotosSelector && nextProps.getFolderPhotosAction(nextProps.currentFolderSelector);
            //TODO: костылик, потому что не хотели нормально загружаться фото папки при обновлении компонента Folders
            return false;
        }
        return (nextState.tab !== this.state.tab || nextProps.myPhotosInProgress !== this.props.myPhotosInProgress)
            || nextState.visitor !== this.state.visitor
            || this.props.selectionSelector !== nextProps.selectionSelector
            || this.props.addFolderSelector !== nextProps.addFolderSelector;
    };
    render () {
        const isIframe = this.state.iframe || this.state.iframe === false;
        return  <Page>
                    <PageInner className={isIframe ? s.iFrame : null}>
                        {!this.state.visitor && <Navbar selectTabAction={this.selectTabAction}
                                currentTab={this.state.tab}
                                tabs={this.PHOTOS_PAGE_TABS}
                                size="md"
                                isMobile={false}
                                disabled={false}
                        />}

                        {this.props.addFolderSelector && !this.state.visitor &&
                        <div className={s.addToFolder}>
                            Выберите фотографии для добавления в папку "{this.props.addFolderSelector.name}"
                        </div>
                        }

                        {this.state.tab === MY_PHOTOS_ALL && <AllPhotos/>}
                        { !this.state.visitor && this.state.tab === MY_PHOTOS_FOLDERS && <Folders/> }

                    </PageInner>

                    { isIframe ? createPortal(
                        <div className={s.iFramePanel + (this.state.iframe ? '' : ` ${s.disabled}`)}>
                            <div className={s.iFramePanelInner}>
                                <div className={s.iFramePanelBtn} onClick={this.closeIframe}>Отмена</div>
                                <div className={s.iFramePanelDivider}/>
                                <div className={`${s.iFramePanelBtn} ${s.iFramePanelBtnUpload}`} onClick={this.props.showModalPhotosUploadAction}>
                                    <IconUpload className={s.iFramePanelIcon}/>
                                    Загрузить фотографии
                                </div>
                                <div className={`${s.iFramePanelBtn} ${s.iFramePanelBtnAdd} ${this.props.selectionSelector && this.props.selectionSelector.length ? '' : s.disabled}`}
                                     onClick={()=>this.addToAlbum(this.props.selectionSelector)}>
                                    Добавить в альбом
                                </div>
                            </div>
                        </div>,
                        document.getElementById( 'spa-top' )
                    ) : null}

                    <DropZone/>

                </Page>;
    }
}

export default withRouter( connect(
    state => ({
        myPhotosInProgress: myPhotosInProgressSelector( state ),
        addFolderSelector: myPhotosAddFolderSelector( state ),
        currentFolderSelector: myPhotosCurrentFolderSelector( state ),
        currentFolderPhotosSelector: myPhotosCurrentFolderPhotosSelector( state ),
        photosCountSelector: myPhotosCountSelector( state ),
        selectionSelector: myPhotosSelectionSelector( state ),
        userRoleSelector: userRoleSelector( state ),
    }),
    dispatch => ({
        getFolderPhotosAction: ( id ) => dispatch( getFolderPhotosAction( {id : id} ) ),
        selectPhotosToggleAction: ( select ) => dispatch( selectPhotosToggleAction( select ) ),
        showModalPhotosUploadAction: (o) => dispatch( modalPhotosUploadAction( {show:true, ...o} ) ),
    })
)( MyPhotosPage ) );