
// @ts-ignore
import {productGetName, getOptionCategoryName} from 'libs/helpers';



/**
 * Адаптер на получение коллекции (товара магазина) в админке
 */
export const getProductSetAdminAdapter: (response: any)=>any = (response) => {
    return {
        ...response,
        products: response.products.map((p) => {
            const {totalCost, formatedOptions} = constructLayoutOptionsForAdmin(p.layoutData.options, p.productSlug);
            return{
                id: p.layoutId,
                name: p.userTitle,
                productType: productGetName(p.productSlug),
                format: p.layoutData.format,
                preview: p.layoutData.preview,
                options: formatedOptions,
                cost: `${totalCost}руб.`,
                useForPreview: response.previewFrom === p.layoutId
            }
        })
    }
};

export const getProductSetAdapter: (response: any)=>any = (response) => {
    /**
     * Адаптер на получение коллекции магазина
     */
    const {id, name, category, previewFrom, designedBy, updatedAt} = response;
    let productsFormated = {};
    let defaultProduct = {};
// console.log('response.products',response.products);

    for (let i=0; i < response.products.length; i++) {
        const p = response.products[i];
        if (p.layoutId === previewFrom) defaultProduct = p;
        productsFormated[p.productSlug] = {
            id: p.productSlug,
            name: productGetName(p.productSlug),
            formats: {
                ...(productsFormated[p.productSlug] && productsFormated[p.productSlug].formats || {}),
                [p.formatSlug]: {
                    ...(productsFormated[p.productSlug] && productsFormated[p.productSlug].formats[p.formatSlug] || {}),
                    id: p.formatSlug,
                    format: p.layoutData.format,
                    preview: p.layoutData.preview,
                    options: productsFormated[p.productSlug] && productsFormated[p.productSlug].formats[p.formatSlug] &&
                    productsFormated[p.productSlug] && productsFormated[p.productSlug].formats[p.formatSlug].options || {}
                }
            }
        };

        for (let j = 0; j < p.layoutData.options.length; j++) {
            const opt = p.layoutData.options[j];
            productsFormated[p.productSlug].formats[p.formatSlug].options = {
                ...(productsFormated[p.productSlug].formats[p.formatSlug].options || {}),
                [opt.name]: [
                    ...(productsFormated[p.productSlug].formats[p.formatSlug].options[opt.name] || []),
                    {
                        ...opt,
                        layoutId: p.layoutId,
                        laminable: opt.name === 'paper' && p.layoutData.options.some((o)=>o.name === 'LAMINATION')
                    }
                ]
            };
        }
    }
    // Object.keys(productsFormated).map((productType)=>{
    //     productsFormated[productType] = {}
    // });

    return {
        ...{id, name, category, previewFrom, designedBy, updatedAt, defaultProduct},

        products: productsFormated
    }

};


/**
 * Адаптер на получение новых продуктов для добавления в коллекцию дизайнера
 */
export const userProductDataAdapter: (layoutData: any)=> any = (layoutData)=> {
    if (!layoutData) return null;
    if (layoutData.error) return [];

    return layoutData.length && layoutData.map((p)=>{
        if (!p.options) return null;
        const {totalCost, formatedOptions} = constructLayoutOptionsForAdmin(p.options, p.productSlug);
        return{
            id: p.id,
            name: p.userTitle,
            productType: productGetName(p.productSlug),
            format: p.format,
            preview: p.preview,
            options: formatedOptions,
            cost: `${totalCost}руб.`,
        }
    }).filter((x)=>x) || [];
};

/**
 * Генерация текста о стоимости и текста опций
 */
const constructLayoutOptionsForAdmin: (options: any, productSlug: any) => any = (options, productSlug) => {
    if (!options || !options.length) return null;

    let totalCost = 0;
    const formatedOptions = options.map((o) => {
        if (o.price) totalCost += o.price;
        return {label: getOptionCategoryName(o.name, productSlug), value: o.optionName || o.nameSelected}
    });

    return {totalCost, formatedOptions}
};