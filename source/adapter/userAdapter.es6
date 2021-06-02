import { createAdapter } from 'api-adapter';

//адаптер получения данных о token с сервера
export const getTokenAdapter = createAdapter({
  'token': 'token',
  'userId': 'userId'
});

export const userAuthAdapter = createAdapter({
    'password': 'pwd',
    'phone': 'phone',
    'email': 'email',
    'responseId': 'responseId'
});

export const themesListAdapter = createAdapter({
    'items': 'items',
    'topicNames': '.',
    'params': '.'
});
