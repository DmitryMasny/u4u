import React, { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom'

import styled from 'styled-components'
import {COLORS} from "const/styles";
import Spinner from 'components/Spinner';

import {Tooltip} from "components/_forms";

import TEXT from 'texts/main';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import LINKS_MAIN from "config/links";

import { productsSelectedSelector } from "components/_pages/ProductPage/selectors";
import { showFutureSelector } from "selectors/global";
import { getCategoriesAction } from 'components/_pages/GalleryPage/actions/categories';
import { galleryCategoriesSelector } from 'components/_pages/GalleryPage/selectors';

import { PRODUCT_TYPE_PHOTOBOOK, SLUGS, THEME_PRODUCT_GROUP } from 'const/productsTypes'


import { productGetId } from "libs/helpers";
import { generateThemesUrl, generateProductUrl } from "__TS/libs/tools";


const DropMenuWrap = styled('div')`
    display: flex;
    padding: 10px 0;
    .dropMenuColumn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 20px;
        &:not(:last-child) {
            border-right: 1px solid ${COLORS.LINE};
        }
    }
    .menuTitle {
        font-size: 21px;
        text-transform: uppercase;
        margin: 20px 0 10px;
        color: ${COLORS.TEXT};
        &:first-child {
            margin-top: 0;
        }
    }
    .menuRow {
      display: flex;
    }
    .menuItem {
        font-size: 16px;
        padding: 5px 0;
        margin-left: 10px;
        font-weight: 200;
        // color: ${COLORS.TEXT}
    }
`;


//menuMenu
const MenuMenuElement = styled('div')`
    width: 100%;
    @media only screen and (max-width: 767px) { //Планшеты sm
        display: none;
    }
`

//mainMenuRow
const MainMenuRowElement = styled('div')`
    display: flex;
    margin: 0 -10px; //$main-padding*-1;
`;


//menuItem
const MenuItemElement = styled( 'div' )`
    position: relative;
    display: flex;
    align-items: center;
    font-size: 18px;  //$main-menu-font-size;
    font-weight: 600; //$main-menu-font-weight;
    text-transform: uppercase;
    line-height: 40px; //$main-menu-height;
    margin-left: 5px; //$main-menu-margin;
    padding: 0 10px; //$main-menu-padding;
    color: ${({selected})=>selected ? COLORS.TEXT_PRIMARY : COLORS.TEXT };
    cursor: pointer;
    -webkit-user-drag: none;
    text-decoration: none;
    user-select: none;
    transition: color .12s ease-out;
    &:first-child {
        margin-left: 0;
    }
    &:hover, &:active {
        color:#1170be; //$main-menu-color-hover;
    }  
    &.active {
        color: #f5740d; //$main-menu-color-active;
        cursor: default;
        text-decoration: none;
    }   
`;


//menuItemDivider
const MenuItemDividerElement = styled('div')`
    flex: 1 1 auto;    
`;

const NewProductMarkStyled = styled('div')`
    position: absolute;
    top: 5px;
    right: -5px;
    padding: 0 3px;
    border-radius: 6px;
    font-size: 10px;
    line-height: 12px;
    color: #fff;
    background: ${COLORS.WARNING};
    text-transform: lowercase;
`;


const MAX_CATEGORIES_COUNT = 9;

const DropMenu = ({name, dropMenu, isNew}) => {
    const [isHover, setIsHover] = useState(false);

    const subMenuAction = (action) => {
        if (typeof action === "function") action();
        setIsHover(false);
    };

    return <Tooltip
        placement="bottom"
        trigger="click"
        intent="minimal"
        hideArrow
        tooltip={dropMenu(subMenuAction)}
        onVisibilityChange={(isOpen) => setIsHover(isOpen)}
        tooltipShown={isHover}
    >
        <MenuItemElement selected={isHover}
            // onMouseEnter={() => setIsHover(true)}
            // onMouseLeave={() => setIsHover(false)}
             onClick={() => setIsHover(true)}
        >
            {name}
            {isNew && <NewProductMark/>}
        </MenuItemElement>
    </Tooltip>
}

const SubMenuItem = ( { data, action } ) => {
    const actionHandler = () => {
        if ( data.action ) data.action( data.id );
        action && action();
    }
    if ( data.isLoading ) return <Spinner delay={ 0 } size={ 24 }/>;

    if ( data.row ) return <div className="menuRow">
        { data.row.map( ( d , i) => <SubMenuItem data={ d } action={ action } key={i}/> ) }
    </div>

    if ( data.title ) return data.link ?
        <NavLink className="menuTitle"
                 activeClassName="active"
                 to={ data.link }
                 onClick={ actionHandler }
                 isActive={ ( match, location ) => isActiveCompare( data.link, location ) }
        >
            { data.title }
        </NavLink>
        :
        <div className="menuTitle">
            { data.title }
        </div>;

    if ( data.name ) return data.link ? (
        <NavLink className="menuItem"
                 activeClassName="active"
                 to={ data.link }
                 onClick={ actionHandler }
                 isActive={ ( match, location ) => isActiveCompare( data.link, location ) }
        >
            { data.name }
        </NavLink>)
        : <span className="menuItem">{data.name}</span>;

    return null;
};

const PhotobooksMenu = ({action}) => {
    const categories =  useSelector(galleryCategoriesSelector);
    const dispatch = useDispatch();

    useEffect(()=> {
        if ( !categories ) {
            dispatch(getCategoriesAction());
        }
    }, []);


    return <DropMenuWrap>
        {[
            [
                {title: 'Фотокниги в твёрдом переплете'},
                {
                    name: 'Твёрдая обложка на клею',
                    link: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-glue')
                },
                {
                    name: 'Твёрдая обложка на пружине',
                    link: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-spring')
                },
                {title: 'Фотокниги в мягком переплете'},
                {
                    name: 'Мягкая обложка на клею',
                    link: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-glue')
                },
                {
                    name: 'Мягкая обложка на пружине',
                    link: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-spring')
                },
                {
                    name: 'Мягкая обложка на скрепке',
                    link: LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-clip')
                },
            ], [
                {title: 'Категории' },
                ...(categories && categories.slice(0, MAX_CATEGORIES_COUNT).map((item)=>({
                    name: item.name, link: LINKS_MAIN.GALLERY.replace(':categoryId?', item.id)
                })) || [{isLoading: true}]),
                {name: 'Все темы...', link: LINKS_MAIN.GALLERY.replace(':categoryId?', '') }
            ],
            // [
            //     {title: 'Форматы'},
            //     {name: '20х20', link: LINKS_MAIN.THEMES_MAIN},
            //     {name: '30х20', link: LINKS_MAIN.THEMES_MAIN},
            //     {name: '20х30', link: LINKS_MAIN.THEMES_MAIN},
            //     {name: '30х30', link: LINKS_MAIN.THEMES_MAIN},
            // ],
        ].map((column, i) => <div className="dropMenuColumn" key={i}>
            {column.map((item, j) => <SubMenuItem data={item} action={action} key={j}/>)}
        </div>)}
    </DropMenuWrap>
};

const PosterMenu = ({action}) => {
    // const categories =  useSelector(themesCategoriesSelector);
    // const showFuture = useSelector(showFutureSelector);

    return <DropMenuWrap>
        {[
            [
                {title: 'Постеры'},
                {name: 'Постер', link: generateProductUrl({productType: '4'}) },
                {name: 'Постер премиум', link: generateProductUrl({productType: '6'}) },
                {title: 'Фотографии'},
                {name: 'Фотография', link: generateProductUrl({productType: '5'}) },
                {name: 'Фотография премиум', link: generateProductUrl({productType: '7'}) },
                {title: 'Холсты'},
                {name: 'Холст', link: generateProductUrl({productType: '8'}) }
            ],
            // [
            //     {title: 'Категории' },
            //     ...(categories && categories.slice(0, MAX_CATEGORIES_COUNT).map((item)=>({
            //         name: item.name, link: generateThemesUrl({productType: THEME_PRODUCT_GROUP.DECOR, category: item.id})
            //     })) || [{isLoading: true}]),
            //     {name: 'Все темы...', link: generateThemesUrl({productType: THEME_PRODUCT_GROUP.DECOR}) }
            // ]
        ].map((column,i) => column && <div className="dropMenuColumn" key={i}>
            {column.map((item, j) => <SubMenuItem data={item} action={action} key={j}/>)}
        </div> || null)}
    </DropMenuWrap>;
}

const SouvenirMenu = ({action}) => {
    return <DropMenuWrap>
        {[
            [
                {title: 'Календари'},
                {name: 'Календарь 1', link: generateProductUrl({productType: '4'}) },
                {name: 'Календарь 2', link: generateProductUrl({productType: '4'}) },
                { title: 'Пазлы' },
                {name: 'Пазл', link: generateProductUrl({productType: '4'}) }
            ]
        ].map((column, i) => <div className="dropMenuColumn" key={i}>
            {column.map((item, j) => <SubMenuItem data={item} action={action} key={j}/>)}
        </div>)}
    </DropMenuWrap>
};

const CalendarMenu = ({action}) => <DropMenuWrap>
        {[
            [
                {title: TEXT_MY_PRODUCTS.CALENDAR_WALL_SIMPLE, link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_WALL_SIMPLE) }) },
                {row: [
                    {name: 'Создать', link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_WALL_SIMPLE) }) },
                    {name: ' | ' },
                    {name: 'Выбрать тему', link: generateThemesUrl({productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_SIMPLE, format: '210_297'}) },
                ]},

                {title: TEXT_MY_PRODUCTS.CALENDAR_WALL_FLIP, link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_WALL_FLIP) }) },
                {row: [
                    {name: 'Создать', link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_WALL_FLIP) }) },
                    {name: ' | ' },
                    {name: 'Выбрать тему', link: generateThemesUrl({productType: THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP, format: '212_318'}) },
                ]},
                {title: TEXT_MY_PRODUCTS.CALENDAR_TABLE_FLIP, link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_TABLE_FLIP) }) },
                {row: [
                    {name: 'Создать', link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_TABLE_FLIP) }) },
                    {name: ' | ' },
                    {name: 'Выбрать тему', link: generateThemesUrl({productType: THEME_PRODUCT_GROUP.CALENDAR_TABLE_FLIP}) },
                ]},
                ]
        ].map((column, i) => <div className="dropMenuColumn" key={i}>
            {column.map((item, j) => <SubMenuItem data={item} action={action} key={j}/>)}
        </div>)}
    </DropMenuWrap>;



