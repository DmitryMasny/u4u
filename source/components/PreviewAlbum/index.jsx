import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import {
    getPreviewThemeServerAction,

    previewThemeSelector,
    previewThemeInProgressSelector
} from './actions';

import TurnJs from './turnjs';
import prepareData from './prepareData';
import Spinner from 'components/Spinner';

import './preview.scss';

/**
 * Компонент превью альбома
 */
class PreviewAlbum extends Component {
    componentDidMount() {
        if ( !this.props.id ) return;

        //если есть ID получаем layout с сервера
        this.props.getPreviewThemeServerAction( this.props.id );
    }
    render() {
        let data = {},
            computedData = [];
        //меняем на твердую обложку на клею
        if (this.props.previewThemeSelector) {
            data = this.props.previewThemeSelector;
            data.bindingType = this.props.bindingType || 'glue';
            data.coverType = this.props.coverType && (this.props.coverType.toUpperCase() + '_COVER') || 'HARD_COVER';
        }

        if (!this.props.previewThemeInProgressSelector && this.props.previewThemeSelector) {
            computedData = prepareData(data, this.props.onlyCover, {maxPages:10, removeTitle:true });
        }
        return (<Fragment>
                    {!this.props.previewThemeInProgressSelector && this.props.previewThemeSelector
                        ?
                        <TurnJs layout={computedData} onlyCover={this.props.onlyCover} sizeFix={this.props.sizeFix + 100}/>
                        :
                        <div style={{display: 'block', width: '100%'}}><Spinner size={90} /></div>
                    }
                </Fragment>)
    }
}

export default connect(
    state => ({
        previewThemeSelector: previewThemeSelector( state ),
        previewThemeInProgressSelector: previewThemeInProgressSelector ( state )
    }),
    dispatch => ({
        getPreviewThemeServerAction: ( id ) => dispatch(getPreviewThemeServerAction( id ) )
    })
)( PreviewAlbum );
