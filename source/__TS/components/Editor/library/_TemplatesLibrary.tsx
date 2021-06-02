// @ts-ignore
import React, { memo, useEffect, useMemo } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";

// @ts-ignore
import styled, { css } from 'styled-components';

// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';


// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';

// @ts-ignore
import { templatesSelector } from "__TS/selectors/templates";

// @ts-ignore
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { windowIsMobileSelector } from "../_selectors";


/** interface */
interface ITemplateItem {
    template: any;
    width: number;
    height: number;
    size?: number;
}


const TemplatesBlock = styled( 'div' )`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    margin: 0 -3px;
    width: 100%;    
    //transform: rotate3d(0, 0, 0, 0);
`;

const Template = styled( 'div' )`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 5px;
    user-select: none;
    height: 140px;
    width: 140px;
    cursor: pointer;
    background: transparent;
    & svg {
        width: 100%;
        height: 100%;
    }
`;

const TemplateDiv = styled( 'div' )`
    border: 1px solid #ccc;
    width: 130px;
    height: 130px;
    //transform: rotate3d(0, 0, 0, 0); //для принудительной отрисовки видеоадаптером, ускоряет обработку
    ${ ( { isDragging }: { isDragging: boolean } ) => isDragging && css`
          position: fixed;
          z-index: 777;
          pointer-events: none;
    `};
`;


/**
 * Компонент стикера
 */
const TemplateItem = memo( ( { template, width, height, size = 100 }: ITemplateItem ) => {

    const [ { isDragging, currentOffset }, drag, preview ] = useDrag( {
        item: {
            sourceAreaId: template.id,
            type: 'template',
            width: size,
            height: size
        },
        canDrag: true,
        collect: ( monitor: DragSourceMonitor ) => ( {
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
            //getDropResult: monitor.getDropResult(),
            //getItem: monitor.getItem(),
            //getItemType: monitor.getItemType(),
            //didDrop: monitor.didDrop(),
        }),
    } );

    useEffect(()=> {
        if ( isDragging ) {
            document.body.classList.add( "layout-photo-not-events-off-all" );
        } else {
            document.body.classList.remove( "layout-photo-not-events-off-all" );
        }
    }, [isDragging]);

    return <Template key={ template.id }>
                <TemplateDiv
                    ref={ drag }
                    style={ { left: currentOffset && currentOffset.x, top: currentOffset && currentOffset.y } }
                    isDragging={ isDragging }>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width={size}
                         height={size}
                         viewBox={ `0 0 ${width} ${height}` }
                         dangerouslySetInnerHTML={ { __html: template.svg } }/>
                </TemplateDiv>
            </Template>
});


/**
 * Библиотека шаблонов
 */
const TemplatesLibrary: React.FC = () => {
    const templates: any = useSelector( templatesSelector );
    const isMobile: boolean = useSelector( windowIsMobileSelector );

    return useMemo( () => {
        if ( !templates || !templates.areas || !templates.areas.length ) return <Spinner size={ 50 }/>;

        return <Scrollbars>
                    <TemplatesBlock>
                        { templates.areas.map( template => <TemplateItem template={template}
                                                                         size={isMobile ? 75 : 100}
                                                                         width={templates.width}
                                                                         height={templates.height}
                                                                         key={template.id} /> ) }
                    </TemplatesBlock>
               </Scrollbars>

    }, [ templates, templates.areas ] );
}

export default TemplatesLibrary;