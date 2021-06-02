import React from 'react';
import styled from 'styled-components';

//import s from './footer.scss';
// import { Link } from 'react-router-dom';
import LINKS from "config/links";
import { IconFacebook, IconInstagram, IconVk } from "components/Icons";
import sendMetric from 'libs/metrics';
import {
    SOC_VK,
    SOC_FACEBOOK,
    SOC_INSTAGRAM,
} from 'const/metrics'

const SocialWrapper = styled( 'div' )`
  margin: 5px 0;
`;
const SocialButton = styled( 'a' )`
  margin: 10px;
  fill: #bed0dd;//$color-cadetGray;
  transition: fill .12s ease-out;
  &:hover{
    fill: #178cea;//$footer-color-hover;
  }
`;

const SocialButtons = props => {
    return (
        <SocialWrapper>
            <SocialButton onClick={()=>sendMetric(SOC_VK)} href={LINKS.SOC_VK} target="_blank">
                <IconVk/>
            </SocialButton>
            <SocialButton onClick={()=>sendMetric(SOC_FACEBOOK)} href={LINKS.SOC_FACEBOOK} target="_blank">
                <IconFacebook/>
            </SocialButton>
            <SocialButton onClick={()=>sendMetric(SOC_INSTAGRAM)} href={LINKS.SOC_INST} target="_blank">
                <IconInstagram/>
            </SocialButton>
        </SocialWrapper>
    );
};

export default SocialButtons;
