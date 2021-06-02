// import {EDITOR_TABS} from "./_config";

// export const productsTabSelector = ( state ) => state.admin.products.products.tab;

export const productsSelector = ( state ) => state.admin.products.productList;
export const productsInProgressSelector = ( state ) => state.admin.products.productListInProgress;
export const currentProductSelector = ( state ) => state.admin.products.currentProduct;
export const disableNavSelector = ( state ) => state.admin.products.disableNav;
export const adminProductImagesSelector = ( state ) => state.admin.products.productImages;
export const adminProductTypesSelector = ( state ) => state.admin.products.productTypes;
export const adminProductGroupsSelector = ( state ) => state.admin.products.productGroups;

export const optionsBufferSelector = ( state ) => state.admin.products.optionsBuffer;
export const formatsBufferSelector = ( state ) => state.admin.products.formatsBuffer;


export const windowWidthSelector = ( state ) => state.global.windowWidth;
export const windowHeightSelector = ( state ) => state.global.windowHeight;
export const windowMediaSelector = ( state ) => state.global.windowMedia;
export const windowIsMobileSelector = ( state ) => state.global.windowIsMobile;
export const windowOrientationSelector = ( state ) => state.global.windowOrientation;
