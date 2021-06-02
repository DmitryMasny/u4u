import React from 'react';
import styled from 'styled-components';

import Tooltip from 'components/_forms/Tooltip';

import { IconTelegram, IconViber, IconWhatsUp } from "components/Icons";

const MessengersWrapper = styled( 'div' )`
  position: relative;
  bottom: -2px;
`;

const MessengersButton = styled( 'a' )`
    margin: 5px;
    display: inline-block;
    fill: #bed0dd;//$color-cadetGray;
    transition: fill .12s ease-out;
    &:hover{
      fill: #178cea;//$footer-color-hover;
    }
`;

const MessengersButtonViber = styled( MessengersButton )`
    background: #fff;
    height: 26px;
    width: 26px;
    display: inline-block;
    border-radius: 7px;
    text-align: center;
    padding: 1px;
`;


const Messengers = props =>
        <MessengersWrapper>
            <Tooltip trigger="hover" tooltip={ 'Напишите нам в Telegram' } intent="minimal" placement="bottom" >
                <MessengersButton href={'https://telegram.me/u4ubuk'} target="_blank">
                    <IconTelegram />
                </MessengersButton>
            </Tooltip>

            <Tooltip trigger="hover" tooltip={ 'Напишите нам в WhatsUp' } intent="minimal" placement="bottom" >
                <MessengersButton href={'https://api.whatsapp.com/send?phone=79255169899'} target="_blank">
                    <IconWhatsUp />
                </MessengersButton>
            </Tooltip>

            <Tooltip trigger="hover" tooltip={ 'Напишите нам в Viber' } intent="minimal" placement="bottom" >
                <MessengersButtonViber href={'viber://chat?number=%2B79255169899'} target="_blank">
                    <IconViber />
                </MessengersButtonViber>
            </Tooltip>

        </MessengersWrapper>

export default Messengers;
