// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import { IconChevronDown } from "components/Icons";
// @ts-ignore
import { COLORS } from 'const/styles';

/** Interfaces */
interface IAccordeon {
    title?: any;
    header?: any;
    content: any;
    onOpen?: any;
    isOpen?: boolean;
}

/** Styles */
const AccordionIcon = styled( IconChevronDown )`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 5px;
  margin: auto;
  height: 24px;
  transform: ${({ isOpen }: IAccordeon) => isOpen && 'scaleY(-1)'};
  fill: ${COLORS.MUTE};
`
const AccordionStyled = styled( 'div' )`
  border-bottom: 1px solid ${COLORS.LINE};
  .accordionContent {
    padding: 10px;
  }
`
const AccordionHeader = styled( 'div' )`
    width: 100%;
    min-height: 20px;
    cursor: pointer;
    .accordionTitle {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px;
        padding-right: 30px;
        color: ${({ isOpen }: IAccordeon) => isOpen ? COLORS.TEXT : COLORS.MUTE };
        background-color: transparent;
        transition: background-color .2s ease-out, color .2s ease-out;
        &:hover {
            background-color: rgba(255,255,255,.9);
            color: ${ COLORS.TEXT };
            ${ AccordionIcon } {
              fill: ${COLORS.TEXT}
            }
        }
    }
`

/**
 * Accordion
 */
const Accordion = ( { title, header, content, onOpen, isOpen }: IAccordeon ) => {
    const [ open, setOpen ] = useState( isOpen || false );

    useEffect( () => {
        if ( isOpen !== open ) setOpen( isOpen )
    }, [ isOpen ] )

    const toggleHandler = () => {
        setOpen( !open )
        if ( onOpen ) onOpen()
    }

    return (
        <AccordionStyled>
            <AccordionHeader onClick={ toggleHandler } isOpen={open}>
                { header || <div className="accordionTitle">{ title } <AccordionIcon isOpen={open}/></div> }
            </AccordionHeader>
            { open && <div className="accordionContent">
                { content }
            </div> }
        </AccordionStyled>
    )
}

export default Accordion;