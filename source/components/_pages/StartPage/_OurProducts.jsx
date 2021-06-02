import React, {useEffect, useState, useRef, memo, forwardRef} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import { CSSTransition } from "react-transition-group"
import styled, { css } from 'styled-components';
import { generatePath } from 'react-router';

import LINKS from "config/links";
import {COLORS} from "const/styles";

import ProductTypeCard from "./_ProductTypeCard";
import TopThemes from "./_TopThemes";
import Carousel from "components/Carousel2";
import {productsSelector} from "components/_pages/ProductPage/selectors";
import { PRODUCT_TYPES, SLUGS, THEME_PRODUCT_GROUP } from 'const/productsTypes';
import TEXT from "texts/main";
import TEXT_STARTPAGE from "texts/startpage";
import TEXT_PRODUCT from "texts/product";
import {windowHeightSelector} from "components/_editor/_selectors";
import VideoBlock from "components/VideoBlock";
import {paragrafyText, productGetId} from "libs/helpers";
import {useScroll} from "components/_hooks/useScroll";
import {generateThemesUrl} from "__TS/libs/tools";
// import { showFutureSelector } from "selectors/global";



const Container = styled.div`
    margin-bottom: 20px;
    ${!process.env.server_render && css(`
        transition: opacity 500ms ease-out, transform 400ms ease-out;
        opacity: 0;
        transform: translateY(100px);
    `)};
    &.item-enter-active, &.item-enter-done  {
        opacity: 1;
        transform:  translateY(0);
    }
`;
const VideoWrap = styled.div`
    max-width: 800px;
    margin: 15px auto;
`;

const LinkStyled = styled(Link)`
    color: ${COLORS.TEXT};
    border-bottom: 2px solid transparent;
    transition: border-bottom .1s ease-out;
    line-height: 1em;
    &:hover {
        color: ${COLORS.TEXT_PRIMARY};
        border-bottom-color: ${COLORS.TEXT_PRIMARY};
    }
`;

const ProductTitle = styled.div`
    text-align: center;
    font-size: 28px;
    text-transform: uppercase;
    margin-bottom: 15px;
    padding: 10px 0;
    line-height: 1.4em;
`;

const pImages = TEXT_PRODUCT.PHOTOBOOK_IMAGES; // Photobook Images Urls



const PHOTOBOOK_TYPES_2 = [
    {
        imageUrl: pImages.HARD_GLUE[0].src,
        title: TEXT.PHOTOBOOK_HARD_GLUE,
        text: paragrafyText(TEXT_STARTPAGE.PHOTOBOOK_HARD_GLUE_TEXT),
        link: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' )
    },
    {
        imageUrl: pImages.SOFT_GLUE[0].src,
        title: TEXT.PHOTOBOOK_SOFT_GLUE,
        text: paragrafyText(TEXT_STARTPAGE.PHOTOBOOK_SOFT_GLUE_TEXT),
        link: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'soft-glue' )
    },
    {
        imageUrl: pImages.SOFT_CLIP[0].src,
        title: TEXT.PHOTOBOOK_SOFT_CLIP,
        text: paragrafyText(TEXT_STARTPAGE.PHOTOBOOK_SOFT_CLIP_TEXT),
        link: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'soft-clip' )
    },
    {
        imageUrl: pImages.HARD_SPRING[0].src,
        title: TEXT.PHOTOBOOK_HARD_SPRING,
        text: paragrafyText(TEXT_STARTPAGE.PHOTOBOOK_HARD_SPRING_TEXT),
        link: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-spring' )
    },
    {
        imageUrl: pImages.SOFT_SPRING[0].src,
        title: TEXT.PHOTOBOOK_SOFT_SPRING,
        text: paragrafyText(TEXT_STARTPAGE.PHOTOBOOK_SOFT_SPRING_TEXT),
        link: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'soft-spring' )
    },
];

