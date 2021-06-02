import styled, { css } from 'styled-components';
import {COLORS} from "const/styles";

/** Styles */
export const StyledPostsList = styled.div`
    display: flex;
    flex-direction: column;
`;
export const StyledPostsItem = styled.div`
    padding: 20px;
    border-bottom: 1px solid ${COLORS.LINE};
    color: ${({clickable})=> clickable ? COLORS.TEXT : COLORS.MUTE};
    .post-inner{
         display: flex;
         align-items: center;
         cursor: ${( { clickable, cursor } ) => clickable ? (cursor || 'pointer') : ( cursor || 'default') };
         @media (max-width: 700px) {
             flex-direction: column;          
         }      
    }
    .post-thumb{
        font-size: 0;
        overflow: hidden;
        border-radius: 10px;
        background-color: ${COLORS.LAVENDERMIST};
        margin-right: ${({fullWidth})=> fullWidth ? '0' : '20px'};
        width: ${({fullWidth})=> fullWidth ? '100%' : 'calc(50% - 20px)'};              
        ${({clickable})=> !clickable && css `
            & > img {
              filter: grayscale(90%) brightness(135%);;              
            }
        `};
         @media (max-width: 700px) {
             width: 100%;         
         }          
    }
    .post-info{           
        width: ${({fullWidth})=> fullWidth ? '100%' : '50%'};
        @media (max-width: 700px) {
             padding-left: 20px;
             width: 100%;          
        }          
    }
    .ReadMoreBtn{
        text-decoration: underline;
        color: ${COLORS.PRIMARY};
    }
    .PostDate{
        color: ${COLORS.TEXT_INFO};
    }
`;

export const StyledPost = styled.div`
    max-width: 940px;
    padding: 0 20px;
    margin: 0 auto;
    .postImage{
        margin: 30px 0 10px;
        border-radius: 10px;
        overflow: hidden;
        font-size: 0;
    }
    .mb {
      margin-bottom: 30px;
    }
`;
