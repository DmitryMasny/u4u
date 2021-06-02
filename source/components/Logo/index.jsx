import React, { memo } from 'react';

/*
const LogoDefault = props => (
        <svg className={s.logo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 480">

            <path className={s.logoColor1}
                  d="M999.57262,129.35768a44.28984,44.28984,0,0,0-82.86515-16.50106,7.2087,7.2087,0,0,0-.83284,1.60963l-.00708.02082a83.64092,83.64092,0,0,0-3.32072,9.21872c-8.80293,32.34278.91429,103.94378,1.34044,140.56875.075,6.45172.075,15.57951.075,15.57951,0,22.76449-20.9726,42.20354-43.87825,42.20354-22.85962,0-44.4567-19.361-44.53344-42.06627.95207-28.16033,13.93275-124.34017.9078-159.5875-.003-.00792-.01121-.02054-.01475-.02875a44.25108,44.25108,0,0,0-86.31514,13.42435c-.22843,3.64982-.11923,13.222.07142,22.52134h0c.0726,30.84871,2.1237,155.1528,2.1237,155.1528,0,5.25359,1.15747,16.10042,1.18935,16.53421,8.92451,55.23867,56.87074,84.48743,123.356,84.48743,66.45692,0,120.4632-29.77289,129.42253-84.96639,0,0,1.31507-11.35365,1.31507-16.6046,1.39239-20.14238,2.04638-124.2334,2.119-155.08212h-.00059C999.91673,146.54565,1000.30334,132.94709,999.57262,129.35768Z"/>

            <path className={s.logoColor2}
                  d="M299.57262,129.35768a44.28984,44.28984,0,0,0-82.86515-16.50106,7.2087,7.2087,0,0,0-.83284,1.60963l-.00708.02082a83.64092,83.64092,0,0,0-3.32072,9.21872c-8.80293,32.34278.91429,103.94378,1.34044,140.56875.075,6.45172.075,15.57951.075,15.57951,0,22.76449-20.9726,42.20354-43.87825,42.20354-22.85962,0-44.4567-19.361-44.53344-42.06627.95207-28.16033,13.93275-124.34017.9078-159.5875-.003-.00792-.01121-.02054-.01475-.02875a44.25108,44.25108,0,0,0-86.31514,13.42435c-.22843,3.64982-.11923,13.222.07142,22.52134h0c.0726,30.84871,2.1237,155.1528,2.1237,155.1528,0,5.25359,1.15747,16.10042,1.18935,16.53421,8.92451,55.23867,56.87074,84.48743,123.356,84.48743,66.45692,0,120.4632-29.77289,129.42253-84.96639,0,0,1.31507-11.35365,1.31507-16.6046,1.39239-20.14238,2.04638-124.2334,2.119-155.08212h-.00059C299.91673,146.54565,300.30334,132.94709,299.57262,129.35768Z"/>

            <path className={s.logoColor1}
                  d="M678.4375,116.48428a13.30375,13.30375,0,0,0-12.65942-17.405H610.73856a13.30743,13.30743,0,0,0-12.64968,9.17543L551.72772,250.184a13.30057,13.30057,0,0,1-12.64315,9.17069H467.78383a13.3091,13.3091,0,0,1-12.65761-17.4221l61.6652-189.77188A17.59972,17.59972,0,0,1,533.52964,40H660a60,60,0,0,1,60,60V380a60,60,0,0,1-60,60H591.61462a13.299,13.299,0,0,1-12.648-17.409L608.05937,333.061a13.30034,13.30034,0,0,1,12.64927-9.19h32.74824a13.30351,13.30351,0,0,0,12.65156-9.19l12.32906-37.91925a13.29592,13.29592,0,0,0-12.64436-17.40711H641.38683a7.2,7.2,0,0,1-6.83969-9.44916Z"/>
            <path className={s.logoColor2}
                  d="M518.2891,323.87106a7.14986,7.14986,0,0,1,6.805,9.34374l-29.88659,92.70256A20.3166,20.3166,0,0,1,475.87093,440H380a60,60,0,0,1-60-60V100a60,60,0,0,1,60-60h39.24195a13.47776,13.47776,0,0,1,12.8166,17.64728L362.75878,270.66672A40.655,40.655,0,0,0,401.411,323.87106Z"/>
        </svg>
);*/

