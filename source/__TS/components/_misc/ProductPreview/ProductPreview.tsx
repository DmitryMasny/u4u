// @ts-ignore
import React, {useState, useEffect, useRef, useMemo} from 'react';
// @ts-ignore
import {useSelector} from "react-redux";

// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import {IMG_DIR} from "config/dirs";
// @ts-ignore
import {COLORS} from "const/styles";
// @ts-ignore
import {windowWidthSelector} from "selectors/global";

// import {COLORS} from 'const/styles';
// import {hexToRgbA} from "libs/helpers";

// @ts-ignore
import { isCalendar } from 'libs/helpers';

// @ts-ignore
import { SLUGS } from 'const/productsTypes.es6';

// @ts-ignore
import {  degrees_to_radians as toRadians } from 'libs/geometry';
// @ts-ignore
import { simpleID } from "__TS/libs/tools";
// @ts-ignore
import PuzzleFrontLayers from "components/LayoutConstructor/PuzzleFrontLayers";


/** Interfaces */
interface Props {
    size?: {
        w: number;
        h: number;
        x?: number;
        y?: number;
    };           // размер для просчета соотношения превьюшки
    svg: string;            // svg превью продукта
    src?: string;            // картинка превью продукта
    scale?: number;          // масштаб превью
    position?: any;          // позиция превью
    glance?: boolean;        // глянцевый блеск
    canvas?: boolean;        // текстура холста
    roundCorners? : boolean;  // закругленные углы
    inModal? : boolean;  // если в модалке нужен таймаут на замер размеров
    format?: any;           // Формат продукта
    productSlug?: string;   // метка продукта
    svgImageQuality?: number;   // Размер запрашиваемых картинок. Если не выставлен, то подбирается под каждую картинка пиксель в пиксель
    noShadow?: boolean;    // не заливать страницу белым цветом
    puzzleSizeType?: string | null; //тип размера для пазла
    noFrontLayout?: boolean;
}
interface ICommonSvgDefs {
    mask: any;
    spring: any;
    isWallFlipCalendar: boolean;
    isTableFlipCalendar: boolean;
    id: string;
}
interface StyledSvgProps {
    translate?: [ number, number, number ];
    rotate?: [ number, number, number ];
    transformOrigin?: [ number, number ];
    scale?: number;
    noInterpolate?: boolean;
    isTableFlipCalendar?: boolean;
}


/** Styles */
const ProductPreviewStyled = styled('div')`
    width: 100%;
    height: 100%;
    font-size: 1%;
    transform-style: preserve-3d;
    transform: 
    ${({scale}: StyledSvgProps) => scale && `scale(${scale})`}
    ${({translate}: StyledSvgProps) => translate && `translate3d(${translate[0] || 0}%, ${translate[1] || 0}%, ${translate[2] || 0}em)`}
    ${({rotate}: StyledSvgProps) => rotate && `rotateX(${rotate[0]}deg) rotateY(${rotate[1]}deg) rotateZ(${rotate[2]}deg)`};
`;
const SvgWrap = styled('svg')`
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: visible;
`;
const TableFlipCalendarStyled = styled(SvgWrap)`
    transform-origin: ${({transformOrigin}: StyledSvgProps) => `${transformOrigin[0] || 0}% ${transformOrigin[1] || 0}%`};
    transform: 
    ${({translate}: StyledSvgProps) => translate && `translate3d(${translate[0] || 0}%, ${translate[1] || 0}%, ${translate[2] || 0}em)`}
    ${({rotate}: StyledSvgProps) => rotate && `rotateX(${rotate[0]}deg) rotateY(${rotate[1]}deg) rotateZ(${rotate[2]}deg)`};
`;
// const TableFlipCalendarBack = styled('div')`
//     position: absolute;
//     top: 15%;
//     height: 70%;
//     width: 100%;
//     transform-origin: 50% 0;
//     transform: rotateX(-20deg);
//     background-color: #3d4c62;
// `;

