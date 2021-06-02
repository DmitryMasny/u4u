// @ts-ignore
import React, { memo } from 'react';
// @ts-ignore
import styled from 'styled-components'
// @ts-ignore
import { useDrag } from 'react-use-gesture';

import { EDITOR_SIZES } from "../_config";
// @ts-ignore
import { COLORS } from 'const/styles';

/** Interfaces */
interface Props {
    isMobile: boolean; //флаг мобильного устройства
    resizeControl: any; //функция ресайза TODO: правильно указать тип блока
    isShifted: boolean; //активно движение или нет
}
interface ClassActive {
    active: boolean; //активный стиль класса или нет
}

/** styles */
const EditorLibraryShift = styled( 'div' )`
        position: absolute;
        right: 0;
        top: 0;
        user-select: none;
        z-index: 120;
        .libraryShiftInner {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${ ( { active }: ClassActive ) => active ? COLORS.LINE : COLORS.WHITE };
            transition: background-color 0.1s linear;
        }
        &:hover .libraryShiftInner {
           background-color: ${ ( { active }: ClassActive ) => active ? COLORS.LINE : COLORS.ATHENSGRAY }
        }
`;
const EditorLibraryShiftHor = styled( EditorLibraryShift )`
        height: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE_XS*3 }px;
        width: 100%;
        cursor: ns-resize;
        top: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE*-1 }px;
        .libraryShiftInner {
            height: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE_XS }px;
            width: 100%;
            margin-top: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE }px;
            border-top: 1px solid ${ COLORS.LINE };
            border-bottom: 1px solid ${ COLORS.LINE };
        }
`;
const EditorLibraryShiftVert = styled( EditorLibraryShift )`
        height: 100%;
        width: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE*3 }px;
        cursor: ew-resize;
        right: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE*-1 }px;
        .libraryShiftInner {
            height: 100%;
            margin-left: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE }px;
            width: ${ EDITOR_SIZES.LIBRARY_SHIFT_SIZE }px;
            border-right: 1px solid ${ COLORS.LINE };
            border-left: 1px solid ${ COLORS.LINE };
        }
`;
const ShiftDots = styled( 'svg' )`
        pointer-events: none;
        transition: fill 0.25s;
        fill: ${ ( { active }: ClassActive ) => active ? COLORS.NEPAL : COLORS.LINE };
        ${ EditorLibraryShift }:hover & {
            fill: ${ COLORS.NEPAL };
        }
`;

/**
 * Библиотека редактора
 */
const EditorLibraryShifter: React.FC<Props> = ( { isMobile, resizeControl, isShifted } ) => {
    const bind = useDrag( o => resizeControl( o ) );

    return isMobile ?
        <EditorLibraryShiftHor { ...bind() } active={ isShifted }>
            <div className="libraryShiftInner">
                <ShiftDots active={ isShifted } width="30" height="6" viewBox="0 0 30 6">
                    <path d="M0 0H2V2H0V0Z"/>
                    <path d="M4 0H6V2H4V0Z"/>
                    <path d="M8 0H10V2H8V0Z"/>
                    <path d="M12 0H14V2H12V0Z"/>
                    <path d="M0 4H2V6H0V4Z"/>
                    <path d="M4 4H6V6H4V4Z"/>
                    <path d="M8 4H10V6H8V4Z"/>
                    <path d="M12 4H14V6H12V4Z"/>
                    <path d="M16 0H18V2H16V0Z"/>
                    <path d="M20 0H22V2H20V0Z"/>
                    <path d="M24 0H26V2H24V0Z"/>
                    <path d="M28 0H30V2H28V0Z"/>
                    <path d="M16 4H18V6H16V4Z"/>
                    <path d="M20 4H22V6H20V4Z"/>
                    <path d="M24 4H26V6H24V4Z"/>
                    <path d="M28 4H30V6H28V4Z"/>
                </ShiftDots>
            </div>
        </EditorLibraryShiftHor>
        :
        <EditorLibraryShiftVert  { ...bind() } active={ isShifted }>
            <div className="libraryShiftInner">
                <ShiftDots active={ isShifted } width="6" height="30" viewBox="0 0 6 30">
                    <path d="M6 2.62268e-07V2H4V1.74846e-07L6 2.62268e-07Z"/>
                    <path d="M6 4V6L4 6V4L6 4Z"/>
                    <path d="M6 8V10H4V8H6Z"/>
                    <path d="M6 12L6 14H4L4 12H6Z"/>
                    <path d="M2 8.74227e-08L2 2H1.22392e-06L1.31134e-06 0L2 8.74227e-08Z"/>
                    <path d="M2 4L2 6H1.04907e-06L1.1365e-06 4H2Z"/>
                    <path d="M2 8V10H8.74228e-07L9.61651e-07 8H2Z"/>
                    <path d="M2 12V14H6.99382e-07L7.86805e-07 12H2Z"/>
                    <path d="M6 16V18H4V16H6Z"/>
                    <path d="M6 20V22H4V20H6Z"/>
                    <path d="M6 24L6 26H4L4 24H6Z"/>
                    <path d="M6 28V30H4V28H6Z"/>
                    <path d="M2 16L2 18H5.24537e-07L6.11959e-07 16H2Z"/>
                    <path d="M2 20L2 22H3.49691e-07L4.37114e-07 20H2Z"/>
                    <path d="M2 24V26H1.74845e-07L2.62268e-07 24H2Z"/>
                    <path d="M2 28V30H0L8.74229e-08 28H2Z"/>
                </ShiftDots>
            </div>
        </EditorLibraryShiftVert>
};

export default memo( EditorLibraryShifter );