const LogoEditor = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5062 4.5888C21.5449 4.46902 21.5547 4.34178 21.5348 4.21749C21.515 4.09319 21.466 3.97534 21.392 3.87355C21.3179 3.77177 21.2209 3.68893 21.1087 3.6318C20.9965 3.57467 20.8725 3.54486 20.7466 3.5448H17.4466C17.2782 3.5448 17.1142 3.598 16.9779 3.69681C16.8416 3.79563 16.74 3.93499 16.6876 4.095L13.9036 12.6108C13.8512 12.7708 13.7496 12.9102 13.6133 13.009C13.477 13.1078 13.313 13.161 13.1446 13.161H8.86661C8.7406 13.161 8.61638 13.1312 8.5041 13.074C8.39183 13.0168 8.29469 12.9339 8.22065 12.8319C8.14661 12.7299 8.09777 12.6119 8.07812 12.4874C8.05847 12.363 8.06858 12.2356 8.10761 12.1158L11.8072 0.7296C11.8762 0.51756 12.0105 0.332789 12.191 0.201736C12.3714 0.0706837 12.5886 6.8827e-05 12.8116 0H20.3998C21.3546 0 22.2702 0.379285 22.9454 1.05442C23.6205 1.72955 23.9998 2.64522 23.9998 3.6V20.4C23.9998 21.3548 23.6205 22.2705 22.9454 22.9456C22.2702 23.6207 21.3546 24 20.3998 24H16.2964C16.1706 23.9998 16.0467 23.9698 15.9347 23.9125C15.8227 23.8552 15.7259 23.7722 15.6521 23.6704C15.5783 23.5685 15.5297 23.4506 15.5102 23.3264C15.4907 23.2021 15.5008 23.075 15.5398 22.9554L17.2852 17.5836C17.3373 17.4233 17.4388 17.2836 17.5751 17.1846C17.7115 17.0855 17.8757 17.0322 18.0442 17.0322H20.0092C20.1777 17.0322 20.3419 16.9789 20.4783 16.8798C20.6146 16.7808 20.7161 16.6411 20.7682 16.4808L21.508 14.2056C21.5469 14.0858 21.5569 13.9585 21.5372 13.8342C21.5175 13.7098 21.4687 13.5918 21.3946 13.4899C21.3206 13.388 21.2235 13.3051 21.1113 13.248C20.9991 13.1908 20.8749 13.161 20.749 13.161H19.285C19.2167 13.1611 19.1494 13.145 19.0885 13.114C19.0277 13.083 18.9751 13.038 18.935 12.9827C18.8949 12.9274 18.8686 12.8634 18.8581 12.7959C18.8476 12.7285 18.8532 12.6595 18.8746 12.5946L21.5062 4.5888Z" fill="#136DB7"/>
        <path d="M11.8974 17.0322C11.9649 17.0323 12.0315 17.0483 12.0917 17.0789C12.1519 17.1096 12.204 17.1541 12.2438 17.2087C12.2836 17.2633 12.3099 17.3266 12.3206 17.3933C12.3313 17.46 12.3261 17.5283 12.3054 17.5926L10.5126 23.1552C10.4333 23.4006 10.2783 23.6146 10.0698 23.7663C9.8613 23.9181 9.61007 23.9999 9.35218 24H3.59999C2.64522 24 1.72954 23.6207 1.05441 22.9456C0.379283 22.2705 0 21.3548 0 20.4V3.6C0 2.64522 0.379283 1.72955 1.05441 1.05442C1.72954 0.379285 2.64522 3.23332e-09 3.59999 3.23332e-09H5.95439C6.08205 -1.14112e-05 6.20791 0.0301994 6.32166 0.0881612C6.43541 0.146123 6.53383 0.230189 6.60885 0.333484C6.68388 0.436778 6.73339 0.556366 6.75333 0.682466C6.77327 0.808566 6.76308 0.937595 6.72359 1.059L2.5656 13.839C2.44681 14.205 2.41629 14.5939 2.47653 14.9739C2.53677 15.3539 2.68607 15.7143 2.91222 16.0256C3.13837 16.3368 3.43496 16.5902 3.77775 16.765C4.12055 16.9397 4.49983 17.0309 4.88459 17.031L11.8974 17.0322Z" fill="#12A3D6"/>
    </svg>
)

