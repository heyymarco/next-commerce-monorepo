// cssfn:
import {
    // writes css in javascript:
    style,
    children,
}                           from '@cssfn/core'                      // writes css in javascript

// reusable-ui core:
import {
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesDragOverlayLayout = () => {
    return style({
        // positions:
        position  : 'fixed',
        zIndex    : globalStacks.dragOverlay,
        translate : '-50% -50%',
        
        
        
        // layouts:
        display   : 'grid',
        
        
        
        // sizes:
        width     : 'max-content', // prevents not shringking by <body>'s padding
        height    : 'max-content', // prevents not shringking by <body>'s padding
        
        
        
        // accessibilities:
        pointerEvents : 'none', // ghost mode
        
        
        
        // children:
        overflow: 'visible',
        ...children('*', {
            // accessibilities:
            pointerEvents : 'initial', // undo ghost mode, so we can set the cursor (if any)
        }),
    });
};

export default () => style({
    // layouts:
    ...usesDragOverlayLayout(),
});
