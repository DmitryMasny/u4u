// Аналог jsx modalSimplePreview без поддержки старых фотокниг

// /** Libs */
// // @ts-ignore
// import React, {useEffect, memo} from 'react';
// // @ts-ignore
// import {useSelector} from "react-redux";
//
// import styled from 'styled-components';
// // @ts-ignore
// import { hexToRgbA } from "libs/helpers";
// // @ts-ignore
// import {COLORS} from 'const/styles';
//
// // @ts-ignore
// import {IconClose} from 'components/Icons';
// // @ts-ignore
// import {Btn} from 'components/_forms';
// // @ts-ignore
// import Spinner from 'components/Spinner';
// // @ts-ignore
// import {useKeyPress} from "libs/hooks";
//
// // @ts-ignore
// import PosterPreview from "components/_pages/ProductPage/Poster/PosterPreview";
//
//
// /** Selectors */
// import { modalAdminThemePreviewSelector } from // @ts-ignore
//         '__TS/selectors/modals';
//
// /** Actions */
// import { modalAdminThemePreviewAction } from // @ts-ignore
//         '__TS/actions/modals';
//
// /** Interfaces */
// interface IModalAdminThemePreview {
//
// }
// interface ImodalData {
//     id: string;
//     name?: string;
//     svgPreview?: string;
//     formatWidth?: number;
//     formatHeight?: number;
//     actions?: ImodalBtn[];
// }
// interface ImodalBtn {
//     action: any;
//     title?: string;
//     closeModal?: boolean;
// }
//
// /** Styles */
// const SimpleModal = styled('div')`
//     position: fixed;
//     height: 100%;
//     width: 100%;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background-color: ${hexToRgbA(COLORS.BLACK, .7)};
//     z-index: 1;
//     .block {
//         position: absolute;
//         text-align: center;
//         top: 70px;
//         left: 30px;
//         right: 30px;
//         bottom: 80px;
//         //pointer-events: none;
//     }
//     .header {
//         position: absolute;
//         display: flex;
//         align-items: center;
//         padding: 5px 20px;
//         top: 0;
//         right: 0;
//         left:0;
//         height: 68px;
//         font-size: 21px;
//         color: #fff;
//         background-color: ${hexToRgbA(COLORS.BLACK, .5)};
//     }
//
//     .closeBtn {
//         position: absolute;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         top: 0;
//         right: 0;
//         fill: #fff;
//         height: 68px;
//         width: 68px;
//         background-color: transparent;
//         transition: background-color .2s ease-out;
//         cursor: pointer;
//         &:hover {
//           background-color: ${hexToRgbA(COLORS.BLACK, .5)};
//         }
//     }
//     .btnBlock {
//         position: absolute;
//         bottom: 15px;
//         right: 10px;
//         left: 10px;
//         display: flex;
//         justify-content: center;
//         .btnBlockInner {
//             display: flex;
//             align-items: center;
//             background-color: ${hexToRgbA(COLORS.BLACK, .5)};
//             border-radius: 30px;
//             height: 60px;
//         }
//         .btn {
//             margin: 0 5px;
//             height: 50px;
//             border-radius: 25px;
//         }
//     }
// `;
//
// /**
//  * Модалка загрузки стикеров
//  */
// const ModalAdminThemePreview: React.FC<IModalAdminThemePreview> = () => {
//
//     const modalData:ImodalData = useSelector(modalAdminThemePreviewSelector);
//     const escapePress = useKeyPress(27);
//
//     useEffect(() => {
//         if (escapePress && closeModal) closeModal();
//     },[escapePress]);
//
//     console.log('modalData',modalData);
//
//     const closeModal = () => {
//         modalAdminThemePreviewAction();
//     };
//     const modalActionHandler = ({action, close}) => {
//         action && action(modalData.id);
//         close && closeModal();
//     };
//
//
//     return modalData && <SimpleModal>
//         {modalData.name && <div className={"header"}>
//             {modalData.name}
//         </div>}
//         <div className="block">
//             { modalData && modalData.svgPreview ?
//                 <PosterPreview
//                     svg={modalData.svgPreview}
//                     size={{h: modalData.formatHeight, w: modalData.formatWidth}}
//                     options={modalData}
//                     inModal
//                 />
//                 : null
//             }
//         </div>
//         <div className={"closeBtn"} onClick={closeModal}>
//             <IconClose size={48}/>
//         </div>
//
//         { modalData.actions && <div className={"btnBlock"}>
//             <div className="btnBlockInner">
//                 {modalData.actions.map((btn, i) =>
//                     <Btn className={"btn"}
//                          onClick={() => modalActionHandler({action: btn.action, close: btn.closeModal})}
//                          key={i}>
//                         {btn.title || null}
//                     </Btn>)}
//             </div>
//         </div>}
//     </SimpleModal> || <SimpleModal><Spinner fill/></SimpleModal>;
// };
//
// export default memo(ModalAdminThemePreview);