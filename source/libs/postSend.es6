/**
 * Функция берет GET URL запрос, конвертирует в форму и отправляет его методом POST
 * @param {string} url
 * @param {boolean=} multipart флаг разделения отправления на части
 */
export default ( url, multipart = false) => {
    const form = document.createElement( "FORM" );
    form.method = "POST";

    if ( multipart ) form.enctype = "multipart/form-data";

    form.style.display = "none";
    document.body.appendChild( form );

    form.action = url.replace( /\?(.*)/, function ( _, urlArgs ) {
        urlArgs.replace( /\+/g, " " ).replace( /([^&=]+)=([^&=]*)/g, function ( input, key, value ) {
            input = document.createElement( "INPUT" );
            input.type = "hidden";
            input.name = decodeURIComponent( key );
            input.value = decodeURIComponent( value );
            form.appendChild( input );
        } );
        return '';
    } );

    form.submit();
};