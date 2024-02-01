// cssfn:
import {
    // writes css in javascript:
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesListItemWithOrderableLayout = () => {
    return style({
        // positions:
        position : 'relative', // we use relative instead of absolute, so the width/height is preserved within <List>
        zIndex   : globalStacks.dragOverlay,
        
        
        
        // accessibilities:
        pointerEvents : 'none', // ghost mode
    });
};

export default () => style({
    // layouts:
    ...usesListItemWithOrderableLayout(),
});
