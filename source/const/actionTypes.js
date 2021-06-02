//** Работа с пользователем (авторизация) получение токена **//
export const USER_TOKEN_GET_REQUEST         = 'USER / TOKEN / GET -> REQUEST';              // Запуск запроса
export const USER_TOKEN_GET_INPROGRESS      = 'USER / TOKEN / GET -> INPROGRESS';           // В процессе
export const USER_TOKEN_GET_SUCCESS         = 'USER / TOKEN / GET -> SUCCESS';              // Выполненно
export const USER_TOKEN_GET_FAIL            = 'USER / TOKEN / GET -> FAIL';                 // Неудача
export const USER_ACCESS_PUT                = 'USER / ACCESS / SET';                        // Изменение прав пользователя
export const USER_LOGIN                     = 'Запуск авторизации';                         // Запуск авторизации
export const USER_LOGIN_FAIL                = 'Ошибка авторизации';                         // Ошибка авторизации
export const USER_LOGIN_SOCIAL              = 'Запуск авторизации через соцсети';           // Запуск авторизации через соцсети
export const USER_FORM_INPROGRESS           = 'В процессе авторизации/регистрации/вост.';   // В процессе авторизации/регистрации/востановления
export const USER_REGISTER                  = 'Запуск регистрации';                         // Запуск регистрации
export const USER_REGISTER_FAIL             = 'Ошибка регистрации';                         // Ошибка регистрации
export const USER_RESTORE                   = 'Востановлание пароля';                       // Востановлание пароля
export const USER_RESTORE_FAIL              = 'Ошибка востановления';                       // Ошибка востановления

export const USER_LOGOUT                    = 'Выход из профиля';                           // Выход из профиля
export const USER_SET_CAPTCHA_TOKEN         = 'Установка токена капчи';                     // Установка токена капчи
export const USER_GET_PERSONAL_INFO         = 'Получение личной информации пользователя';   // Получение личной информации
export const USER_SET_PERSONAL_INFO         = 'Установка личной информации пользователя';   // Установка личной информации
export const USER_CHANGE_PASSWORD           = 'Смена пароля в профиле';                     // Смена пароля в профиле
export const USER_SEND_PERSONAL_INFO        = 'Отправка личной информации пользователя';    // Отправка личной информации пользователя
export const USER_SEND_AVATAR               = 'Отправка аватара на сервер';                 // Отправка аватара на сервер
export const USER_SEND_DELIVERY             = 'Отправка данных доставки на сервер';         // Отправка данных доставки на сервер
export const USER_GET_DELIVERY              = 'Получение данных доставки юзера с сервера';  // Получение данных доставки юзера с сервера

//** ФОРМА АВТОРИЗАЦИИ / РЕГИСТРАЦИИ **//
export const SHOW_USER_LOGIN                = 'Блок авторизации пользователя';              // Показать форму авторизации
export const SHOW_USER_REG                  = 'Блок регистрации пользователя';              // Показать форму регистрации
export const SHOW_USER_REG_RESTORE_SUCCESS  = 'Блок удачной регистрации/востановления';     // Показать форму регистрации/востановления
export const SHOW_USER_RESTORE              = 'Блок востановления пароля';                  // Показать форму восстановления пароля
export const SET_USER_FORM_LOGIN            = 'Обновление поля ввода логина';               // Обновление поля ввода логина

//** Полноэкранный лоадер **//
export const FULL_SCREEN_LOADER             = 'Полноэкоранный лоадер';

//** Модальные окна **//

export const MODAL_PREVIEW_ALBUM            = 'модалка - Показать окно просмотра альбома';
export const MODAL_GALLERY_THEME_INFO       = 'модалка - Показать окно просмотра темы';
export const MODAL_AUTH                     = 'модалка - Показать окно авторизации';
export const MODAL_CONDITION                = 'модалка - Показать пользовательское соглашение';
export const MODAL_REQISITES                = 'модалка - Показать окно реквизиты';
export const MODAL_OFERTA                   = 'модалка - Показать окно оферты';
export const MODAL_CONTACTS                 = 'модалка - Показать окно контактов';
export const MODAL_ORDER_DELIVERY_INFO      = 'модалка - Показать окно инфы о доставке в заказах';
export const MODAL_PAYMENT_ACCEPTED         = 'модалка - Показать окно о удачной оплате';
export const MODAL_PAYMENT_DECLINED         = 'модалка - Показать окно о неудачной оплате';
export const MODAL_PAYMENT_INFO             = 'модалка - Показать окно об оплате';
export const MODAL_SPEC_PROJECT             = 'модалка - Показать окно спецпроекта';
export const MODAL_CREATE_PHOTO_FOLDER      = 'модалка - Мои фотографии - новая папка';
export const MODAL_PHOTOS_FOLDERS           = 'модалка - Мои фотографии - выбор папки';
export const MODAL_PHOTOS_UPLOAD            = 'модалка - Мои фотографии - загрузка фото';
export const MODAL_DELETE_CONFIRM           = 'модалка - Мои фотографии - подверждение удаления папки / фото';
export const MODAL_UPLOAD_SOCIAL_PHOTOS     = 'модалка - Добавить фотографии из соцсетей';
export const MODAL_PRODUCT_PROBLEM_INFO     = 'модалка - Проблемы с продуктом, не совместимо с текущим layout';
export const MODAL_PHOTO_QUALITY            = 'модалка - Оценка качества изображения';
export const MODAL_SIMPLE_PREVIEW           = 'модалка - Просмотр layout';
export const MODAL_UPLOAD_STICKERS          = 'модалка - Загрузка стикеров';
export const MODAL_CREATE_THEME             = 'модалка - Создание темы';
export const MODAL_ADMIN_THEME_PREVIEW      = 'модалка - Превью админом темы';
export const MODAL_ADMIN_THEME_COPY         = 'модалка - копирование темы';
export const MODAL_UPLOAD_BACKGROUNDS       = 'модалка - Загрузка фонов';
export const MODAL_DIALOG_ADD               = 'диалог - добавить новый';
export const MODAL_DIALOG_REMOVE            = 'диалог - удалить';