const SvgMainWrap = styled('svg')`
    height: 100%;
    width: 100%;
    overflow: visible;
    image-rendering: ${({noInterpolate}: StyledSvgProps) => noInterpolate ? 'pixelated' : 'auto'};
    transform: 
    ${({translate}: StyledSvgProps) => translate && `translate3d(${translate[0]}%, ${translate[1]}%, ${translate[2]}em)`}
    ${({rotate}: StyledSvgProps) => rotate && `rotateX(${rotate[0]}deg) rotateY(${rotate[1]}deg) rotateZ(${rotate[2]}deg)`}    
    scale(${({scale}: StyledSvgProps) => scale});
    transform-origin: ${({transformOrigin}: StyledSvgProps) => `${transformOrigin[0] || 50}% ${transformOrigin[1] || 0}%`};

    [data-current="layoutSticker"] {
        image {
            image-rendering: auto!important;
        }
    }
`;

const loaderSizes = {
    w: 20,
    h: 10,
    x: 40,
    y: 45
};
const SPRING_IMG_ASPECT = 180/258;          // Соотношение сторон картинки пружинки
const SPRING_SIZE = 8;                      // Физический размер пружинки (ширина в мм)
const CALENDAR_DATE_ASPECT = 720/540;       // Соотношение сторон картинки даты календаря
const CALENDAR_DATE_VERT_ASPECT = 540/720;  // Соотношение сторон вертикальной картинки даты календаря
const CALENDAR_DATE_IMG_PROPORTIONS = 0.4;  // Соотношение сторон даты и фона календаря
const CALENDAR_DATE_PADDING = 1;            // Отступ даты календаря от краев
const CALENDAR_RIGEL_SIZE = 4;              // Размер ригеля

const getPreviewImage = (productSlug, format) => {
    if (!productSlug) return `${IMG_DIR}previewImages/tower.jpg`;
    switch (productSlug) {
        case SLUGS.PHOTO_PREMIUM:
            return format.k > 1 ? `${IMG_DIR}previewImages/tower-hor.jpg`:  `${IMG_DIR}previewImages/tower.jpg`;
        case SLUGS.PHOTO_SIMPLE:
            return `${IMG_DIR}previewImages/girl.jpg`;
        case SLUGS.POSTER_PREMIUM:
            return `${IMG_DIR}previewImages/dog.jpg`;
        case SLUGS.POSTER_CANVAS:
            return `${IMG_DIR}previewImages/holst.jpg`;
        case SLUGS.CALENDAR_WALL_SIMPLE:
            return `${IMG_DIR}previewImages/calendar-bd.jpg`;
        case SLUGS.CALENDAR_WALL_FLIP:
            return `${IMG_DIR}previewImages/calendar-autumn.jpg`;
        case SLUGS.CALENDAR_TABLE_FLIP:
            return `${IMG_DIR}previewImages/calendar-winter.jpg`;
        case SLUGS.PUZZLE:
            return format.k > 1 ? `${IMG_DIR}previewImages/puz-hor.jpg`:  `${IMG_DIR}previewImages/puz.jpg`;
        default: //SLUGS.POSTER_SIMPLE
            return `${IMG_DIR}previewImages/bird.jpg`;
    }
};
const getCalendarImage = (productSlug, verticalDateBlock) => {
    switch (productSlug) {
        case SLUGS.CALENDAR_WALL_SIMPLE:
            return verticalDateBlock ? `${IMG_DIR}previewImages/calendar-full-vert.png` : `${IMG_DIR}previewImages/calendar-full.png`;
        case SLUGS.CALENDAR_WALL_FLIP:
            return `${IMG_DIR}previewImages/calendar-a.png`;
        default:
            return `${IMG_DIR}previewImages/calendar-w.png`;
    }
};

