import styled, {css, keyframes} from 'styled-components';

// @ts-ignore
import {hexToRgbA} from "libs/helpers";
// @ts-ignore
import {PageInner} from "components/Page";
// @ts-ignore
import { COLORS, TextOverflow } from 'const/styles';

// @ts-ignore
import {Divider} from "const/styles";

interface IBackgroundPreviewWrap {
    repeatBackground: boolean;
    src?: string;
}

/** Styles */
export const AdminPageStyled = styled(PageInner)`
  margin-bottom: 50px !important;
`;

// Create the keyframes
const uploadProgressAnimation = keyframes`
  from {
    background-position: 0 0;
  }

  to {
    background-position: 50px 50px;
  }
`;

export const AdminPageHeader = styled('div')`
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    // margin-bottom: 5px;
    // border-bottom: 1px solid ${COLORS.LINE};
    //.mr {
    //    margin-right: 10px;
    //}
    .label {
        font-size: 21px;
        font-weight: 200;
        margin-right: 10px;
    }
    &>*:not(:last-child) {
        margin-right: 10px;
    }
`;

export const AdminHeaderStyled = styled('div')`
    font-size: 18px;
    text-transform: uppercase;
`;
export const AdminListItemStyled = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100px;
    height: 100px;
    padding: 10px;
    cursor: ${({sortable}: {sortable: boolean;})=>sortable ? '-webkit-grab' : 'pointer' };
    //border: 2px solid ${COLORS.LINE};
    background-color: ${COLORS.WHITE};
    border: 2px solid ${COLORS.LAVENDERMIST};
    transition: border-color .2s ease-out, color .2s ease-out;
    &:hover:not(.active) {
        color: ${COLORS.TEXT_PRIMARY};
        border-color: ${COLORS.LINE};
    }
    &.active {
        color: ${COLORS.TEXT_WARNING};
        border-color: ${COLORS.WARNING};
        cursor: ${({sortable}: {sortable: boolean;})=>sortable ? '-webkit-grab' : 'default' };
    }
    .listItemIcon {
        width: 32px;
        height: 32px;
        margin-bottom: 5px;
        &> svg {
            width: 100%;
            height: 100%;
        }
    }
    .listItemName {
        width: 100%;
        text-align: center;
        padding: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
        font-size: 14px;
    }
`;
export const AdminListPanelStyled = styled('div')`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 10px;
    padding: 10px;
    border-top: 1px solid ${COLORS.LINE};
    border-bottom: 1px solid ${COLORS.LINE};
    margin-bottom: 30px;
`;

export const HRStyled = styled('hr')`
    margin-top: 0;
`;
export const ActionsBarTextStyled = styled('div')`
    display: inline-flex;
    align-items: center;
    height: 40px;
    flex-grow: 1;
`;

export const NameLengthInfoText = styled('div')`
    text-align: right;
    padding: 0 10px;
    .left {
        color: ${COLORS.TEXT_SUCCESS};
    }
     &.danger, &.danger .left {
        color: ${COLORS.TEXT_DANGER};
    }
`;

export const BtnRow = styled('div')`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
    &>* {
      margin: 0 5px 10px;
    }
`;

export const StickerPreviewWrap = styled('div')`
    position: relative;
    width: 100%;
    padding-bottom: 75%;
    border: 1px solid #d3d3da;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF4eHk////NGhv+gAAABRJREFUeJxjYLD/wEAM/n+AgRgMACSCHU0RydcxAAAAAElFTkSuQmCC');
    .svgWrap, .imgWrap {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        &>svg {
            width: 100%;
            height: 100%;
        }
    }
    .imgWrap {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
`;
export const BackgroundPreviewWrap = styled('div')`
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    border: 1px solid #d3d3da;
    background-image: ${({src}: IBackgroundPreviewWrap)=>src ? `url(${src})` : 'none' };
    background-size: ${({repeatBackground}: IBackgroundPreviewWrap)=>repeatBackground ? `20%` : 'contain' };
    background-repeat: ${({repeatBackground}: IBackgroundPreviewWrap)=>repeatBackground ? `repeat` : 'no-repeat' };
    background-position: center;
`;

export const AddStickersWrap = styled('div')`
    //display: grid;
    //grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    //grid-gap: 10px;
    margin-bottom: 20px;
    min-height: 200px;
`;

export const StickerTypeText = styled('div')`
    display: inline-flex;
    align-items: center;
    font-weight: 200;
    color: ${({isSVG}: {isSVG: boolean;})=>isSVG ? COLORS.TEXT_INFO : COLORS.TEXT_MUTE };
`;
export {
    Divider
};

export const StickerUploadProgressBar = styled('div')`
    position: relative;
    margin-top: 5px;
    margin-left: 10px;
    margin-right: 20px!important;
    height: 30px;
    flex-grow: 1;
    background-color: ${COLORS.LINE};
    border-radius: 15px;
    overflow: hidden;
    transition: opacity .1s ease-out;
    .innerBar{
        position: relative;
        width: 0;
        height: 100%;
        background-color: ${COLORS.INFO};
        transition: width .5s ease-in-out;
        //box-shadow:
        //        inset 0 1px 5px rgba(255, 255, 255, 0.1),
        //        inset 0 -1px 6px rgba(0, 0, 0, 0.2);

        &:after {
            display: ${({isDone}: {isDone: boolean;})=>!isDone ? 'block' : 'none'};
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-image: linear-gradient(
                            -45deg,
                            rgba(255, 255, 255, .2) 25%,
                            transparent 25%,
                            transparent 50%,
                            rgba(255, 255, 255, .2) 50%,
                            rgba(255, 255, 255, .2) 75%,
                            transparent 75%,
                            transparent
            );
            z-index: 1;
            background-size: 50px 50px;
            animation: ${uploadProgressAnimation} 2s linear infinite;
        }
        &.loading:after {
        
        }
    }
    .innerText{
        position: absolute;
        padding: 0 10px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        font-size: 13px;
        line-height: 30px;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 1px 3px ${hexToRgbA(COLORS.BLACK, .3)};
        &.error {
            color: ${COLORS.TEXT_DANGER};
        }
    }
`;
