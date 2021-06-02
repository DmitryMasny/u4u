import React from 'react';

import { Input } from "components/_forms";

import s from './MyProductsPage.scss';
import TEXT_MY_PRODUCTS from 'texts/my_products';


/**
 * Название продукта
 */
const ProductName = ({editable, orderId, id, type, name, productName, onChange, prefix}) => {

    const onChangeT = ( x ) => {
        onChange(x);
    };

    return (
        <div className={s.productName + (editable ? ` ${s.editable}`:` ${s.static}`)}>

            {orderId &&
            <div className={s.productNameNumber}>
                <span className={s.productNameNumberSign}>{productName} № </span>
                <span className={s.productNameNumberId}>{`${orderId}${prefix}${id} `}</span>
            </div>}

            { editable ?
                <Input latent
                    className={s.productNameText}
                    placeholder={TEXT_MY_PRODUCTS.ENTER_ALBUM_NAME}
                    value={name}
                    onChange={onChangeT}
                    // maxLength={60}
                />
                :
                <div className={s.productNameText}>
                    {name}
                </div>
            }

        </div>);

};

export default ProductName;