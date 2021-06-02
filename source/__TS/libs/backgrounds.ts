// @ts-ignore
import { IBackgroundConfig } from "../interfaces/backgrounds";

/**
 * Создать ссылку на стикер
 * @param stickerConfig
 * @param id
 * @param size
 * @param ext
 */
export const createBackgroundLink = ( { backgroundConfig, id, size, ext }: { backgroundConfig: IBackgroundConfig, id: string, size: any, ext?: string } ): string => {
    const protocol = location.protocol;
    const domain = location.hostname;

    if ( !backgroundConfig || !backgroundConfig[ size ] ) return '';
    return `${ protocol }//${ domain }${ backgroundConfig.path + id }/${ backgroundConfig[ size ] }.${ ext || backgroundConfig.ext }`;
};

/**
 * Создать ссылку на стикер, размер thumb (300px)
 * @param stickerConfig
 * @param id
 */
export const createBackgroundLinkThumb = ( { backgroundConfig, id, ext }: { backgroundConfig: IBackgroundConfig, id: string, ext?: string } ) => {
    return createBackgroundLink( { backgroundConfig, id, size: 'sm', ext: ext } );
};

/**
 * Создать ссылку на стикер, размер small (700px)
 * @param stickerConfig
 * @param id
 */
export const createBackgroundLinkSmall = ( { backgroundConfig, id, ext }: { backgroundConfig: IBackgroundConfig, id: string, ext?: string } ) => {
    return createBackgroundLink( { backgroundConfig, id, size: 'ms', ext: ext } );
};

/**
 * Создать ссылку на стикер, размер middle (1500px)
 * @param stickerConfig
 * @param id
 */
export const createBackgroundLinkMiddle = ( { backgroundConfig, id, ext }: { backgroundConfig: IBackgroundConfig, id: string, ext?: string } ) => {
    return createBackgroundLink( { backgroundConfig, id, size: 'ms', ext: ext } );
};

/**
 * Создать ссылку на стикер, размер orig
 * @param stickerConfig
 * @param id
 */
export const createBackgroundLinkOrig = ( { backgroundConfig, id, ext }: { backgroundConfig: IBackgroundConfig, id: string, ext?: string } ) => {
    return createBackgroundLink( { backgroundConfig, id, size: 'orig', ext: ext } );
};