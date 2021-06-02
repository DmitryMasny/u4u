import React from 'react';
import { generatePath } from 'react-router';
import styled from 'styled-components';
import LINKS from "config/links";
import { IMG_DIR } from "config/dirs";

/** Styles **/
const StyledBlock = styled.div`
   margin: 20px 0;
   font-size: 0;
   display: flex;
   flex-direction: row;
   @media (max-width: 740px) {
      flex-direction: column;   
   }
`;
const StyledBannerBig = styled.a`
    overflow: hidden;
    border-radius: 10px;
    font-size: 0;
    display: inline-block;
    width: 50%;
    & + & {
      margin-left:20px;   
    }
    @media (max-width: 740px) {
      display: none;
    } 
`;
const StyledBannerMini = styled.a`
    overflow: hidden;
    border-radius: 10px;
    font-size: 0;
    margin-left: 0;
    & + & {
      margin-top:20px;   
    }
    display: none;          
    @media (max-width: 740px) {
      display: block;
    }    
`;


const Multi = () => <StyledBlock>
    <StyledBannerMini href={generatePath( LINKS.GALLERY_B64, { categoryId: 11, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6NjUsImlkIjoxNjQzLCJuYW1lIjoi0J/RgNC40LLQtdGCLCDQu9C10YLQviEiLCJwcmV2aWV3Q292ZXIiOiIvbWVkaWEvcHJvZHByZXYvMTY0My8wX2QzMGFmZjgyLWM1YzgtNDA4NC1iYjYzLTYwMzgwMWI4ZjMzNi5qcGcifSwicHJvZHVjdCI6eyJiaW5kaW5nVHlwZSI6ImdsdWUiLCJjb3ZlclR5cGUiOiJoYXJkIiwiZm9ybWF0SWQiOjIsImlkIjo0LCJwYWdlcyI6bnVsbCwidGhlbWUiOnsibmFtZSI6bnVsbCwiaWQiOm51bGwsInByZXZpZXciOm51bGx9fSwidHlwZSI6InNob3dQcmV2aWV3QWxidW0ifQ==' })}>
        <img src={IMG_DIR + 'pr/mainpage/letnie_knigi.png'} />
    </StyledBannerMini>
    <StyledBannerMini href={generatePath( LINKS.GALLERY_B64, { categoryId: 8, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6MjMsImlkIjoxNTQyLCJuYW1lIjoi0JTQviDRgdCy0LjQtNCw0L3QuNGPLCDRiNC60L7Qu9CwISDQmtC70LDRgdGBIFwi0JFcIiIsInByZXZpZXdDb3ZlciI6Ii9tZWRpYS9wcm9kcHJldi8xNTQyLzBfMzllZWVlNjUtNzJjZC00OTIxLWI4ZjUtMzFlMjhlZjMzY2NkLmpwZyJ9LCJwcm9kdWN0Ijp7ImJpbmRpbmdUeXBlIjoiZ2x1ZSIsImNvdmVyVHlwZSI6ImhhcmQiLCJmb3JtYXRJZCI6MiwiaWQiOjQsInBhZ2VzIjpudWxsLCJ0aGVtZSI6eyJuYW1lIjpudWxsLCJpZCI6bnVsbCwicHJldmlldyI6bnVsbH19LCJ0eXBlIjoic2hvd1ByZXZpZXdBbGJ1bSJ9' })}>
        <img src={IMG_DIR + 'pr/mainpage/vipusk_mini.png'} />
    </StyledBannerMini>
    <StyledBannerBig href={generatePath( LINKS.GALLERY_B64, { categoryId: 11, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6NjUsImlkIjoxNjQzLCJuYW1lIjoi0J/RgNC40LLQtdGCLCDQu9C10YLQviEiLCJwcmV2aWV3Q292ZXIiOiIvbWVkaWEvcHJvZHByZXYvMTY0My8wX2QzMGFmZjgyLWM1YzgtNDA4NC1iYjYzLTYwMzgwMWI4ZjMzNi5qcGcifSwicHJvZHVjdCI6eyJiaW5kaW5nVHlwZSI6ImdsdWUiLCJjb3ZlclR5cGUiOiJoYXJkIiwiZm9ybWF0SWQiOjIsImlkIjo0LCJwYWdlcyI6bnVsbCwidGhlbWUiOnsibmFtZSI6bnVsbCwiaWQiOm51bGwsInByZXZpZXciOm51bGx9fSwidHlwZSI6InNob3dQcmV2aWV3QWxidW0ifQ==' })}>
        <img src={IMG_DIR + 'pr/mainpage/letnie_knigi.png'} />
    </StyledBannerBig>
    <StyledBannerBig href={generatePath( LINKS.GALLERY_B64, { categoryId: 8, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6MjMsImlkIjoxNTQyLCJuYW1lIjoi0JTQviDRgdCy0LjQtNCw0L3QuNGPLCDRiNC60L7Qu9CwISDQmtC70LDRgdGBIFwi0JFcIiIsInByZXZpZXdDb3ZlciI6Ii9tZWRpYS9wcm9kcHJldi8xNTQyLzBfMzllZWVlNjUtNzJjZC00OTIxLWI4ZjUtMzFlMjhlZjMzY2NkLmpwZyJ9LCJwcm9kdWN0Ijp7ImJpbmRpbmdUeXBlIjoiZ2x1ZSIsImNvdmVyVHlwZSI6ImhhcmQiLCJmb3JtYXRJZCI6MiwiaWQiOjQsInBhZ2VzIjpudWxsLCJ0aGVtZSI6eyJuYW1lIjpudWxsLCJpZCI6bnVsbCwicHJldmlldyI6bnVsbH19LCJ0eXBlIjoic2hvd1ByZXZpZXdBbGJ1bSJ9' })}>
        <img src={IMG_DIR + 'pr/mainpage/vipusk.png'} />
    </StyledBannerBig>

    {/*
                        <StyledBannerMini href={generatePath( LINKS.GALLERY_B64, { categoryId: 11, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6NjUsImlkIjoxNjQzLCJuYW1lIjoi0J/RgNC40LLQtdGCLCDQu9C10YLQviEiLCJwcmV2aWV3Q292ZXIiOiIvbWVkaWEvcHJvZHByZXYvMTY0My8wX2QzMGFmZjgyLWM1YzgtNDA4NC1iYjYzLTYwMzgwMWI4ZjMzNi5qcGcifSwicHJvZHVjdCI6eyJiaW5kaW5nVHlwZSI6ImdsdWUiLCJjb3ZlclR5cGUiOiJoYXJkIiwiZm9ybWF0SWQiOjIsImlkIjo0LCJwYWdlcyI6bnVsbCwidGhlbWUiOnsibmFtZSI6bnVsbCwiaWQiOm51bGwsInByZXZpZXciOm51bGx9fSwidHlwZSI6InNob3dQcmV2aWV3QWxidW0ifQ==' })}>
                            <img src={'/spa-img/pr/mainpage/summer.jpg'} />
                        </StyledBannerMini>
                        <StyledBannerMini href={generatePath( LINKS.GALLERY_B64, { categoryId: 8, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6MjMsImlkIjoxNTQyLCJuYW1lIjoi0JTQviDRgdCy0LjQtNCw0L3QuNGPLCDRiNC60L7Qu9CwISDQmtC70LDRgdGBIFwi0JFcIiIsInByZXZpZXdDb3ZlciI6Ii9tZWRpYS9wcm9kcHJldi8xNTQyLzBfMzllZWVlNjUtNzJjZC00OTIxLWI4ZjUtMzFlMjhlZjMzY2NkLmpwZyJ9LCJwcm9kdWN0Ijp7ImJpbmRpbmdUeXBlIjoiZ2x1ZSIsImNvdmVyVHlwZSI6ImhhcmQiLCJmb3JtYXRJZCI6MiwiaWQiOjQsInBhZ2VzIjpudWxsLCJ0aGVtZSI6eyJuYW1lIjpudWxsLCJpZCI6bnVsbCwicHJldmlldyI6bnVsbH19LCJ0eXBlIjoic2hvd1ByZXZpZXdBbGJ1bSJ9' })}>
                            <img src={'/spa-img/pr/mainpage/vipusk_mini.png'} />
                        </StyledBannerMini>
                        <StyledBannerBig href={generatePath( LINKS.GALLERY_B64, { categoryId: 11, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6NjUsImlkIjoxNjQzLCJuYW1lIjoi0J/RgNC40LLQtdGCLCDQu9C10YLQviEiLCJwcmV2aWV3Q292ZXIiOiIvbWVkaWEvcHJvZHByZXYvMTY0My8wX2QzMGFmZjgyLWM1YzgtNDA4NC1iYjYzLTYwMzgwMWI4ZjMzNi5qcGcifSwicHJvZHVjdCI6eyJiaW5kaW5nVHlwZSI6ImdsdWUiLCJjb3ZlclR5cGUiOiJoYXJkIiwiZm9ybWF0SWQiOjIsImlkIjo0LCJwYWdlcyI6bnVsbCwidGhlbWUiOnsibmFtZSI6bnVsbCwiaWQiOm51bGwsInByZXZpZXciOm51bGx9fSwidHlwZSI6InNob3dQcmV2aWV3QWxidW0ifQ==' })}>
                            <img src={'/spa-img/pr/mainpage/summer.jpg'} />
                        </StyledBannerBig>
                        <StyledBannerBig href={generatePath( LINKS.GALLERY_B64, { categoryId: 8, b64: 'eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6MjMsImlkIjoxNTQyLCJuYW1lIjoi0JTQviDRgdCy0LjQtNCw0L3QuNGPLCDRiNC60L7Qu9CwISDQmtC70LDRgdGBIFwi0JFcIiIsInByZXZpZXdDb3ZlciI6Ii9tZWRpYS9wcm9kcHJldi8xNTQyLzBfMzllZWVlNjUtNzJjZC00OTIxLWI4ZjUtMzFlMjhlZjMzY2NkLmpwZyJ9LCJwcm9kdWN0Ijp7ImJpbmRpbmdUeXBlIjoiZ2x1ZSIsImNvdmVyVHlwZSI6ImhhcmQiLCJmb3JtYXRJZCI6MiwiaWQiOjQsInBhZ2VzIjpudWxsLCJ0aGVtZSI6eyJuYW1lIjpudWxsLCJpZCI6bnVsbCwicHJldmlldyI6bnVsbH19LCJ0eXBlIjoic2hvd1ByZXZpZXdBbGJ1bSJ9' })}>
                            <img src={'/spa-img/pr/mainpage/vipusk.png'} />
                        </StyledBannerBig>
    */}
                    </StyledBlock>;
export default Multi;