const PHOTOBOOKS_TOP_THEMES = [
    {
        name: 'Популярная',
        format: "20x20",
        id: 4539,
        orientation: "SQUARE",
        previewCover: "/media/prodprev/4539/0_5a0b7000-09d1-4bd1-9be3-18262ab2a490.jpg",
        url: generatePath( LINKS.GALLERY, { categoryId: 0 }) + '/eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6MTI0LCJpZCI6NDUzOSwibmFtZSI6ItCo0LrQvtC70YzQvdCw0Y8iLCJwcmV2aWV3Q292ZXIiOiIvbWVkaWEvcHJvZHByZXYvNDUzOS8wXzVhMGI3MDAwLTA5ZDEtNGJkMS05YmUzLTE4MjYyYWIyYTQ5MC5qcGcifSwicHJvZHVjdCI6eyJiaW5kaW5nVHlwZSI6ImdsdWUiLCJjb3ZlclR5cGUiOiJoYXJkIiwiZm9ybWF0SWQiOjIsImlkIjo0LCJwYWdlcyI6bnVsbCwidGhlbWUiOnsibmFtZSI6bnVsbCwiaWQiOm51bGwsInByZXZpZXciOm51bGx9fSwidHlwZSI6InNob3dQcmV2aWV3QWxidW0ifQ==',
        themeId: 744
    },
    {
        name: 'Свадебная',
        format: "20x20",
        id: 2830,
        orientation: "SQUARE",
        previewCover: "/media/prodprev/2830/0_da8588e9-6b79-4cb1-82d2-2905ec9160d5.jpg",
        url: generatePath( LINKS.GALLERY, { categoryId: 5 } ),
        themeId: 373
    },
    {
        name: 'Детская',
        format: "20x20",
        id: 933,
        orientation: "SQUARE",
        previewCover: "/media/prodprev/933/0_469cf92b-4fec-4389-9e44-06ca2ccb270b.jpg",
        url: generatePath( LINKS.GALLERY, { categoryId: 2 } ) + '/eyJtb2RhbCI6eyJmb3JtYXRJZCI6MiwiZ3JvdXBJZCI6MzUsImlkIjo5MzMsIm5hbWUiOiLQmtCw0YDRg9GB0LXQu9GMIiwicHJldmlld0NvdmVyIjoiL21lZGlhL3Byb2RwcmV2LzkzMy8wXzQ2OWNmOTJiLTRmZWMtNDM4OS05ZTQ0LTA2Y2EyY2NiMjcwYi5qcGcifSwicHJvZHVjdCI6eyJiaW5kaW5nVHlwZSI6ImdsdWUiLCJjb3ZlclR5cGUiOiJoYXJkIiwiZm9ybWF0SWQiOjIsImlkIjo0LCJwYWdlcyI6bnVsbCwidGhlbWUiOnsibmFtZSI6bnVsbCwiaWQiOm51bGwsInByZXZpZXciOm51bGx9fSwidHlwZSI6InNob3dQcmV2aWV3QWxidW0ifQ==',
        themeId: 189
    },
    {
        name: 'Выпускной',
        format: "20x20",
        id: 1542,
        orientation: "SQUARE",
        previewCover: "/media/prodprev/1542/0_39eeee65-72cd-4921-b8f5-31e28ef33ccd.jpg",
        url: generatePath( LINKS.GALLERY, { categoryId: 8 } ),
        themeId: 241
    }
];


