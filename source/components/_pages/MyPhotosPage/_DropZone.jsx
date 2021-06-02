import React, {Fragment, Component, useCallback} from 'react';
import {createPortal} from "react-dom";
import { connect } from 'react-redux';

import s from "./MyPhotosPage.scss";
import {PHOTO_MAX_WEIGHT} from "config/main";
import {modalPhotosUploadAction} from "actions/modals";
import {myPhotosCurrentFolderSelector} from "./selectors";
import {addToFolderToggleAction} from "./actions";

/**
 * Компонент загрузки фотографий
 */
class DropZone extends Component {
    state = {
        dropzoneIsActive: false
    };

    dragoverListener = (e) => {
        e.preventDefault();
        if (!this.state.dropzoneIsActive && e.dataTransfer.items && e.dataTransfer.items[0].kind === 'file') this.setState({dropzoneIsActive: true});
    };
    dragleaveListener = (e) => {
        e.preventDefault();
        this.setState({dropzoneIsActive: false});
    };
    dropListener = (e) => {
        e.preventDefault();
        this.setState({dropzoneIsActive: false});
        if (e.dataTransfer) {
            this.props.currentFolderSelector && this.props.addToFolderToggleAction(this.props.currentFolderSelector);
            this.props.showModalPhotosUploadAction({droppedFiles: e.dataTransfer.files});
        }
    };

    componentDidMount() {
        window.addEventListener("dragover", this.dragoverListener, false);
        if (this.dropzone) {
            this.dropzone.addEventListener("dragleave", this.dragleaveListener, false);
            this.dropzone.addEventListener("drop", this.dropListener, false);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.dropzoneIsActive !== this.state.dropzoneIsActive;
    }

    componentWillUnmount() {
        window.removeEventListener("dragover", this.dragoverListener);
        if (this.dropzone) {
            window.removeEventListener("dragleave", this.dragleaveListener);
            window.removeEventListener("drop", this.dropListener);
        }
    }


    render() {
        return createPortal(
            <div className={s.dropzone + (this.state.dropzoneIsActive ? ` ${s.active}` : '')}
                 onClick={()=>{this.setState({dropzoneIsActive: false})}}
                 ref={(r) => this.dropzone = r}>
                <div className={s.dropzoneHeader}>
                    Загрузить фотографии
                </div>
                    Поддерживаются файлы ".jpg", ".jpeg" не больше {PHOTO_MAX_WEIGHT / 1024 / 1024}Mb
            </div>,
            document.getElementById('spa-top')
        );
    }
}

export default connect(
    state => ({
        currentFolderSelector: myPhotosCurrentFolderSelector( state ),
    }),
    dispatch => ({
        showModalPhotosUploadAction: ( o ) => dispatch( modalPhotosUploadAction( o ) ),
        addToFolderToggleAction: ( o ) => dispatch( addToFolderToggleAction( o ) ),
    })
)( DropZone );

