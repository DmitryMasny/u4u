/**
 * Адаптер для пака фонов
 * @param stickerPacks
 * @returns {*}
 */
export const backgroundsPackAdapter = ( stickerPacks ) => {
    const converted = stickerPacks.map( pack => {
        if ( pack.status === 'enable' ) {
            return {
                id: pack.id,
                name: pack.name,
                sortIndex: pack.sortIndex
            }
        } else {
            return false;
        }

    } )

    //отфильтруем пустые
    return converted.filter( pack => pack );
}
/**
 * Адаптер для коллекции фонов в паке
 * @param backgrounds
 * @returns {null|*}
 */
export const backgroundsInPackAdapter = ( backgrounds ) => {

    if ( !backgrounds.backgroundList || !Array.isArray( backgrounds.backgroundList ) ) return null;

    return backgrounds.backgroundList.map( bg => {

        return {
            id: bg.id,
            backgroundSet: bg.backgroundSet,
            width: bg.width,
            height: bg.height,
            sortIndex: bg.sortIndex,
            ext: bg.ext
        };

    } );
}