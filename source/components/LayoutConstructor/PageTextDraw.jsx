import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { useSelector } from "react-redux";
import styled from "styled-components";

import { selectContent } from './selectors';
import { FONTS } from '__TS/fonts/fontConfig';

import { updateTextContentAction } from "__TS//actions/layout";

/** styles */
const TextSVG = styled( 'text' )`
    pointer-events: none;
    user-select: none;
    
    @font-face {
                font-family: '${( { fontFamily } ) => fontFamily}';
                src: url('${( { fontUrl } ) => fontUrl}') format('truetype');
                font-weight: normal;
                font-style: normal;
                }
    font-family: '${( { fontFamily } ) => fontFamily}';                
    font-weight: ${( { fontBold } ) => fontBold ? 'bold' : 'normal'};
    font-style: ${( { fontItalic } ) => fontItalic ? 'italic' : 'normal'};          
`;

/**
 * Обновляем блок текста
 * @param textArray
 * @param elementId
 * @param controlWidthPx
 * @param size
 */
function svgTextMultiline( textArray, elementId, controlWidthPx, size ) {
//  text = strip(text);

    var elementMain = document.getElementById( elementId );
    var element = elementMain.cloneNode( false );

    element.removeAttribute( 'id' );
    element.removeAttribute( 'path' );
    element.removeAttribute( 'transform' );
    element.removeAttribute( 'clip-path' );

    element.setAttribute( 'font-size', size );

    //@ts-ignore
    elementMain.parentNode.insertBefore( element, elementMain );

    var width = controlWidthPx;

    let result = [];
    let double = 1
    for ( let i = 0; i < textArray.length; i++ ) {
        var text = textArray[ i ];

        if ( text.length === 0 ) {
            double++;
            continue;
        }

        var words = text.split( ' ' );
        var line = '';


        /* Make a tspan for testing */
        element.innerHTML = '<tspan id="PROCESSING">busy</tspan >';

        for ( var n = 0; n < words.length; n++ ) {
            var testLine = line + words[ n ] + ' ';

            var testElem = document.getElementById( 'PROCESSING' );
            /*  Add line in testElement */
            testElem.innerHTML = testLine;
            /* Messure textElement */
            var metrics = testElem.getBoundingClientRect();
            let testWidth = metrics.width;

            if ( testWidth > width && n > 0 ) {
                if ( double > 1 ) {
                    for ( var d = 1; d < double; d++ ) {
                        result.push( '' );
                    }
                    double = 1;
                }
                result.push( line );
                //result.push('<tspan x="0" dy="' + y*double + '">' + line + '</tspan>');
                line = words[ n ] + ' ';
            } else {
                line = testLine;
            }
        }

        if ( line.length ) {
            if ( double > 1 ) {
                for ( var d = 1; d < double; d++ ) {
                    result.push( '' );
                }
                double = 1;
            }
            result.push( line );
            //result.push('<tspan x="0" dy="' + y*double + '">' + line + '</tspan>');
        }

        var el = document.getElementById( "PROCESSING" );
        if ( el ) el.remove();

        if ( double > 1 ) double = 1;
    }
    //element.innerHTML = result.join('');
    element.remove();
    return result;
}

