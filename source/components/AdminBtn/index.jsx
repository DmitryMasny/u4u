import React from 'react';
import s from './AdminBtn.scss';
import {createPortal} from "react-dom";

const AdminBtn = () => {

    const  adminData = localStorage.getItem('auth_tokenAdminData');

    const  goOut = (data) => {
        localStorage.removeItem('auth_tokenAdminData');
        localStorage.setItem('auth_token', data.admin);
        window.location.replace('/manage/#!/users');
    };

    if (adminData) {
        try {
            const data = JSON.parse(adminData);
            if (data.admin && data.user && data.user === localStorage.getItem('auth_token')) {
                return <div className={s.adminBtn} onClick={()=>goOut(data)}>
                        Вход под: {data.userName}<br/>Вернуться в Админа
                    {createPortal( <div className={s.bodyFrame}/>, document.body )}
                    </div>
            }
        } catch(error) {
            console.log('AdminBtn error',error);
        }
    }
    return null;
};

export default AdminBtn;
