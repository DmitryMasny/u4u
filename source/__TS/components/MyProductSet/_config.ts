
// @ts-ignore
import {IMG_DIR} from "config/dirs";


export interface ViewOptionsProps {
    id: string;
    preview?: string;
    src?: string;
    size?: number;
    max?: [number, number];
    min?: number;
    position?: {
        x?: number;
        y?: number;
        p?: number;
        po?: [number, number];
        rx?: number;
        ry?: number;
        rz?: number;
    }
}

export const VIEW_OPTIONS: ViewOptionsProps[] = [
    {id: 'pencil' },
    {
        id: 'white-n-chair',
        preview: `${IMG_DIR}posters/preview_1.jpg`,
        src: `${IMG_DIR}posters/view_1.jpg`,
        size: 2200,
        max: [1500, 1500],
        min: 1000,
        position: {
            x: 20, y: -16,
        }
    },
    {
        id: 'yellow',
        preview: `${IMG_DIR}posters/preview_4.jpg`,
        src: `${IMG_DIR}posters/view_4.jpg`,
        size: 3500,
        max: [2500, 1500],
        min: 1200,
        position: { x: 0, y: -20, }
    },
    {
        id: 'blue-livingroom',
        preview: `${IMG_DIR}posters/preview_5.jpg`,
        src: `${IMG_DIR}posters/view_5.jpg`,
        size: 3200,
        max: [2000, 1400],
        min: 700,
        position: { x: 0, y: -20, }
    },
    {
        id: 'grey',
        preview: `${IMG_DIR}posters/preview_6.jpg`,
        src: `${IMG_DIR}posters/view_6.jpg`,
        size: 2100,
        max: [2200, 1100],
        min: 700,
        position: { x: 20, y: -22}
    },
    {
        id: 'violet',
        preview: `${IMG_DIR}posters/preview_7.jpg`,
        src: `${IMG_DIR}posters/view_7.jpg`,
        size: 3000,
        max: [2200, 1100],
        min: 1000,
        position: {x: 10, y: -25}
    },
    {
        id: 'beton-bed',
        preview: `${IMG_DIR}posters/preview_8.jpg`,
        src: `${IMG_DIR}posters/view_8.jpg`,
        size: 3500,
        max: [1200, 1100],
        min: 1000,
        position: {x: 7, y: -26, ry: -25, p: 200, po: [60, 48]}
    },
    {
        id: 'cafe',
        preview: `${IMG_DIR}posters/preview_9.jpg`,
        src: `${IMG_DIR}posters/view_9.jpg`,
        size: 3600,
        max: [2200, 2200],
        min: 1000,
        position: {x: 25, y: -23, ry: -40, p: 280, po: [60, 50]}
    },
    {
        id: 'white-window',
        preview: `${IMG_DIR}posters/preview_10.jpg`,
        src: `${IMG_DIR}posters/view_10.jpg`,
        size: 2400,
        max: [1200, 1200],
        min: 700,
        position: {x: 5, y: -20, ry: -20, p: 600, po: [50, 40]}
    },
    {
        id: 'creme-bedroom',
        preview: `${IMG_DIR}posters/preview_2.jpg`,
        src: `${IMG_DIR}posters/view_2.jpg`,
        size: 2800,
        max: [1200, 1000],
        min: 1000,
        position: { x: -30, y: -20, ry: 15, p: 200, po: [40, 50]}
    }
];