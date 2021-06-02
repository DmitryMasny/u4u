import React, {memo} from "react";
import s from "./MyProductsPage.scss";

import { PosterPreviewMini } from "components/PosterPreview";
import CoverPreview from "components/CoverPreview";
import ProductPreview from "__TS/components/_misc/ProductPreview/ProductPreview";

/**
 * Проверка на ламинацию
 * @param options
 * @returns {{}|{lamination: *, glance: *}}
 */
const checkLamination = ( options ) => {
    if ( !options || !options.length ) return {};
    let lamination = false,
        glance = false;

    for ( let i = 0; i < options.length; i++ ) {
        if ( options[ i ].name === "LAMINATION" ) {
            lamination = options[ i ].nameSelected === "Глянцевая" || false;
            break;
        }
        //TODO: glance paper?
    }
    return { lamination, glance }
};

const _Preview = memo(( { product, thisIsNewProduct } ) => {

    const poster = thisIsNewProduct && product || null;

    if ( poster ) {
        const { lamination } = checkLamination( poster.options );
        const format = {
            w: parseInt(poster.format.width),
            h: parseInt(poster.format.height)
        };

        return  <ProductPreview svg={poster.preview || poster.previewList && poster.previewList[0]}
                                noFrontLayout={true}
                                format={format}
                                productSlug={poster.productSlug}
                                svgImageQuality={300}
                                glance={ lamination }
        />

        // return <PosterPreviewMini svg={poster.preview || poster.previewList && poster.previewList[0] }
        //                           lamination={checkLamination( poster.options )}
        //                           aspect={poster.format && (poster.format.width / poster.format.height)}/>;
    }

    return <CoverPreview className={s.productThumbImg}
                          bindingType={product.info && product.info.bindingType}
                          coverType={product.info && product.info.coverType}
                          data={product.previewCover}
                          formatId={product.formatId}
                          gloss={product.info && product.info.lamination}/>
});

export default _Preview;
