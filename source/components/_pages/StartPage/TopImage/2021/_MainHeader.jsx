import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';

/** Styles **/
const MainHeader = styled.div`
    .wordTransition{
        position: relative;
        display: inline-block;
        width: 200px;
        height: 36px;
        text-align: left;
        perspective: 600px;
        ${({theme}) => theme.media && theme.media.sm`
            height: 23px;
        `};
        ${({theme}) => theme.media && theme.media.xs`
            width: 120px;
            height: 16px;
        `};
    }
    .wordIndex{
        position: absolute;
        transition: transform .5s ease-in-out, opacity .5s ease-in-out;
        &.item-enter{
            opacity: 0;
            transform: rotateX(-90deg) translateX(20px);
            transform-origin: center bottom;
            transition-delay: .1s;
          &-active{
            opacity: 1;
            transform: rotateX(0deg) translateX(0);
          }
        }
        &.item-exit{
          opacity: 1;
          transform: rotateX(0deg) translateX(0);
          transform-origin: center top;
            &-active{
              opacity: 0;
              transform: rotateX(90deg) translateX(20px);
            }
        }
    }
`;

const wordsArray = [
    'фотокнигу', 'постер', 'фотографию', 'календарь' //, 'пазл',
];

export default () => {
    const [wordIndex, setWordIndex] = useState( 0 );

    useEffect(() => {
        const changeWordTimeout = setTimeout(() => {
            setWordIndex( (wordIndex >= wordsArray.length - 1) ? 0 : wordIndex + 1 )
        }, 4000);
        return () => {
            if ( changeWordTimeout ) clearTimeout( changeWordTimeout );
        };
    }, [wordIndex] );

    return <MainHeader className="mainHeader">
                <span>Создай </span>
                <div className="wordTransition">
                    <TransitionGroup component={null}>
                        {wordsArray.map((word, i) => i === wordIndex && (
                            <CSSTransition
                                timeout={2000}
                                classNames="item"
                                key={i}
                            >
                                <span className="wordIndex">{word}</span>
                            </CSSTransition>) || null)}
                    </TransitionGroup>
                </div>
            </MainHeader>;
};