// const POSTERS_TOP_THEMES = [
//     {
//         name: 'Новая тема',
//         preview: '<svg xmlns="http://www.w3.org/2000/svg" data-ver="1" width="100%" height="100%" viewBox="0 0 420 420" ><defs><clipPath id="clip_print_0rckg15k7bg4cxbr2yi2wqma3ey"><rect x="-3" y="-3" width="426" height="426"></rect></clipPath><clipPath id="clip_cut_0rckg15k7bg4cxbr2yi2wqma3ey"><rect x="0" y="0" width="420" height="420"></rect></clipPath></defs><rect width="510" height="510" x="-45" y="-45" style="filter:url(#pageShadow)" ></rect><g><image width="639" height="426" x="-208.14699885393767" y="-3" rotate="0" href="https://lh3.googleusercontent.com/ouCMiaLVnvf580aFdK4HOI9ivDcEOaMXU9ooungoErRbd-e15A7L9D0yCSKwpo0HeIw0S6Tdc9Uxk61AIUoB3zqJ=/%IMAGESIZE%/" clip-path="url(#clip_print_0rckg15k7bg4cxbr2yi2wqma3ey)"></image></g></svg>',
//         url: generateThemesUrl({ productType: THEME_PRODUCT_GROUP.DECOR, themeId: '9f54ff5b-52dd-4e6a-bad9-1806e894260a'})
//     },
//     {
//         name: 'Свадебные темы',
//         preview: '<svg xmlns="http://www.w3.org/2000/svg" data-ver="1" width="100%" height="100%" viewBox="0 0 420 420" ><defs><clipPath id="clip_print_0rckg15k7bg4cxbr2yi2wqma3ey"><rect x="-3" y="-3" width="426" height="426"></rect></clipPath><clipPath id="clip_cut_0rckg15k7bg4cxbr2yi2wqma3ey"><rect x="0" y="0" width="420" height="420"></rect></clipPath></defs><rect width="510" height="510" x="-45" y="-45" style="filter:url(#pageShadow)" ></rect><g><image width="639" height="426" x="-208.14699885393767" y="-3" rotate="0" href="https://lh3.googleusercontent.com/ouCMiaLVnvf580aFdK4HOI9ivDcEOaMXU9ooungoErRbd-e15A7L9D0yCSKwpo0HeIw0S6Tdc9Uxk61AIUoB3zqJ=/%IMAGESIZE%/" clip-path="url(#clip_print_0rckg15k7bg4cxbr2yi2wqma3ey)"></image></g></svg>',
//         url: generateThemesUrl({ productType: THEME_PRODUCT_GROUP.DECOR, category: 'f4c9cc'})
//     },
// ];