const PageTextDraw = ( { state = null, contentId, blockHeight, mirroring, x, y, w, h, r, controlWidthPx, updateHeightHandler, pdf, preview } ) => {
    const content = state ? selectContent( state, contentId ) : useSelector( state => selectContent( state, contentId ) );

    const [linesOfTexts, setLinesOfTexts] = useState( content.textLines );

    const timeOutDebounce = useRef( null );

    useEffect( () => {
        setLinesOfTexts( content.textLines )
    }, [content.textLines, content.text] );

    useEffect( () => {
        if ( !pdf && !preview && controlWidthPx && content.textLines.length ) {
            const textId = `text_${content.id}`;
            const mainMultiLineNext = content.text.split( '\n' );

            const lines = svgTextMultiline( mainMultiLineNext, textId, controlWidthPx, content.size );

            //if ( content.textLines.length !== lines.length ) {
            if ( timeOutDebounce.current ) clearTimeout( timeOutDebounce.current );

            timeOutDebounce.current = setTimeout( () => {
                updateTextContentAction( { controlWidthPx: controlWidthPx, textLines: lines, text: content.text } );
            }, 300);

            //}

            setLinesOfTexts( lines );
        }
    }, [controlWidthPx] );

    useEffect( () => {
        const height = (linesOfTexts.length || 1) * content.dy;

        if ( height > blockHeight ) {
            updateHeightHandler( height );
        }
    }, [linesOfTexts.length] );

    //если нет контента, не рендерим
    if ( !content ) return null;


    const mirroringParams = useMemo(()=> {
        if ( !mirroring ) return '';
        return `scale(-1, 1) translate(${(x*2 + w) * -1}, 0)`

    }, [mirroring, x, y, w, h] );

    const transform = `rotate(${r} ${x + w / 2} ${y + h / 2}) ${mirroringParams}`;

    /*
    const clipPathId = useMemo(() =>
                                   pdf ? ('clip_print_' + pageId) : ('clip_print_block_' + contentId),

                        [pdf, pageId, contentId] );
    */

    //id текста
    const textId = useMemo( () => `text_${content.id}`, [] );

    //id тени текста
    const shadowId = useMemo( () => `shadow_${content.id}`, [] );

    //рендер def тени
    const shadow = useMemo( () => {
        if ( !content.shadowSize ) return;
        return <defs>
            <filter id={shadowId} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2 2" result={shadowId}/>
                <feOffset dx={content.shadowSize / 5} dy={content.shadowSize / 5}/>
            </filter>
        </defs>
    }, [content.shadowSize] );

    //Получаем и запоминаем выбранный объект шрифта
    const fontSelected = useMemo( () => {
        let selected = FONTS.filter( font => font.id === content.fontFamilyId );

        if ( !selected.length ) {
            selected = {
                name: '',
                types: {
                    regular: {
                        font: ''
                    }
                }
            }
        }

        return Array.isArray( selected ) ? selected[ 0 ] : selected;
    }, [content.fontFamilyId] );

    //формируем цвет
    const color = useMemo( () => {
        if ( !content ) return {
            rgb: null,
            a: null
        };
        return {
            rgb: `rgb(${content.color.r}, ${content.color.g}, ${content.color.b})`,
            a: content.color.a
        }
    }, [content.color] );

    //формируем цвет фона
    const bgColor = useMemo( () => {
        if ( !content || !content.bgColor.a ) return {
            rgb: null,
            a: null
        };
        return {
            rgb: `rgb(${content.bgColor.r}, ${content.bgColor.g}, ${content.bgColor.b})`,
            a: content.bgColor.a
        };
    }, [content.bgColor] );

    //формируем цвет тени
    const shadowColor = useMemo( () => {
        if ( !content || !content.shadowColor.a ) return {
            rgb: null,
            a: null
        };
        return {
            rgb: `rgb(${content.shadowColor.r}, ${content.shadowColor.g}, ${content.shadowColor.b})`,
            a: content.shadowColor.a
        };
    }, [content.shadowColor] );

    //формируем цвет тени
    const strokeColor = useMemo( () => {
        if ( !content || !content.strokeColor.a ) return {
            rgb: null,
            a: null
        };
        return {
            rgb: `rgb(${content.strokeColor.r}, ${content.strokeColor.g}, ${content.strokeColor.b})`,
            a: content.strokeColor.a
        };
    }, [content.strokeColor] );

    //font стиль
    const fontStyle = useMemo( () => {
        if ( !pdf && !preview ) return {
            rendered: null
        };

        //const fontName = `${fontSelected.name}_${content && content.id}`;
        const origin = window.location.origin;
        const style = `@font-face {
                                            font-family: '${fontSelected.name}';
                                                src: url( '${origin}${fontSelected.types.regular.font}') format('truetype');
                                            }`;
        //font-weight: ${content && content.bold ? 'bold' : 'normal'};
        //font-style: ${content && content.italic ? 'italic' : 'normal'};

        return {
            rendered: <defs>
                          <style dangerouslySetInnerHTML={{ __html: style }} />
                      </defs>
        };

    }, [fontSelected.name] )

    //функция рендера текста
    const textRender = ( { isShadow } ) => {
        let xText = x + content.padding;
        let yText = null;

        let textAnchor = 'start';
        switch ( content.horizontal ) {
            case 'center':
                xText = x + w / 2;
                textAnchor = 'middle';
                break;
            case 'right':
                xText = xText + w;
                textAnchor = 'end';
                break;
        }
        switch ( content.vertical ) {
            case 'middle':
                yText = y + h / 2 - (content.dy * linesOfTexts.length) / 2;
                break;
            case 'bottom':
                yText = y + h - (content.dy * linesOfTexts.length);
                break;
        }

        if ( !content.text.length ) {
            if ( !pdf && !preview ) return <tspan x={x + w / 2}
                                                  y={y + h / 2}
                                                  textAnchor={'middle'}
                //dy={content.dy / 2}
                //clipPath={`url(#${'text_id' + contentId})`}
                                                  alignmentBaseline="middle"
                                                  dominantBaseline="middle">Текстовый блок</tspan>;
            return null;
        }

        let multi = 1;
        return linesOfTexts.map( ( text, index ) => {
            if ( text.length ) {
                const fontStyle = content && content.italic ? 'italic' : 'normal';
                const fontWeight = content && content.bold ? 'bold' : 'normal';
                const colorText = isShadow ? shadowColor : color;

                const style = {
                    fill: colorText.rgb,
                    fillOpacity: colorText.a,
                    fontStyle: fontStyle,
                    fontWeight: fontWeight,
                    fontFamily: fontSelected.name,
                    alignmentBaseline: 'middle',
                    dominantBaseline: 'middle'
                };

                const node = <tspan x={xText}
                                    y={!index ? yText : null}
                                    dy={content.padding + (!index ? content.dy * multi - content.dy / 2 : content.dy * multi)}
                                    key={index}
                                    fill={colorText.rgb}
                                    fillOpacity={colorText.a}
                                    fontStyle={fontStyle}
                                    fontFamily={fontSelected.name}
                                    fontWeight={fontWeight}
                                    //clipPath={`url(#${'text_id' + contentId})`}
                                    textAnchor={textAnchor}
                                    style={style}
                                    alignmentBaseline="middle"
                                    dominantBaseline="middle">{text}</tspan>;
                multi = 1;
                return node;
            } else {
                multi++;
            }
        } );
    }

    /* Рендерим контент текста */
    const contentRender = useMemo( () => {
        return textRender( { isShadow: false } );
    }, [content.text, fontStyle.fontName, color.rgb, color.a, content.fontFamilyId, x, y, w, h, linesOfTexts, content.horizontal, content.vertical, content.padding, content.bold, content.italic, content.size, content.lineHeight] );

    /* Рендерим контент тени */
    const contentRenderShadow = useMemo( () => {
        if ( !shadowColor.a ) return null;

        return textRender( { isShadow: true } );
    }, [shadow, content.text, fontStyle.fontName, shadowColor.rgb, shadowColor.a, content.fontFamilyId, x, y, w, h, linesOfTexts, content.horizontal, content.vertical, content.padding, content.bold, content.italic, content.size, content.lineHeight] );

    return <>
        {/*<clipPath id={'text_id' + contentId}>
            <rect x={x} y={y} width={w} height={h} transform={transform} />
        </clipPath>*/}
        {bgColor.a ? <rect x={x}
                         y={y}
                         width={w}
                         height={h}
                         fill={bgColor.rgb}
                         fillOpacity={bgColor.a}
                         transform={transform}
                         style={{ fill: bgColor.rgb, fillOpacity: bgColor.a }}
                         ry={content.borderRadius}/> : null}

        {shadowColor.a ? shadow : null}

        {pdf || preview ? fontStyle.rendered : null}

        {shadow && shadowColor.a ?
            <TextSVG x={x}
                     y={y}
                     id={textId + 'shadow'}
                     fontSize={content && content.size || 14}
                     fontBold={content && content.bold}
                     fontItalic={content && content.italic}
                     transform={transform}
                     fontFamily={fontSelected.name}
                     fontUrl={fontSelected.types.regular.font}
                //clipPath={`url(#${clipPathId})`}
                     fill={shadowColor.rgb}
                     fillOpacity={shadowColor.a}
                     alignmentBaseline="middle"
                     dominantBaseline='middle'
                     style={{ filter: `url(#${shadowId})`, fill: shadowColor.rgb, fillOpacity: shadowColor.a, alignmentBaseline: 'middle', dominantBaseline: 'middle' }}>
                {contentRenderShadow}
            </TextSVG> : null
        }
        <TextSVG x={x}
                 y={y}
                 id={textId}
                 stroke={strokeColor.rgb}
                 strokeOpacity={strokeColor.a}
                 strokeWidth={content.strokeWidth / 10}
                 paintOrder={'stroke'}
                 fontSize={content && content.size || 14}
                 fontBold={content && content.bold}
                 fontItalic={content && content.italic}
                 transform={transform}
                 fontFamily={fontSelected.name}
                 fontUrl={fontSelected.types.regular.font}
            //clipPath={`url(#${clipPathId})`}
                 fill={color.rgb}
                 fillOpacity={color.a}
                 alignmentBaseline="middle"
                 dominantBaseline="middle"
                 style={{ fill: color.rgb, fillOpacity: color.a, paintOrder: 'stroke' }}>
            {contentRender}
        </TextSVG>
    </>
}
export default PageTextDraw;