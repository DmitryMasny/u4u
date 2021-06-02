import {createStore, applyMiddleware} from 'redux';
import reducers from 'reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import serverActions from 'middleware/serverActions';

//import { serverActions } from 'middleware/serverActions';
let instance;

const configureStore = () => {
    //получение данных состояния из localStorage, если они есть
    //const persistedState = storage.getStore();

    //создаем стор
    // if (persistedState) {
    //     return createStore(reducers, persistedState, composeWithDevTools(applyMiddleware(thunk, serverActions)));
    //} else {
        //return createStore(reducers, composeWithDevTools(applyMiddleware(thunk, serverActions)));
        if (!instance) instance = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, serverActions)));
        return instance;
    //}
};

const store = configureStore();
export default store;