//** Галлерея **//
export const GALLERY_SET_PAGE               = 'Установка активной страницы пагинатора';   // Установка активной страницы пагинатора
export const GALLERY_GET_CATEGORIES         = 'Получение категорий альбомов с сервера';   // Получение категорий альбомов с сервера
export const GALLERY_SET_CATEGORIES         = 'Запись категорий альбомов в state';        // Запись категорий альбомов в state
export const GALLERY_SET_CURRENT_FORMAT     = 'Выбор формата в галерее';                  // Выбор формата в галере
export const GALLERY_GET_THEMES_FROM_SERVER = 'Получение тем с сервера';                  // Получение тем с сервера
export const GALLERY_PUT_THEMES             = 'Запись тем в state';                       // Запись тем в state

//** Темы **//
export const THEMES_GET_CATEGORIES         = 'Получение категорий альбомов с сервера ';   // Получение категорий альбомов с сервера
export const THEMES_SET_CATEGORIES         = 'Запись категорий альбомов в state ';        // Запись категорий альбомов в state
export const THEMES_GET_PUBLISHED_THEMES   = 'Получение тем';                             // Получение тем с сервера
export const THEMES_GET_THEMES             = 'Получение тем админа';                      // Получение тем админа с сервера
export const THEMES_PUT_THEMES             = 'Запись тем';                                // Запись тем в state
export const THEMES_GET_FILTER_DATA        = 'Получение данных для использования при фильтрации';   // Получение данных для использования при фильтрации
export const THEMES_SET_FILTER_DATA        = 'Запись данных для фильтрации';              // Запись данных для фильтрации
export const THEMES_CREATE_NEW_THEME       = 'Создать новую тему';                        // Создать новую тему
export const THEMES_GET_ADMIN_CATEGORIES   = 'Получить категории для тем админа';         // Получить категории для тем админа
export const THEMES_SET_ADMIN_CATEGORIES   = 'Записать категории для тем админа';         // Записать категории для тем админа
export const THEMES_GET_ADMIN_PRODUCT_GROUP   = 'Получить группы продуктов для тем админа';         // Записать группы продуктов для тем админа
export const THEMES_SET_ADMIN_PRODUCT_GROUP   = 'Записать группы продуктов для тем админа';         // Записать группы продуктов для тем админа
export const THEMES_CREATE_CATEGORY        = 'Создать категорию для тем админа';          // Создать категорию для тем админа
export const ADMIN_CHANGE_THEME_STATUS     = 'Смена статуса публикации темы';             // Смена статуса публикации темы
export const THEMES_CLEAR                  = 'Очистить список тем';                       // Очистить список тем
export const ADMIN_THEME_UPDATE            = 'Обновить тему';                             // Обновить тему
export const ADMIN_THEME_DELETE            = 'Удалить тему';                              // Удалить тему
export const ADMIN_THEME_CLEAR             = 'Очистить выбранную тему в админке';         // Удалить тему
export const THEMES_GET_THEME_DATA         = 'Получение содержимого темы';                // Получение содержимого темы
export const THEMES_PUT_THEME_DATA         = 'Запись содержимого темы';                   // Запись содержимого темы
export const THEMES_GET_THEME_FORMATS      = 'Получение форматов темы';                   // Получение форматов темы
export const THEMES_PUT_THEME_FORMATS      = 'Запись форматов темы';                      // Запись форматов темы
export const THEMES_PUT_THEME_FORMAT       = 'Запись формата темы';                       // Запись формата темы
export const THEMES_COPY_THEME             = 'Копировать тему';                           // Копировать тему