// const LogoNY = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 476 222" style={{marginTop: props.isMobile ? 3 : 0}}>
//             <path
//                 d="M128.3,44.2A21.87,21.87,0,0,0,87.4,36a3,3,0,0,0-.4.8h0a40.38,40.38,0,0,0-1.6,4.5c-4.4,16,.4,51.4.7,69.4v7.7c0,11.2-10.4,20.9-21.7,20.9s-22-9.6-22-20.8c.5-13.9,6.9-61.4.4-78.9h0A21.89,21.89,0,0,0,.1,46.2C0,48,0,52.7.1,57.3h0c0,15.2,1,76.7,1,76.7,0,2.6.6,8,.6,8.2,4.4,27.3,28.1,41.8,61,41.8s59.5-14.7,63.9-42c0,0,.6-5.6.6-8.2.7-10,1-61.4,1-76.6h0C128.4,52.7,128.6,46,128.3,44.2Z"
//                 fill="#d40613"/>
//             <path
//                 d="M474.1,44.2A21.87,21.87,0,0,0,433.2,36a2,2,0,0,0-.4.8h0a40.38,40.38,0,0,0-1.6,4.5c-4.3,16,.5,51.4.7,69.4v7.7c0,11.2-10.4,20.9-21.7,20.9s-22-9.6-22-20.8c.5-13.9,6.9-61.4.5-78.9h0A21.89,21.89,0,0,0,346,46.2c-.1,1.8-.1,6.5,0,11.1h0c0,15.2,1,76.7,1,76.7,0,2.6.6,8,.6,8.2,4.4,27.3,28.1,41.8,61,41.8s59.5-14.7,64-42c0,0,.7-5.6.7-8.2.7-10,1-61.4,1-76.6h0C474.3,52.7,474.5,46,474.1,44.2Z"
//                 fill="#8ebc28"/>
//             <path
//                 d="M315.5,37.9a6.61,6.61,0,0,0-4.2-8.3,6.93,6.93,0,0,0-2-.3H282a6.45,6.45,0,0,0-6.2,4.5l-22.9,70.1a6.55,6.55,0,0,1-6.2,4.5H211.5a6.59,6.59,0,0,1-6.6-6.6,6.45,6.45,0,0,1,.3-2L235.7,6A8.71,8.71,0,0,1,244,0h62.5a29.6,29.6,0,0,1,29.6,29.6V167.9a29.6,29.6,0,0,1-29.6,29.6H272.7a6.59,6.59,0,0,1-6.6-6.6,6.45,6.45,0,0,1,.3-2l14.4-44.2a6.55,6.55,0,0,1,6.2-4.5h16.2a6.45,6.45,0,0,0,6.2-4.5l6.1-18.7a6.61,6.61,0,0,0-4.2-8.3,6.93,6.93,0,0,0-2-.3H297.2a3.5,3.5,0,0,1-3.5-3.6,4.25,4.25,0,0,1,.2-1.1Z"
//                 fill="#8ebc28"/>
//             <path
//                 d="M236.3,140.3a3.48,3.48,0,0,1,3.5,3.5,4.25,4.25,0,0,1-.2,1.1l-14.8,45.8a10,10,0,0,1-9.6,7H168a29.6,29.6,0,0,1-29.6-29.6h0V29.7A29.6,29.6,0,0,1,168,.1h19.4a6.7,6.7,0,0,1,6.7,6.7,7.61,7.61,0,0,1-.3,2.1L159.6,114.1a20.08,20.08,0,0,0,13,25.3,21.05,21.05,0,0,0,6.1,1h57.6Z"
//                 fill="#d40613"/>
//             <path
//                 d="M340.36,101.82c-1.9,3-3.9,6.17-5.89,9.11,18-.38,34.26-5.41,50.11-13.48,3.61-1.8,5.88,3.42,2.37,5.32a115,115,0,0,1-56.37,13.85c-.28.38-.47.67-.76,1l-4.36,5.78c14.9,8,29.13,3.61,44-1.42,3.89-1.33,6.36,3.8,2.47,5.32-17.18,6.45-33.22,10.06-50.11.75-2.94,3.52-5.79,7.22-8.73,10.73,15.75,9.39,30.84,10.06,47.55,3.23a2.91,2.91,0,1,1,2.37,5.31c-18.6,8.26-36.26,6.74-53.72-4-1.42,1.62-2.84,3.23-4.27,4.75-1.33,2.56-4.46,6.45-7.12,7.4,13.29,7.59,28.29,11.86,43.09,7.78,4.08-1.14,6.36,4.08,2.28,5.32-17.18,5.41-34.26,0-49.54-9a.09.09,0,0,0-.1-.09c-2.37,2.28-4.93,4.46-7.49,6.55C297,177,309.23,182.2,324.41,182.48c4,.1,4.65,5.7.57,5.7-17.37.28-31-6.27-43.18-18.51-4.27,3.23-8.45,6.55-12.72,9.78L273,167.68l1.52-1.23c-4.65-3.61-7.59-9.4-9.68-14.62a89.3,89.3,0,0,1-6.55-31.13,2.9,2.9,0,0,1,5.79-.38c.76,8.92,1.52,16.42,4.65,25.44,1.9,5.41,4.18,14,10.44,16.7.1,0,.1.09.19.09,2.66-2.18,5.32-4.36,7.79-6.64-8.83-14.61-14.05-28.75-14.24-45.84-.1-3.89,5.6-3,5.79.86A85,85,0,0,0,291.29,152c2.09-2,4.08-4,6.07-6.17-10.24-16-16.51-32.46-17.74-51.34-.29-3.89,5.31-4.84,5.69-1,1.71,17.65,6.55,32.84,16,47.93,3.51-3.9,6.93-7.88,10.16-12-12.91-15.47-20.41-32-22-51.91-.29-3.9,5.31-4.94,5.79-1,2,18.5,8.06,33.78,20,48.21,2.37-2.94,4.75-6,7-9-11.29-19-18.88-38-22.3-59.79-.57-3.89,5-4.74,5.79-.85,3.7,19.93,9.87,38,20.22,55.61,3.22-4.65,6.35-9.39,9.3-14.23-12.53-16.42-22-34.26-25.25-54.67-.66-4,5-4.84,5.79-.85,3.51,18.41,11.39,35,22.59,50.2a153.94,153.94,0,0,0,7.68-15.94C334,57.88,327.64,40.22,326.5,19.06c-.19-3.89,5.5-3.32,5.79.57,1.52,18,6.36,34.07,16.32,49.54,1.71-4.75,3.32-9.59,4.84-14.43l-.09-.09c-8.73-15.19-9.59-31.22-8.16-48.12A2.9,2.9,0,1,1,351,7c-.56,13.66-.94,27.14,4.66,40.14,3.41-11.77,5.4-23.72,7.78-35.78.85-4.46,7.12-2.56,6.55,1.81-1.24,10.06-3.71,20.4-6.08,30.37,9.3-9.4,14.81-19.84,18.32-32.46,1-3.8,6.45-1.8,5.5,2C383.54,29.88,374.62,42.79,361,53.8c-1.8,6-3.7,12-5.79,17.84,16-11.49,28-24,34.45-42.8,1.23-3.71,6.74-1.71,5.5,2-7.49,23-23.63,37.3-43.65,50.2-2.28,5.13-4.75,10.06-7.4,14.9,19.55-2.84,35.11-11,49.73-24,2.94-2.66,6.64,1.8,3.7,4.56C381.16,91.57,363.23,99.73,340.93,102A1.14,1.14,0,0,0,340.36,101.82Z"
//                 fill="#2f7c45"/>
//             <polygon
//                 points="331.31 109.81 327.62 112.31 317.12 132.41 317.12 135.71 319.51 148.21 320.92 150.81 333.21 163.11 335.81 164.41 370.21 160.21 372.62 158.31 379.71 148.21 380.62 145.51 381.71 133.11 381.21 130.71 368.31 108.31 365.81 106.81 331.31 109.81"
//                 fill="#ffb537"/>
//             <path
//                 d="M347.71,151.31a7.39,7.39,0,0,0,2.1,0c.3-.1.6-.1.9-.2,6.6,2.9,13,6,19.5,9.1a36.14,36.14,0,0,1-34.4,4A38.58,38.58,0,0,1,347.71,151.31Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M371.11,132.61c-4.9.3-7.8-2.7-11.4-5.5-1.3-1-2.6-1.9-4-2.8-.7-.4-1.4-.9-2.2-1.3-.2-.1-1-.4-1.1-.6-.2-.4,1.1-1.1,1.4-1.4l2.4-2.1,4.6-4c2.5-2.2,5.1-4.4,7.6-6.6a27.67,27.67,0,0,1,9.5,11.2,43.94,43.94,0,0,1,3.4,11.2A48,48,0,0,1,371.11,132.61Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M339.51,147.51a37.21,37.21,0,0,0,4.9,2.8,41.28,41.28,0,0,0-11.1,12.8,23.81,23.81,0,0,1-3-1.8,30.39,30.39,0,0,1-9.4-10.5c2.7-3.8,5.4-7.5,8.2-11.2A63.25,63.25,0,0,0,339.51,147.51Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M342.21,128.21a24.09,24.09,0,0,1,4.4-3.3,4.17,4.17,0,0,1,2.4-.9,4.6,4.6,0,0,1,2.4,1c1.1.6,2.1,1.3,3.2,2,2,1.3,3.9,2.8,5.8,4.3a19.41,19.41,0,0,0,2.9,2.1c.5.3,1,.6,1.6.9.4.2,1.2.3,1.5.5,1.2.9-2.1,3.6-2.7,4.2a44,44,0,0,1-3.9,3.5,36.24,36.24,0,0,1-8.6,5.3,7,7,0,0,1-3.8.4,16.88,16.88,0,0,1-6.2-2.5,54.31,54.31,0,0,1-8.9-6.9c-.3-.3-.7-.6-1-.9a21.12,21.12,0,0,0,3.1-2.1C337.21,133.51,339.51,130.71,342.21,128.21Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M371.31,137.41c-.3-.2-1.9-1.4-1.8-1.7.1-.5,1.5-.3,1.8-.3,1.1-.1,2.2-.2,3.3-.4,2.1-.4,4.2-1.1,6.3-1.6a6.37,6.37,0,0,1,.7-.2,34.39,34.39,0,0,1-.9,12.4c-1.5-1.2-2.9-2.4-4.3-3.6C374.61,140.41,373,138.91,371.31,137.41Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M360.41,145.11a39.63,39.63,0,0,0,7.7-7c3.7,3.5,7.6,6.9,11.6,10.1a25.89,25.89,0,0,1-7.1,10.1c-6.1-3-12.3-5.9-18.5-8.7C356.31,148.31,358.51,146.51,360.41,145.11Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M354.81,116.31c-.9.8-1.8,1.6-2.7,2.3-1.8,1.6-2,2.2-4.3,2.1-4.5-.2-10.4-5.1-14.1-7.6-1.3-.8-2.5-1.7-3.8-2.6,10.2-6.8,25.3-9,35.8-3.8-1.4,1.2-2.8,2.5-4.3,3.7C359.31,112.41,357.11,114.41,354.81,116.31Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M326.51,138.41c-2.3,3.2-4.7,6.4-7,9.5a31.71,31.71,0,0,1-2.5-12.5l6.6,2.1C324.61,137.81,325.51,138.11,326.51,138.41Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M334.91,117.21q4.05,2.55,8.4,4.8c.4.2.9.5,1.4.8-4.3,2.6-7.5,6.4-11.3,9.9a11.75,11.75,0,0,1-3,2.4c-2.8,1.5-5.6-.1-8.3-.9-1.7-.5-3.3-1-5-1.6a29,29,0,0,1,7.1-16.9,28.31,28.31,0,0,1,3.5-3.4C330,114,332.41,115.61,334.91,117.21Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M336.81,102.31c1.5-.8,4.1-.6,5.4-1.5s.4-4.2.9-5.8a5.31,5.31,0,0,1,.8-1.7c.6-.6,2.3-1.1,3-.2a2,2,0,0,1,.2,1.1,13.14,13.14,0,0,0-.1,4l.3.9c.1.1.1.3.2.4.8,1,2.4.4,3.7.3a6.93,6.93,0,0,1,6.6,3.6,6.42,6.42,0,0,1,.8,2s-16.5,1.7-24.4,3.8C334.11,109.11,332.81,104.41,336.81,102.31Z"
//                 fill="#db1d1d"/>
//             <path
//                 d="M81.6,152.1s5.4,20.5,17.9,20.1,34.4,0,34.4,0c.9,1.6,8.6-2.5,15.5-20.1l-20-4.9-6.3,11H108.2L96,145.8Z"
//                 fill="#2f7c45"/>
//             <path
//                 d="M96.7,224.2a31.32,31.32,0,0,1,7.6-21.2l3.6-4.4a19.22,19.22,0,0,0-2.4-27.2,21,21,0,0,0-29.4,2.8l-4,4.8a37.57,37.57,0,0,1-6.4,6.2,36.7,36.7,0,0,1-13.3,6c-.8.2-1.5.3-2.3.5l-3.4,4.2c-1.4,1.7,8,10.9,20.8,20.5S92,232.5,93.4,230.8l3.4-4.2C96.8,225.7,96.7,224.9,96.7,224.2Z"
//                 fill="#ffb537"/>
//             <path
//                 d="M155.4,207.6a28,28,0,0,1-4.8-10.4,29.12,29.12,0,0,1-.5-7.2l.3-4.6a16.49,16.49,0,0,0-14.9-17.2c-9.6-.9-17.9,6-18.4,15l-.3,5a23.45,23.45,0,0,1-1.3,7,28.11,28.11,0,0,1-6,10,15.93,15.93,0,0,1-1.3,1.3l-.2,4.3c-.1,1.8,10.7,3.7,24,4.4s24.3-.2,24.4-1.9l.2-4.3A5.26,5.26,0,0,1,155.4,207.6Z"
//                 fill="#ffb537"/>
//             <path
//                 d="M123.3,158.2h0a4.6,4.6,0,0,0,5.7,5.9h0a41,41,0,0,0,17.5-9.2l.8-.7a6.17,6.17,0,0,0,.4-9l-3.2-3.4a6.83,6.83,0,0,0-9.4-.4l-.8.7A40,40,0,0,0,123.3,158.2Z"
//                 fill="#8ebc28"/>
//             <path
//                 d="M103.2,163.9h0c3.8.6,6.8-3,5.2-6.4h0a39.78,39.78,0,0,0-12.3-15l-.9-.7a6.87,6.87,0,0,0-9.4,1.1l-2.9,3.6a6.23,6.23,0,0,0,1.2,9l.9.7A40.6,40.6,0,0,0,103.2,163.9Z"
//                 fill="#8ebc28"/>
//             <path
//                 d="M118,156.9l-4.6-.1A2.33,2.33,0,0,0,111,159l-.3,10.7A2.26,2.26,0,0,0,113,172l4.6.1a2.33,2.33,0,0,0,2.4-2.2l.3-10.7A2.26,2.26,0,0,0,118,156.9Z"
//                 fill="#8ebc28"/>
//             <path
//                 d="M88.8,162.8s-9.9-8.9-28.1-1.7a1.11,1.11,0,0,0-.2,2l6.9,4.5-.7,6.4a1.23,1.23,0,0,0,2,1C72.4,171.6,80,165.5,88.8,162.8Z"
//                 fill="#8ebc28"/>
//             <path
//                 d="M138.3,164.4s10.1-8.7,28.1-.9a1.11,1.11,0,0,1,.2,2l-7.1,4.3.5,6.4a1.17,1.17,0,0,1-2,.9C154.4,173.6,147,167.3,138.3,164.4Z"
//                 fill="#8ebc28"/>
//     </svg>
// )


