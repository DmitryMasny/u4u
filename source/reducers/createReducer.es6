export default (initialState, handlers) =>  function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) return handlers[action.type](state, action);
        return state;
}