//** Мои продукты **//
export const MY_PRODUCTS_GET_PRODUCTS       = 'Получение продуктов с сервера';              // Получение продуктов с сервера
export const MY_PRODUCTS_GET_ORDERS         = 'Получение заказов с сервера';                // Получение заказов с сервера
export const MY_PRODUCTS_SET_PRODUCTS       = 'Запись полученых с сервера продуктов';       // Запись полученых с сервера продуктов
export const MY_PRODUCTS_SET_DELIVERY_BOX_SIZE      = 'Запись полученых с сервера данных размера посылок'; // Запись полученых с сервера данных размера посылок
export const MY_PRODUCTS_MAKE_ORDER_FROM_PRODUCT    = 'Заказать продукт';                   // Заказать продукт
export const MY_PRODUCTS_MOVE_PRODUCT_TO_CART       = 'Перенос продукта в корзину';         // Перенос продукта в корзину
export const MY_PRODUCTS_GET_DELETED_PRODUCTS       = 'Получение удаленных продуктов с сервера';    // Получение удаленных продуктов с сервера
export const MY_PRODUCTS_MAKE_PRODUCT_COPY          = 'Создать копию продукта';             // Получение удаленных продуктов с сервера
export const MY_PRODUCTS_UPDATE_ORDERS              = 'Обновить заказы';                    // Обновить заказы
export const MY_PRODUCTS_DELETE_PRODUCT             = 'Удалить продукт';                    // Удалить продукт
export const MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED    = 'Перенос удаленного продукта в удаленные';    // Перенос удаленного продукта в удаленные
export const MY_PRODUCTS_RECOVER_PRODUCT            = 'Восстановить удаленный продукт';             // Восстановить удаленный продукт
export const MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED  = 'Восстановление удаленного продукта';         // Восстановление удаленного продукта
export const MY_PRODUCTS_REORDER_PRODUCT            = 'Заказать продукт повторно';                  // Заказать продукт повторно
export const MY_PRODUCTS_REMOVE_PRODUCT_FROM_CART   = 'Убрать продукт из корзины';                  // Убрать продукт из корзины
export const MY_PRODUCTS_MOVE_PRODUCT_FROM_CART     = 'Из корзины в новые заказы';                  // Из корзины в новые заказы
export const MY_PRODUCTS_CHANGE_PRODUCT_COUNT       = 'Изменить тираж продукта в корзине';          // Изменить тираж продукта в корзине
export const MY_PRODUCTS_CHANGE_PRODUCT_NAME        = 'Изменить имя продукта в новых';              // Изменить  имя продукта в новых
export const MY_PRODUCTS_CHANGING_PRODUCT_COUNT     = 'Изменение тиража продукта в корзине';        // Изменение тиража продукта в корзине
export const MY_PRODUCTS_CHANGING_PRODUCT_NAME      = 'Изменение имени продукта в корзине';        // Изменение тиража продукта в корзине
export const MY_PRODUCTS_TOGGLE_SHOW_DELIVERY       = 'Показать/ скрыть оформление доставки';       // Показать/ скрыть оформление доставки
export const MY_PRODUCTS_SET_MY_DELIVERY            = 'Запись данных оформления доставки';          // Запись данных оформления доставки
export const MY_PRODUCTS_SEND_NEW_ORDER_TO_SERVER   = 'Отправка доставки и заказа на сервер';       // Отправка доставки и заказа на сервер
export const MY_PRODUCTS_CLEAR_MY_CART              = 'Очистка корзины с заказом';                  // Очистка корзины с заказом redux
export const MY_PRODUCTS_GET_CART_COUNT             = 'Получение количества заказов';               // Получение количества заказов
export const MY_PRODUCTS_SET_CART_COUNT             = 'Запись количества заказов';                  // Запись количества заказов
export const MY_PRODUCTS_RESET_DEFAULT_STATE        = 'Сброс раздела Мои проекты на заводские настройки';  // Сброс раздела Мои проекты на заводские настройки



export const PRODUCT_GET_THEME_DATA                 = 'Получение данных темы по групее продуктов';  // Получение данных темы по групее продуктов
export const PRODUCT_PUT_THEME_DATA                 = 'Сохранение данных темы по групее продуктов'; // Сохранение данных темы по групее продуктов


//** Карточка продукта **//
export const PRODUCT_SELECTED_DATA_PUT      = 'Сохранение состояния настройки альбома';
export const PRODUCT_TYPES_GET              = 'Получение типов фотокниг';
export const PRODUCT_TYPES_PUT              = 'Запись данных продукта';
export const PRODUCT_GET_OPTIONS            = 'Получение списка всех опций';
export const PRODUCT_PUT_OPTIONS            = 'Запись списка всех опций';
export const PRODUCT_PUT_OPTIONS_TYPES      = 'Запись списка всех типов параметров опций';
export const PRODUCT_UPDATE_OPTION_PARAMS   = 'Обновление параметра опции';
export const PRODUCT_PUT_OPTION_CATEGORIES  = 'Обновление всех категорий опций';
export const PRODUCT_SET_OPTIONS_BUFFER     = 'Запись опций формата в буфер';
export const PRODUCT_SET_FORMATS_BUFFER     = 'Запись форматов в буфер';


