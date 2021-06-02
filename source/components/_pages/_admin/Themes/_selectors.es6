// import {EDITOR_TABS} from "./_config";

// export const productsTabSelector = ( state ) => state.admin.products.tab;

export const productsSelector = ( state ) => state.admin.products.productList;
export const currentProductSelector = ( state ) => state.admin.products.currentProduct;



export const windowWidthSelector = ( state ) => state.global.windowWidth;
export const windowHeightSelector = ( state ) => state.global.windowHeight;
export const windowMediaSelector = ( state ) => state.global.windowMedia;
export const windowIsMobileSelector = ( state ) => state.global.windowIsMobile;
export const windowOrientationSelector = ( state ) => state.global.windowOrientation;
