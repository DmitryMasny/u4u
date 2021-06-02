import React from 'react';
import s from './icons.scss';
import { INTENT_NAMES } from 'config/main';

const getClassName = ( className, intent ) => {
    let classes = s.lineIcon;
    if ( className ) classes += ' ' + className;
    if ( intent && (INTENT_NAMES.some( elem => elem === intent )) ) classes += ' ' + s[intent];
    return classes;
};

/**
 * Контейнер svg
 * @param props
 */
const IconWrap = ( { className, intent, children, size = 24, stroke = 2, type } ) => {
    const resultStroke = 24 / size * stroke;  // Пересчет толщины обводки в масштабе (
    return (
        <svg className={getClassName( className, intent)}
             style={{ fontSize: size, strokeWidth: resultStroke }}
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            {type === 'shift' && <g className={s.shift}>{children}</g>}
            {children}
        </svg>);
};

/**
 *  Компоненты и иконок
 */
// export const UserCheckIcon = ( props ) =>
//     <IconWrap {...props} >
//         <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//         <circle cx="8.5" cy="7" r="4"/>
//         <polyline points="17 11 19 13 23 9"/>
//     </IconWrap>;

export const FolderIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </IconWrap>;

export const FolderPlusIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
        <line x1="9" y1="14" x2="15" y2="14"/>
    </IconWrap>;

export const HearthIcon = ( props ) =>
    <IconWrap {...props} >
        <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </IconWrap>;

export const CopyIcon = ( props ) =>
    <IconWrap {...props} >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </IconWrap>;

export const RotateL = ( props ) =>
    <IconWrap {...props} >
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </IconWrap>;

export const RotateR = ( props ) =>
    <IconWrap {...props} >
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </IconWrap>;

export const SaveIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
    </IconWrap>;

export const SelectIcon = ( props ) =>
    <IconWrap {...props} >
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </IconWrap>;

export const ShareIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
    </IconWrap>;

export const SmartphoneIcon = ( props ) =>
    <IconWrap {...props} >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="5" y1="18" x2="19" y2="18"/>
        <circle cx="12" cy="20" r="1"/>
    </IconWrap>;

export const MailIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </IconWrap>;

export const GridIcon = ( props ) =>
    <IconWrap {...props} >
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
    </IconWrap>;

export const ClockIcon = ( props ) =>
    <IconWrap {...props} >
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </IconWrap>;

export const TruckIcon = ( props ) =>
    <IconWrap {...props} >
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
    </IconWrap>;

export const SendIcon = ( props ) =>
    <IconWrap {...props} >
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </IconWrap>;

export const PackageIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/>
        <polyline points="2.32 6.16 12 11 21.68 6.16"/>
        <line x1="12" y1="22.76" x2="12" y2="11"/>
        <line x1="7" y1="3.5" x2="17" y2="8.5"/>
    </IconWrap>;

export const MapPinIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </IconWrap>;

export const MoreVertical = ( props ) =>
    <IconWrap {...props} >
        <circle cx="12" cy="12" r="1"/>
        <circle cx="12" cy="5" r="1"/>
        <circle cx="12" cy="19" r="1"/>
    </IconWrap>;

export const MoreHorizontal = ( props ) =>
    <IconWrap {...props} >
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
    </IconWrap>;

export const TrashIcon = ( props ) =>
    <IconWrap {...props} >
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
    </IconWrap>;

export const RenameIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </IconWrap>;

export const UploadCloudIcon = ( props ) =>
    <IconWrap {...props} >
        <polyline points="16 16 12 12 8 16"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        <polyline points="16 16 12 12 8 16"/>
    </IconWrap>;

export const AddPhotoIcon = ( props ) =>
    <IconWrap {...props} >
        <path d="M3 19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V7"/>
        <line x1="4" y1="15" x2="4" y2="11" />
        <line x1="6" y1="13" x2="2" y2="13" />
        <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" />
        <path d="M21 15L16 10L5 21"/>
    </IconWrap>;