export const PRODUCT_CREATE_POSTER           = 'Создать постер - отправка на сервер';
export const PRODUCT_PUT_PRODUCT_DATA        = 'Создать продукт - запись';
export const PRODUCT_UPDATE_PRODUCT_DATA     = 'Обновить продукт - запись';
export const PRODUCT_UPDATE_CONTENT_PHOTO    = 'Обновить фото продукта';
export const PRODUCT_UPDATE_CONTENT_POSITION = 'Обновить координаты контекста продукта';
export const PRODUCT_UPDATE_ITERATION        = 'Обновление итерации продукта';
export const PRODUCT_SET_POSTER              = 'Изменить продукт - постер';
export const PRODUCT_SET_IS_COMPLETED        = 'Меняем статус готовности продукта';
export const PRODUCT_CLEAR_DATA              = 'Удаляем layout и фотографии из layout';

export const PRODUCT_AREA_SET_LIST_IDS       = 'Обновляем список Areas в layout';
export const PRODUCT_RESET_CHANGES_COUNT     = 'Сбрасываем счётчик изменений продукта (можно покинуть редактор)';

//export const PRODUCT_TYPE_SET               = 'Выбор типа продукта';
//export const PRODUCT_FORMAT_SET             = 'Выбор формата продукта';
//export const PRODUCT_PAGES_SET              = 'Выбор кол-ва страниц продукта';
//export const PRODUCT_GLOSS_SET              = 'Выбор ламинирования обложки продукта (мат/глянец)';

//** Мои фотографии **//
export const MY_PHOTOS_GET_PHOTOS           = 'Получить фотографии';
export const MY_PHOTOS_GET_GOOGLE_PHOTOS    = 'Получить гугл фотографии';
export const MY_PHOTOS_SET_GOOGLE_PHOTOS    = 'Добавить выбранные гугл фотографии';
export const MY_PHOTOS_GET_INSTAGRAM_PHOTOS = 'Получить instagram фотографии';
export const MY_PHOTOS_SET_INSTAGRAM_PHOTOS = 'Добавить выбранные instagram фотографии';
export const MY_PHOTOS_GET_VK_PHOTOS        = 'Получить VK фотографии';
export const MY_PHOTOS_SET_VK_PHOTOS        = 'Добавить выбранные VK фотографии';
export const MY_PHOTOS_GET_YANDEX_PHOTOS    = 'Получить Yandex фотографии';
export const MY_PHOTOS_SET_YANDEX_PHOTOS    = 'Добавить выбранные Yandex фотографии';
export const MY_PHOTOS_SET_ALL_PHOTOS       = 'Запись всех фотографий';
export const MY_PHOTOS_SET_PHOTO            = 'Запись фотографии';
export const MY_PHOTOS_GET_FOLDERS          = 'Получить все папки с фотографиями';
export const MY_PHOTOS_GET_FOLDER_PHOTOS    = 'Получить фотографии папки';
export const MY_PHOTOS_SET_FOLDERS          = 'Запись всех папок с фотографиями';
export const MY_PHOTOS_SELECT_TOGGLE        = 'Групповой выбор фото';
export const MY_PHOTOS_SELECT_PHOTO         = 'Выбор фото';
export const MY_PHOTOS_CREATE_FOLDER        = 'Создать папку';
export const MY_PHOTOS_SET_NEW_FOLDER       = 'Добавить новую папку в список папок фронта';
export const MY_PHOTOS_DELETE_PHOTOS        = 'Удалить фотографии';
export const MY_PHOTOS_MOVE_PHOTOS          = 'Переместить фотографии';
export const MY_PHOTOS_DUPLICATE_PHOTOS     = 'Сдублировать фотографии';
export const MY_PHOTOS_RENAME_FOLDER        = 'Переименовать папку';
export const MY_PHOTOS_DELETE_FOLDER        = 'Удалить папку';
export const MY_PHOTOS_REMOVE_FROM_FOLDER   = 'Удалить фотографии из папки';
export const MY_PHOTOS_SELECT_FOLDER        = 'Выбрать папку';
export const MY_PHOTOS_SET_CURRENT_FOLDER   = 'Положить запрошенные фотографии в открытую папку';
export const MY_PHOTOS_REMOVE_PHOTOS        = 'Удалить фотографии из Redux';
export const MY_PHOTOS_UPLOAD_PHOTO         = 'Загрузить фотографию';
export const MY_PHOTOS_ADD_TO_FOLDER_TOGGLE = 'Добавить в папку toggle';
export const MY_PHOTOS_ADD_TO_FOLDER        = 'Добавить в папку';
export const MY_PHOTOS_ADD_NEW_PHOTO        = 'Добавить новую фотографию';
export const MY_PHOTOS_RESET_DEFAULT        = 'Сброс раздела фото в начальное состояние';


//** Просмотр фотографии **//
export const MODAL_PREVIEW_PHOTO            = 'Модалка превью фото';
export const MY_PHOTOS_PREVIEW_PHOTO        = 'Просмотр фотографии';
export const MY_PHOTOS_PREVIEW_PHOTO_SLIDE  = 'Предыдущая / следущая фоторафия';
export const MY_PHOTOS_ROTATE_PHOTO         = 'Поворот фотографии';
export const MY_PHOTOS_MODAL_PROGRESS       = 'Прелоадер модалки просмотра фото';
export const MY_PHOTOS_MODAL_REMOVE_PHOTO   = 'Удалить фото в модалке';


//** Прочее / Общее **//

