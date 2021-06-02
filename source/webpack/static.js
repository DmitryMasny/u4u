const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const fs = require('fs');

class MetaInfoPlugin {
    constructor( options ) {
        this.options = options;
    }

    apply( compiler ) {
        compiler.hooks.shouldEmit.tap( this.constructor.name, stats => {

            console.log('CURRENT HASH:', stats.hash);
            //const metaInfo = {
            // add any other information if necessary
            //    hash: stats.hash
            //};
            //const json = JSON.stringify(metaInfo);

            const textInFile = `
let s = document.createElement('script');
s.type = "text/javascript";
s.src = "/js_spa/index-${stats.hash}.js";
document.body.append(s);
            `;
            return new Promise((resolve, reject) => {

                let list = this.options.filename.split(/[\\\/]/);
                let filename = list.pop();
                let filepath = list.join('/');

                console.log( '----filepath', filepath );

                fs.mkdirSync( filepath, { recursive: true }, ( err ) => {
                    console.log( 'Ошибка создания директории', filepath );
                    if (err) throw err;
                });

                fs.writeFileSync( this.options.filename, textInFile, 'utf8', error => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
}

module.exports = function(notRenderStartJs, PATHS) {
    if ( notRenderStartJs ) {
        return { plugins: [] }
    }
    return {
        plugins: [
            new MetaInfoPlugin( {
                                    filename: PATHS.build + '/js_spa/start.js'
                                } )
        ]
    }
};