const CALENDARS_TOP_THEMES = [
    {
        name: 'Стандарт 1',
        preview: `<svg xmlns="http://www.w3.org/2000/svg" data-ver="1" viewBox="0 0 212 318">
        <defs>
        <clipPath id="clip_print_6i0rhfyzle799w4so3t6ehph6pk">
          <path d="M-3-3h218v324H-3z"/>
        </clipPath>
        <clipPath id="clip_cut_6i0rhfyzle799w4so3t6ehph6pk">
          <path d="M0 0h212v318H0z"/>
        </clipPath>
        </defs>
        <path fill="#fff" d="M0 0h212v318H0z"/>
        <path fill="#fff" d="M0 0h212v318H0z"/>
        <clipPath id="clip_print_block_ja5mzf4y5k1421lx2b5i4l8f18w" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g clip-path="url(#clip_photo_block_ja5mzf4y5k1421lx2b5i4l8f18w)" data-current="layoutBackground">
        <path clip-path="url(#clip_print_block_ja5mzf4y5k1421lx2b5i4l8f18w)" fill="#FFF" d="M-3-3h218v324H-3z"/>
        </g>
        <clipPath id="clip_print_block_zs8p4jgmyrbf01c8mljfzlc3ahg" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g data-current="layoutPhoto">
        <clipPath id="clip_photo_block_zs8p4jgmyrbf01c8mljfzlc3ahg" data-current="clipPath">
          <path d="M-2-2h217v323H-2z"/>
        </clipPath>
        <g clip-path="url(#clip_photo_block_zs8p4jgmyrbf01c8mljfzlc3ahg)">
          <image x="-109" y="-2" width="513" height="343" href="https://lh3.googleusercontent.com/IDmMLCbkRp78a0ijgtJgRtJYEyGUpekjuIpJd_qglINxj9vpRpGS9Ke-5OZj-1J5eWjivrqT_E16qbBcZsVLHsFZnQ9b36iMC6GJzA=/%IMAGESIZE%/" clip-path="url(#clip_print_block_zs8p4jgmyrbf01c8mljfzlc3ahg)"/>
        </g>
        </g>
        <clipPath id="clip_print_block_451rswmhhlh476dnvazg8z83v0z" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g data-current="layoutText">
        <defs>
          <style>
            @font-face{font-family:&apos;RussoOne&apos;;src:url(&quot;https://u4u.ru/spa-img/fonts/Russo_One.ttf&quot;) format(&apos;truetype&apos;)}
          </style>
        </defs>
        <text x="31" y="34" id="text_451rswmhhlh476dnvazg8z83v0z" stroke="#000" stroke-opacity="1" stroke-width="0" paint-order="stroke" font-size="33" font-family="RussoOne" fill="#000" fill-opacity="1" alignment-baseline="middle" dominant-baseline="middle">
          <tspan x="31" y="14.5" dy="28.5" font-weight="400" alignment-baseline="middle">2021</tspan>
        </text>
        </g>
        </svg>`,
        url: generateThemesUrl({ productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP, format: '212_318', themeId: '32275e3f-4f83-492d-a018-e5cb95dafc85'})
    },
    {
        name: 'Акварель',
        preview: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-ver="1" viewBox="0 0 212 318">
            <path fill="#fff" d="M0 0h212v318H0z"/>
            <path fill="#fff" d="M0 0h212v318H0z"/>
            <clipPath id="a" data-current="clipPath">
            <path d="M0 0h212v318H0z"/>
            </clipPath>
            <g clip-path="url(#clip_photo_block_e7h1w9h7x1oce1oglmf6r2r9uwi)" data-current="layoutBackground">
            <path clip-path="url(#a)" fill="#FFF" d="M-3-3h218v324H-3z"/>
            </g>
            <clipPath id="c" data-current="clipPath">
            <path d="M0 0h212v318H0z"/>
            </clipPath>
            <g data-current="layoutPhoto">
            <clipPath id="b" data-current="clipPath">
              <path d="M-2-4h216v325H-2z"/>
            </clipPath>
            <g clip-path="url(#b)">
              <image x="-2" y="-4" width="216" height="325" href="https://lh3.googleusercontent.com/ImnCFTzlqsu9OsmmgH-pIp44LyJipxToi6pKYSQQt2-JO8xzS9MmpifYJjJjzsu9teqFcI6JZ1mVmeLVZcK0jwbWHDxooL2RO3UJ=/%IMAGESIZE%/" clip-path="url(#c)"/>
            </g>
            </g>
            <clipPath id="d" data-current="clipPath">
            <path d="M0 0h212v318H0z"/>
            </clipPath>
            <image x="-26" y="18" preserveAspectRatio="none" width="128" height="127" xlink:href="https://u4u.ru/media/sticker/089a9aaa-f250-4580-906b-4c62c4437470/ms.png" clip-path="url(#d)" data-current="layoutSticker"/>
            <clipPath id="e" data-current="clipPath">
            <path transform="matrix(-1 0 0 1 340 0)" d="M0 0h212v318H0z"/>
            </clipPath>
            <image x="106" y="18" preserveAspectRatio="none" width="128" height="127" transform="matrix(-1 0 0 1 340 0)" xlink:href="https://u4u.ru/media/sticker/089a9aaa-f250-4580-906b-4c62c4437470/ms.png" clip-path="url(#e)" data-current="layoutSticker"/>
            <clipPath id="f" data-current="clipPath">
            <path d="M0 0h212v318H0z"/>
            </clipPath>
            <image x="126" y="272" preserveAspectRatio="none" width="70" height="27" xlink:href="https://u4u.ru/media/sticker/964b1b6d-e210-41e0-acd4-396883f609fc/ms.png" clip-path="url(#f)" data-current="layoutSticker"/>
        </svg>`,
        url: generateThemesUrl({ productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP, format: '212_318', themeId: '3ec7890f-0518-4b79-8cc9-eac75a9cbfc2'})
    },
    {
        name: 'Карусель',
        preview: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-ver="1" viewBox="0 0 212 318">
        <defs>
        <clipPath id="clip_print_h72pwu1n0iksxnpvvlfvpjzuwdc">
          <path d="M-3-3h218v324H-3z"/>
        </clipPath>
        <clipPath id="clip_cut_h72pwu1n0iksxnpvvlfvpjzuwdc">
          <path d="M0 0h212v318H0z"/>
        </clipPath>
        </defs>
        <path fill="#fff" d="M0 0h212v318H0z"/>
        <path fill="#fff" d="M0 0h212v318H0z"/>
        <clipPath id="clip_print_block_7yi3adwjxabta1kmqsylhwwwirs" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g clip-path="url(#clip_photo_block_7yi3adwjxabta1kmqsylhwwwirs)" data-current="layoutBackground">
        <path clip-path="url(#clip_print_block_7yi3adwjxabta1kmqsylhwwwirs)" fill="#FFF" d="M-3-3h218v324H-3z"/>
        <image x="-40" y="-3" width="638" height="324" href="https://u4u.ru/media/background/83284814-f6fa-4c99-b6e9-e4c58013885e/ms.jpeg" clip-path="url(#clip_print_block_7yi3adwjxabta1kmqsylhwwwirs)"/>
        </g>
        <clipPath id="clip_print_block_038xuwg40o5d78ihrqrz32kk4xx" data-current="clipPath">
        <path transform="rotate(-90 106.5 151)" d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="-8" y="54" preserveAspectRatio="none" width="229" height="194" transform="rotate(90 106.5 151)" xlink:href="https://u4u.ru/media/sticker/8f8826b9-e6f7-4151-ab58-d587d3164072/ms.png" clip-path="url(#clip_print_block_038xuwg40o5d78ihrqrz32kk4xx)" data-current="layoutSticker"/>
        <clipPath id="clip_print_block_7qy9fgr61tm7yp8qxqpc6dmabfq" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="20" y="17" preserveAspectRatio="none" width="173" height="274" xlink:href="https://u4u.ru/media/sticker/23d309df-9579-4a23-bd5f-eb23cdcb292d/ms.png" clip-path="url(#clip_print_block_7qy9fgr61tm7yp8qxqpc6dmabfq)" data-current="layoutSticker"/>
        <clipPath id="clip_print_block_ihui9us1ys91rqp4roj1szf4mz9" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g data-current="layoutPhoto">
        <clipPath id="clip_photo_block_ihui9us1ys91rqp4roj1szf4mz9" data-current="clipPath">
          <path d="M20 36h172v230H20z"/>
        </clipPath>
        <g clip-path="url(#clip_photo_block_ihui9us1ys91rqp4roj1szf4mz9)">
          <image x="-100" y="36" width="344" height="230" href="https://lh3.googleusercontent.com/7dmsLslNcKhLher-77z-jhNPT-n-2QiDIiwiHtR1zMoaXWl8PPzazx3Dj5NvYutZKyI1OZ0ZYC-j93Aodnfq0_WE0h-BXZ2xb184=/%IMAGESIZE%/" clip-path="url(#clip_print_block_ihui9us1ys91rqp4roj1szf4mz9)"/>
        </g>
        </g>
        <clipPath id="clip_print_block_t7ewupm9jfuvbblfyp1093ja538" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g data-current="layoutText">
        <defs>
          <style>
            @font-face{font-family:&apos;TMVinogradFilled&apos;;src:url(&quot;https://u4u.ru/spa-img/fonts/TMVinograd-Filled.ttf&quot;) format(&apos;truetype&apos;)}
          </style>
        </defs>
        <text x="53" y="265" id="text_t7ewupm9jfuvbblfyp1093ja538" stroke="#000" stroke-opacity="1" stroke-width="0" paint-order="stroke" font-size="12" font-family="TMVinogradFilled" fill="#fff" fill-opacity="1" alignment-baseline="middle" dominant-baseline="middle">
          <tspan x="106" y="260.11" dy="15.39" font-weight="400" text-anchor="middle" alignment-baseline="middle">Наш счастливый 2021</tspan>
        </text>
        </g>
        <clipPath id="clip_print_block_i5cuz7itxzaabftbonpigu40ou1" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="10" y="223" preserveAspectRatio="none" width="52" height="85" xlink:href="https://u4u.ru/media/sticker/118b1fc9-69d5-466d-8a42-c44370a1445e/ms.png" clip-path="url(#clip_print_block_i5cuz7itxzaabftbonpigu40ou1)" data-current="layoutSticker"/>
        <clipPath id="clip_print_block_ixuv2x7g0ntokk7sav8278t9np3" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="159" y="215" preserveAspectRatio="none" width="49" height="93" xlink:href="https://u4u.ru/media/sticker/efea5333-81f0-427f-9f28-fb70b8f69463/ms.png" clip-path="url(#clip_print_block_ixuv2x7g0ntokk7sav8278t9np3)" data-current="layoutSticker"/>
        </svg>`,
        url: generateThemesUrl({ productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP, format: '212_318', themeId: '1c98f878-05c0-4f25-b9e8-7cecd79ef440'})
    },
    {
        name: 'Звёздная пыль',
        preview: `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-ver="1" viewBox="0 0 212 318">
        <path fill="#fff" d="M0 0h212v318H0z"/>
        <path fill="#fff" d="M0 0h212v318H0z"/>
        <clipPath id="a" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g clip-path="url(#clip_photo_block_j9ihewri2c6wqu1b84gnzn3f9oc)" data-current="layoutBackground">
        <path clip-path="url(#a)" fill="#FFF" d="M-3-3h218v324H-3z"/>
        <image x="-216" y="-3" width="646" height="324" href="https://u4u.ru/media/background/7e0d6ec4-3051-44b8-bc50-f621e4d20be9/ms.png" clip-path="url(#a)"/>
        </g>
        <clipPath id="b" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="86" y="-13" preserveAspectRatio="none" width="148" height="148" xlink:href="https://u4u.ru/media/sticker/ddb4fb49-56ed-4f6a-bf13-87fd38a54de8/ms.png" clip-path="url(#b)" data-current="layoutSticker"/>
        <clipPath id="c" data-current="clipPath">
        <path transform="rotate(-333 25.5 161.5)" d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="-72" y="64" preserveAspectRatio="none" width="195" height="195" transform="rotate(333 25.5 161.5)" xlink:href="https://u4u.ru/media/sticker/85fc69dc-83d9-4ce1-85e8-5d8aa3e57b20/ms.png" clip-path="url(#c)" data-current="layoutSticker"/>
        <clipPath id="d" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="66" y="186" preserveAspectRatio="none" width="148" height="156" xlink:href="https://u4u.ru/media/sticker/e579fec3-9794-4f22-a9d5-38beda1fca10/ms.png" clip-path="url(#d)" data-current="layoutSticker"/>
        <clipPath id="e" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="33" y="52" preserveAspectRatio="none" width="148" height="193" xlink:href="https://u4u.ru/media/sticker/7d62841c-b7a6-462c-85f4-492e40960a98/ms.png" clip-path="url(#e)" data-current="layoutSticker"/>
        <clipPath id="g" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <g data-current="layoutPhoto">
        <clipPath id="f" data-current="clipPath">
          <path d="M44 60h127v171H44z"/>
        </clipPath>
        <g clip-path="url(#f)">
          <image x="-70" y="60" width="256" height="171" href="https://lh3.googleusercontent.com/ycFo4iMxR4tRWUrLIEtyDKlyBCUopA_SS71hE3sABXyOQzg8AZYr0hTRH1mh70oATb1MMfZs8xC1hyWhVVmOwS6epux1dtCyienI=/%IMAGESIZE%/" clip-path="url(#g)"/>
        </g>
        </g>
        <clipPath id="h" data-current="clipPath">
        <path d="M0 0h212v318H0z"/>
        </clipPath>
        <image x="62" y="257" preserveAspectRatio="none" width="90" height="35" xlink:href="https://u4u.ru/media/sticker/1a01cb9a-39d9-44f8-9746-1c2862449cd7/ms.png" clip-path="url(#h)" data-current="layoutSticker"/>
        </svg>`,
        url: generateThemesUrl({ productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP, format: '212_318', themeId: 'c0c160a4-b2fb-4a41-80f9-f44bfd4c9937'})
    },

];

