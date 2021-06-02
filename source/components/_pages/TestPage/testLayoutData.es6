export default {
    id: '123456-12345-1234',
    userId: '3453453453453454345',
    type: 'photobook',
    themeId:  '5434345354332234244',
    name: 'Название фотокниги',
    format: {
        w: 200, //мм
        h: 200  //мм
    },
    blockSize: { //размер одного turn (разворота) блока
        w: 400, //мм
        h: 200  //мм
    },
    coverType: 'hard-cover', //???
    lamination: 'gloss',
    photos: [],
    backgrounds: [],
    stickers: [],

    turns: [
        {
            id: 'turn-id-1',
            type: 'page',
            pages: {
                'startPage': 'page_id-2',

                'page-id-1': {
                    linkTo: {
                        right: 'page-id-3'
                    }
                },
                'page-id-2': {
                    linkTo: {
                        right: 'page-id-1'
                    },
                    blocks: [
                        {
                            id: 'block-id-1',
                            type: 'empty',
                            x: 10, //координата Х в мм
                            y: 10, //координата Y в мм
                            w: 50, //ширина в мм
                            h: 40, //высота в мм
                            r: 0,  //угол поворота

                            oTop: 0,    //верхняя грань в мм
                            oLeft: 0,   //левая грань в мм
                            oRight: 0,  //правая грань в мм
                            oWBottom: 0 //нижняя грань в мм
                        }
                    ]
                },
                'page-id-3': {},
            }
        }
    ]
}


/*
{
    0: {
    width: 150,
        height: 200,
        top: 10,
        left: 10,
        rotateAngle: 0,
        color: 'red',
        photo: {
        url: 'http://lh3.googleusercontent.com/BaIShQBLrBWEgxHoCYFDHJDwNDbFuaVA4U_O40a28wcb4dJTLTPsvDANaGmE8roGwPqqWgW9t_r2nanITDwIatcK=h750',
            width: 150,
            height: 200,
            ratio: 0.75,
            top: 0,
            left: 0,
            rotateAngle: 0
    }
},
    1: {
    width: 250,
        height: 150,
        top: 10,
        left: 250,
        rotateAngle: 0,
        color: 'green',
},
    2: {
    width: 90,
        height: 90,
        top: 250,
        left: 100,
        rotateAngle: 25,
        color: 'blue',
}
}
*/