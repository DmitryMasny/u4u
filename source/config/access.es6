const ROLE_VISITOR = 'visitor';
const ROLE_USER    = 'user';
const ADMIN_USER   = 'admin';


//значения доступа по умолчанию и для роли Visitor,
//с нее же строиться основной редьюсер по умолчанию
const ACCESSES = {
    hasProfile: false,
    hasMyProducts: false,
};

//роль USER
const user = {
  hasProfile: true,
  hasMyProducts: true,
};

//роль ADMIN
const admin = {
    hasProfile: true,
    hasMyProducts: true,
};

//Так как ниже роли Visitore нет, то сливаем эту роль с назначеной
const accessList = ( role ) => {
    switch ( role ) {
        case ROLE_USER:
            return {
                ...ACCESSES,
                ...user
            };
            break;

        case ADMIN_USER:
            return {
                ...ACCESSES,
                ...admin
            };
            break;

        case ROLE_VISITOR:
        default:
            return ACCESSES;
    }
};

export { accessList, ACCESSES }
