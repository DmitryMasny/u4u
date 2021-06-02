import React from 'react';

import prepareData from 'components/PreviewAlbum/prepareData';

import PagesConstructor from 'components/PreviewAlbum/_PagesConstructor';

const CoverPreviewBuildByData = ( props ) => {
    const { width, height, formatId, data } = props;
    const dataConverted = prepareData( { pages: [ data ], fmt: formatId }, true );

    return  <PagesConstructor {...dataConverted} pxWidth={width * 2} pxHeight={height} isThumb={true} />;
};

export default CoverPreviewBuildByData;