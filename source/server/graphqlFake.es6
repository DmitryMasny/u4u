import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const axiosInstance = axios.create({
                                    method: "POST",
                                    baseURL: '',
                                    timeout: 1000,
                                    headers: { 'X-Custom-Header': 'foobar' }
                                 });
const mock = new MockAdapter( axiosInstance, { delayResponse: 0 } );

/*
mock.onPost('1').reply(200,
                                    {
                                        id: '654932154982436',
                                        userId: '0123571113',
                                        name: 'Постернейм'
                                    }
);
*/
export default axiosInstance;