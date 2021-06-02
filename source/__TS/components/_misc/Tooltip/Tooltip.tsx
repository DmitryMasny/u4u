// @ts-ignore
import React, { memo, useState, useEffect } from 'react';
// @ts-ignore
import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

// @ts-ignore
import styled, {css} from 'styled-components'
// @ts-ignore
import {COLORS} from 'const/styles'

/** Interfaces */
interface ITooltip {
    children: any;
    tooltip: any;
    hideArrow?: boolean;
    className?: string;
    intent?: 'danger' | 'warning' | 'primary' | 'info' | string;
    tooltipShown?: boolean;
    onVisibilityChange?: any;
    styleParent?: any;
    trigger?: any;
    placement?: any;
}

/** Styles */
const StyledTooltip = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${COLORS.WHITE};
  background-color: ${COLORS.TEXT};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
  margin: 0.4rem;
  padding: 0.5rem 0.8rem;
  //max-height: 300px;
  //overflow-y: auto;
  transition: opacity 0.2s;
  -webkit-overflow-scrolling: touch;
  z-index: 11;
  pointer-events: ${({enablePointerEvents})=>enablePointerEvents ? 'auto' : 'none'}
  ${({hideArrow})=>hideArrow && `overflow-y: auto`};
  ${({intent})=>{
    if (intent) switch (intent) {

        case 'primary': return css`
                    background-color: ${COLORS.PRIMARY};
                `;
        case 'success': return css`
                    background-color: ${COLORS.SUCCESS};
                `;
        case 'warning': return css`
                    background-color: ${COLORS.WARNING};
                `;
        case 'danger': return css`
                    background-color: ${COLORS.DANGER};
                `;
        case 'info': return css`
                    background-color: ${COLORS.INFO};
                `;
        case 'minimal': return css`
                    color: ${COLORS.TEXT};
                    background-color: ${COLORS.WHITE};
                    box-shadow:  2px  5px 16px rgba(0, 0, 0, 0.2);
                `;
        case 'slider': return css`
                    color: ${COLORS.TEXT};
                    background-color: ${COLORS.WHITE};
                    height: 44px;
                    border-radius: 22px;
                    box-shadow:  2px  5px 16px rgba(0, 0, 0, 0.2);                   
                `;
    }
  }
}`;
const StyledTooltipInner = styled('div')`
  display: inline;
  max-width: 100%;
`;

const StyledTooltipArrow = styled('div')`
  height: 1rem;
  position: absolute;
  width: 1rem;

&:before {
  border-style: solid;
  content: '';
  display: block;
  height: 0;
  margin: auto;
  width: 0;
}

${( { placement, intent } ) => {
    switch ( placement ) {
        case 'bottom': return css`
            height: 1rem;
            left: 0;
            margin-top: -0.4rem;
            top: 0;
            width: 1rem;
            &:before {
                border-color: transparent transparent ${intent} transparent;
                border-width: 0 0.5rem 0.4rem 0.5rem;
                position: absolute;
                top: 0;
            }
        `;
        case 'top': return css`
            bottom: 0;
            height: 1rem;
            left: 0;
            margin-bottom: -1rem;
            width: 1rem;
            &:before {
                border-color: ${intent} transparent transparent transparent;
                border-width: 0.4rem 0.5rem 0 0.5rem;
                position: absolute;
                top: 0;
            }
        `;
        case 'right': return css`
            height: 1rem;
            left: 0;
            margin-left: -0.7rem;
            width: 1rem;
        
            &:before {
                border-color: transparent ${intent} transparent transparent;
                border-width: 0.5rem 0.4rem 0.5rem 0;
            }
        `;
        case 'left': return css`
        height: 1rem;
        margin-right: -0.7rem;
        right: 0;
        width: 1rem;
        &:before {
            border-color: transparent transparent transparent ${intent};
            border-width: 0.5rem 0 0.5rem 0.4em;
        }
        `;
    }
}}
`;

/**
 * Tooltip
 */
const Tooltip = memo( ( { children, tooltip, hideArrow, className, intent, tooltipShown, onVisibilityChange, styleParent, trigger, placement }: ITooltip ) => {
    const [isShow, setIsShow] = useState( tooltipShown );

    useEffect( () => {
        setIsShow( tooltipShown );
    }, [tooltipShown] );

    const arrowIntentColor = intent ?
        (
            intent === 'primary' ? COLORS.PRIMARY :
                intent === 'success' ? COLORS.SUCCESS :
                    intent === 'warning' ? COLORS.WARNING :
                        intent === 'danger' ? COLORS.DANGER :
                            intent === 'info' ? COLORS.INFO :
                                (intent === 'minimal' || intent === 'slider') ? COLORS.WHITE
                                    : COLORS.TEXT
        ) : COLORS.TEXT;

    const onVisibilityChangeHandler = ( isOpen ) => {
        if ( onVisibilityChange ) onVisibilityChange( isOpen );
        if ( tooltipShown === undefined && isOpen !== isShow ) setIsShow( isOpen )
    };

    return <TooltipTrigger
        placement={placement}
        trigger={trigger}
        tooltipShown={isShow}
        onVisibilityChange={onVisibilityChangeHandler}
        tooltip={({
                      arrowRef,
                      tooltipRef,
                      getArrowProps,
                      getTooltipProps,
                      placement
                  }) => (
            <StyledTooltip id="tooltip" onClick={()=>tooltipShown === undefined && setIsShow(false)} {...getTooltipProps({ref: tooltipRef})} intent={intent} hideArrow={hideArrow} enablePointerEvents={trigger === "click"}>
                {!hideArrow && <StyledTooltipArrow className="arrow" intent={arrowIntentColor}
                                                   placement={placement} {...getArrowProps({ref: arrowRef,})} />}
                {tooltip}
            </StyledTooltip>
        )}
    >
        {({getTriggerProps, triggerRef}) => (
            <StyledTooltipInner className={className} style={styleParent} {...getTriggerProps({ref: triggerRef})}>
                {children}
            </StyledTooltipInner>
        )}
    </TooltipTrigger>;
})

export default Tooltip;
