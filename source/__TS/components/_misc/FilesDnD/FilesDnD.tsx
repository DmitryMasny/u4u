// @ts-ignore
import React, { useState, useEffect, memo, useRef } from 'react';
// @ts-ignore
import {createPortal} from "react-dom";

// @ts-ignore
import styled  from 'styled-components'

// @ts-ignore
import {PHOTO_MAX_WEIGHT} from "config/main";

// @ts-ignore
import {COLORS} from 'const/styles'
// @ts-ignore
import {hexToRgbA} from "libs/helpers";



/** interfaces */
interface IFilesDnD {
    onDrop: any;
    header?: string;
    text?: string;
    isActive?: boolean;
}

/** Styles */


const StyledFilesDnD = styled('div')`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: ${hexToRgbA(COLORS.BLACK, .33)};
    color: ${COLORS.WHITE};
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    font-size: 18px;
    padding: 20px;
    z-index: 800;
    opacity: ${({isActive}: IFilesDnD)=>isActive ? 1 : 0};
    pointer-events: ${({isActive}: IFilesDnD)=>isActive ? 'all' : 'none'};
    transition: opacity .2s ease-out;
    text-shadow: 1px 2px 30px ${COLORS.BLACK};
    &-header{
        font-size: 36px;
        margin-bottom: 30px;
    }
    &:before{
        position: absolute;
        content: '';
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        border: 4px dashed ${COLORS.WHITE};
        border-radius: 4px;
    }
`;


/**
 * DnD загрузки файлов
 */
const FilesDnD: React.FC<IFilesDnD>  = memo(( {onDrop, header, text}) => {
    const [dropzoneIsActive, dropzoneIsActiveSet] = useState(false);
    
    const dropzoneRef = useRef(null);


    useEffect(() => {
        function dragoverListener(e) {
            e.preventDefault();
            if (!dropzoneIsActive && e.dataTransfer.items && e.dataTransfer.items[0].kind === 'file') dropzoneIsActiveSet( true );
        }
        function dragleaveListener(e) {
            e.preventDefault();
            dropzoneIsActiveSet( false );
        }
        function dropListener(e) {
            e.preventDefault();
            dropzoneIsActiveSet( false );
            if (e.dataTransfer) onDrop(e.dataTransfer.files);
        }

        window.addEventListener("dragover", dragoverListener, false);
        if (dropzoneRef && dropzoneRef.current) {
            dropzoneRef.current.addEventListener("dragleave", dragleaveListener, false);
            dropzoneRef.current.addEventListener("drop", dropListener, false);
        }
        return () => {
            window.removeEventListener("dragover", dragoverListener);
            if (dropzoneRef && dropzoneRef.current) {
                window.removeEventListener("dragleave", dragleaveListener);
                window.removeEventListener("drop", dropListener);
            }
        };
    }, [dropzoneRef]);

    return createPortal(
        <StyledFilesDnD ref={dropzoneRef}
                        isActive={dropzoneIsActive}
                        onClick={() => dropzoneIsActiveSet(false)}
        >
            <div className="dropzoneHeader">
                { header || 'Загрузить фотографии' }
            </div>
            { text || `Поддерживаются файлы ".jpg", ".jpeg" не больше ${PHOTO_MAX_WEIGHT / 1024 / 1024}Mb` }
        </StyledFilesDnD>,
        document.getElementById('spa-top')
    );
});

export default FilesDnD;