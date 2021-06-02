const deliveryLocalStorageName = 'u4u_delivery_info';

export const setDeliveryInfoToLocalStorage = ( data ) => {
    const d = new Date();
    localStorage.setItem( deliveryLocalStorageName, JSON.stringify( {
                                                                        data,
                                                                        time: d.getTime()
                                                                    } ) );
};

export const getDeliveryInfoToLocalStorage = ( { id, totalCost } ) => {
    const data = localStorage.getItem( deliveryLocalStorageName );
    if ( data ) {
        try {
            const objData = JSON.parse( data );
            const d = new Date();
            //если разница во времени меньше 3х часов
            if ( ((((d.getTime() - objData.time) / 1000) / 60) / 60) < 3 && objData.data.id === id && objData.data.totalCost === totalCost ) {
                objData.data.localStorageChecked = true;
                return objData.data
            } else {
                return { type: objData.data.type, localStorageChecked: true }
            }
        } catch ( e ) {
            console.error( `Error parse JSON delivery data from localStorage ${deliveryLocalStorageName}`, e );
        }
    }

    return { localStorageChecked: true };
};
