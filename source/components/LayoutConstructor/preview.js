import React from "react";
import ReactDOMServer from "react-dom/server";
import AreaConstructor from "./AreaConstructor";
import { store } from "components/App";
import { selectGetAllAreasIdsSelector, selectAreaByIdSelector } from './selectors';

import hmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import {
    productLayoutGroupSlugSelector, productLayoutSlug
} from "__TS/selectors/layout";

import { getPagesStructure } from "__TS/products/pagesTypes";


const SECRET_KEY = 'a040e40d-0b3e-4f69-ba6c-3ce4ec9bf580';

const generatePdf = ( { areasListIds, areasTypesAreas, state, productLayoutGroupSlug, isPuzzlePreview = false, areasTypesList } ) => {
    let pdfs = areasListIds.map( ( areaId, index ) => {
        const area = selectAreaByIdSelector( state, areaId );

        let disableBarcode = false;
        let renderBarcodeOnPage = false;

        if ( areasTypesList ) {
            disableBarcode = areasTypesList.disableBarcode || false
            if ( areasTypesAreas ) {
                if ( index === areasListIds.length - 1 && areasTypesAreas['last'] && areasTypesAreas['last']['type'] !== 'empty' ) {
                    renderBarcodeOnPage = areasTypesAreas['last'].renderBarcodeOnPage;
                }
            }
        }

        const generatedSvgForPdf = "<?xml version='1.0' encoding='UTF-8'?>" + generatePosterPreview( state, true, false, areaId, false, false, disableBarcode, renderBarcodeOnPage, isPuzzlePreview );

        //создаем хеш
        const hash = hmacSHA256( generatedSvgForPdf, SECRET_KEY ).toString( Hex );

        //создаем хеш + b54 из svg
        const b64svgHash = hash + window.btoa( unescape( encodeURIComponent( generatedSvgForPdf ) ) );

        let areaType = area.type === 'empty' ? 'page' : area.type;

        if ( productLayoutGroupSlug === 'CALENDAR_WALL_FLIP' ||
            productLayoutGroupSlug === 'CALENDAR_TABLE_FLIP' ||
            productLayoutGroupSlug === 'CALENDAR_WALL_SIMPLE' ||
            productLayoutGroupSlug === 'PUZZLE_SIMPLE' ) {
            areaType = isPuzzlePreview ? 'preview' : 'page'
        }

        return {
            group: areaType,
            payload: b64svgHash
        }

    } );

    //генератор пустых страниц
    if ( areasTypesAreas ) {
        for ( let page in areasTypesAreas ) {
            if ( areasTypesAreas.hasOwnProperty( page ) &&
                 areasTypesAreas[page].type === 'empty' ) {

                const generatedEmptySvgForPdf = "<?xml version='1.0' encoding='UTF-8'?>" + generatePosterPreview( state, true, false, false, false, true, true, areasTypesAreas[ page ].renderBarcodeOnPage );

                //создаем хеш
                const hash = hmacSHA256( generatedEmptySvgForPdf, SECRET_KEY ).toString( Hex );

                //создаем хеш + b54 из svg
                const b64svgHash = hash + window.btoa( unescape( encodeURIComponent( generatedEmptySvgForPdf ) ) );

                const pg = {
                    group: 'page',
                    payload: b64svgHash
                }

                if ( page === 'last' ) {
                    pdfs.push( pg );
                } else {
                    pdfs.splice( parseInt( page ), 0, pg );
                }
            }
        }
    }

    return pdfs;
}

/**
 * Создаем SVG для Preview или для PDF
 * @param state
 * @param forPdf
 * @param debugMode
 * @returns {*}
 */
export const generatePosterPreview = ( state = null, forPdf = false, debugMode = false, areaId = null, previewPage = false, empty = false, disableBarcode = false, renderBarcodeOnPage = false, isPuzzlePreview = false) => {

    const preview = <AreaConstructor state={state || store.getState()}
                                     dispatch={store.dispatch}
                                     preview={!forPdf}
                                     previewPage={previewPage}
                                     pdf={forPdf}
                                     debugMode={debugMode}
                                     areaId={areaId}
                                     empty={empty}
                                     disableBarcode={disableBarcode}
                                     renderBarcodeOnPage={renderBarcodeOnPage}
                                     isPuzzlePreview={isPuzzlePreview}
    />;

    let html = ReactDOMServer.renderToStaticMarkup( preview );

    html = html.replace( /className="[^"]+"/g, '' );
    html = html.replace( /id="[^"]+"/, 'data-ver="1"' );
    html = html.replace( /class="[^"]+"/g, '' );

    if ( forPdf ) {
        console.log('============ SVG FOR PDF', html);
    }

    return html;
};

export const generateAllProductPreview = ( state, onlyFirstArea = false, previewPage= false ) => {
    const stateInner = state || store.getState();
    const areasListIds = selectGetAllAreasIdsSelector( stateInner );

    if ( !areasListIds ) return [];

    if ( onlyFirstArea ) {
        return generatePosterPreview( state, false, false, areasListIds[0], previewPage );
    }

    return areasListIds.map( areaId => {
        return generatePosterPreview( state, false, false, areaId, previewPage );
    } );
}

export const generateAllProductPDF = ( state ) => {
    const stateInner = state || store.getState();
    const areasListIds = selectGetAllAreasIdsSelector( stateInner );
    const productLayoutGroupSlug = productLayoutGroupSlugSelector( stateInner ) || productLayoutSlug( stateInner );

    const areasTypesList = getPagesStructure( { productSlug: productLayoutGroupSlug } ),
        areasTypesAreas = areasTypesList && areasTypesList.areas;

    if ( !areasListIds ) return [];

    let result = generatePdf( {
        areasTypesList, areasListIds, areasTypesAreas, state, productLayoutGroupSlug
    } );


    if ( productLayoutGroupSlug === 'PUZZLE_SIMPLE' ) {
        const puzzleResult = generatePdf( {
            areasTypesList, areasListIds, areasTypesAreas, state, productLayoutGroupSlug,
            isPuzzlePreview: true
        } );
        result = [ ...result, ...puzzleResult ];
    }


    return result;
}