export const SIDE_MENU_SHOW_TOGGLE          = 'Показать/ Скрыть боковое меню';
export const SET_WINDOW_SIZES               = 'Запись размеров окна';
export const SET_WINDOW_SCROLL              = 'Запись скролла окна';
export const SET_FUTURE                     = 'Показать меню которое должно быть скрыто от простых смертных - для теста на продакшене';

//** Получение layout альбома **//
export const THEME_LAYOUT_GET_FROM_SERVER  = 'Получение объекта темы с сервера';  // Получение объекта темы с сервера
export const THEME_LAYOUT_PUT              = 'Положили layout темы в хранилище';  // Положили layout альбома в хранилище
export const THEME_SELECTED_PUT_DATA       = 'Сохраняем выбранную тему';  // Сохраняем выбранную тему

//** Получение фонов альбома **//
export const THEME_BACKGROUNDS_GET_FROM_SERVER  = 'Получение фонов темы с сервера';     // Получение фонов темы с сервера
export const THEME_BACKGROUNDS_PUT              = 'Положили фоны альбома в хранилище';  // Положили фоны альбома в хранилище

// Установка кода спецпроекта
export const SET_SPEC_PROJECT                   = 'Установка кода спецпроекта';  // Установка кода спецпроекта


//** получения layout альбома для его preview **//
export const ALBUM_LAYOUT_GET_FROM_SERVER_FAIL = 'Ошибка получение объекта альбома с сервера';  // Получение объекта альбомы с сервера
export const ALBUM_LAYOUT_GET_FROM_SERVER      = 'Получение объекта альбома с сервера';  // Получение объекта альбомы с сервера
export const ALBUM_LAYOUT_PUT                  = 'Положили layout альбома в хранилище';  // Положили layout альбома в хранилище


export const GENERATE_LAYOUT               = 'Генерируем layout для переадресации в редатор';  // Генерируем layout для переадресации в редатор

//**РАБОТА С ПРОМОКОДАМИ
export const PROMOCODE_CHECK               = 'Запрос на сервер на проверку промокода';
export const PROMOCODE_SET                 = 'Установка промокода в state';
//export const BIGLION_PROMOCODE_CHECK       = 'Запрос на сервер на проверку купона Biglion';

export const GIFT_CARD_SET                 = 'Отправить данные для подарочного сертификата';


/**
 * Web Sockets
 */
export const WS_TEST                    = 'ws запрос загрузки фото';


/** EDITOR **/
export const EDITOR_NEXT_TURN = 'Следующий разворот';
export const EDITOR_PREV_TURN = 'Предыдущиц разворот';

export const EDITOR_SET_TAB                     = 'Выбор таба';
export const EDITOR_SET_LIBRARY_RESIZING        = 'Активнация изменения размера';
export const EDITOR_TOGGLE_PAGES_PANEL          = 'Свернуть/Развернуть панеь страниц';

export const EDITOR_GET_PHOTOS_LIBRARY          = 'Получение фотографий в библиотеку редактора';
export const EDITOR_GET_THEMES_LIBRARY          = 'Получение фонов в библиотеку редактора';
export const EDITOR_GET_TEXT_LIBRARY            = 'Получение текстовых стилей в библиотеку редактора';
export const EDITOR_GET_FRAMES_LIBRARY          = 'Получение рамок и масок в библиотеку редактора';
export const EDITOR_GET_STICKERS_LIBRARY        = 'Получение стикеров в библиотеку редактора';
export const EDITOR_GET_TEMPLATES_LIBRARY       = 'Получение шаблонов в библиотеку редактора';
export const EDITOR_SET_PHOTOS_LIBRARY          = 'Запись фотографий в библиотеку редактора';
export const EDITOR_SET_THEMES_LIBRARY          = 'Запись фонов в библиотеку редактора';
export const EDITOR_SET_TEXT_LIBRARY            = 'Запись текстовых стилей в библиотеку редактора';
export const EDITOR_SET_FRAMES_LIBRARY          = 'Запись рамок и масок в библиотеку редактора';
export const EDITOR_SET_STICKERS_LIBRARY        = 'Запись стикеров в библиотеку редактора';
export const EDITOR_SET_TEMPLATES_LIBRARY       = 'Запись шаблонов в библиотеку редактора';
export const EDITOR_TOGGLE_PHOTO_SHOW_ONLY_USED = 'Переключатель режима показа фотографий (показывать не только не размещенные)';

export const EDITOR_SET_TEMPLATES               = 'Запись шаблонов';
export const EDITOR_SET_SELECTED_AREA           = 'Устанавливаем выбранную area';

export const EDITOR_SET_PHOTOS_LIBRARY_SELECTION = 'Мультивыбор фоток вкл./выкл.';
export const EDITOR_SET_THEMES_LIBRARY_SELECTION = 'Мультивыбор фонов вкл./выкл.';
export const EDITOR_SELECT_PHOTO                = 'Выбор фото в редакторе';
export const EDITOR_SELECT_THEME                = 'Выбор фона в редакторе';