const PRODUCTS_BLOCKS = [
    {
        title: TEXT_STARTPAGE.OUR_PHOTOBOOKS,
        link: LINKS.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-glue'),
        productList: PHOTOBOOK_TYPES_2,
        component: <TopThemes productSlug={'photobook'} title={'Темы фотокниг'} link={LINKS.GALLERY.replace(':categoryId?', '')} themesList={PHOTOBOOKS_TOP_THEMES}/>
    },
    {
        title: 'Новый продукт! Пазл!',
        link: LINKS.PRODUCT.replace(':productType', productGetId(SLUGS.PUZZLE)),
        productList: SLUGS.PUZZLE,
    },
    {
        title: TEXT_STARTPAGE.OUR_POSTERS,
        link: LINKS.PRODUCT.replace(':productType', productGetId(SLUGS.POSTER_SIMPLE)),
        productList: 'posters'
    },
    {
        title: TEXT_STARTPAGE.OUR_PHOTOS,
        link: LINKS.PRODUCT.replace(':productType', productGetId(SLUGS.PHOTO_SIMPLE)),
        productList: 'photos'
    },
    {
        title: TEXT_STARTPAGE.OUR_CANVASES,
        link: LINKS.PRODUCT.replace(':productType', productGetId(SLUGS.POSTER_CANVAS)),
        productList: 'canvases',
        // component: <TopThemes productSlug={SLUGS.POSTER_SIMPLE} title={'Темы для интерьерной печати'} link={generateThemesUrl({})} themesList={POSTERS_TOP_THEMES}/>
    },
    {
        title: TEXT_STARTPAGE.OUR_CALENDARS,
        link: LINKS.PRODUCT.replace(':productType', productGetId(SLUGS.CALENDAR_WALL_FLIP)),
        productList: 'calendars',
        component: <TopThemes productSlug={SLUGS.CALENDAR_WALL_FLIP} title={'Темы для календарей'} link={generateThemesUrl({productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP})} themesList={CALENDARS_TOP_THEMES}/>
    },
    {
        title: 'Видео с нашими фотокнигами',
        component: <VideoWrap>
            <VideoBlock hash='OVpoydmpNUo'/>
        </VideoWrap>
    },
];

