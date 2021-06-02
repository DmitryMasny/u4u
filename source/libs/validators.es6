const commandsPriority = {
    'exist' : 2,
    'phone' : 1,
    'email' : 1
}

/**
 * функция проверки на соответвие правильности email
 *
 * @param {string} email
 * @returns {boolean}
 */
const validateEmail = ( email ) => {
    email = email.toLowerCase();
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
};

/**
 * функция проверки на соответвие правильности телефона
 *
 * @param {string} phone
 * @returns {boolean}
 */
const validateForPhone = ( phone ) => {
    //const re = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
    const re = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
    return re.test( phone );
};

/**
 * получаем самое важное сообщение по валидации массива
 * @param data <array>
 */
const getMostImportantText = ( data ) => {

    let result = {
        text: null,
        priority: 0
    };

    Object.keys(data).map((item) => {

        const d = data[item];
        const p = commandsPriority[d.validator];

        if ( p > result.priority ) {
            result.priority = p;
            result.text = d.text;
        }
    });

    return result.text;
};

/**
 * команды валидации
 */
const validationCommands = {
    'exist': ( d ) => {return d.length > 0},
    'phone': ( d ) => validateForPhone( d ),
    'email': ( d ) => validateEmail( d )
};

/**
 * Ковертер данных для подготовки отправки с storage
 * @param data
 */
const convertValidationToStoreObject = ( data ) => {
    const result = {};
    if (!data) return result;
    Object.keys( data ).map( item => {
        result[ item ] = data[ item ].text;
    });
    return result;
};

/**
 * @param instructionArray - массив, иструкция валидации
 * @param sourceData - объект, источник данных
 * return array || null;
 */
const validateArray = ( { instructionArray, sourceData } ) => {
    let err = [];
    instructionArray.map( item => {
        if ( item.validator ) {
            if ( !validationCommands[ item.validator ] ) return;
            if ( item.require && !sourceData[ item.name ] ) {
                err[ 'error_' + item.name ] = {
                    text: item.errorEmpty,
                    validator: item.validator
                };
            } else if ( sourceData[ item.name ] && !validationCommands[ item.validator ]( sourceData[ item.name ] ) ) {
                err[ 'error_' + item.name ] = {
                    text: item.error,
                    validator: item.validator
                };
            }
        }
    });

    return Object.keys( err ).length && err || null;
};

export { validateEmail, validateForPhone, validateArray, convertValidationToStoreObject, getMostImportantText }
//7 123 456 78 90