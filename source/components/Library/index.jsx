import React, {memo} from 'react';

import {PHOTO_THUMB_SIZE} from "config/main";
import ImageLoader from "components/ImageLoader";
import {IconCheck, IconView, IconVk, IconInstagram, IconGooglePhoto, IconYandex} from "components/Icons";
import Spinner from "components/Spinner";
import s from './library.scss';
import {IMAGE_TYPES} from "const/imageTypes";

const LibraryItem = memo(( { url, resolution, selectAction, selected, id, previewAction, selectionActive, disabled, size, type, authId, importFrom, thumbSize, hideSelectBtn } ) => {
    // const orientation = (photo.width < photo.height) ? 'h' : 'w';
    const height = thumbSize || PHOTO_THUMB_SIZE[1];
    const src = type ?
        ( type === IMAGE_TYPES.GPHOTO ?
                `${url}=h${height}`
                :
            type === IMAGE_TYPES.THEME_BG ? `/${url}_sm.jpg` : url
        )
            : url;

    const onClickItemAction = ( e, isSelectionBox, isPreview ) => {
        e.stopPropagation();
        if (disabled) return null;
        if ( !isPreview && (isSelectionBox || selectionActive) ) {
            // Если клик на photoSelectionBox или выделение активно, то выделяем фотографию
            selectAction({id: id, shiftKey: e.shiftKey});
        } else {
            // Иначе открываем фото
            previewAction({id: id, size: size});
        }
    };

    const ImportFromIcon = () => {
        let icon, title;
        switch (importFrom) {
            case 'vk':
                icon = <IconVk size={16}/>;
                title = 'В Контакте';
                break;
            case 'instagram':
                icon = <IconInstagram size={16}/>;
                title = 'Instagram';
                break;
            case 'google':
                icon = <IconGooglePhoto size={16}/>;
                title = 'GooglePhoto';
                break;
            case 'ya':
                icon = <IconYandex size={16}/>;
                title = 'Yandex';
                break;
        }
        return(
            <div className={s.photoImportBox}  title={title && ('Эта фотография загружена из ' + title)}>
                {icon}
            </div>);
    };

    return <div className={s.photo + ` ${selected ? s.selected : ''}` + ` ${(disabled) ? s.disabled : ''}`}
                onClick={( e ) => onClickItemAction( e )}
                style={{height: height}}>
        <ImageLoader className={s.photoImage} src={src} showLoader={disabled} type={type} authId={authId} light/>
        {/* Чекбокс выделения фотки */ !disabled && (selectionActive || !hideSelectBtn) &&
        <div className={s.photoSelectionBox} onClick={( e ) => onClickItemAction( e, true )}>
            {selected ? <IconCheck/> : null}
        </div>}
        {/* Иконка превью фотки */ previewAction && !disabled &&
        <div className={s.photoPreviewBox} onClick={( e ) => onClickItemAction(e, false, true) } >
            <IconView/>
        </div>}
        {/* Иконка источника импорта */ importFrom &&
        <ImportFromIcon />
        }
        {/* Размер изображения в px */ resolution &&
        <div className={s.resolution}>{resolution}</div>}
    </div>
});

const Library = ( { disabled, items, selectionActive, selectAction, previewAction, folderId, type, thumbSize, hideSelectBtn, showResolution } ) => {
    // if (!items || Array.isArray( items ) && !items.length) return null;

    const previewItemAction = (o) => {
        previewAction && previewAction({
            id: o.id,
            size: o.size,
            folderId: folderId,
            list: items,
            thumbSize: thumbSize
        });
    };
    const selectItemAction = (o) => {
        selectAction && selectAction({
            id: o.id,
            shiftKey: o.shiftKey,
            folderId: folderId
        });
    };

    return (
        <div className={s.library + ` ${disabled ? s.disabled : ''} ${selectionActive ? s.selectable : ''}`} >
            { (items && items.length || false) && items.map(
                ( item ) => {
                    return <LibraryItem
                        id={item.photoId || item.id}
                        url={item.url}
                        type={item.type || type}
                        size={item.size}
                        resolution={showResolution && item.sizeOrig && `${item.sizeOrig.w}x${item.sizeOrig.h}`}
                        selected={item.selected}
                        selectionActive={selectionActive}
                        hideSelectBtn={hideSelectBtn}
                        disabled={item.inProgress}
                        selectAction={selectAction && selectItemAction}
                        previewAction={previewAction && previewItemAction}
                        thumbSize={thumbSize}
                        importFrom={item.importFrom}
                        authId={type === 'ya' && item.requestUuid}
                        key={item.photoId || item.id}
                    />
                }
            )}
            {disabled && <Spinner className={s.spinner} size={80} delay={items ? undefined : 0}/>}
        </div>
    );
};

export default memo( Library );
