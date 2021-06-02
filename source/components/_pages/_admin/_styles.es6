import pSBC from 'shade-blend-color';
import styled, {css} from 'styled-components'
import MEDIA from "config/media";
import {hexToRgbA} from "libs/helpers";
import {COLORS, TextOverflow} from "const/styles";

export const StyledProductHeader = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid ${COLORS.LINE};
    .mr {
        margin-right: 10px;
    }
    .label {
        font-size: 18px;
        font-weight: 200;
        margin-right: 10px;
    }
`;
export const StyledProductName = styled.div`
    font-size: 18px;
    margin-top: 7px;
    text-align: right;
`;
export const StyledProductLabel = styled(StyledProductHeader)`
    margin-top: 30px;
    margin-bottom: 10px;
    .label {
      font-size: 18px;
      font-weight: 200;
    }
    .error {
      color: ${COLORS.TEXT_DANGER};
    }
`;
export const StyledLabel = styled.div`
    margin-bottom: 5px;
    font-weight: 200;
    line-height: 1em;
`;
export const StyledArray = styled.div`
    max-height: ${({arrayView})=>arrayView ? 'inherit' : '400px'};
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 10px;
    font-size: 0;
`;
export const StyledHR = styled.hr`
    margin-top: 0;
`;
export const StyledParamsText = styled.td`
    position: relative;
    width: 50%;
    &>span {
    position: absolute;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre;
    padding-right: 2px;
    width: 100%;
    left: 0;
    right: 0;
    font-weight: 200;
    font-size: 15px;
    }
`;

export const StyledArrayItem = styled.div`
    width: ${({fullWidth, small})=>fullWidth ? '100%': small ? '200px' :'300px'};
    padding: 0 5px 5px;
    margin: 0 5px 10px;
    border-radius: 9px;
    border: 1px solid ${({active})=>active ? COLORS.WARNING : COLORS.LINE};
    background-color: ${COLORS.ATHENSGRAY};
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 0;
        min-height: 5px;
        .headerBtn{
            cursor: pointer;
            &.move{
            cursor: move;
              &:hover{
                fill: ${COLORS.TEXT_PRIMARY}
              }
            }
            &.remove{
              &:hover{
                fill: ${COLORS.TEXT_DANGER}
              }
            }
            &.upload{
            padding: 0 20px;
              &:hover{
                fill: ${COLORS.TEXT_WARNING}
              }
            }
        }
    }
    .textArea{
        margin-bottom: 0;
    }
    .name{
        padding: 20px 10px;
        font-size: 16px;
        text-align: center;
        background-color: ${({active})=>active ? COLORS.WARNING : COLORS.WHITE};
        color: ${({active})=>active ? COLORS.WHITE : COLORS.TEXT};
        cursor: ${({active})=>active === false ? 'pointer' : 'default'};
        border-radius: 4px;
    }
    .size{
        font-size: 12px;
        margin-bottom: -5px;
        color: ${({active})=>active ? COLORS.WHITE : COLORS.MUTE};
    }
    .img{
        width: 100%;
        height: 120px;
        margin: 10px 0;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        ${({fullWidth})=>fullWidth && css`
            width: 120px;
            margin-right: 20px;
        `};
    }
    .flexWrap {
      display: flex;
      width: 100%;
      flex-direction: ${({fullWidth})=>fullWidth ? 'row' : 'column'};
    }
`;

export const StyledIconAdd = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 140px;
    fill: ${COLORS.NEPAL};
    cursor: ${({clickable})=>clickable ? 'pointer' : 'default'};
    transition: fill .3s ease-out;
    &:hover {
         fill: ${COLORS.TEXT_PRIMARY};
    }    
`;
export const StyledNoContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 10px;
    font-size: 18px;
    color: ${COLORS.TEXT_MUTE};
    .text {
        padding-bottom: 10px;
    }
`;

export const StyledOptionTableRow = styled.div`
    background-color: #fff;
    transition: box-shadow .2s ease-out;
    box-shadow: 0 0 0 transparent;
    body > & {
        box-shadow: 1px 3px 10px 1px ${hexToRgbA(COLORS.WARNING, .2)};
        .cell.sort {
            fill: ${COLORS.TEXT_WARNING};
            &:hover{
                fill: ${COLORS.TEXT_WARNING}
            }
        }
    }
    .headRow{
        display: flex;
        align-items: center;
        padding: 5px 0;
    }
    .cell{
        display: flex;
        align-items: center;
        padding: 0 5px;
        &.sort {
            width: 40px;
            cursor: move;
            transition: fill .1s ease-out;
            &:hover{
                fill: ${COLORS.TEXT_PRIMARY}
            }
        }
        &.title {
            width: 320px;
            font-weight: bold;
            font-size: 18px;
        }
        &.kind {
            flex-grow: 1;
            font-weight: 200;
            font-size: 14px;
            color: ${COLORS.MUTE}
        }
        &.actions {
            display: flex;
            flex-grow: 1;
            justify-content: flex-end;
        }
        .mr {
            margin-right: 10px;
        }
    }
`;
export const StyledAreasOptions = styled.div`
    display: flex;
    .leftCol {
        width: 70%;
        padding-right: 10px;
        display: flex;
        flex-direction: column;
    }
    .rightCol {
        width: 30%;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
    }
    .title {
        text-transform: uppercase;
        font-size: 18px;
        display: inline-block;
        margin-right: 10px;
    }
    .ParamsList {
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        .ParamsListRow, .label {
            display: flex;
            margin-bottom: 5px;
        }
        .cl0 {
            width: 150px;
        }
        .cl1 {
            padding-left: 10px;
            width: calc(100% - 200px);
            min-width: 200px;
        }
        .cl2 {
            width: 40px;
        }
    }
`;

export const StyledPapersList = styled.div`
    .item {
        cursor: pointer;
        padding: 5px 10px;
        transition: color .1s ease-out;
        // border-bottom: 1px solid ${COLORS.LINE};
        // &:last-child {
        //     border-bottom-color: transparent;
        // }
        &:hover {
            color: ${COLORS.TEXT_PRIMARY};
        }
    }
`;

export const StyledAdminMainPage = styled.div`
    margin-bottom: 30px;
    .row {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        &:not(:last-child){
            border-bottom: 1px solid ${COLORS.LINE};
        }
    }
    .item {
        width: 20%;
        padding: 5px;
        min-width: 150px;
    }
    .item-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100px;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        transition: color .1s ease-out, border-color .1s ease-out;
        border: 1px solid ${COLORS.LINE};
        overflow: hidden;
        &:hover {
            color: ${COLORS.TEXT_PRIMARY};
            border-color: ${COLORS.PRIMARY};
        }
    }
`;

