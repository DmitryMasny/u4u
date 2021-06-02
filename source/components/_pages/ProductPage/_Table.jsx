import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from "./product.scss";

import Table from "components/Table";

import TEXT_PRODUCT from 'texts/product'
import TEXT from 'texts/main'
// import { Wrapper } from "components/Page";

const ProductTable = ( props ) => {


    /*<span>Кол-во страниц<br/>включено в стоимость</span>*/

    const tablePriceHead = [
        'Тип переплета фотокниг',
        {text: 'Кол-во страниц включено в стоимость', className: s.tableColumnPages},
        'Макс. кол-во страниц',
        {text: '20 х 20 см.', className: s.tableNoWrap},
        {text: '20 х 30 см.', className: s.tableNoWrap},
        {text: '30 х 20 см.', className: s.tableNoWrap},
        {text: '30 х 30 см.', className: s.tableNoWrap}
    ];

    const tablePriceData = [
        tablePriceHead,
        // ['Тип переплета',        'Кол-во страниц включено в стоимость', 'Макс. кол-во страниц', '20 х 20 см.', '20 х 30 см.', '30 х 20 см.','30 x 30 см.'],
        ['Фотокнига на скрепке',                   'от 4 до 12 страниц*', '32 страницы',            '390 руб.',     '490 руб.',     false,      false],
        ['Фотокнига на пружине в мягкой обложке',  'от 4 до 20 страниц', '150 страниц',            '480 руб.',     false,          false,      false],
        ['Фотокнига на пружине в твёрдой обложке', 'от 4 до 20 страниц', '150 страниц',            '790 руб.',     '890 руб.',     '890 руб.', '1090 руб.'],
        ['Фотокнига книжный переплет в мягкой обложке', '36 страниц', '200 страниц',            '1190 руб.',     '1290 руб.',     false,      false],
        ['Фотокнига книжный переплет в твёрдой обложке', '36 страниц', '200 страниц',           '1290 руб.',     '1790 руб.',     '1840 руб.',   '2790 руб.'],
        {className: s.tableDopPage, content: ['Цена за дополнительную страницу', '', '',                 '25 руб.',      '29 руб.',      '29 руб.', '42 руб.']},
        //false,
        //['Фотокнига книжный переплет в твёрдой обложке', '36 страниц', '300 страниц',           '1290 руб.',     '1790 руб.',     '1790 руб.',   '2790 руб.'],
        //{className: s.tableDopPage, content: ['Цена за дополнительную страницу', '', '',                 '22 руб.',      '26 руб.',      '26 руб.', '38 руб.']},
    ];

    const tableSizeData = [
        ['Тип переплета фотокниги',                 '20 х 20 см.',      '20 х 30 см.',      '30 х 20 см.',  '30 x 30 см.'],
        ['На скрепке',                              '200 x 200 мм.',    '193 x 290 мм.',    false,          false],
        ['На пружине в мягкой обложке',            '200 x 200 мм.',    false,              false,          false],
        ['На пружине в твёрдой обложке',           '200 x 200 мм.',    '193 x 290 мм.',   '290 x 193 мм.', '290 x 290 мм.'],
        ['Книжный переплет в мягкой обложке',   '200 x 200 мм.',    '193 x 290 мм.',    false,          false],
        ['Книжный переплет в твёрдой обложке',  '206 x 206 мм.',    '199 x 296 мм.',   '296 x 199 мм.', '296 x 296 мм.'],
    ];

    const desc = <span><b>*</b> - количество страниц у альбома на скрепке должно быть кратно 4: 4, 8, 12, 16, 20, 24, 28 или 32 страницы</span>;

    return (
        <div className={s.productTable}>

            <Table data={tablePriceData} fill responsive hover emptyCell={'Отсутствует'} title={'Цена фотокниг'} desc={desc} small/>

            <Table data={tableSizeData} fill responsive hover emptyCell={'Отсутствует'} title={'Точные размеры фотокниг'}/>

        </div>);
};

export default ProductTable;
