/**
 * Адаптер для пака стикеров
 * @param stickerPacks
 * @returns {*}
 */
export const stickerPackAdapter = ( stickerPacks ) => {
    const converted = stickerPacks.map( pack => {
        if ( pack.status === 'enable' ) {
            return {
                id: pack.id,
                name: pack.name,
                thumb: {
                    type: pack.iconFrom.svg ? 'svg' : 'png',
                    svg: pack.iconFrom.svg,
                    pngId: pack.iconFrom && pack.iconFrom.id || null
                },
                stickersList: pack.stickerList,
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
 * Адаптер для коллекции стикеров в паке
 * @param stickers
 * @returns {null|*}
 */
export const stickersInPackAdapter = ( stickers ) => {

    if ( !stickers.stickerList || !Array.isArray( stickers.stickerList ) ) return null;

    return stickers.stickerList.map( sticker => {
        let width = 0, height = 0, viewBoxWidth = 0, viewBoxHeight = 0, svg = '';

        //если это svg, берем их из svg (нужно для получения пропорций в дальнейшем)
        if ( sticker.svg ) {
            const widthObj = sticker.svg.match( /width="(.*?)"/ );
            const heightObj = sticker.svg.match( /height="(.*?)"/ );

            if ( widthObj && Array.isArray( widthObj ) ) {
                width = parseInt( widthObj[ 0 ].replace( /[^\d.]/g, '' ) );
            }
            if ( heightObj && Array.isArray( heightObj ) ) {
                height = parseInt( heightObj[ 0 ].replace( /[^\d.]/g, '' ) );
            }

            //разбираем данные из viewBox
            const viewBox = sticker.svg.match( /viewBox="(.*?)"/ );
            const vb = viewBox[ 1 ].split( ' ' );

            viewBoxWidth = parseInt( vb[ 2 ] );
            viewBoxHeight = parseInt( vb[ 3 ] );

            svg = sticker.svg.replace( /(<(svg[^>]+)>)/g, "" );
            svg = svg.replace( '</svg>', "" );
        }

        const result = {
            id: sticker.id,
            stickerSet: sticker.stickerSet,
            width: sticker.width || width,
            height: sticker.height || height,
            constrainProportions: sticker.constrainProportions,
            sortIndex: sticker.sortIndex
        }

        if ( sticker.svg ) {
            result[ 'svg' ] = svg;
            result[ 'viewBoxWidth' ] = viewBoxWidth || 0;
            result[ 'viewBoxHeight' ] = viewBoxHeight || 0;
        } else {
            result[ 'orig' ] = sticker.urls && sticker.urls.orig || null;
            result[ 'mid' ] = sticker.urls && sticker.urls.md || null;
            result[ 'thumb' ] = sticker.urls && sticker.urls.sm || null;
        }

        return result;
    } );
}