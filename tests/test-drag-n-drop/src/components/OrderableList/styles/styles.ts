// cssfn:
import {
    // writes css in javascript:
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesListItemWithOrderableLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // positions:
        position : 'relative', // we use relative instead of absolute, so the width/height is preserved within <List>
        zIndex   : globalStacks.dragOverlay,
        
        
        
        // accessibilities:
        pointerEvents : 'none', // ghost mode
        
        
        
        // borders:
        border                 : borderVars.border,       // restore border stripped out by `inheritBorderFromParent`
     // borderRadius           : borderVars.borderRadius, // restore border stripped out by `inheritBorderFromParent`
        borderStartStartRadius : borderVars.borderStartStartRadius,
        borderStartEndRadius   : borderVars.borderStartEndRadius,
        borderEndStartRadius   : borderVars.borderEndStartRadius,
        borderEndEndRadius     : borderVars.borderEndEndRadius,
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        margin : `calc(0px - ${borderVars.borderWidth})`, // a compensate for borderWidth to preserve the original size
    });
};

export default () => style({
    // layouts:
    ...usesListItemWithOrderableLayout(),
});