export const EDITOR_ADD_NOT_GOOD_PHOTO          = 'Добавляем не качественные фото в массив';
export const EDITOR_DELETE_NOT_GOOD_PHOTO       = 'Удаляем не качественные фото из массива';
export const EDITOR_ADD_NOT_ACCEPTED_PHOTO      = 'Добавляем плохие фото в массив';
export const EDITOR_DELETE_NOT_ACCEPTED_PHOTO   = 'Удаляем плохие фото из массива';
export const EDITOR_CLEAR_NOT_GOOD_AND_NOT_ACCEPTED_PHOTO   = 'Удаляем все не качественные и плохие фотографии из массивов';

export const EDITOR_STICKERS_SET_PACKS           = 'Устанавливаем наборы стикеров';
export const EDITOR_STICKERS_SET_SELECTED_PACK   = 'Устанавливаем выбранный набор стикеров';
export const EDITOR_STICKERS_SET_STICKERS_COLLECTION = 'Устанавливаем сникеры по id пака стикеров';
export const EDITOR_STICKERS_UPDATE_STICKER      = 'Обновление стикера в стикерпаке редактора';

export const EDITOR_BACKGROUND_SET_PACKS                = 'Устанавливаем наборы фонов';
export const EDITOR_BACKGROUND_SET_SELECTED_PACK        = 'Устанавливаем выбранный набор фонов';
export const EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION        = 'Устанавливаем фоны по id пака фонов';
export const EDITOR_BACKGROUND_SET_BACKGROUND_THEME_COLLECTION  = 'Устанавливаем набор фонов темы';
export const EDITOR_BACKGROUND_DELETE_FROM_THEME        = 'Удаляем фоон из темы';
export const EDITOR_CLEAR_THEME_DATA            = 'Очищаем фоны и стикеры редактора';
export const SET_EXIT_CONFIRM_MODAL             = 'Модалка подтверждения выхода';

export const EDITOR_UPDATE_ACTION_READY_STATUS  = 'Изменения статуса готовности продукта';

export const EDITOR_SET_CONTROL_ELEMENT_ID      = 'Назначаем id элемента на котором рисуем контрол';
export const EDITOR_UPDATE_BLOCK_DATA           = 'Обновляем данные блока';

export const EDITOR_SET_MAGNETIC                = 'Переключаем режим примагничивания';

export const EDITOR_RATIO                       = 'Устанавливаем ratio в redux';
export const EDITOR_SET_FULLSCREEN_LOADER       = 'Устанавливаем fullscreenLoader';

export const EDITOR_SET_THEME_ID                = 'Запись id выбранной темы';
export const ADMIN_THEME_GET_DATA              = 'Запрашиваем содержимое темы';
export const ADMIN_THEME_PUT_DATA              = 'Записываем содержимое темы в redux';



export const MODAL_EDITOR_ADD_PHOTOS            = 'Модалка добавления фотографий в редактор';
export const MODAL_EDITOR_AUTOFILL              = 'Модалка авторазмещения фотографий в редактор';
export const MODAL_POSTER_CONFIG                = 'Модалка настроек постера';

export const MODAL_ADMIN_DIALOG                 = 'Модалка для админа';



export const PRODUCT_SET_SELECTED               = 'Назначаем выбранный продукт';
export const FORMAT_SET_SELECTED                = 'Назначаем выбранный формат';
export const FORMAT_SET_ROTATION                = 'Поворачивам форматы';
export const OPTION_SET_SELECTED                = 'Назначаем формат опции';


export const ADMIN_GET_PRODUCTS_LIST            = 'Получение списка продуктов для админа';
export const ADMIN_SET_PRODUCTS_LIST            = 'Запись списка продуктов';
export const ADMIN_SET_PRODUCTS_LIST_PROGRESS   = 'Получение списка продуктов в процессе';
export const ADMIN_DESELECT_PRODUCT             = 'Назад ко всем продуктам';
export const ADMIN_GET_PRODUCT                  = 'Получение свойств выбранного продукта';
export const ADMIN_SET_PRODUCT                  = 'Запись свойств выбранного продукта';
export const ADMIN_DISABLE_NAV                  = 'Блокировка навигации';
export const ADMIN_SET_AVAIBLE_PRODUCTS_TYPES   = 'Запись доступные типы продуктов';
export const ADMIN_SET_AVAIBLE_PRODUCTS_GROUPS  = 'Запись доступные группы продуктов';

export const ADMIN_UPLOAD_PRODUCT_IMAGE         = 'Загрузка изображения продукта';
export const ADMIN_PHOTOS_SET_PHOTO             = 'Запись изображения продукта';
export const ADMIN_PHOTOS_REMOVE_PHOTO          = 'Удаление изображения продукта из буфера';



