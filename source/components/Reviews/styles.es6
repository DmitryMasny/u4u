import styled, {css} from 'styled-components';
import {COLORS} from "const/styles";

/** Styles */
export const StyledReviewsWrap = styled.div`
    max-width: 940px;
    padding: 0 20px;
    margin: 0 auto;
`;

export const StyledReviewAva = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 32px;
    background-color: ${COLORS.INFO};
    background-image: url("${(url)=>url}");
    overflow: hidden;
    .miniName{
        font-size: 32px;
        font-weight: bold;
        color: ${COLORS.WHITE};
    }
`;

export const StyledReviews = styled.div`
    display: flex;
    flex-direction: column;
    .review {
        padding: 20px;
        border-bottom: 1px solid ${COLORS.LINE};
        &-inner{
            display: flex;
            flex-direction: column;
        }
       
        &-header{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            ${({theme}) => theme.media.sm`
                flex-direction: column;
            `};
        }
        ${StyledReviewAva} {
            margin-right: 20px;
            flex-shrink: 0;
            ${({theme}) => theme.media.sm`
                margin-right: 0;
                margin-bottom: 10px;
            `};
        }
        &-name{
            font-size: 18px;
            flex-grow: 1;
        }
        &-date{
            font-weight: 200;
            color: ${COLORS.NEPAL};
            height: 14px;
            margin-left: 10px;
            
            ${({theme}) => theme.media.sm`
                margin-left: 0;
                margin-top: 10px;
            `};
        }
        &-source{
            cursor: pointer;
        }
        &-text{
            padding-left: 84px;
            font-weight: 200;
            ${({theme}) => theme.media.sm`
                padding-left: 0;
            `};
        }
        .ReadMoreBtn{
            margin-left: 5px;
            text-decoration: underline;
            &:hover{
                text-decoration: underline;
            }
            &.source {
                margin-left: 10px;
                svg {
                    vertical-align: -7px;
                    &.yandex{
                      fill: #ed2224;        
                    }
                    &.vk{
                       fill: #3081be;   
                    }
                }
                ${({theme}) => theme.media.sm`
                    margin-left: 0;
                    margin-top: 10px;
                `};
            }
        }
    }
`;