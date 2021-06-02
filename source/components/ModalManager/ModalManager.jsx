import React, {useEffect, useState, Suspense} from 'react';

import {useSelector} from "react-redux";

import ModalConfig from 'config/modals'
import {modalDialog} from 'selectors/modals'
import {dialogRemoveAction} from '__TS/actions/modals'

import Modal from 'components/Modal';
import Loading from "./_Loading";
import Dialog from "__TS/components/_modals/Dialog";

const getStates = () => {
    let states = {};
    Object.keys(ModalConfig).map((key) => {
        states[key] = useSelector(ModalConfig[key].selector);
    });
    return states;
};


const ModalsWrap = ({data, dialogs}) => {

    const [sortedModals, setSortedModals] = useState({});
    useEffect(() => {

        let sortedModalsObj = {};

        data.map((modal)=>{
            sortedModalsObj[modal.name] = {...modal, timeStamp: sortedModals[modal.name] ? sortedModals[modal.name].timeStamp : Date.now()}
        });

        setSortedModals(sortedModalsObj);
    }, [data]);

    const sortedArray = Object.values(sortedModals).sort((a,b)=>a.timeStamp - b.timeStamp);

    return <>
        {sortedArray.length ? sortedArray.map( ( modal, key ) =>
            modal.minimal ?
                <Suspense fallback={<Loading/>} key={key}>
                    {modal.component}
                </Suspense>
                :
                <Modal key={key}
                       size={modal.size}
                       action={modal.action}
                       isOpen={true}
                       title={modal.title}>
                    <Suspense fallback={<Loading/>}>
                        {modal.component}
                    </Suspense>
                </Modal>
        ) : null}
        {dialogs && dialogs.length && dialogs.map(
            (item, i) => <Dialog modalData={item} closeCallback={()=>dialogRemoveAction(item.id)} key={i}/>
        )}
    </>
};

const ModalManager = () => {
    const modalStates = getStates();
    const dialogs = useSelector(modalDialog);
    let modals = []; //массив открытых модальных окон

    //проверяем
    Object.keys(ModalConfig).map((key) => {
        if (modalStates[key]) {
            modals.push({
                ...ModalConfig[key],
                component: React.createElement(ModalConfig[key].component),
                name: key
            });
        }
    });

    return <ModalsWrap data={modals} dialogs={dialogs}/>;
};

export default ModalManager