const productListAdapter = (productSelector) => productSelector ? productSelector.length && productSelector.map((item) => ({
    imageUrl: item.productImages && item.productImages[0].url,
    title: item.name,
    text: item.description && paragrafyText(item.description.split('\n')),
    link: LINKS.PRODUCT.replace( ':productType', item.id )
})) || [] : null;

export default () => {
    const windowScroll = useScroll();
    const windowHeight = useSelector(windowHeightSelector);

    const posterSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.POSTER ) );
    const photosSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.PHOTO ) );
    const canvasesSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.CANVAS ) );
    const calendarsSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.CALENDAR ) );
    const puzzleSelector = useSelector( ( state ) => productsSelector( state, PRODUCT_TYPES.PUZZLE ) );
    // const showFuture = useSelector(showFutureSelector);


    const [viewPosition, setViewPosition] = useState(0);
    const [productLists, setProductLists] = useState({
        posters: null,
        photos: null,
        canvases: null,
        calendars: null,
        [SLUGS.PUZZLE]: null,
    });

    useEffect( () => {
        if (posterSelector && photosSelector && canvasesSelector && calendarsSelector ) setProductLists( {
            posters: productListAdapter( posterSelector ),
            photos: productListAdapter( photosSelector ),
            canvases: productListAdapter( canvasesSelector ),
            calendars: productListAdapter( calendarsSelector ),
            [SLUGS.PUZZLE]: productListAdapter( puzzleSelector ),
        } );
    }, [ posterSelector, photosSelector, canvasesSelector, calendarsSelector , puzzleSelector ] );

    useEffect(() => {
        setViewPosition(windowHeight + windowScroll - (windowHeight / 4))
    }, [windowScroll] );

    return PRODUCTS_BLOCKS.map( ( item, i ) =>
        <ProductsBlock {...item} key={i}
                       viewPosition={ viewPosition }
                       productList={Array.isArray(item.productList) ? item.productList : productLists[item.productList]}
        /> )
};


const viewComponent = (data, active, index) => <ProductTypeCard data={data} active={active} key={index}/>;


const ProductsBlock = ({ viewPosition, isHolding = true, ...other}) => {
    const ref = useRef(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!(isHolding && show)) setShow(ref.current && viewPosition > ref.current.offsetTop)
    }, [isHolding, viewPosition, ref.current && ref.current.offsetTop]);

    return <ProductsBlockView ref={ref} show={show} {...other}/>
};

const ProductsBlockView = memo(forwardRef(({ show, productList, title, link, component = null, timeout = 500, height = 320}, ref) =>{

    return <CSSTransition
        timeout={ timeout }
        classNames="item"
        in={ show }
    >
        <Container ref={ ref }>
            { title && productList && <ProductTitle center h3>
                <LinkStyled to={ link }>{ title }</LinkStyled>
            </ProductTitle> }
            { productList && <Carousel data={ productList }
                                       viewComponent={ viewComponent }
                                       height={ height }
                                       loop
            /> }
            { component }
        </Container>
    </CSSTransition> }));
