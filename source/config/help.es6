import TEXT_HELP from 'texts/help';
import { NAV } from 'const/help';
import LINKS_MAIN from 'config/links';


export const helpMenuData = [
    { id: NAV.START,        title: TEXT_HELP.START,         link: LINKS_MAIN.HELP.replace( /:tab/, NAV.START ) },
    { id: NAV.EDITOR,       title: TEXT_HELP.EDITOR,        link: LINKS_MAIN.HELP.replace( /:tab/, NAV.EDITOR ) },
    { id: NAV.POSTER_EDITOR,title: TEXT_HELP.POSTER_EDITOR, link: LINKS_MAIN.HELP.replace( /:tab/, NAV.POSTER_EDITOR ) },
    { id: NAV.MY_PHOTOS,    title: TEXT_HELP.MY_PHOTOS,     link: LINKS_MAIN.HELP.replace( /:tab/, NAV.MY_PHOTOS ) },
    { id: NAV.PHOTO_EDIT,   title: TEXT_HELP.PHOTO_EDIT,    link: LINKS_MAIN.HELP.replace( /:tab/, NAV.PHOTO_EDIT ) },
    { id: NAV.TEXT_EDIT,    title: TEXT_HELP.TEXT_EDIT,     link: LINKS_MAIN.HELP.replace( /:tab/, NAV.TEXT_EDIT ) },
    { id: NAV.PAGES_EDIT,   title: TEXT_HELP.PAGES_EDIT,    link: LINKS_MAIN.HELP.replace( /:tab/, NAV.PAGES_EDIT ) },
    { id: NAV.BINDING,      title: TEXT_HELP.BINDING,       link: LINKS_MAIN.HELP.replace( /:tab/, NAV.BINDING ) },
    { id: NAV.ORDER,        title: TEXT_HELP.ORDER,         link: LINKS_MAIN.HELP.replace( /:tab/, NAV.ORDER ) },
    { id: NAV.NOTIFICATIONS,title: TEXT_HELP.NOTIFICATIONS, link: LINKS_MAIN.HELP.replace( /:tab/, NAV.NOTIFICATIONS ) },
    { id: NAV.PROMO,        title: TEXT_HELP.PROMO,         link: LINKS_MAIN.HELP.replace( /:tab/, NAV.PROMO ) },
];
