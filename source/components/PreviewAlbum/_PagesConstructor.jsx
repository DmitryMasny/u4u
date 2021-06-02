import React from "react";
import Page from './_Page';

/**
 * компонент отрисовки страниц альбома
 * @param pages <array>
 * @param pxWidth <number>
 * @param pxHeight <number>
 * @param coverSize <number>
 * @param coverParams <object>
 * @returns []<array>
 * @constructor
 */
const PagesConstructor =  ( { pages, pxWidth, pxHeight, coverSize, coverParams, isThumb } ) => {


    /*if (!pxWidth || !pxHeight) {
        pxWidth = coverSize.width;
        pxHeight = coverSize.height;
    }*/

    const pagesCount = pages.length;

    return pages.map(( page, i ) =>
                                    <Page isFrontCover={i === 0}
                                          isFrontLiner={i === 1}
                                          isBackLiner ={i === pagesCount - 2}
                                          isBackCover ={i === pagesCount - 1}
                                          page={page}
                                          key={i}
                                          isThumb={isThumb}
                                          pxWidth={pxWidth}
                                          pxHeight={pxHeight}
                                          //pageNumber={i + 1}
                                          coverParams={coverParams}
                                    />
    );
};

export default PagesConstructor;