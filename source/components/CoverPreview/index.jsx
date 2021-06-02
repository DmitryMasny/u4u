import React, { Component } from 'react';

import s from './CoverPreview.scss';

import ImageLoader from 'components/ImageLoader';
import AlbumThumbnail from 'components/AlbumThumbnail';
import CoverPreviewBuildByData from 'components/CoverPreviewBuildByData';

export default class CoverPreview extends Component {
    state = {
        width: 0,
        height: 0
    };

    shouldComponentUpdate( nextProps ) {
        if ( nextProps.data && (nextProps.data.id !== this.props.data.id) ) {
            this.updateSize( nextProps );
            return false;
        }

        return true;
    }
    componentDidMount() {
        this.updateSize( this.props);
    }
    updateSize( props ) {
        if ( props.data ) {
            this.setState({
                              width: this.block.offsetWidth,
                              height: this.block.offsetHeight
                          })
        }
    }
    clickChild = () => {
        if ( this.props.clickChild ) this.props.clickChild();
    };

    render () {
        const { coverType, bindingType, formatId, data, clickChild, gloss } = this.props;
        const { width, height } = this.state;
        const blockCN = s['cover-preview-album_s' + formatId],
              cn = `${s.coverPreviewAlbum}` + ' ' +
                   (formatId ? s[`size_${formatId}`] : '') + ' ' +
                   (bindingType && coverType ? s[`${coverType}_${bindingType}`] : '');

        return (
            <AlbumThumbnail className={blockCN}>
                <div className={cn}>
                    <div className={s.coverPreviewAlbumInner} ref={r => this.block = r} onClick={()=>this.clickChild()}>
                        {data
                            ?
                            width && height ? <CoverPreviewBuildByData data={data} formatId={formatId} width={width} height={height} /> : null
                            :
                            <ImageLoader {...this.props} absolute className={coverType && s.prevImage }/>
                        }
                    </div>
                </div>
                {gloss && <div className={`${s.glossy} ${gloss === "glance" ? s.glance: ''}`}/>}
            </AlbumThumbnail>
        );
    }
}