const createCalendar = ( { w, h, x, y }, productSlug ) => {
    // console.log('===>', { w, h, x, y });
    const dateSizes = {w:0, h:0, x:x, y:y, isVertical: false}
    const imageDateAspect = productSlug === SLUGS.CALENDAR_WALL_SIMPLE ? CALENDAR_DATE_VERT_ASPECT : CALENDAR_DATE_ASPECT;
    //TODO: возможно сделать для всех вертикальные картинки
    if ( w > h ) {
        dateSizes.h = h;
        dateSizes.w = h * imageDateAspect;
        if (dateSizes.w > w * CALENDAR_DATE_IMG_PROPORTIONS) {
            dateSizes.w = w * CALENDAR_DATE_IMG_PROPORTIONS;
            dateSizes.h = dateSizes.w / imageDateAspect;
            dateSizes.y = y + (h - dateSizes.h)/2;
            dateSizes.x = x + w - dateSizes.w;
        } else {
            dateSizes.x = x + w - dateSizes.w;
        }
    } else {
        dateSizes.isVertical = true;
        dateSizes.w = w;
        dateSizes.h = w / CALENDAR_DATE_ASPECT;
        if (dateSizes.h > h * CALENDAR_DATE_IMG_PROPORTIONS) {
            dateSizes.h = h * CALENDAR_DATE_IMG_PROPORTIONS;
            dateSizes.w = dateSizes.h * CALENDAR_DATE_ASPECT;
            dateSizes.x = x + (w - dateSizes.w)/2;
            dateSizes.y = y + h - dateSizes.h;
        } else {
            dateSizes.y = y + h - dateSizes.h;
        }
    }
    return {size: dateSizes, src: getCalendarImage(productSlug, !dateSizes.isVertical)}
};

const calculateSpring = (size, format, rigel = 0) => {
    const margin = 1;
    const springWidth = size.w - margin*2;
    const k = springWidth / format.w;
    const springSize = {
        w: SPRING_SIZE * k,
        h: 0,        x: 0,        y: 0,
        fullWidth: 0, margin: margin, halfWidth: 0, x2: 0
    };
    let tail = springWidth % springSize.w;
    springSize.h = springSize.w / SPRING_IMG_ASPECT;

    springSize.fullWidth = springWidth - tail;
    springSize.x = size.x + tail / 2 + margin;
    springSize.y = size.y - springSize.h/2;

    if ( rigel ) {
        const halfSpringLength = (springWidth - rigel) / 2;
        tail = halfSpringLength % springSize.w;
        springSize.halfWidth = halfSpringLength - tail;
        springSize.x2 = springSize.x + springSize.fullWidth - springSize.halfWidth;
    }
    return springSize;
};

