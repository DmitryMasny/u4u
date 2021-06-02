import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import {
    getThemeBacksFromServerAction,
    previewThemeBacksSelector,
    previewThemeIdSelector,
    previewThemeBacksInProgressSelector
} from './actions';

import Spinner from 'components/Spinner';

import s from './PreviewBackgrounds.scss';

import AlbumThumbnail from 'components/AlbumThumbnail';

/**
 * Компонент превью альбома
 */
class PreviewBackgrounds extends Component {
    componentDidMount() {
        if ( !this.props.previewThemeIdSelector ) return;

        //если есть ID получаем фоны с сервера
        this.props.getThemeBacksFromServerAction( this.props.previewThemeIdSelector );
    }
            /* <span className={s.previewBackgroundsItem} key={item.id}>
                                        <img className={s.previewBackgroundsImg} src={item.image + '_sm.jpg'}/>
                                    </span>*/
    render() {
        const { previewThemeBacksSelector, previewThemeBacksInProgressSelector, formatId} = this.props;
        return (<Fragment>
                    {!previewThemeBacksInProgressSelector && previewThemeBacksSelector
                        ?
                        <div className={s.previewBackgrounds}>
                            {previewThemeBacksSelector.map( ( item ) => {
                                if ( item.elementType === 'PAGE_BACKGROUND' ) return (
                                    <div className={s.previewBackgroundsItem} key={item.id}>
                                        <AlbumThumbnail formatId={formatId} src={item.image + '_sm.jpg'}/>
                                    </div>
                                );
                            })}
                        </div>
                        :
                        <div style={{display: 'block', width: '100%'}}><Spinner size={50} /></div>
                    }
                </Fragment>)
    }
}

export default connect(
    state => ({
        previewThemeBacksSelector: previewThemeBacksSelector( state ),
        previewThemeIdSelector: previewThemeIdSelector( state ),
        previewThemeBacksInProgressSelector: previewThemeBacksInProgressSelector ( state )
    }),
    dispatch => ({
        getThemeBacksFromServerAction: ( id ) => dispatch(getThemeBacksFromServerAction( id ) )
    })
)( PreviewBackgrounds );
