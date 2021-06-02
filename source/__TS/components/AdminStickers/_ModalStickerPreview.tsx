// @ts-ignore
import React, {useState, useEffect, memo} from 'react';
import {createPortal} from "react-dom";
// @ts-ignore
import {useSelector, useDispatch} from "react-redux";

// @ts-ignore
import {TYPES} from 'const/types';

import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import {Input, Btn, Checkbox} from 'components/_forms';

// @ts-ignore
import Modal from 'components/Modal';

import {StickerPreviewWrap, StickerTypeText} from '__TS/styles/admin';
import {Isticker} from "../../interfaces/admin/adminStickers";
import {
    updateStickersAction,
    deleteStickerAction,
} from "../../actions/admin/adminStickers";




/** Interfaces */
interface ImodalStickerPreview {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    showMoveStickerAction: (idList: string[])=>any;     // экшен перенести стикер
    data: Isticker
}



/**
 * Модалка просмотра стикера
 */
const ModalStickerPreview: React.FC<ImodalStickerPreview> = ({data, isOpen, closeCallback, showMoveStickerAction}) => {
    if (!isOpen) return null;

    const [footer, setFooter] = useState([]);

    useEffect(()=>{
        data && setFooter([
            // {type: TYPES.BTN, text: 'Заменить файл', action: onChangeFileHandler},
            {type: TYPES.BTN, text: 'В другой набор...', action: onMoveStickerHandler},
            {type: TYPES.COMPONENT, component: <Checkbox label={'Сохранять пропорции'} checked={data.constrainProportions} onChange={onChangeConstrainProportions}/>},
            {type: TYPES.DIVIDER},
            {type: TYPES.COMPONENT, component: <StickerTypeText isSVG={!!data.svg}>{data.svg ? 'SVG' : 'PNG'}</StickerTypeText>},
            {type: TYPES.BTN, text: 'Удалить', action: onRemoveStickerHandler},
        ])
    }, [data]);


    const onChangeConstrainProportions = (constrainProportions) => {
        updateStickersAction({
            id: data.id,
            data: {constrain_proportions: constrainProportions}
        });
        // closeCallback();
    };

    const onMoveStickerHandler = () => {
        showMoveStickerAction([data && data.id]);
        closeCallback();
    };
    const onRemoveStickerHandler = () => {
        deleteStickerAction({id: data.id, stickerSetId: data.stickerSet});
        closeCallback();
    };

    return createPortal(

            // @ts-ignore
            <Modal size={'lg'} title={'Просмотр стикера'} isOpen={isOpen} action={closeCallback} footer={footer}>
                {(!data || !data.id) ?
                    <Spinner fill size={50}/>
                    :
                    <StickerPreviewWrap>
                        {
                            data.svg ?
                                <div dangerouslySetInnerHTML={{__html: data.svg}} className="svgWrap"/>
                                :
                                data.srcMedium ? <div className="imgWrap" style={{backgroundImage: `url(${data.srcMedium})`}}/> : null

                            // <ImageLoader className="itemImage" src={src} showLoader={disabled} light/>
                        }
                    </StickerPreviewWrap>
                }
            </Modal>
        ,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalStickerPreview);



