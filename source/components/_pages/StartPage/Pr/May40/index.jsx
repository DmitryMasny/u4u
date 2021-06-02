import React from 'react';
import styled from 'styled-components';


/** Styles **/
const StyledBanner = styled.div`
   margin:20px 0;
   overflow: hidden;
   border-radius: 10px;
   font-size: 0;
`;
const Banner = () => <StyledBanner><img src={'/spa-img/pr/may40/main.png'} alt={'Скидка 40% на фотокнигу, твердая обложка, книжный переплет, 30х20'} /></StyledBanner> ;
export default Banner;