export const ADMIN_STICKERS_GET_STICKERS        = 'Получение списка стикерпаков';
export const ADMIN_STICKERS_SET_STICKERS        = 'Запись списка стикерпаков';
export const ADMIN_STICKERS_GET_STICKER_PACK    = 'Получение конкретного стикерпака';
export const ADMIN_STICKERS_SET_STICKER_PACK    = 'Запись конкретного стикерпака';
export const ADMIN_STICKERS_SET_STICKER_PACK_STICKERS        = 'Запись стикеров конкретного стикерпака';
export const ADMIN_STICKERS_STICKER_PACK_CREATE = 'Создание стикерпака';
export const ADMIN_STICKERS_STICKER_PACK_UPDATE = 'Обновление стикерпака';
export const ADMIN_STICKERS_STICKER_PACK_DELETE = 'Удаление стикерпака';
export const ADMIN_STICKERS_CLEAR               = 'Очистка списка стикерпаков';
export const ADMIN_STICKERS_SET_STICKER         = 'Изменить свойства стикера';
export const ADMIN_STICKERS_SELECT_STICKERS     = 'Отменить выбор/ выбрать все стикеры';
export const ADMIN_STICKERS_MOVE_STICKERS       = 'Перенести стикеры в другую коллекцию';
export const ADMIN_STICKERS_SELECT_STICKERPACK  = 'Выбрать стикерпак';
export const ADMIN_STICKERS_STICKER_UPLOAD      = 'Загрузить файл стикера';
export const ADMIN_STICKERS_ADD_UPLOADED        = 'Запись загруженного файла стикера в redux';
export const ADMIN_STICKERS_STICKER_UPDATE      = 'Обновить стикер';
export const ADMIN_STICKERS_STICKER_DELETE      = 'Удалить стикер';
export const ADMIN_STICKERS_STICKER_PACK_SORT   = 'Сортировать стикерпак';
export const ADMIN_STICKERS_STICKER_SORT        = 'Сортировать стикер';
export const ADMIN_STICKERS_BULK_UPDATE         = 'Обновить несколько стикеров';
export const ADMIN_STICKERS_BULK_DELETE         = 'Удалить несколько стикеров';
export const ADMIN_STICKERS_REMOVE_FROM_PACK    = 'Убрать удаленный стикер из redux';
export const ADMIN_THEME_STICKER_DELETE         = 'Удалить стикер из темы';

export const ADMIN_BACKGROUNDS_GET_BACKGROUNDS          = 'Получение списка  коллекций фонов';
export const ADMIN_BACKGROUNDS_SET_BACKGROUNDS          = 'Запись списка коллекций фонов';
export const ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK      = 'Получение конкретного коллекции фонов';
export const ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK      = 'Запись конкретного коллекции фонов';
export const ADMIN_BACKGROUNDS_BACKGROUND_PACK_CREATE   = 'Создание коллекции фонов';
export const ADMIN_BACKGROUNDS_BACKGROUND_PACK_UPDATE   = 'Обновление коллекции фонов';
export const ADMIN_BACKGROUNDS_BACKGROUND_PACK_DELETE   = 'Удаление коллекции фонов';
export const ADMIN_BACKGROUNDS_CLEAR                    = 'Очистка списка коллекций фонов';
export const ADMIN_BACKGROUNDS_SET_BACKGROUND           = 'Изменить свойства фона';
export const ADMIN_BACKGROUNDS_SELECT_BACKGROUNDS       = 'Отменить выбор/ выбрать все фоны';
export const ADMIN_BACKGROUNDS_MOVE_BACKGROUNDS         = 'Перенести фоны в другую коллекцию';
export const ADMIN_BACKGROUNDS_SELECT_BACKGROUND_PACK   = 'Выбрать коллекцию фонов';
export const ADMIN_BACKGROUNDS_BACKGROUND_UPLOAD        = 'Загрузить файл фона';
export const ADMIN_BACKGROUNDS_ADD_UPLOADED             = 'Запись загруженного файла фона в redux';
export const ADMIN_BACKGROUNDS_BACKGROUND_UPDATE        = 'Обновить фон';
export const ADMIN_BACKGROUNDS_BACKGROUND_DELETE        = 'Удалить фон';
export const ADMIN_BACKGROUNDS_BACKGROUND_PACK_SORT     = 'Сортировать коллекцию фонов';
export const ADMIN_BACKGROUNDS_BACKGROUND_SORT          = 'Сортировать фон';
export const ADMIN_BACKGROUNDS_BULK_UPDATE              = 'Обновить несколько фонов';
export const ADMIN_BACKGROUNDS_BULK_DELETE              = 'Удалить несколько фонов';
export const ADMIN_BACKGROUNDS_REMOVE_FROM_PACK         = 'Убрать удаленный фон из redux';
export const ADMIN_THEME_BACKGROUND_DELETE              = 'Удалить фон из темы';





export const SHOP_GET_PRODUCTSETS_PAGE          = 'Получение страницы витрины';
export const SHOP_SET_PRODUCTSETS_PAGE          = 'Запись страницы витрины';
export const SHOP_GET_PRODUCTSET                = 'Получение товара витрины';
export const SHOP_SET_PRODUCTSET                = 'Запись товара витрины';
export const SHOP_GET_PRODUCTSET_CATEGORIES     = 'Получение категорий витрины';
export const SHOP_SET_PRODUCTSET_CATEGORIES     = 'Запись категорий витрины';
export const SHOP_GET_FILTERS                   = 'Получение фильтров в магазине';
export const SHOP_PUT_FILTERS                   = 'Запись фильтров в магазине';
export const SHOP_SET_FILTERS                   = 'Запись настроек фильтров и страниц в магазине';
export const SHOP_BUY_PRODUCT                   = 'Купить продукт';

