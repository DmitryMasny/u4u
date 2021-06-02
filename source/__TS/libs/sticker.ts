import { IStickerConfig } from "../interfaces/stickers";

/**
 * Создать ссылку на стикер
 * @param stickerConfig
 * @param id
 * @param size
 * @param ext
 */
export const createStickerLink = ( { stickerConfig, id, size, ext }: { stickerConfig: IStickerConfig, id: string, size: any, ext?: string } ): string => {
    const protocol = location.protocol;
    const domain = location.hostname;

    if ( !stickerConfig || !stickerConfig[ size ] ) return '';
    return `${protocol}//${domain}${ stickerConfig.path + id }/${ stickerConfig[ size ] }.${ ext || stickerConfig.ext }`;
};

/**
 * Создать ссылку на стикер, размер thumb (300px)
 * @param stickerConfig
 * @param id
 */
export const createStickerLinkThumb = ( { stickerConfig, id }: { stickerConfig: IStickerConfig, id: string } ) => {
    return createStickerLink( { stickerConfig, id, size: 'sm' } );
};

/**
 * Создать ссылку на стикер, размер small (700px)
 * @param stickerConfig
 * @param id
 */
export const createStickerLinkSmall = ( { stickerConfig, id }: { stickerConfig: IStickerConfig, id: string } ) => {
    return createStickerLink( { stickerConfig, id, size: 'ms' } );
};

/**
 * Создать ссылку на стикер, размер middle (1500px)
 * @param stickerConfig
 * @param id
 */
export const createStickerLinkMiddle = ( { stickerConfig, id }: { stickerConfig: IStickerConfig, id: string } ) => {
    return createStickerLink( { stickerConfig, id, size: 'ms' } );
};

/**
 * Создать ссылку на стикер, размер orig
 * @param stickerConfig
 * @param id
 */
export const createStickerLinkOrig = ( { stickerConfig, id }: { stickerConfig: IStickerConfig, id: string } ) => {
    return createStickerLink( { stickerConfig, id, size: 'orig' } );
};