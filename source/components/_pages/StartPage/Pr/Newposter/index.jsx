import React from 'react';
import styled from 'styled-components';


/** Styles **/
const StyledBanner = styled.div`
   margin:20px 0;
   overflow: hidden;
   border-radius: 10px;
   font-size: 0;
`;
const Banner = () => <StyledBanner><img src={'/spa-img/pr/newposter/transp_opt.png'} alt={'Скидка 20% на все фотографии и постеры!'} /></StyledBanner> ;
export default Banner;