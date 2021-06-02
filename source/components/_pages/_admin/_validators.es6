
import { toast } from '__TS/libs/tools';

// Валидация
const universalValidation = (data, validata) => {
    if (!data || !data.length) return false;

    let errorData = [];
    data.map((parameter, i)=>{
        errorData[i] = validateFormField(parameter, validata);
    });
    errorData = errorData.filter((item)=> item);

    if (errorData.length) {
        toast.error('Ошибка валидации на клиенте', {
            autoClose: 3000
        });
        return errorData;
    } else return false;
};

const validateFormField = (param, validata) => {
    let errorData = {};
    validata.map((val) => {   // если отсутствует необходимое поле в данных, то собираем объект с текстом ошибки и id
        if (!param[val[0]]) errorData[val[0]] = val[1] || 'Необходимо заполнить';
    });
    if ( Object.keys(errorData).length ) {
        errorData.id = param.id;
        return errorData;
    } else return false;
};


// Валидация создания/изменения полей опции
export const validateCreateProductOptionParameter = (data) => {
    const VALIDATA = [
        ['optionSlug', 'Необходимо выбрать тип'],
        ['name'],
        ['description'],
        ['technicalDescription'],
    ];
    return universalValidation(data, VALIDATA);
};

// Валидация создания/изменения полей формата в админке продукта
export const validateProductFormat = (data) => {
    if (!data) return false;
    const VALIDATA = [
        // ['type'],
        ['name'],
        ['width'],
        ['height'],
    ];
    return universalValidation(data, VALIDATA);
};

// Валидация создания/изменения полей формата в админке продукта
export const validateProductInfo = (data) => {
    if (!data) return false;
    data.productInfo = data.productInfo && data.productInfo.length && data.productInfo || [];
    data.productImages = data.productImages && data.productImages.length && data.productImages || [];

    const productInfoErrors =  universalValidation(data.productInfo, [ ['description']]);
    const productImagesErrors =  universalValidation(data.productImages, [['url', 'Отсутствует изображение']]);

    // собираем ошибки
    let validateProductInfoErrors = {
        name: !data.name && 'Необходимо заполнить',
        description: !data.description && 'Необходимо заполнить',
        productSlug: !data.productSlug && 'Необходимо выбрать',
        // productGroup: !data.productGroup && 'Необходимо выбрать',
        productInfo: productInfoErrors,
        productImages: productImagesErrors,
    };

    if (Object.values(validateProductInfoErrors).filter((item)=>item).length) {
        // Если была ошибка в productInfo, то тостер не показываем, так как он уже показался в universalValidation
        if (!validateProductInfoErrors.productInfo) toast.error('Ошибка валидации на клиенте', {
            autoClose: 3000
        });
        return validateProductInfoErrors;
    } else {
        return false; // если ошибок нет, возвращаем false
    }
};
// Валидация создания/изменения полей формата в админке продукта
export const validateOption = (data) => {
    if (!data) return false;

    // собираем ошибки
    let validateOptionErrors = {
        name: !data.name && 'Необходимо заполнить',
        description: !data.description && 'Необходимо заполнить',
    };

    if (Object.values(validateOptionErrors).filter((item)=>item).length) {
        // Если была ошибка в productInfo, то тостер не показываем, так как он уже показался в universalValidation
        toast.error('Ошибка валидации на клиенте', {
            autoClose: 3000
        });
        return validateOptionErrors;
    } else {
        return false; // если ошибок нет, возвращаем false
    }
};
