import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentPages,
         selectCalculateTurnSize } from './selectors';
import styled from 'styled-components';

let x = 0;

const SvgLayout = styled.svg`
  fill: white;
  box-shadow: 10px 0 0 0 rgba(100,100,100,0.5);
`;
const Page = styled.rect`
  stroke: grey;
  stroke-width: 0.1;
  fill:white;
`;

/**
 * Строим развороты turns
 * @param layout
 */
const TurnsConstructor = () => {
    //получаем текущий выбранный разворот
    //const currentTurn = useSelector( state => selectCurrentTurn( state ) );

    const currentPages = useSelector( state => selectCurrentPages( state ) ), //получаем текущие страницы
          { w: turnWidth, h: turnHeight } = useSelector( state => selectCalculateTurnSize( state ) ); //получаем размеры разворота

    //console.log('currentTurn', currentTurn);
    console.log('currentPages', currentPages);
    console.log('turnWidth', turnWidth);
    console.log('turnHeight', turnHeight);

    return (<SvgLayout id="book" width={'100%'} height={'100%'} viewBox={`0 0 ${turnWidth} ${turnHeight}`} viewport={`0 0 ${turnWidth} ${turnHeight}`}>
                {currentPages.map( ( page, i ) =>
                       <Page width={page.w}
                             height={page.h}
                             x={page.x}
                             y={page.y}
                             key={i}
                       />
                    )
                }
            </SvgLayout>);
};

export default TurnsConstructor;



/*
<rect width={'30mm'}
      height={'30mm'}
      x={"5mm"}
      y={"7mm"}
      style={{fill: 'red', stroke: 'green', strokeWidth: 1}}
/>
 */


/*
 * Типизация входящих данных
 *
TurnsConstructor.propTypes = {
    turns: arrayOf( shape({
                              id: string.isRequired,
                              type: string.isRequired,
                              pages: object.isRequired
                          }))
};
*/