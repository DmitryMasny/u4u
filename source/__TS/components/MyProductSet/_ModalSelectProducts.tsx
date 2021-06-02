// @ts-ignore
import React, {useState, useEffect} from 'react';
// @ts-ignore
import {createPortal} from "react-dom";
// @ts-ignore
import {useSelector, useDispatch} from "react-redux";

// @ts-ignore
import {COLORS} from 'const/styles';
// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import TEXT_MAIN from 'texts/main';
// @ts-ignore
import {Select, Btn} from 'components/_forms';
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import Modal from 'components/Modal';


import {userProductsSelector} from '../../selectors/shop';
import {getUserProductsAction} from "../../actions/shop";
import ProductsList from './_ProductsList';



/** Interfaces */
interface Props {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    addProductsAction: (list: any)=>any;     // добавить выбранные продукты
}
interface ILayoutData {
    id: string,
    title: string,
}



/**
 * Модалка выбора продуктов для добавления в коллекцию
 */
const ModalSelectProducts: React.FC<Props> = ({isOpen, closeCallback, addProductsAction}) => {
    if (!isOpen) return null;
    const userProductsData: any = useSelector( userProductsSelector );

    const [productsList, setProductsList] = useState(null);

    useEffect(()=>{
        if (isOpen && !userProductsData) getUserProductsAction();
    },[isOpen]);

    useEffect(()=>{
        if (userProductsData) setProductsList(userProductsData);
    }, [userProductsData]);

    const onAddProductsHandler = () => {
        addProductsAction(productsList.filter((p)=>p.selected).map((p)=>({...p, selected: false})));
        closeCallback();
    };

    const onSelectProductHandler: (id: string)=> any = (id) => {
        setProductsList(productsList.map((p)=>p.id === id ? {...p, selected: !p.selected} : p ))
    };

    const selectedLength = productsList && productsList.filter((p)=>p.selected).length;

    const modalFooter = [
        {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeCallback},
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: TEXT_MAIN.READY, action: onAddProductsHandler, intent: 'primary', disabled: !selectedLength},
    ];


    return createPortal(
        // @ts-ignore
        <Modal size={'lg'} title={'Добавление продукта в коллекцию'} isOpen={isOpen} action={closeCallback} footer={modalFooter}>
            { productsList ? (productsList.length &&
            <ProductsList list={productsList} onSelect={onSelectProductHandler}/>
                ||
            <h4 style={{textAlign: 'center'}}>Нет продуктов для добавления</h4>) :
                <Spinner fill/>}
        </Modal>,
        document.getElementById( 'spa-top' )
    );
};

export default ModalSelectProducts;



