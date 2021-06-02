import React from "react";
import ReactDOMServer from "react-dom/server";
import AreaConstructor from "./AreaConstructor";
import { store } from "components/App";

/**
 * Создаем SVG для Preview
 * @returns {*}
 * @param areaNum
 * @param areaId
 */
export const generatePagePreview = ( areaNum = null, areaId = null ) => {

    const preview = <AreaConstructor state={store.getState()}
                                     dispatch={store.dispatch}
                                     previewPage={true}
                                     preview={true}
                                     areaNum={areaNum}
                                     areaId={areaId}
    />;

    let html = ReactDOMServer.renderToStaticMarkup( preview );

    html = html.replace( /className="[^"]+"/g, '' );
    html = html.replace( /id="[^"]+"/, 'data-ver="1"' );
    html = html.replace( /class="[^"]+"/g, '' );

    return html;
};