export const MY_SHOP_GET_PRODUCTSETS_PAGE       = 'Получение страницы витрины дизайнера';
export const MY_SHOP_SET_PRODUCTSETS_PAGE       = 'Запись страницы витрины дизайнера';
export const MY_SHOP_SET_PAGE                   = 'Запись текущей страницы';
export const MY_SHOP_GET_PRODUCTSET             = 'Получение товара витрины дизайнера';
export const MY_SHOP_SET_PRODUCTSET             = 'Запись товара витрины дизайнера';
export const MY_SHOP_PRODUCTSET_CREATE          = 'Изменение товара витрины дизайнером';
export const MY_SHOP_PRODUCTSET_UPDATE          = 'Обновление товара витрины дизайнером';
export const MY_SHOP_PRODUCTSET_DELETE          = 'Удаление товара витрины дизайнером';
export const MY_SHOP_PRODUCTSET_CHANGE_STATUS   = 'Изменение статуса публикации';
export const MY_SHOP_CLEAR_DATA                 = 'Очистить текущую коллекцию и страницу коллекций';
export const ALL_SHOP_CLEAR_DATA                = 'Очистить все страницы магазинов';



/*

//Работа с лоадерами на экране
export const MAIN_FULL_SCREEN_LOADER_SHOW = 'MAIN_FULL_SCREEN_LOADER_SHOW';
export const MAIN_FULL_SCREEN_LOADER_HIDE = 'MAIN_FULL_SCREEN_LOADER_HIDE';

//Боковое меню
export const MAIN_MENU_SET_OPEN = 'MAIN_MENU_SET_OPEN';

//НАСТРОЙКИ РЕДАКТОР
//Галлерея в редакторе внизу
export const EDITOR_SET_GALLERY_ORIENTATION_TO_HORIZONTAL = 'EDITOR_SET_GALLERY_ORIENTATION_TO_HORIZONTAL';

//Галлерея в редакторе справа
export const EDITOR_SET_GALLERY_ORIENTATION_TO_VERTICAL = 'EDITOR_SET_GALLERY_ORIENTATION_TO_VERTICAL';

//Изменение размера редактора
export const EDITOR_SET_GALLERY_SIZE_HORIZONTAL = 'EDITOR_SET_GALLERY_SIZE_HORIZONTAL';
export const EDITOR_SET_GALLERY_SIZE_VERTICAL = 'EDITOR_SET_GALLERY_SIZE_VERTICAL';

//Изменение выбранного раздела библиотеки редактора
export const EDITOR_SET_GALLEY_TAB = 'EDITOR_SET_GALLEY_TAB';

//Изменеие выбранного раздела редактора
export const HEADER_SET_TAB = 'HEADER_SET_TAB';

//Навигатор по страницам редактора
export const EDITOR_SET_ALBUM_PAGES = 'EDITOR_SET_ALBUM_PAGES';

//вкл/выкл фильтр галереии фото
//вкл/выкл фильтр галереии фото
export const PHOTOS_FILTER_PLACED_SET_STATE = 'PHOTOS_FILTER_PLACED_SET_STATE';
export const PHOTOS_FILTER_DOUBLE_SET_STATE = 'PHOTOS_FILTER_DOUBLE_SET_STATE';
export const PHOTOS_FILTER_BLUR_SET_STATE = 'PHOTOS_FILTER_BLUR_SET_STATE';
export const PHOTOS_ANALYSE_SET_STATE = 'PHOTOS_ANALYSE_SET_STATE';
export const PHOTOS_AUTOPLACE_SET_STATE = 'PHOTOS_AUTOPLACE_SET_STATE';

//сортировка и группировка фотографий в галерее
export const PHOTOS_SORT = 'PHOTOS_SORT';
export const PHOTOS_GROUP_TOGGLE = 'PHOTOS_GROUP_TOGGLE';

//работа с выделенной фотографией
export const PHOTO_SELECT = 'PHOTO_SELECT';
export const PHOTO_DELETE = 'PHOTO_DELETE';
export const PHOTO_DELETE_ALL = 'PHOTO_DELETE_ALL';
export const PHOTO_DESELECT = 'PHOTO_DESELECT';
export const PHOTO_SELECT_MULTIPLE_SET_STATE = 'PHOTO_SELECT_MULTIPLE_SET_STATE';
export const PHOTO_SHOW_DUPLICATES_SET_STATE = 'PHOTO_SHOW_DUPLICATES_SET_STATE';
export const PHOTO_MAKE_NO_BLURED = 'PHOTO_MAKE_NO_BLURED';

export const EDITOR_SET_GALLERY = 'EDITOR_SET_GALLERY';

//Layout
export const LAYOUT_SET_ID = 'LAYOUT_SET_ID';

//WebSocket (WS)
export const WS_SET_CONNECTED_STATUS = 'WS_SET_CONNECTED_STATUS';

*/
