import { SHOW_CONSOLE_NOTICE } from 'config/main';

//вывод в консоль
export const logs = {
    show:  ( name, obj ) => SHOW_CONSOLE_NOTICE && console && console.log( name, obj ),
    warn:  ( name, obj ) => SHOW_CONSOLE_NOTICE && console && console.warn( name, obj ),
    error: ( name, obj ) => SHOW_CONSOLE_NOTICE && console && console.error( name, obj ),
};
