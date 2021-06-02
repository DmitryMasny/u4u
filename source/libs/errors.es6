import { toast } from '__TS/libs/tools';

/**
 * Показать тостер с ошибкой
 */

export const showServerError = () => {
    toast.error('Ошибка сервера. Попробуйте повторить позже', {
        autoClose: 5000
    });
};

export const showBadPromocodeError = () => {
    toast.error('В корзине нет продуктов, к которым возможно применить данный промокод', {
        autoClose: 5000
    });
};
