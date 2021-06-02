// @ts-ignore
import React, {useState, useEffect, memo} from 'react';
// @ts-ignore
import {createPortal} from "react-dom";

// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';


// @ts-ignore
import {Checkbox} from 'components/_forms';

// @ts-ignore
import Modal from 'components/Modal';

// @ts-ignore
import {BackgroundPreviewWrap} from '__TS/styles/admin';
import {Ibackground, IBackgroundConfig} from "../../interfaces/admin/adminBackgrounds";
import {
    updateBackgroundsAction,
    deleteBackgroundAction,
} from "../../actions/admin/adminBackgrounds";




/** Interfaces */
interface ImodalBackgroundPreview {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    showMoveBackgroundAction: (idList: string[])=>any;     // экшен перенести стикер
    data: Ibackground;
    config: IBackgroundConfig;
}



/**
 * Модалка просмотра фона
 */
const ModalBackgroundPreview: React.FC<ImodalBackgroundPreview> = ({data, isOpen, closeCallback, showMoveBackgroundAction, config}) => {
    if (!isOpen) return null;

    const [footer, setFooter] = useState([]);
    const [repeatBackground, setRepeatBackground] = useState(data.repeatBackground || false);

    const onChangeBackgroundAction = () => {
        updateBackgroundsAction({
            id: data.id,
            data:{
                is_pattern: !repeatBackground
            }, config: config
        });
        setRepeatBackground(!repeatBackground);
    }

    useEffect(()=>{
        data && setFooter([
            // {type: TYPES.BTN, text: 'Заменить файл', action: onChangeFileHandler},
            {type: TYPES.BTN, text: 'В другой набор...', action: onMoveBackgroundHandler},
            {type: TYPES.COMPONENT, component: <Checkbox label={'Повторять как узор'} checked={data.repeatBackground} onChange={onChangeBackgroundAction}/>},
            {type: TYPES.DIVIDER},
            // {type: TYPES.COMPONENT, component: <BackgroundTypeText isSVG={!!data.svg}>{data.svg ? 'SVG' : 'PNG'}</BackgroundTypeText>},
            {type: TYPES.BTN, text: 'Удалить', action: onRemoveBackgroundHandler},
        ])
        setRepeatBackground(data.repeatBackground);
    }, [data]);


    // const onChangeConstrainProportions = (constrainProportions) => {
    //     updateBackgroundsAction({
    //         id: data.id,
    //         data: {constrain_proportions: constrainProportions}
    //     });
    //     // closeCallback();
    // };

    const onMoveBackgroundHandler = () => {
        showMoveBackgroundAction([data && data.id]);
        closeCallback();
    };
    const onRemoveBackgroundHandler = () => {
        deleteBackgroundAction(data.id, data.backgroundSet);
        closeCallback();
    };

    return createPortal(

            // @ts-ignore
            <Modal size={'lg'} title={'Просмотр фона'} isOpen={isOpen} action={closeCallback} footer={footer}>
                {(!data || !data.id) ?

                    <Spinner fill size={50}/>
                    :
                    <BackgroundPreviewWrap src={data.src} repeatBackground={repeatBackground}/>
                }
            </Modal>
        ,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalBackgroundPreview);



