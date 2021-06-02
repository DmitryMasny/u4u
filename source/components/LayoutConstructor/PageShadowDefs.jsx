import React from "react";
import styled from "styled-components";

const StopFrom = styled.stop`
    stop-color:rgb(200,200,200);
    stop-opacity:0.5
`;
const StopTo = styled.stop`
    stop-color:rgb(255,255,255);
    stop-opacity:0
`;

const pageShadowDefs = () =>
    <defs>
        <linearGradient id="grad_left" x1="0%" y1="0%" x2="100%" y2="0%">
            <StopFrom offset={"0%"} />
            <StopTo offset={"15%"} />
        </linearGradient>
        <linearGradient id="grad_right" x1="100%" y1="0%" x2="0%" y2="0%">
            <StopFrom offset={"0"} />
            <StopTo offset={"15%"} />
        </linearGradient>
        <linearGradient id="grad_top" x1="0%" y1="0%" x2="0%" y2="100%">
            <StopFrom offset={"0"} />
            <StopTo offset={"15%"} />
        </linearGradient>
        <linearGradient id="grad_bottom" x1="0%" y1="100%" x2="0%" y2="0%">
            <StopFrom offset={"0"} />
            <StopTo offset={"15%"} />
        </linearGradient>
    </defs>;


export default pageShadowDefs;