const CommonSvgDefs: React.FC<ICommonSvgDefs> =  ( { mask, spring, isWallFlipCalendar, isTableFlipCalendar, id } ) => (
    <SvgWrap id={`svgCommonDefsContainer-${id}`} viewBox={ '0 0 100 100' }>
        <defs>
            <clipPath id={`mask-${id}`}>
                <rect x={mask.x} y={mask.y} width={mask.w} height={mask.h} rx={mask.rc} ry={mask.rc}/>
            </clipPath>

            { isWallFlipCalendar &&
                <clipPath id={`calendarWallMask-${id}`}>
                    <path d={mask.maskPath} fill="white" />
                </clipPath>}

            <linearGradient id="glance-gloss" x1="0" y1="0" x2="80%" y2="100%">
                <stop offset="0%"   stopColor="rgba(205,225,235,0)"/>
                <stop offset="33%"  stopColor="rgba(255,255,255,1)"/>
                <stop offset="50%"  stopColor="rgba(30,50,70,.3)"/>
                <stop offset="100%" stopColor="rgba(30,50,70,0)"/>
            </linearGradient>


            {isTableFlipCalendar &&
                <linearGradient id="paperGradient" x1={0} x2={0} y1={0} y2={1}>
                    <stop offset="0%" stopColor="#d5d8de" />
                    <stop offset="100%" stopColor="#f9fafc" />
                </linearGradient>}

            {isTableFlipCalendar &&
                <linearGradient id="paperGradient2" x1={0} x2={0} y1={0} y2={1}>
                    <stop offset="0%" stopColor="#c6c7d2" />
                    <stop offset="100%" stopColor="#eaebef" />
                </linearGradient>}

            {isTableFlipCalendar &&
                <mask id={`maskTableCalendar-${id}`} x={mask.x} y={mask.y} width={mask.w} height={mask.h}>
                    <rect id='main-rect' x={mask.x} y={mask.y} width={mask.w} height={mask.h} fill='#000' />
                    <circle cx={50} cy={50} r={50} fill="#fff"/>
                </mask>}

            <pattern id="canvas" patternUnits="userSpaceOnUse" width="60" height="60">
                <image xlinkHref={`${IMG_DIR}common/clean-textile.png`} x="0" y="0" width="60" height="60"/>
            </pattern>

            {spring &&
                <pattern id={`spring-${id}`} patternUnits="userSpaceOnUse" width={spring.w} height={spring.h} y={spring.y} x={spring.x}>
                    <image xlinkHref={`${IMG_DIR}common/spring-ring.png`} x="0" y="0" width={spring.w} height={spring.h}/>
                </pattern>}

            <filter id="shadow" x="-10" y="-10" width="120" height="120">
                <feDropShadow dx="0.2" dy="1.2" stdDeviation="1.4" floodColor={COLORS.BLACK} floodOpacity=".4"/>
            </filter>

            <rect id="sa11" x="763.0" y="176.5" width="70.0" height="25.0" rx="50" ry="50" />
            <rect id="sa12" x="516.0" y="127.5" width="70.0" height="25.0" rx="50" ry="50" />
            <filter id="calendarTableShadow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
        </defs>
    </SvgWrap>
);

/**
 * Построение превью продукта
 * @param format
 * @param size
 * @param scale
 * @param src
 * @param svg
 * @param position
 * @param glance
 * @param canvas
 * @param roundCorners
 * @param inModal
 * @param productSlug
 * @param svgImageQuality
 * @param noShadow
 * @constructor
 */
