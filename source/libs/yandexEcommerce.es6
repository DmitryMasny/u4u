//window.dataLayer
//Методы по работе с Yandex.Metrika Ecommerce

import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'
import lexem from 'libs/lexems';

const YaMetric_ConvertToProduct = ({ bindingType, coverType, coverLaminationType, format }) => {
    const name = lexem( PRODUCT_TYPE_PHOTOBOOK, 'type', coverType, bindingType );
    const variant = format + ' ' + lexem('COVER', coverLaminationType.toUpperCase());

    return {
        name: name,
        variant: variant
    }
};



/**
 * Просмотр страницы с продуктом
 */
const YaMetric_ShowProduct = ( { id,
                                 bindingType,
                                 coverType,
                                 coverLaminationType,
                                 format,
                                 price,
                                 brand = 'U4U',
                                 category = 'Фотокнига'} ) => {

    if ( !localStorage ) return;

    const { name, variant } = YaMetric_ConvertToProduct({
                                                            bindingType: bindingType,
                                                            coverType: coverType,
                                                            coverLaminationType: coverLaminationType,
                                                            format: format
                                                        });

    window.dataLayer.push({
                              "ecommerce": {
                                  "detail": {
                                      "products": [
                                          {
                                              "id": id,
                                              "name" : name,
                                              "price": price,
                                              "brand": brand,
                                              "category": category,
                                              "variant" : variant
                                          }
                                      ]
                                  }
                              }
                          });
};

/**
 * Добавляем продукт в корзину
 */
const YaMetric_AddToCart = ( { id,
                                 bindingType,
                                 coverType,
                                 coverLaminationType,
                                 format,
                                 price,
                                 brand = 'U4U',
                                 category = 'Фотокнига',
                                 quantity = 1} ) => {

    if ( !localStorage ) return;

    const { name, variant } = YaMetric_ConvertToProduct({
                                                            bindingType: bindingType,
                                                            coverType: coverType,
                                                            coverLaminationType: coverLaminationType,
                                                            format: format
                                                        });

    window.dataLayer.push({
                              "ecommerce": {
                                  "add": {
                                      "products": [
                                          {
                                              "id": id,
                                              "name" : name,
                                              "price": price,
                                              "brand": brand,
                                              "category": category,
                                              "variant" : variant,
                                              "quantity": quantity
                                          }
                                      ]
                                  }
                              }
                          });
};



const addToCartProduct = localStorage && localStorage.getItem('add_to_cart') || null;

if ( addToCartProduct ) {
    let addToCartProductObj = null;

    try {
        addToCartProductObj = JSON.parse( addToCartProduct );
    } catch(e) {

    }
    if (addToCartProductObj) {

        YaMetric_AddToCart({
                               id: addToCartProductObj.id,
                               bindingType: addToCartProductObj.bindingType,
                               coverType: addToCartProductObj.coverType,
                               coverLaminationType: addToCartProductObj.coverLaminationType,
                               format: addToCartProductObj.formatName.replace('см', '').trim().replace('х','x'),
                               price: addToCartProductObj.price
                           });
    }
    localStorage.removeItem('add_to_cart');
}

/**
 * Удаляем продукт из карзины
 */
const YaMetric_RemoveFromCart = ({ id,
                                   bindingType,
                                   coverType,
                                   coverLaminationType,
                                   format,
                                   price,
                                   brand = 'U4U',
                                   category = 'Фотокнига',
                                   quantity = 1} ) => {
    if ( !localStorage ) return;

    const { name, variant } = YaMetric_ConvertToProduct({
                                                            bindingType: bindingType,
                                                            coverType: coverType,
                                                            coverLaminationType: coverLaminationType,
                                                            format: format
                                                        });

    window.dataLayer.push({
                              "ecommerce": {
                                  "remove": {
                                      "products": [
                                          {
                                              "id": id,
                                              "name" : name,
                                              "price": price,
                                              "brand": brand,
                                              "category": category,
                                              "variant" : variant,
                                              "quantity": quantity
                                          }
                                      ]
                                  }
                              }
                          });
};

/**
 * Купили продукты
 */
const YaMetric_Pokupka = () => {
     return;//TODO: временно выключили метрику, падает когда в card_data в local_store

    if ( !localStorage ) return;

    const cartData = localStorage.getItem('cart_data');
    if ( !cartData ) return;

    let cartObj = null;

    try {
        cartObj = JSON.parse( cartData );
    } catch(e) {

    }
    if ( !cartObj ) return;

    const products = cartObj.orders.map( ( product ) => {

        const { name, variant } = YaMetric_ConvertToProduct({
                                                                bindingType: product.info.bindingType,
                                                                coverType: product.info.coverType,
                                                                coverLaminationType: product.info.lamination,
                                                                format:  product.info.formatName.replace('см', '').trim().replace('х','x')
                                                            });

        return {
            "id": product.layoutId,
            "name": name,
            "price": product.info.price,
            "brand": "U4U",
            "category": "Фотокнига",
            "variant": variant,
            "quantity": product.count,
        };
    });


    window.dataLayer.push( {
                        "ecommerce": {
                            "purchase": {
                                "actionField": {
                                    "id": cartObj.id,
                                    "revenue": cartObj.totalCost
                                },
                                "products": products
                            }
                        }
                    } );

    localStorage.removeItem('cart_data');
};

YaMetric_Pokupka();

export { YaMetric_ShowProduct, YaMetric_AddToCart, YaMetric_RemoveFromCart }