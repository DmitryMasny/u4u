import LINKS from "config/links";
import {
    fotografii_i_shirokoformatnaya_pechat_fotografii,
    vipusknoi,
    u4u_ru_servis_dlya_bistrogo_sozdaniya_fotoknig,
    fotokniga,
    fotoalbom,
    albom,
    albom_s_fotografiyami,
    shkolnie_albomi,
    svadebnii_albom,
    semeinii_albom,
    detskii_albom,
    fotografii_novorojdennogo,
    kak_sdelat_krasivii_fotoalbom,
    oformlenie_dizain_fotoknig_i_fotoalbomov,
    photografii_premium,
    holsti,
    posteri,
    interiernaya_pechat,
    shirokoformatnaya_pechat,
    portfolio
} from './tx';

const texts = (() => ({
    [ LINKS.PRODUCT.replace( ':productType?', '4' ) ]: { texts: [posteri, shirokoformatnaya_pechat] }, //постеры
    [ LINKS.PRODUCT.replace( ':productType?', '6' ) ]: { texts: [interiernaya_pechat, shirokoformatnaya_pechat] }, //постеры премиум

    [ LINKS.PRODUCT.replace( ':productType?', '8' ) ]: { texts: [holsti, interiernaya_pechat, shirokoformatnaya_pechat] },  //холсты

    [ LINKS.PRODUCT.replace( ':productType?', '7' ) ]: { texts: [photografii_premium] }, //фотографии премиум
    [ LINKS.PRODUCT.replace( ':productType?', '5' ) ]: { texts: [fotografii_i_shirokoformatnaya_pechat_fotografii] },

    [ LINKS.GALLERY.replace( ':categoryId?', '8' ) ]: { texts: [vipusknoi, shkolnie_albomi] },//выпускной
    [ LINKS.GALLERY.replace( ':categoryId?', '5' ) ]: { texts: [svadebnii_albom] },           //свадьба
    [ LINKS.GALLERY.replace( ':categoryId?', '3' ) ]: { texts: [semeinii_albom] },            //семья
    [ LINKS.GALLERY.replace( ':categoryId?', '2' ) ]: { texts: [detskii_albom, fotografii_novorojdennogo] }, //дети
    [ LINKS.GALLERY.replace( ':categoryId?', '' ) ]:  { texts: [kak_sdelat_krasivii_fotoalbom, oformlenie_dizain_fotoknig_i_fotoalbomov, oformlenie_dizain_fotoknig_i_fotoalbomov] }, //Галлерея основаная

    [ LINKS.INDEX ]: { //главная страница
        texts: [
            u4u_ru_servis_dlya_bistrogo_sozdaniya_fotoknig,
            fotokniga,
            fotoalbom,
            albom,
            albom_s_fotografiyami,
            portfolio
        ]
    }
}))();


export default texts;
