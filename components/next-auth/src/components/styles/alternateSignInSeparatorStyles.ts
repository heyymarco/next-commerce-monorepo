// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



export const usesAlternateSignInSeparatorLayout = () => {
    return style({
        // layouts:
        display        : 'flex',    // use block flexbox, so it takes the entire parent's width
        flexDirection  : 'row',     // items are stacked horizontally
        justifyContent : 'center',  // center items horizontally
        alignItems     : 'center',  // center items vertically
        flexWrap       : 'nowrap',  // no wrapping
        
        
        
        // spacings:
        gap            : spacers.sm,
        
        
        
        // children:
        ...children('hr', {
            // sizes:
            flex       : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width
        }),
        ...children('.text', {
            // appearances:
            opacity    : 0.5,
            
            
            
            // sizes:
            flex       : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
        }),
    });
};
export default () => style({
    // layouts:
    ...usesAlternateSignInSeparatorLayout(),
});