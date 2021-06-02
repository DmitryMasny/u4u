import React from 'react';
import styled, {css} from "styled-components";

const PencilSvg = styled( 'svg' )`
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 5;
    height: ${({height})=>height || 0}%;
    ${({ theme}) => theme.media.sm`
        right: -15px;
    `}
    ${({ isOldStyle}) => isOldStyle && css`
        left: -7%;
        bottom: 10px;
        ${({ theme}) => theme.media.sm`
            left: auto;
            right: -10px;
        `}
    `}
`;

const Pencil = ( { className, height = 100, isOldStyle } ) => {

    if (height > 200 || height < 10) return null;

    const color = {
        color1: {
            colorBodyMain:      '#ec9300',
            colorBodyShadow:    '#d38e16',
            colorBodyLight:     '#ffb048',
        },
        color2: {
            colorBodyMain:      '#4bb8de',
            colorBodyShadow:    '#489fbd',
            colorBodyLight:     '#82d1ec',
        }
    };

    const {colorBodyMain,colorBodyShadow,colorBodyLight } = color.color2;

    return <PencilSvg className={className || ''} height={height} isOldStyle={isOldStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 462">
        <defs>
            <linearGradient id="gr_228" x1="1" y1="23.216" x2="19" y2="23.216" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#e0c4a9"/>
                <stop offset="0.236" stopColor="#f4d8bd"/>
                <stop offset="0.4" stopColor="#e5c8ac"/>
                <stop offset="0.581" stopColor="#dcbea1"/>
                <stop offset="0.79" stopColor="#d9bb9e"/>
            </linearGradient>
            <linearGradient id="gr_196" x1="2" y1="455" x2="18" y2="455" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#e66a6a"/>
                <stop offset="0.106" stopColor="#e4636a"/>
                <stop offset="0.328" stopColor="#e05769"/>
                <stop offset="0.537" stopColor="#bf5063"/>
                <stop offset="0.746" stopColor="#a3495d"/>
                <stop offset="1" stopColor="#803958"/>
            </linearGradient>
            <linearGradient id="gr_173" x1="1" y1="432" x2="19" y2="432" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#d3cfcc"/>
                <stop offset="0.082" stopColor="#eae8e7"/>
                <stop offset="0.213" stopColor="#fff"/>
                <stop offset="0.364" stopColor="#edeceb"/>
                <stop offset="0.509" stopColor="#fbfbfb"/>
                <stop offset="0.662" stopColor="#797674"/>
                <stop offset="0.792" stopColor="#adaba8"/>
                <stop offset="1" stopColor="#8f8b86"/>
            </linearGradient>
            <linearGradient id="gr_76" x1="1" y1="419.5" x2="19" y2="419.5" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#d3cfcc"/>
                <stop offset="0.197" stopColor="#fff"/>
                <stop offset="0.362" stopColor="#a19c97"/>
                <stop offset="0.454" stopColor="#fff"/>
                <stop offset="0.622" stopColor="#bfbebd"/>
                <stop offset="0.748" stopColor="#969491"/>
                <stop offset="0.887" stopColor="#d3d0cc"/>
                <stop offset="1" stopColor="#b2ada7"/>
            </linearGradient>
        </defs>

        {/*деревяшка*/}
        <path d="M1,45,9.507,1.847a.5.5,0,0,1,.986,0L19,45Z" fill="url(#gr_228)"/>
        <polygon points="9.167 9 3 41.667 5.789 45 9.754 45 9.167 9" fill="#f4d8bd"/>

        {/*тело карандаша - ONE COLOR - выглядит более размыто =( */}
        {/*<path d="M18.886,44.658l-1.5-4.513a.5.5,0,0,0-.922-.065l-2.075,4.149a.507.507,0,0,1-.863.054l-3.106-4.659a.5.5,0,0,0-.832,0L6.478,44.283a.507.507,0,0,1-.863-.054L3.54,40.08a.5.5,0,0,0-.922.065l-1.5,4.513A.483.483,0,0,1,1,44.813V415H19V44.813A.483.483,0,0,1,18.886,44.658Z"
              fill={colorBodyMain}/>
        <path d="M5.615,44.229,4,41V415H6V44.5A.488.488,0,0,1,5.615,44.229Z" fill="#fffef5" opacity="0.2"/>

        <path d="M18.886,44.658l-1.5-4.513a.5.5,0,0,0-.922-.065l-2.075,4.149A.488.488,0,0,1,14,44.5V415h5V44.813A.483.483,0,0,1,18.886,44.658Z"
              fill="#1c1f23" opacity="0.2"/>
        <path d="M5.615,44.229,3.54,40.08a.5.5,0,0,0-.922.065l-1.5,4.513A.483.483,0,0,1,1,44.813V415H6V44.5A.488.488,0,0,1,5.615,44.229Z"
              fill="#fffef5" opacity="0.2"/>*/}

        {/*тело карандаша*/}
        <path
            d="M13.522,44.283l-3.106-4.659a.5.5,0,0,0-.832,0L6.478,44.283A.489.489,0,0,1,6,44.5V415h8V44.5A.489.489,0,0,1,13.522,44.283Z"
            fill={colorBodyMain}/>

        <path
            d="M18.886,44.658l-1.5-4.513a.5.5,0,0,0-.922-.065l-2.075,4.149A.488.488,0,0,1,14,44.5V415h5V44.813A.483.483,0,0,1,18.886,44.658Z"
            fill={colorBodyShadow}/>

        <path
            d="M5.615,44.229,3.54,40.08a.5.5,0,0,0-.922.065l-1.5,4.513A.483.483,0,0,1,1,44.813V415H6V44.5A.488.488,0,0,1,5.615,44.229Z"
            fill={colorBodyLight}/>

        {/*грифель*/}
        <path d="M10,12a5.985,5.985,0,0,0,2.4-.5l-1.9-9.653a.5.5,0,0,0-.986,0L7.6,11.5A5.985,5.985,0,0,0,10,12Z" fill="#403933"/>
        <path d="M10.25,1.5a.5.5,0,0,0-.743.344L7.923,9.882c.114.023.226.05.342.067a5.984,5.984,0,0,0,2.442-.163Z"
              fill="#57595b"/>

        {/* насадка с ластиком*/}
        <path d="M2,449H18a0,0,0,0,1,0,0v7a5,5,0,0,1-5,5H7a5,5,0,0,1-5-5v-7A0,0,0,0,1,2,449Z" fill="url(#gr_196)"/>

        <rect x="1" y="415" width="18" height="34" fill="url(#gr_173)"/>
        <rect x="1" y="419" width="18" height="1" fill="url(#gr_76)"/>
        <rect x="1" y="422" width="18" height="1" fill="url(#gr_76)"/>
        <rect x="1" y="425" width="18" height="1" fill="url(#gr_76)"/>
        <rect x="1" y="438" width="18" height="1" fill="url(#gr_76)"/>
        <rect x="1" y="441" width="18" height="1" fill="url(#gr_76)"/>
        <rect x="1" y="444" width="18" height="1" fill="url(#gr_76)"/>

        {/*тенюшки*/}
        <rect x="2" y="449" width="16" height="1" fill="#2b2b38" opacity="0.1"/>
        <rect x="1" y="414" width="18" height="1" fill="#2b2b38" opacity="0.1"/>
    </PencilSvg>
};


export default Pencil;