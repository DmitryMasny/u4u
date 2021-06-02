import { GENERATE_LAYOUT } from 'const/actionTypes';

//action на запуск получения token
export const generateLayoutAction = ( theme, product ) => {
    const id = theme.id;
    const params = {
        binding_type:  product.bindingType,
        cover_type:  `${product.coverType.toUpperCase()}_COVER`,
        cover_lamination_types: product.coverLaminationType,
        paper_type: 'mat',
        paper_density: 170
    };

    return {
        type: GENERATE_LAYOUT,
        payload: {
            ...params,
            urlParams: [id, 'generate-layout'],
            actions: {
                inSuccess: ( data ) => {
                    if (data.response && data.response.hash) {
                        window.location.assign('/redaktor/#' + data.response.hash + '/');
                    }
                },
                inFail: ()  => ({ type: 0 })
            }
        }
    }
};