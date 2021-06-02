import React, { Component } from 'react';
import Websocket from 'react-websocket';
import connect from 'react-redux/es/connect/connect';

import { WSContext } from 'contexts/wsContext';
import { userIdSelector, userTokenSelector, userRoleIsAdmin } from "selectors/user";
import { PHOTO_ROTATED, PHOTO_UPLOADED, PHOTO_ROTATE_ERROR, PHOTO_UPLOAD_ERROR, PHOTO_IMPORT_ERROR } from "const/wsCommands";
import { updatePhotoAction } from "components/_pages/MyPhotosPage/actions";
import { updateAdminPhotoAction } from "components/_pages/_admin/Products/_actions";
import TEXT_MY_PHOTOS from 'texts/my_photos';
import {IMAGE_TYPES} from "const/imageTypes";

// import { AppToaster } from 'components/Toaster';
// import TEXT_MY_PHOTOS from 'texts/my_photos';

/**
 * HOC управления WebSocket запросами
 *
 *  <WSContext.Consumer>
 *      {( ws ) => <div onClick={()=>ws.socketAction()}>Кнопка</div>}
 *  </WSContext.Consumer>
 *
 */
class WebSocket extends Component {
    state = {
        wsp: (window.location.protocol === 'https:' ? 'wss' : 'ws')
    };

    /**
     * Обработка ответа от сервера
     * @param data {string}
     */
    handleData = ( data ) => {
        const received_data = JSON.parse(data);
        // console.log('received_data', received_data );

        if ( received_data.cmd ) {
            switch ( received_data.cmd ) {

                /*
                 / Обработка удачных команд
                */
                case PHOTO_UPLOADED:
                    const struct = received_data.payload;
                    const updatePhotoAction = () => this.props.updatePhotoAction(
                        struct.photo_id,
                        {
                            url: struct.photo.image,
                            orig: struct.photo.orig,
                            sizeOrig: struct.size_orig,
                            date: struct.date,
                            import_from: struct.import_from,
                            inProgress: false,
                            type: IMAGE_TYPES.GPHOTO,
                        }
                    );
                    if (this.props.userRoleIsAdmin) {
                        this.props.updateAdminPhotoAction(
                            struct.photo_id,
                            {
                                url: struct.photo.image,
                                sizeOrig: struct.size_orig,
                            }
                        );
                        updatePhotoAction()
                    } else {
                        updatePhotoAction()
                    }
                    break;

                case PHOTO_ROTATED:
                    this.props.updatePhotoAction(
                        received_data.payload.photo_id,
                        {
                            url: received_data.payload.photo.image,
                            orig: received_data.payload.photo.orig,
                            size: received_data.payload.size_orig,
                            date: received_data.payload.date,
                            inProgress: false
                        }
                    );
                    break;


                /*
                 / Обработка ошибок
                */
                case PHOTO_ROTATE_ERROR:
                    this.props.updatePhotoAction(
                        received_data.payload,
                        {
                            error: TEXT_MY_PHOTOS.WS_ROTATE_ERROR
                        }
                    );
                    break;

                case PHOTO_UPLOAD_ERROR:
                    this.props.updatePhotoAction(
                        received_data.payload,
                        {
                            error: TEXT_MY_PHOTOS.WS_UPLOAD_ERROR,
                            clear: true
                        }
                    );
                    break;

                case PHOTO_IMPORT_ERROR:
                    this.props.updatePhotoAction(
                        received_data.payload,
                        {
                            error: Array.isArray(received_data.error) ? received_data.error[0] : received_data.error,
                            clear: true
                        }
                    );
                    break;

            }
        }
    };

    /**
     * Отправка по WS
     * @param message
     */
    sendMessage = ( message ) => {
        // console.log('message',message);
        this.webSocket.sendMessage( JSON.stringify(message) );
    };

    startWS = () => {
        // this.setState({o:{ sendWS:this.sendMessage }});
    };

    componentDidMount() {
        this.setState({ o:this.sendMessage });
    }

    render () {
        if (!this.props.userIdSelector) return this.props.children;
        //TODO: подготовить для других url
        const wsUrl = `${this.state.wsp}://${window.location.host}/photos/ws?jwt=${this.props.userTokenSelector}&user_id=${this.props.userIdSelector}`;

        return (
            <WSContext.Provider value={this.state.o}>
                <Websocket ref={( r ) => this.webSocket = r}
                           url={wsUrl}
                           onMessage={this.handleData}
                           onOpen={this.startWS}
                    // onClose={this.handleClose}
                    // reconnect={true}
                    // debug={true}
                />
                {this.props.children}
            </WSContext.Provider>
        );

    }
}

export default connect(
    state => ({
        userIdSelector: userIdSelector( state ),
        userTokenSelector: userTokenSelector( state ),
        userRoleIsAdmin: userRoleIsAdmin( state ),
    }),
    dispatch => ({
        updatePhotoAction: ( photoId, data ) => dispatch( updatePhotoAction( photoId, data ) ),
        updateAdminPhotoAction: ( photoId, data ) => dispatch( updateAdminPhotoAction( photoId, data ) ),
    })
)( WebSocket );