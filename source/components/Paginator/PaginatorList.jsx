import React from 'react';

import s from './paginator.scss';

import {PAGINATOR_MAX_LENGTH} from 'config/main';

/**
 * Элемент пагинатора
 * @param type {String} - тип страницы [page, cover...]
 * @param page {Number} - номер страницы
 * @param active {Boolean} - если это текущая страница
 * @param children
 * @param onSelectPage
 * @param disabled
 * @returns {*}
 */
const BuildItem = ( {type, page, active, children, onSelectPage, disabled} ) => {
 let className = s.paginatorItem + (disabled ? ` ${s.disabled}`:'');
    if (type === 'page' ){
        //Для текущей страницы выставляем класс .active
        if (active) className += ` ${s.active}`;
        //Для обложки, страницы "Заметки" и страниц 100+ (трехзначные) ставим класс для уменьшения шрифта
        if ( page > 99) className += ` ${s.sm}`;
    } else className += ` ${s.arrow}`;

    return (<div key={type+page} className={className} onClick={()=> onSelectPage(page)}>{ children }</div>);
};

/**
 * Сборка элементов пагинатора
 * @params pages
 * currentPage  {Number} - Активная страница
 * totalPages   {Number} - Всего страниц
 * onSelectPage {Function} - callback выбора страниц
 * visiblePages {Number} - Максимально отображаемое кол-во страниц
 * @returns {Array}
 */
const PaginatorList = ( {currentPage, totalPages, onSelectPage, visiblePages = PAGINATOR_MAX_LENGTH - 1, small } ) => {
    if (small && visiblePages > 6) visiblePages = 6;

    let pages = [],
        half = Math.floor(visiblePages / 2),
        start = currentPage - half - visiblePages % 2,
        end = currentPage + half;

    if (visiblePages > totalPages) visiblePages = totalPages; // Не показывать больше страниц чем есть

    if (end < visiblePages) end = visiblePages;

    if ( start < 0 ) {
        start = 0;
        end = visiblePages;
    }

    if (end > totalPages) {
        start = totalPages - visiblePages ;
        end = totalPages;
    }

    let itPage = start;
    while (itPage <= end) {
        pages.push(itPage);
        itPage++;
    }
    let listItems = [],
        listPages = [];

    // В начало
    listItems.push(<BuildItem type="first" onSelectPage={onSelectPage} page={1} key="first" disabled={currentPage === 1}>
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" className={s.icon}>
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
        </svg>
    </BuildItem>);

    // Предыдущая страница
    if (!small) {
        let prev = currentPage > 2 ? currentPage - 1 : 1;

        listItems.push(<BuildItem type="prev" onSelectPage={onSelectPage} page={prev} key="prev" disabled={currentPage === 1}>
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" className={s.icon}>
                <polyline points="15 18 9 12 15 6"/>
            </svg>
        </BuildItem>);
    }

    // Страницы
    for ( let i = 1; i < pages.length; i++ ) {
        listPages.push(<BuildItem type="page" key={'page'+i} onSelectPage={onSelectPage} page={pages[i]} active={currentPage === pages[i]}>
                          {pages[i]}
                       </BuildItem>);
    }
    // Общий контейнер для страниц
    listItems.push(
        <div className={s.pagesWrap} key="listPages">{listPages}</div>
    );

    // Следующая страница
    if (!small) {
        let next = currentPage < totalPages ? currentPage + 1 : totalPages;
        listItems.push( <BuildItem type="next" onSelectPage={onSelectPage} page={next} key="next" disabled={currentPage === totalPages}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={s.icon}>
                <polyline points="9 18 15 12 9 6"/>
            </svg>
        </BuildItem> );
    }

    // В конец
    listItems.push(<BuildItem type="last" onSelectPage={onSelectPage} page={totalPages} key="last" disabled={currentPage === totalPages}>
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" className={s.icon}>
            <polyline points="13 17 18 12 13 7"/>
            <polyline points="6 17 11 12 6 7"/>
        </svg>
    </BuildItem>);

    return listItems;
};

export default PaginatorList;