const LogoSpring2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.17 239.79" width="100%" height="100%"  style={{marginTop: 3}}>
        <path
            d="M128.3,44.1a21.9,21.9,0,0,0-24.1-19.4A22.2,22.2,0,0,0,87.3,36a5.9,5.9,0,0,0-.4.8h0a40.4,40.4,0,0,0-1.6,4.5c-4.4,16,.4,51.4.6,69.5v7.7c0,11.2-10.3,20.8-21.6,20.8s-22-9.5-22-20.7c.4-14,6.8-61.5.4-78.9h0A21.8,21.8,0,0,0,.1,46.3c-.2,1.8-.1,6.6,0,11.2h0c0,15.2,1,76.6,1,76.6,0,2.6.6,8,.6,8.2,4.4,27.3,28.1,41.7,61,41.7s59.5-14.7,64-42c0,0,.6-5.6.6-8.2.7-9.9,1-61.3,1-76.6h0C128.4,52.6,128.6,45.9,128.3,44.1Z"
            fill="#7ac943"/>
        <path
            d="M474.1,44.1A21.7,21.7,0,0,0,450,24.8,21.5,21.5,0,0,0,433.2,36a2,2,0,0,0-.4.8h0c-.6,1.5-1.2,3-1.7,4.5-4.3,16,.5,51.4.7,69.5v7.7c0,11.2-10.3,20.8-21.7,20.8s-22-9.5-22-20.7c.5-14,6.9-61.5.5-78.9h0a21.9,21.9,0,0,0-42.7,6.6c-.1,1.8,0,6.6,0,11.2h0c0,15.2,1.1,76.6,1.1,76.6,0,2.6.6,8,.6,8.2,4.4,27.3,28.1,41.7,60.9,41.7s59.5-14.7,64-42c0,0,.7-5.6.7-8.2.7-9.9,1-61.3,1-76.6h0C474.3,52.6,474.5,45.9,474.1,44.1Z"
            fill="#009245"/>
        <path
            d="M315.4,37.8a6.5,6.5,0,0,0-6.2-8.6H282a6.6,6.6,0,0,0-6.3,4.5l-22.9,70.1a6.5,6.5,0,0,1-6.2,4.6H211.4a6.7,6.7,0,0,1-6.6-6.6,6.5,6.5,0,0,1,.4-2L235.6,6a8.7,8.7,0,0,1,8.3-6h62.5A29.6,29.6,0,0,1,336,29.6V168a29.6,29.6,0,0,1-29.6,29.6H272.6a6.5,6.5,0,0,1-6.6-6.5,7.6,7.6,0,0,1,.3-2.1l14.4-44.2a6.5,6.5,0,0,1,6.2-4.5h16.2a6.7,6.7,0,0,0,6.3-4.6l6-18.7a6.5,6.5,0,0,0-6.2-8.6h-12a3.6,3.6,0,0,1-3.6-3.6,5.2,5.2,0,0,1,.2-1.1Z"
            fill="#009245"/>
        <path
            d="M236.3,140.3a3.5,3.5,0,0,1,3.6,3.5,4.3,4.3,0,0,1-.2,1.1l-14.8,45.8a10.1,10.1,0,0,1-9.5,7H168A29.6,29.6,0,0,1,138.4,168V29.6A29.6,29.6,0,0,1,168,0h19.4a6.7,6.7,0,0,1,6.7,6.7,6.4,6.4,0,0,1-.3,2L159.5,114a20.2,20.2,0,0,0,12.9,25.3,21.7,21.7,0,0,0,6.2,1Z"
            fill="#7ac943"/>
        <path
            d="M97,159.5a54.5,54.5,0,0,1,1-36.9,8.7,8.7,0,0,1,2.7-4.1c2.3-1.7,5.5-.6,7,1.6s1.9,5.1,2.1,7.9l1.7,17.6a34.8,34.8,0,0,1,6.7-26.1c2-2.5,5.5-5,7.7-3.1a5.3,5.3,0,0,1,1.4,2.8c2.6,10-1.3,21-5.1,31.2,4-11.2,8.7-23.3,18.6-29.7,1.2-.7,2.8-1.4,3.8-.5s.7,2.3.4,3.5a132.5,132.5,0,0,1-12.7,34.1,148.2,148.2,0,0,1,9.7-17.4c3.1-4.6,7.3-9.2,12.5-10a4,4,0,0,1,1.9.2c1.3.8.9,2.9.4,4.5a139.1,139.1,0,0,1-15.5,30.2c2.3-4.6,4.7-9.1,7.4-13.5s6.1-9.1,10.9-11.1a3.2,3.2,0,0,1,2.5-.4c2,.6,1.7,3.6,1,5.7-7.1,20.5-24.5,35.4-39.1,51.6"
            fill="#c13355"/>
        <path
            d="M97.2,159.5A58,58,0,0,1,96,131.7c.5-2.4,1.2-4.6,1.9-6.9s1.6-5.3,3.9-6.2a4.7,4.7,0,0,1,4.9,1.4c1.5,1.6,2,4.2,2.2,6.4.8,6.5,1.2,13,1.8,19.4l1.6-.4a33.5,33.5,0,0,1,3.5-20.7,24.2,24.2,0,0,1,3.8-5.8c1.1-1.2,3-2.7,4.7-2.5s2.5,3.4,2.8,5.2a36.4,36.4,0,0,1-.8,13.5,120.1,120.1,0,0,1-4.8,15.1l1.4.4c3.3-9.3,6.8-19.3,14.2-26.3L140,122a6.4,6.4,0,0,1,2.9-1.6c2.7-.5,1.4,3.6,1,5.1-1.3,5.1-2.9,10.3-4.7,15.3a137.1,137.1,0,0,1-7.6,16.5l1.3.9c2.4-4.9,4.9-9.9,7.7-14.5s4.9-7.6,8.4-10.2a12.3,12.3,0,0,1,5.3-2.5c1-.1,2.1-.1,2.3,1.1a4.6,4.6,0,0,1-.4,2.6,118.2,118.2,0,0,1-6.3,14.7,175.7,175.7,0,0,1-9.1,15.6l1.1.5c1.6-3.3,3.3-6.6,5.1-9.7a74.8,74.8,0,0,1,5.4-8.4,19.9,19.9,0,0,1,6.9-6c1.1-.6,2.8-1.2,3.5.2a5.2,5.2,0,0,1,0,3.7,51.1,51.1,0,0,1-4,9.3c-1.7,3.1-3.5,6-5.4,8.8A150.8,150.8,0,0,1,140,179.7c-5.4,5.9-10.9,11.6-16.2,17.5-.5.5.1,1.3.6.8,5-5.6,10.5-10.9,15.6-16.5a154.1,154.1,0,0,0,14.2-17,77.1,77.1,0,0,0,5.7-9.5c.9-1.7,1.6-3.3,2.3-5a28.4,28.4,0,0,0,1.7-4.9c.6-2.3.3-5.7-2.7-5.4a8.8,8.8,0,0,0-4.1,1.7,20.5,20.5,0,0,0-3.5,3,54.2,54.2,0,0,0-6.6,9.3,126.6,126.6,0,0,0-6.3,11.4c-.3.8.7,1.2,1.2.6a132.8,132.8,0,0,0,15.5-30.5c.5-1.6,1-4-.6-5a3.7,3.7,0,0,0-3.1-.2,13.1,13.1,0,0,0-2.8.9c-3.9,1.9-6.9,5.5-9.4,9.1a165,165,0,0,0-9.8,17.4c-.5.9.7,1.8,1.2.8a128,128,0,0,0,12.3-32.5c.5-1.9,1.5-4.9-.4-6.2s-4.1.6-5.7,1.7a36.9,36.9,0,0,0-10.2,12,121.4,121.4,0,0,0-7.4,17,.9.9,0,0,0,.5,1,1,1,0,0,0,1-.6c3.4-9.2,7-19.3,5.5-29-.3-2.2-.7-5.1-2.8-6.2s-3.7,0-5.3,1.1a19,19,0,0,0-4.5,5.3,37.7,37.7,0,0,0-3.4,7,35.4,35.4,0,0,0-1.7,17c.2,1.1,1.7.7,1.6-.3-.6-6.3-1.1-12.6-1.8-18.8a15.6,15.6,0,0,0-2.2-7.1,6.3,6.3,0,0,0-5-2.6c-2.5,0-4.3,1.7-5.3,4a39.1,39.1,0,0,0-2.6,7.5,53.8,53.8,0,0,0-1.8,14.9,46.3,46.3,0,0,0,3.2,16.2c0,.2.3.1.3-.1Z"
            fill="#c13355"/>
        <path
            d="M92.9,146.6c-1.5,10.2-2.7,20.7-.4,30.4s8.6,18.7,18,21.1,19.4-2.1,26.8-9.2,12.2-16.3,16.3-25.6c1.9-4.2,3.7-8.6,3.2-13s-4-8.6-8.3-7.9c-2.6.5-4.8,2.4-6.6,4.4a69.7,69.7,0,0,0-14.2,21.3,88.1,88.1,0,0,0,9.1-26.1,14.6,14.6,0,0,0,0-7.2c-.7-2.2-2.7-4.1-5-3.8s-4.1,2.3-5.5,4.3a102.2,102.2,0,0,0-13.5,25.5c3.2-11.2,6.3-23.4,2.4-33.6-2.9-.2-5.1,2.8-6.5,5.5a68.4,68.4,0,0,0-7,23.9,86.4,86.4,0,0,0-.8-21c-.3-2.1-1-4.4-2.8-4.9s-5.2,2.9-6.2,5.9a79.9,79.9,0,0,0-3.5,31.7c.9,9.8,3.9,19.5,10.4,26.1s17.1,9.5,26,5.2a32.9,32.9,0,0,0,9.6-7.5,71.8,71.8,0,0,0,11.2-15.6"
            fill="#e24076"/>
        <path
            d="M92.3,146.6c-2.1,12.2-3.8,25.4.8,36.7a28.7,28.7,0,0,0,10.1,13.1,21.8,21.8,0,0,0,15.6,3.5,33.1,33.1,0,0,0,15-6.3A50.9,50.9,0,0,0,146.9,179a89.8,89.8,0,0,0,5.3-9.6c1.5-3.1,2.9-6.2,4.1-9.3,2.1-5.4,3-11.7-.8-16.1a7.4,7.4,0,0,0-6.5-2.9c-2.9.3-5.4,2.2-7.4,4.3a68.8,68.8,0,0,0-12.7,17.5c-.8,1.5-1.6,3.1-2.3,4.7a1.1,1.1,0,0,0,2,.9,87.1,87.1,0,0,0,6.6-15.4,79.4,79.4,0,0,0,2.2-8,38.6,38.6,0,0,0,1-7.5,8.4,8.4,0,0,0-2.4-6.3,5.4,5.4,0,0,0-6.2-1c-2.1,1.1-3.6,3.2-5,5.1s-3.2,4.8-4.7,7.3a119.2,119.2,0,0,0-8.4,17.7l2.1.7c2.5-8.9,5.1-18.2,4.1-27.2a25.9,25.9,0,0,0-1.7-7.3,1,1,0,0,0-.9-.6c-4.2-.2-6.7,4.4-8.3,7.8a67.5,67.5,0,0,0-5,14.3,60.3,60.3,0,0,0-1.4,8.5h2.2a94,94,0,0,0-.2-17.6c-.3-2.7-.5-5.9-2.1-8a4.1,4.1,0,0,0-6-.6,11.5,11.5,0,0,0-3.5,5.4,56.1,56.1,0,0,0-2.3,8,76.6,76.6,0,0,0-2,17c-.2,10.8,1.7,21.8,7.5,30.4s14.1,13,23.7,11.8a20.9,20.9,0,0,0,6.9-1.9,27.5,27.5,0,0,0,7.3-4.9,66.5,66.5,0,0,0,12-15c.8-1.4,1.6-2.8,2.3-4.2a.9.9,0,0,0-.2-1.3.9.9,0,0,0-1.3.3,57.1,57.1,0,0,1-5.1,7.7,81.3,81.3,0,0,1-5.8,7.1c-3.6,3.8-7.7,7.3-12.6,8.6-8.2,2.3-16.9-1-22.2-6.9s-8.9-16.8-9.6-26.4a78.6,78.6,0,0,1,1.9-23.6,44.4,44.4,0,0,1,2.1-7.1c.6-1.4,1.8-3.2,3.2-3.6a2,2,0,0,1,2,1,9.1,9.1,0,0,1,1,3.3,89.8,89.8,0,0,1,1,16.4c-.1,1.4-.1,2.7-.2,4.1a1,1,0,0,0,1,1.1,1.3,1.3,0,0,0,1.2-1.1,65.8,65.8,0,0,1,5.4-20.2,30,30,0,0,1,2.8-5.3c1-1.4,2.3-2.8,4.1-2.8l-1-.6c3,7.9,1.7,17-.4,25.4-.6,2.4-1.3,4.9-2,7.3a1.1,1.1,0,0,0,.8,1.4,1.2,1.2,0,0,0,1.3-.7,108.5,108.5,0,0,1,6.7-14.7c1.3-2.3,2.7-4.5,4.2-6.7a34.8,34.8,0,0,1,4.3-5.8c1.3-1.3,2.9-2.2,4.6-1.3a5.4,5.4,0,0,1,2.5,4.7,25.8,25.8,0,0,1-.8,6.8c-.5,2.5-1.1,4.9-1.8,7.3a86.9,86.9,0,0,1-6.7,16.1l2,.9A69.1,69.1,0,0,1,139.5,151c1.1-1.3,2.2-2.5,3.4-3.7a18.7,18.7,0,0,1,3-2.6,5.8,5.8,0,0,1,6.2-.3,8,8,0,0,1,3.4,5.3,14.9,14.9,0,0,1-.9,7.8A63.7,63.7,0,0,1,151,166c-1.4,3-3,6-4.7,8.9a55.4,55.4,0,0,1-12,14.8,32.7,32.7,0,0,1-13.2,6.8,20.4,20.4,0,0,1-13.8-1.2,25.1,25.1,0,0,1-10.6-10.8c-5.4-10-4.8-22.1-3.8-33.6.2-1.4.3-2.9.5-4.3s-1-.7-1.1,0Z"
            fill="#e24076"/>
        <path
            d="M103.6,202.1a71.9,71.9,0,0,0,4.8-27.7,6.5,6.5,0,0,0-.7-3.4,2.1,2.1,0,0,0-2.8-.9,2.9,2.9,0,0,0-1.3,1.4,15.2,15.2,0,0,0-1.5,6.6,100.4,100.4,0,0,0,1.1,23.9Z"
            fill="#2f7057"/>
        <path
            d="M104.1,202.3a74.4,74.4,0,0,0,4.8-27.8c0-1.8-.2-4-1.9-4.9a2.5,2.5,0,0,0-2.4,0,4.8,4.8,0,0,0-1.8,2.4,17.9,17.9,0,0,0-1.3,6.8c-.1,2.4-.2,4.8-.2,7.3a106.9,106.9,0,0,0,1.4,16c0,.2.1.3.3.4h.4a.6.6,0,0,0,.7-.4c.1-.2,0-.6-.3-.6l-.4-.2.3.4a108.4,108.4,0,0,1-1.3-12.9v-6.8a48.7,48.7,0,0,1,.5-6.5,11.8,11.8,0,0,1,.8-3.1c.3-.9,1-2.2,2.1-2.1s2.1,2.9,2.1,4.5a71.8,71.8,0,0,1-4.7,27,.6.6,0,0,0,.5.6Z"
            fill="#2f7057"/>
        <path
            d="M102.2,201.7l.6.2A62.9,62.9,0,0,0,85.5,178c-.7-.6-1.5-1.1-2.3-.7s-.8,2-.3,2.9c1.8,4.3,5.2,7.4,8.3,10.6s6.7,6.9,9.9,10.5Z"
            fill="#2f7057"/>
        <path
            d="M102,202.2l.6.2a.6.6,0,0,0,.6-.4c.1-.2.1-.3,0-.4a64.3,64.3,0,0,0-15-21.9l-2.4-2.2a3.3,3.3,0,0,0-2.1-.9c-2.2.3-1.8,2.9-1.2,4.2,1.9,4.1,5,7.1,8.1,10.2l5.7,5.8,2.8,3,1.3,1.5a1.5,1.5,0,0,0,.6.5l1,.4c.6.2.9-.8.4-1.1a2.4,2.4,0,0,1-1.3-.7l-1.1-1.2-2.2-2.4c-1.5-1.7-3.1-3.2-4.6-4.8s-5.9-5.6-8.2-9c-.5-.7-3.1-4.5-1.5-5.3s1.6.6,2,1l2.3,2a64.1,64.1,0,0,1,14.4,21.4l.7-.7-.6-.2a.6.6,0,0,0-.6.5A.5.5,0,0,0,102,202.2Z"
            fill="#2f7057"/>
        <path
            d="M103.2,202c4.9-2.5,9.1-6.3,13.1-10.2s7.4-7.9,8.3-13a2.5,2.5,0,0,0-.1-1.2c-.4-.7-1.4-.5-2.2-.1s-4,3.3-5.6,5.4l-14.4,18.9Z"
            fill="#2f7057"/>
        <path
            d="M103.4,202.5a46.5,46.5,0,0,0,10.8-8c3.2-3,6.5-6.2,8.8-10.1a15.5,15.5,0,0,0,2.1-5.9,1.4,1.4,0,0,0-1.1-1.8,3.6,3.6,0,0,0-2.5.6,16.8,16.8,0,0,0-4.5,4.3l-4.5,5.9c-3.5,4.7-7.1,9.3-10.6,13.9a.6.6,0,0,0,.2.8h.1l.8.3a.6.6,0,0,0,.7-.4.5.5,0,0,0-.3-.7l-.9-.3.3.8,8.4-11,4.2-5.6c1.3-1.7,2.6-3.4,4-5a13,13,0,0,1,2.2-1.9c.6-.4,2.4-1.5,2.6-.2a9.5,9.5,0,0,1-.7,2.9,16.9,16.9,0,0,1-1.3,2.7c-2,3.6-5.1,6.5-8,9.3a45.6,45.6,0,0,1-11.2,8.4C102.4,201.8,102.8,202.8,103.4,202.5Z"
            fill="#2f7057"/>
        <path
            d="M101.5,201.7c1.7,1.7,4.5,1.8,7,1.8h9.3a51.4,51.4,0,0,0,11.7-1,20.5,20.5,0,0,0,10.6-5.5,2.3,2.3,0,0,0,.8-2c-.2-.9-1.5-.9-2.5-.6L105.8,202"
            fill="#2f7057"/>
        <path
            d="M101.2,201.9c1.6,1.9,4.2,2.1,6.5,2.1h8.7c5.1,0,10.4,0,15.5-1.6a21,21,0,0,0,6.5-3.3c1.2-.9,4.2-3.2,2.6-4.8a2.9,2.9,0,0,0-2.7-.4l-4.3,1-8.7,2.1c-6.5,1.5-13,2.9-19.6,4.6-.2,0-.4.3-.3.6a.4.4,0,0,0,.5.3c5.3-1.1,10.5-2.4,15.8-3.7l15.9-3.7c.6-.2,3-.9,2.9.4s-1.5,1.9-2.2,2.4a17.7,17.7,0,0,1-6,3.3c-4.6,1.6-9.5,1.7-14.3,1.8h-8.6c-2.8,0-5.6.1-7.8-1.5-.2,0-.3,0-.4.2v.3Z"
            fill="#2f7057"/>
        <path
            d="M134.8,186.1l-.9-.3c-2.1,0-4.1,1.3-5.9,2.4-7.9,5.1-15.9,9.7-24.1,14l.7.2,2.7-.6c9.6-2.9,19.7-6.1,26.9-13.5C134.8,187.7,135.3,186.6,134.8,186.1Z"
            fill="#2f7057"/>
        <path
            d="M135.1,185.6a3.6,3.6,0,0,0-2.7-.1,10.2,10.2,0,0,0-2.7,1.1c-2,1.1-3.9,2.4-5.8,3.6-4.2,2.6-8.5,5.1-12.8,7.5l-7.5,4a.6.6,0,0,0-.2.7c0,.2.1.2.3.3l1.1.2,1-.2,1.8-.5c2.8-.8,5.6-1.6,8.3-2.6a51.6,51.6,0,0,0,15.1-7.8,26.6,26.6,0,0,0,3.5-3.2c.8-.8,1.4-2,.6-2.9s-1.2.3-.8.8-1.2,2.1-1.6,2.5a36.1,36.1,0,0,1-3,2.5,41.4,41.4,0,0,1-6.7,4.1,99.9,99.9,0,0,1-14.7,5.4l-2.3.6-1.1.2c-.4.1-.4,0-.9-.1v1q12.4-6.4,24.3-14.1l2.7-1.5c.9-.4,2.6-1.1,3.4-.6a.6.6,0,0,0,.8-.1A.8.8,0,0,0,135.1,185.6Z"
            fill="#2f7057"/>
        <path
            d="M102.5,199.7c.2.4-.6.4-.9.1-5.2-5.6-7.8-13.3-10.3-20.7-.8-2.5-1.7-5.3-.5-7.8a4.6,4.6,0,0,1,2.4,2.7,122.3,122.3,0,0,1,5.7,14.1l4.1,11.2"
            fill="#2f7057"/>
        <path
            d="M102.4,199.7c0,.3-.6-.1-.7-.2l-.4-.6-.9-1.2c-.6-.9-1.2-1.8-1.7-2.7a37.1,37.1,0,0,1-2.9-5.6,117.2,117.2,0,0,1-4.4-11.7,9.1,9.1,0,0,1-.1-6.3l-.7.4c1.2.4,1.8,1.8,2.3,2.8s1,2.2,1.5,3.3,1.9,4.7,2.7,7.1,1.7,4.8,2.6,7.2a73.4,73.4,0,0,0,2.7,7.4c.2.6,1.4.2,1.2-.5a61.3,61.3,0,0,0-2.2-6l-2.2-6c-1.4-3.9-2.9-7.7-4.6-11.4-.8-1.9-1.7-4.2-3.6-5.1a.7.7,0,0,0-.7.4,9.1,9.1,0,0,0-.2,6.3c.6,2.3,1.5,4.5,2.2,6.7a55.2,55.2,0,0,0,6.5,13.1,12,12,0,0,0,2.6,2.9c.3.2,1.4.4,1.2-.4s-.2-.1-.2.1Z"
            fill="#2f7057"/>
        <path
            d="M103.8,198c5.7-8.3,6.3-19.1,11.5-27.7.5-.6,1.1-1.4,1.8-1.2a3.1,3.1,0,0,1,0,2.3,107.7,107.7,0,0,1-10.6,24.7"
            fill="#2f7057"/>
        <path
            d="M104,198.1c5.2-6.7,6.4-15.5,9.6-23a25.3,25.3,0,0,1,1.6-3.3c.3-.5,1-2.3,1.7-2.1l-.3-.3c.4.8-.1,2.1-.4,3l-1.2,3.5c-.8,2.3-1.6,4.6-2.5,6.8s-2,4.5-3.1,6.7-2.4,4.3-3.4,6.6c-.3.5.6.9.9.4a44.2,44.2,0,0,0,3.4-6c1.1-2,2-4,2.9-6.1a87.4,87.4,0,0,0,4.6-13,3.9,3.9,0,0,0,0-2.4,1.2,1.2,0,0,0-1.7-.3h0a4.9,4.9,0,0,0-1.6,1.9c-.5.8-.9,1.7-1.4,2.6a82.8,82.8,0,0,0-4.2,11.8,63,63,0,0,1-5.2,13c0,.1,0,.2.1.2Z"
            fill="#2f7057"/>
    </svg>
)

/** LOGO **/
const Logo = memo( ( { min } ) => {
    return min ? <LogoEditor/> :
        // ↓ ↓ ↓ Основной логотип на сайте меняется ниже ↓ ↓ ↓
        <LogoSpring2/>
});

export default Logo;
