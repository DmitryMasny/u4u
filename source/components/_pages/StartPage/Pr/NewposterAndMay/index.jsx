import React from 'react';
import styled from 'styled-components';


/** Styles **/
const StyledBanner = styled.div`
   margin:20px 0;
   overflow: hidden;
   border-radius: 10px;
   font-size: 0;
`;
const Banner = () => <StyledBanner><img src={'/spa-img/pr/newposterandmay/main.jpg'} alt={'Скидка 20% на все фотографии и постеры! Скидка 40% на фотокнигу, твердая обложка, книжный переплет, 30х20'} /></StyledBanner> ;
export default Banner;