const ProductPreview: React.FC<Props> =  ( { format, size, scale = 1, src, svg, noFrontLayout = false, puzzleSizeType, position, glance, canvas, roundCorners, inModal, productSlug, svgImageQuality, noShadow } ) => {
    if ( Array.isArray( svg ) ) svg = svg[ 0 ];

    const svgWrapRef = useRef( null );
    const [uid, set___] = useState( simpleID() );
    const [isLoading, setIsLoading] = useState( !!svg ? 0 : 1);
    const [fixedSvg, setFixedSvg] = useState(null);
    const [nonUrlsSvg, setNonUrlsSvg] = useState(null);
    const [imageSrc, setImageSrc] = useState('');
    const [calendar, setCalendar] = useState<any>(null);
    const [sizes, setSizes] = useState(null);
    const [spring, setSpring] = useState(null);
    const [svgImageSizes, setSvgImageSizes] = useState([]); // Размеры картинок в state чтобы не подгружать такую же, но чуть меньше
    const windowWidth = useSelector( state => windowWidthSelector( state ) );

    const isTableFlipCalendar = productSlug === SLUGS.CALENDAR_TABLE_FLIP;
    const isWallFlipCalendar = productSlug === SLUGS.CALENDAR_WALL_FLIP;
    const isPuzzle = productSlug === SLUGS.PUZZLE;

    useEffect( () => {
        if (size) {
            setSizes({...(size || {w:100, h:100,x:0,y:0}), rc: roundCorners ? 10 : 0});
        } else if (format) {
            const size = {
                w: 0,
                h: 0,
                x: 0,
                y: 0,
                k: format.w / format.h
            };

            // Расчет размеров для SVG в процентах
            if ( size.k > 1) {   //горизонтальные пропорции
                size.w = 100;
                size.h = Math.round( format.h / format.w * 1000 ) / 10;
                size.y = Math.round( (100 - size.h) / .2 ) / 10;
            } else {   //вертикальные пропорции или квадрат
                size.h = 100;
                size.w = Math.round( size.k * 1000 ) / 10;
                size.x = Math.round( (100 - size.w) / .2 ) / 10;
            }
            setSizes({...size, rc: roundCorners ? 10 : 0});
        }
    }, [ size, format ] );


    useEffect( () => {
        setImageSrc( src || getPreviewImage(productSlug, format) );
    }, [ src ] );

    useEffect( () => {
        if ( sizes && !src && !svg && isCalendar(productSlug) ) {
            // @ts-ignore
            setCalendar(createCalendar(sizes, productSlug));
        } else {
            setCalendar(null);
        }
    }, [ src, svg, sizes, productSlug ] );

    useEffect( () => {
        if (sizes && [
            'CALENDAR_WALL_FLIP',
            'CALENDAR_TABLE_FLIP'
        ].some(x => x === productSlug)) {
            setSpring(calculateSpring(sizes, format, isWallFlipCalendar ? CALENDAR_RIGEL_SIZE : 0));
        } else setSpring(null);
    }, [ productSlug, sizes, format ] );


    // замеряем картинки и проставляем в свг нужный размер для загрузки из стореджа оптимального размера
    const fixSvg = (svg) => {
        //Ищем в svg эл-ты image и их href
        //const svgImageRegex = /<image([^>]*?)>/i;
        const svgImageRegex = /<image([^>]*?)>/gm;
        // @ts-ignore
        const matchedImages = [...svg.matchAll( svgImageRegex )];

        setIsLoading( matchedImages && matchedImages.length || 0 );

        //если нет image то выходим из функции
        if ( !matchedImages || !matchedImages.length ) {
            return;
        }

        const svgUrls = matchedImages.map( ( svgImage ) => {
            const urlString = svgImage[ 0 ].match( /href="(.*?)"/gm );
            return urlString && Array.isArray( urlString ) && urlString[ 0 ].split( '"' )[ 1 ] || null
        });

        // Ищем в доме svg эл-ты image для получения размера в пикселях
        const svgImages = svgWrapRef.current && svgWrapRef.current.querySelectorAll("image");
        const imageSizes = [];
        let replacedSvg = svg;
        if (svgImages && svgImages.length) {
            for (let i = 0; i < svgImages.length; i++) {
                const imageEl = svgImages[i];
                const imageSize = Math.ceil(imageEl.getBoundingClientRect().width);
                if (imageSize) imageSizes[i] = Math.max(svgImageSizes[i] || 0, Math.min(imageSize*2, 3600));
                const newUrl = svgUrls[i] && svgUrls[i].replace('/%IMAGESIZE%/', `w${imageSizes[i] || 100}`);
                if (newUrl) {
                    replacedSvg = replacedSvg.replace(svgUrls[i], newUrl);
                    const img = new Image();
                    img.src = newUrl;
                    img.onload = () => {
                        isLoading && setIsLoading( isLoading - 1 );
                    };
                } else {
                    isLoading && setIsLoading( isLoading - 1 );
                }
            }
            setSvgImageSizes( imageSizes );
            setFixedSvg( replacedSvg );
        }
    };

    // Удаляем url из svg дабы избежать запроса на несуществующий файл
    useEffect( () => {
        if ( svg && !svgImageQuality ) {
            setNonUrlsSvg( svg.replace( /href="(.*?)"/gm, '' ) );
            setIsLoading(1);
            setSvgImageSizes([]);
            setFixedSvg(null);
        }
    }, [ svg ] );

    // Если не выставлен фиксированный размер изображений Замеряем картинки в svg чтобы запросить изображения необходимого размера
    useEffect( () => {
        let timer = null;
        if ( svg ) {
            if ( svgImageQuality ) {
                const svgConverted = svg.split('/%IMAGESIZE%/').join('w' + svgImageQuality);
                setFixedSvg( svgConverted );
            } else {
                if ( inModal ) {
                    timer = setTimeout( ()=>fixSvg(svg), 900 );
                } else fixSvg(svg);
            }
        } else {
            setIsLoading( 0 );
        }
        return ()=>{
            if (timer) clearTimeout(timer);
        }
    }, [ size, svg, windowWidth ] );

    if (!svg && !imageSrc || !sizes) return null;

    const {w,h,x,y,rc} = sizes;
    const imageSize = {
        w: !calendar || calendar.size.isVertical ? w : w - calendar.size.w,
        h: calendar && calendar.size.isVertical ? h - calendar.size.h : h,
    };
    const rigelSize = {
        x1: x,
        x2: 0,
        x3: 0,
        x4: x + w,
        stickLength: 0,
        r: Math.round(CALENDAR_RIGEL_SIZE/2.1 * 100)/100,
        y: y - 1,
        y2: y + h,
    };
    rigelSize.stickLength = (w - rigelSize.r)/2;
    rigelSize.x2 = rigelSize.x1 + rigelSize.stickLength;
    rigelSize.x3 = rigelSize.x4 - rigelSize.stickLength;
    const rigelPath:string = isWallFlipCalendar ? `M${rigelSize.x1 + 1} ${rigelSize.y} L ${rigelSize.x2} ${rigelSize.y} C ${rigelSize.x2} ${rigelSize.y - rigelSize.r}, ${rigelSize.x3} ${rigelSize.y - rigelSize.r}, ${rigelSize.x3} ${rigelSize.y} L ${rigelSize.x4 - 1} ${rigelSize.y}` : '';  // Кривая отрисовки ригеля
    const maskPath:string = isWallFlipCalendar ? `
        M${rigelSize.x1} ${rigelSize.y +1} 
        L ${rigelSize.x2 -1} ${rigelSize.y +1} 
        C ${rigelSize.x2 -1} ${rigelSize.y +1 + rigelSize.r}, ${rigelSize.x3 +1} ${rigelSize.y +1 + rigelSize.r}, ${rigelSize.x3 +1} ${rigelSize.y +1} 
        L ${rigelSize.x4} ${rigelSize.y +1} 
        L ${rigelSize.x4} ${rigelSize.y2} 
        L ${rigelSize.x1} ${rigelSize.y2} 
        Z` : '';  // Кривая отрисовки маски - выреза под ригель

    let object3d:any = null;  // Данные для 3d трансформации целого объекта

    const calendarBack = {
        angle: 15,
        h: Math.round(h * 1.08 * 100)/100,
        floorH: 0,
        floorY: 0,
        bottom: {
            h: 0,
            angle: 75,
            dy: 0
        }
    };

    calendarBack.bottom.h = calendarBack.h * Math.sin(toRadians(calendarBack.angle)) / Math.sin(toRadians(calendarBack.bottom.angle));
    calendarBack.bottom.dy = calendarBack.h * Math.cos(toRadians(calendarBack.angle)) - calendarBack.bottom.h * Math.cos(toRadians(calendarBack.bottom.angle));
    calendarBack.floorH = calendarBack.h * Math.sin(toRadians(calendarBack.angle)) * 2;
    calendarBack.floorY = calendarBack.h * Math.cos(toRadians(calendarBack.angle)) - calendarBack.floorH /2;

    if ( isTableFlipCalendar ) {
        object3d = {y: -5, ry: -30, z: (sizes.w < sizes.h) ? -1000 : -200};
        position = { rx: calendarBack.angle + 1, z: 12 };
    }

    return <ProductPreviewStyled
        rotate={ object3d && [ object3d.rx || 0, object3d.ry || 0, object3d.rz || 0 ] }
        translate={ object3d && [ object3d.x || 0, object3d.y || 0, object3d.z || 0 ] }
        scale={object3d && object3d.scale || 1}>
        <CommonSvgDefs mask={{
                                x: x,
                                y: y,
                                w: w,
                                h: h,
                                rc: rc,
                                maskPath: maskPath
                            }}
                       spring={spring}
                       isWallFlipCalendar={isWallFlipCalendar}
                       isTableFlipCalendar={isTableFlipCalendar}
                       id={uid}
        />

        { isTableFlipCalendar &&
            <>

                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [90, 0, 0] }
                                         transformOrigin={[50,y + calendarBack.floorH /2]}
                                         translate={[0, calendarBack.floorY]}
                                         style={{ opacity: .3}}
                >
                    <rect x={x} y={y - 2} width={w} height={calendarBack.floorH + 3} fill={COLORS.BLACK} filter="url(#calendarTableShadow)"/>
                </TableFlipCalendarStyled>

                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [calendarBack.angle * -1, 0, 0] }
                                         transformOrigin={[50,y]}
                >
                    <rect x={x} y={y} width={w} height={calendarBack.h} fill="url(#paperGradient2)"/>
                </TableFlipCalendarStyled>

                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [calendarBack.bottom.angle * -1, 0, 0] }
                                         translate={[0, calendarBack.bottom.dy]}
                                         transformOrigin={[50,y]}
                >
                    <rect x={x} y={y} width={w} height={calendarBack.bottom.h} fill="#c6c7d2"/>
                </TableFlipCalendarStyled>

                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [calendarBack.bottom.angle, 0, 0] }
                                         translate={[0, calendarBack.bottom.dy]}
                                         transformOrigin={[50,y]}
                >
                    <rect x={x} y={y} width={w} height={calendarBack.bottom.h} fill="#dde2ea"/>
                </TableFlipCalendarStyled>

                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [calendarBack.angle, 0, 0] }
                                         transformOrigin={[50,y]}
                >
                    <rect x={x} y={y} width={w} height={calendarBack.h} fill="url(#paperGradient)"/>
                </TableFlipCalendarStyled>
                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [calendarBack.angle + 0.4, 0, 0] }
                                         translate={[0, 0, 4]}
                                         transformOrigin={[50,y]}
                >
                    <rect x={x} y={y} width={w} height={h} fill="#dddddd"/>
                </TableFlipCalendarStyled>
                <TableFlipCalendarStyled viewBox={ '0 0 100 100' }
                                         rotate={ [calendarBack.angle + 0.8, 0, 0] }
                                         translate={[0, 0, 8]}
                                         transformOrigin={[50,y]}
                >
                    <rect x={x} y={y} width={w} height={h} fill="#eeeeee"/>
                </TableFlipCalendarStyled>
            </>
        }


        <SvgMainWrap
            translate={position && [position.x || 0, position.y || 0, position.z || 0]}
            rotate={position && [position.rx || 0, position.ry || 0, position.rz || 0]}
            scale={scale}
            transformOrigin={[50,y]}
            //noInterpolate={!!fixedSvg}
            noInterpolate={false}
            viewBox={'0 0 100 100'}
        >

            {!noShadow && !isTableFlipCalendar && <rect clipPath={isWallFlipCalendar ? `url(#calendarWallMask-${uid})` : ''} fill={'white'} x={x+.25} y={y+.25} width={w-.5} height={h-.5} rx={rc} ry={rc} style={{filter: 'url(#shadow)'}}/>}


            <g className="mainPage">
                {svg ?
                    <g clipPath={`url(#${isWallFlipCalendar ? `calendarWallMask-${uid}` : ''})`} ref={svgWrapRef} x={x} y={y} height={h} width={w} dangerouslySetInnerHTML={{__html: fixedSvg || nonUrlsSvg}}/>
                    :
                    <image clipPath={`url(#${isWallFlipCalendar ? `calendarWallMask-${uid}` : `mask-${uid}`})`} xlinkHref={imageSrc} x={x} y={y} height={imageSize.h} width={imageSize.w} preserveAspectRatio={'xMidYMid slice'} opacity={isLoading ? 0 : 1}/>
                }

                {isPuzzle && !inModal && !noFrontLayout &&
                // @ts-ignore
                <PuzzleFrontLayers opacity={1} formatSlug={`${format.w}_${format.h}`} puzzleSizeType={puzzleSizeType} width={w} height={h} x={x} y={y} />}

                {calendar && <rect fill={`white`}
                                   x={calendar.size.isVertical ? x : calendar.size.x}
                                   y={calendar.size.isVertical ? calendar.size.y : y}
                                   width={calendar.size.isVertical ? w : calendar.size.w}
                                   height={calendar.size.isVertical ? calendar.size.h : h}
                />}
                {calendar && <image xlinkHref={calendar.src} x={calendar.size.x + CALENDAR_DATE_PADDING} y={calendar.size.y + CALENDAR_DATE_PADDING} height={calendar.size.h - CALENDAR_DATE_PADDING*2} width={calendar.size.w - CALENDAR_DATE_PADDING*2} preserveAspectRatio={'xMidYMid slice'} clipPath={`url(#mask-${uid})`}/>}


                {glance && <rect fill="url(#glance-gloss)" x={x} y={y} width={w} height={h} rx={rc} ry={rc} opacity={.33}/>}
                {canvas && <rect opacity=".8" fill={`url(#canvas)`} x={x} y={y} width={w} height={h} rx={rc} ry={rc}/>}

                {spring && !isWallFlipCalendar && <rect fill={`url(#spring-${uid})`} x={spring.x} y={spring.y} width={spring.fullWidth} height={spring.h}/> }

                {/* Если настенный перекидной календарь, рисуем ригель и раздельную пружину */}
                {isWallFlipCalendar && spring && <>
                    {/* Ригель */}
                    <path d={rigelPath} stroke="#cad0dc" fill="transparent" strokeWidth={.48}  strokeLinecap="round" strokeLinejoin="round" />
                    <path d={rigelPath} stroke="white" fill="transparent" strokeWidth={.15}  strokeLinecap="round" strokeLinejoin="round" />

                    <rect fill={`url(#spring-${uid})`} x={spring.x} y={spring.y} width={spring.halfWidth} height={spring.h}/>
                    <rect fill={`url(#spring-${uid})`} x={spring.x2} y={spring.y} width={spring.halfWidth} height={spring.h}/>

                </>}

            </g>

            {/*//TODO: проверить лоадер ниже*/}
            {/*Preloader By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL*/}
            {/*{isLoading && <svg width={loaderSizes.w} height={loaderSizes.h} x={loaderSizes.x} y={loaderSizes.y} viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#cfdae6">
                <circle cx="15" cy="15" r="15">
                    <animate attributeName="r" from="15" to="15"
                             begin="0s" dur="0.8s"
                             values="15;9;15" calcMode="linear"
                             repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1"
                             begin="0s" dur="0.8s"
                             values="1;.5;1" calcMode="linear"
                             repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                    <animate attributeName="r" from="9" to="9"
                             begin="0s" dur="0.8s"
                             values="9;15;9" calcMode="linear"
                             repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="0.5" to="0.5"
                             begin="0s" dur="0.8s"
                             values=".5;1;.5" calcMode="linear"
                             repeatCount="indefinite" />
                </circle>
                <circle cx="105" cy="15" r="15">
                    <animate attributeName="r" from="15" to="15"
                             begin="0s" dur="0.8s"
                             values="15;9;15" calcMode="linear"
                             repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1"
                             begin="0s" dur="0.8s"
                             values="1;.5;1" calcMode="linear"
                             repeatCount="indefinite" />
                </circle>
            </svg> || null }*/}
        </SvgMainWrap>
    </ProductPreviewStyled>;
};

export default ProductPreview;



