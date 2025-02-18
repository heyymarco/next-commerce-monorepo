// cssfn:
import {
    // cssfn general types:
    Factory,
    
    
    
    // cssfn css specific types:
    CssRule,
    
    
    
    // writes css in javascript:
    style,
    
    
    
    // strongly typed of css variables:
    CssVars,
    cssVars,
}                           from '@cssfn/core'                  // writes css in javascript



// hooks:

// features:

//#region image
export interface ImageVars {
    /**
     * `<Image>`'s width.
     */
    intrinsicWidth  : any
    
    /**
     * `<Image>`'s height.
     */
    intrinsicHeight : any
}
const [imageVars] = cssVars<ImageVars>({ prefix: 'image', minify: false }); // shared variables: ensures the server-side & client-side have the same generated css variable names



export interface ImageStuff { imageRule: Factory<CssRule>, imageVars: CssVars<ImageVars> }
export interface ImageConfig {
    /* not implemented yet */
}
/**
 * Uses image variables.
 * @param config  A configuration of `imageRule`.
 * @returns A `ImageStuff` represents the image rules.
 */
export const usesImage = (config?: ImageConfig): ImageStuff => {
    return {
        imageRule: () => style({
            /* not implemented yet */
        }),
        imageVars,
    };
};
//#endregion image
