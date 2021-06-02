import { store } from "components/App";
import {
    GIFT_CARD_SET,
} from "const/actionTypes";
import { toast } from '__TS/libs/tools';

//получаем диспетчер Redux
const dispatch = store.dispatch;


/**
 * Экшены
 */
export const sendGiftCardToServerAction = (data, callback) => {

    return dispatch({
        type: GIFT_CARD_SET,
        payload: {
            ...data,
            actions: {
                inSuccess: ({response}) => {
                    callback && callback(response);
                },
                inFail: (err)  => {
                    toast.error( 'Ошибка при покупке сертификата', {
                        autoClose: 10000
                    } );
                    callback && callback(err);
                }
            }
        }
    } );
};
