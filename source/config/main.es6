//Настройки
export const PRODUCTION_DOMAIN = 'u4u.ru'; // домен в продакшене
//export const PRODUCTION_DOMAIN = 'develop.u4u.online'; // домен в продакшене

export const SHOW_CONSOLE_NOTICE = true; //показывать ли в консоли технические команды (выключить для продакшена)

export const LOCAL_STORAGE_NAME = 'auth_token'; // название поля для user token в Local Storage

export const INTENT_NAMES = ['primary', 'warning', 'danger', 'success', 'info', 'mute']; // названия цветовых стилей

export const PAGINATOR_MAX_LENGTH = 7; // Максимальное число страниц в пагинаторе

export const PHOTO_MAX_SENDING_COUNT = 3;           // Максимальное количество одновременно загружаемых файлов
export const PHOTO_MAX_WEIGHT = 50 * 1024 * 1024;   // Максимальный размер файла фотографии
export const PHOTO_MIN_WEIGHT = 0.2 * 1024 * 1024;  // 0.2 мегабайта: минимальный размер, при котором осуществляем проверку на минимальный геометрический размер
export const PHOTO_MIN_SIZE = [450, 450];           // Минимальный размер изображения в px
export const PHOTO_ACCEPT_FORMATS = ['jpeg', 'jpg'];// Доступные форматы файлов (например ['jpeg','gif','png'])
export const ADMIN_PRODUCT_ACCEPT_FORMATS = ['jpeg', 'jpg', 'png'];// Доступные форматы файлов (например ['jpeg','gif','png'])
export const PHOTO_THUMB_SIZE = [90, 148, 750];     //  размеры картинки в библиотеке

export const PHOTO_FOLDER_NAME_MAX = 20;            // максимальная длина имени папки


/*
export const GALLERY_MIN_SIZE_HORIZONTAL = '400px'; //минимальный размер блока галлереи в % от экрана или в px
export const GALLERY_MAX_SIZE_HORIZONTAL = '65%';   //максимальный размер блока галлереи в % от экрана или в px

export const GALLERY_MIN_SIZE_VERTICAL = '15%'; //минимальный размер блока галлереи в % от экрана или в px
export const GALLERY_MAX_SIZE_VERTICAL = '65%'; //максимальный размер блока галлереи в % от экрана или в px

export const GALLERY_CAN_CHANGE_ORIENTATION = true;   //возможно ли менять ориентацию галереи
export const GALLERY_VERTICAL_BUTTONS_SHIFT = -15;    //сдвиг в px конопок размера и положения при вертикальной ориентации (необходимо для правильной работы изменения размера)
export const GALLERY_DEFAULT_SIZE_HORIZONTAL = '50%'; //размер галереи по горизонтали, обязательно в % от размера экрана
export const GALLERY_DEFAULT_SIZE_VERTICAL = '20%';   //размер галереи по вертикали, обязательно в % от размера экрана
export const GALLERY_DEFAULT_ORIENTATION = 'bottom';  //ориентация галереи по умолчанию (доступно left, right, bottom)
export const GALLERY_DEFAULT_VERTICAL_ORIENTATION = 'left';  //ориентация галереи по умолчанию (доступно left, right)


export const GALLERY_DEFAULT_MAIN_MENU_SELECTED = 'photos'; //кнопка по умолчанию в меню галерее

export const HEADER_TABS_DEFAULT_SELECTED = 'library';

export const PHOTOS_FILTER_PLACED_DEFAULT = true;   //вкл./выкл. "показывать размещенные" по-умолчанию
export const PHOTOS_FILTER_DOUBLE_DEFAULT = true;   //вкл./выкл. "показывать дубликать" по-умолчанию
export const PHOTOS_FILTER_BLUR_DEFAULT = true;     //вкл./выкл. "показывать нечёткие" по-умолчанию

export const PHOTOS_SORT_DEFAULT = 'byUpload';      //Cортировка по-умолчанию
export const PHOTOS_GROUP_DEFAULT = false;          //вкл./выкл. группировки по-умолчанию
export const PHOTOS_SORT_DIRECTION_BYDATE = true;   //Порядок сортировки по дате
export const PHOTOS_SORT_DIRECTION_BYSIZE = true;   //Порядок сортировки по размеру
export const PHOTOS_SORT_DIRECTION_BYUPLOAD = true; //Порядок сортировки по времени загрузки
export const PHOTOS_SORT_NAME_BYDATE = 'date';      //Порядок сортировки по дате
export const PHOTOS_SORT_NAME_BYSIZE = 'size';      //Порядок сортировки по размеру
export const PHOTOS_SORT_NAME_BYUPLOAD = 'uploaded';//Порядок сортировки по времени загрузки

export const PHOTOS_ANALYSE_DEFAULT = true;         //вкл./выкл. анализа фото при загрузке по-умолчанию
export const PHOTOS_AUTOPLACE_DEFAULT = true;       //вкл./выкл. авторазмещения фоток при загрузке по-умолчанию
*/
