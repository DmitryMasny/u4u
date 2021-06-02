//получение идентификатора роли пользователя
export const userRoleSelector  = (state: any) => state.user.auth.role;

export const userRoleIsAdmin   = ( state: any ): boolean => userRoleSelector( state ) === 'admin';
export const userRoleIsUser    = ( state: any ): boolean => userRoleSelector( state ) === 'user';
export const userRoleIsVisitor = ( state: any ): boolean => userRoleSelector( state ) === 'visitor';