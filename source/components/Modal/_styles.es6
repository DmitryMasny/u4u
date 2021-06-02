import styled, {keyframes} from 'styled-components';
import {hexToRgbA} from "libs/helpers";
import {COLORS} from "const/styles";

const MODAL_SIZES = {
    xs: 400,
    sm: 500,
    md: 600,
    lg: 800,
    xl: 1120,
};

export const expandModal = keyframes`
  from {
    transform: scale(0) translateY(50px);
  }
  to {
    transform: scale(1) translateY(0);
  }
`;
export const collapseModal = keyframes`
  from {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: none;
  }
  to {
    transform: scale(0.33) translateY(50px);
    opacity: 0;
  }
`;
export const ModalWrap = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${hexToRgbA(COLORS.BLACK, .2)};
    transition: opacity .25s ease-in-out;
    overflow: hidden;
    pointer-events: ${({isOpen})=>isOpen ? 'auto' : 'none'};
`;
export const ModalBg = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${hexToRgbA(COLORS.BLACK, .2)};
    user-select: none;
`;
export const ModalBlock = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(16,22,26,0.1), 0 4px 8px rgba(16,22,26,0.2), 0 18px 46px 6px rgba(16,22,26,0.2);
    background: #fff;
    width: 90%;
    max-width: ${({size})=>size ? ((MODAL_SIZES[size] || MODAL_SIZES.lg) + 'px') : (95 + '%')};
    max-height: 90vh;
    pointer-events: all;
    user-select: text;
    animation: ${({isOpen})=>isOpen ? expandModal : collapseModal} .2s ease-out forwards;
`;
export const ModalHeader = styled.div`
    min-height: 52px;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid ${COLORS.LINE};
    padding: 5px 5px 5px 20px;
    .title{
        margin-right: 20px;
        margin-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        flex: 1 1 auto;
        line-height: 1.2em;
        font-size: 21px;
        color: #182026;
        font-weight: 200;
        padding: 0;
    }
`;
export const ModalNavbar = styled.div`
    padding: 0 20px;
`;
export const ModalBody = styled.div`
    flex: 1 1 auto;
    padding: ${({navigation})=>navigation ? '0': '20px'} 20px 0;
    margin-bottom: 20px;
    line-height: 18px;
    overflow-x: hidden;
    overflow-y: auto;
`;
export const ModalFooter = styled.div`
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    padding: 0 20px 20px;
    & > *:not(:last-child) {
        margin-right: 10px;
    }
`;
export const Divider = styled.div`
    flex-grow: 1;
`;
export const StyledText = styled.div`
    display: flex;
    align-items: center;
`;