const MAIN_MENU_ITEMS = [

    {name: TEXT.PHOTOBOOKS, dropMenu: (f) => <PhotobooksMenu action={f}/>},
    {name: TEXT.DECORS, dropMenu: (f) => <PosterMenu action={f}/>},
    {name: TEXT.CALENDARS, dropMenu: (f) => <CalendarMenu action={f}/>},
    {
        name: TEXT.PUZZLES,
        link: {path: LINKS_MAIN.PRODUCT.replace(':productType', productGetId(SLUGS.PUZZLE))},
        active: LINKS_MAIN.PRODUCT.replace(':productType?', productGetId(SLUGS.PUZZLE)),
        isNew: true,
        // showInFuture: true
    },
    {divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты'},

    {name: TEXT.SHOP, link: {path: LINKS_MAIN.SHOP_MAIN}, active: LINKS_MAIN.SHOP_MAIN},
];

const isActiveCompare = ( active, location ) => {
    if ( process.env.server_render ) return false;
    if ( active ) return !!~location.pathname.indexOf( active );
    return false;
};

const NewProductMark = memo( () => <NewProductMarkStyled>new</NewProductMarkStyled>);

const MenuItem = memo( ( { item, productsSelected, location } ) => {
    if ( item.divider ) {
        // Если это разделитель
        return <MenuItemDividerElement />;
    } else if ( item.link ) { // Если есть ссылка (это простой пункт меню)
        let link = item.link;

        if ( item.link === 'toPhotoBook' ) {
            const { coverType, bindingType } = productsSelected;
            const to = (coverType && bindingType ? [coverType, bindingType].join( '-' ) : 'hard-glue');
            link = { path: LINKS_MAIN.PHOTOBOOKS.replace( ':coverType-:bindingType', to )};
        }

        return (
            <MenuItemElement
                    as={NavLink}
                    to={ link.path }
                    activeClassName="active"
                    onClick={ item.metrics }
                    isActive={( match, location ) => isActiveCompare( item.active, location )}
            >
                {item.name}
                {item.isNew && <NewProductMark/>}
            </MenuItemElement>);
    } else if ( item.sublinks ) {
        // Если есть подссылки (это выпадающее меню)
        console.log('Выпадающего меню пока нет!');
        // return <Select title={item.name} list={item.sublinks} isHover className={`${s.menuItem} ${s.menuItemSelect}`} custom key={key}/>;

    } else if ( item.dropMenu ) {
        return <DropMenu name={ item.name } dropMenu={ item.dropMenu } isNew={item.isNew}/>;
    }

});

// Компонент пункта меню
const MenuMainView =  props => {
    const location = props.location.pathname;
    const productsSelected = useSelector(state => productsSelectedSelector(state, PRODUCT_TYPE_PHOTOBOOK));
    const showFuture = useSelector(showFutureSelector);

    return <MenuMenuElement>
                <MainMenuRowElement>
                    {MAIN_MENU_ITEMS.map(( item, key ) => (!item.showInFuture || showFuture) &&
                    // {MAIN_MENU_ITEMS.map(( item, key ) =>
                        <MenuItem location={location} item={item} productsSelected={productsSelected} key={key}/> || null
                    )}
                </MainMenuRowElement>
           </MenuMenuElement>
};

export default withRouter(MenuMainView);
