import React from 'react';
import styled from 'styled-components';

/** Styles **/
const StyledBanner = styled.div`
   margin:20px 0;
   overflow: hidden;
   border-radius: 10px;
   font-size: 0;
`;

const Banner = () => <StyledBanner><a href={'/fotoknigi/hard-glue/'}><img src={'/spa-img/pr/deti40/main.png'} /></a></StyledBanner>;
export default Banner;