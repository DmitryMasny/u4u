// @ts-ignore
import { store } from "components/App";

// @ts-ignore
import { toast } from '__TS/libs/tools';

//получаем диспетчер Redux
const dispatch = store.dispatch;

// @ts-ignore
import WS from 'server/ws.es6';

import {
    EDITOR_SET_TEMPLATES
// @ts-ignore
} from "const/actionTypes";
import { ILayout } from "../interfaces/layout";
import { productLayoutSelector } from "../selectors/layout";
import { IPhoto } from "../interfaces/photo";
import { IStickers } from "../interfaces/stickers";
// @ts-ignore
import { generateAllProductPreview } from "../../components/LayoutConstructor/preview";

interface ILayoutFullData {
    layout: ILayout,
    photos?: IPhoto[],
    stickers?: IStickers,
}

export const getTemplatesAction = () => {
    const layout = <ILayout>{ ...productLayoutSelector( store.getState() ) };

    const layoutParentId: string | null = layout.theme && layout.theme.layoutParentId || null;

    if ( !layoutParentId ) return null;

    dispatch( {
        type: EDITOR_SET_TEMPLATES,
        payload: {
            svg: [],
            layoutId: null,
            layout: null
        }
    } );

    WS.getProductLayout( layoutParentId, true, [] ).then( ( layoutFullData: ILayoutFullData ) => {

        if ( layoutFullData ) {
            const lyo: ILayout = layoutFullData.layout;

            //svg = svg.replaceAll('/%IMAGESIZE%/', `w100`);

            const width = parseFloat( lyo.format.width ),
                  height = parseFloat( lyo.format.height ),
// @ts-ignore
                  svgs = generateAllProductPreview( { productData: { layout: lyo } }, false, true );

            const areas = lyo.areasList.map(( id, index ) => ({
                id: id,
                svg: svgs[ index ]
            } ) );

            dispatch( {
                type: EDITOR_SET_TEMPLATES,
                payload: {
                    layout: lyo,
                    svg: {
                        width: width,
                        height: height,
                        proportion: width / height,
                        areas: areas
                    },
                    layoutId: layout.id
                }
            });
        }

    } ).catch( ( err ) => {
        console.error( 'Не удалось получить layout с сервера', err );
    } );

};