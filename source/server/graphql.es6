import axios from 'axios';
import { store } from 'components/App';
import fakeQuery  from 'server/graphqlFake';
import { userTokenSelector } from 'selectors/user';

let instanceAxios = null;

const initAxios = () => {
    if ( instanceAxios ) return instanceAxios;

    instanceAxios = axios.create({
        method: 'POST',
        baseURL: '/api/graphql/',
        timeout: 5000,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000,
        headers: {'authorization':  'Bearer ' + userTokenSelector( store.getState() )}
    });

    return instanceAxios;
};


const graphQL = (() => {
    const getQuery = ( query, fake = false, adapter = null ) => new Promise((resolve, reject) => {
        const axiosInstance = initAxios();

        const q = { data: { query: query } };
        if ( fake ) q.url = fake.toString();

        return (fake ? fakeQuery : axiosInstance)( q )
                        .then( ( resp ) => {
                            const data = fake ? resp.data : resp.data.data;
                            resolve( adapter ? adapter( data ) : data  );
                        })
                        .catch( ( err ) => {
                            reject( {
                                error: err,
                                response: err.response && err.response.data.errors
                            } )
                         } );
    });

    return {
        get: ( { data, fake = false, adapter = null } ) => getQuery( `query {${data}}`, fake, adapter ),
        set: ( { data, fake = false, adapter = null } ) => getQuery( `mutation {${data}}`, fake, adapter )
    };
})();

export { graphQL };