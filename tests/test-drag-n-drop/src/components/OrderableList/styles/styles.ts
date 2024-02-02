// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'           // a styled basic building block of Reusable-UI components
import {
    // elements:
    wrapperElm,
    
    
    
    // configs:
    lists,
}                           from '@reusable-ui/list'            // represents a series of content



// styles:
export const usesOrderableListLayout = () => {
    return style({
        // children:
        ...children(wrapperElm, {
            // animations:
            transition : [
                // original:
                [lists.transition],
                
                // overwrites:
                
                // borders:
                ['border-width' , '0s'], // does not support transition on border width , because we use it to make a separator
                ['border-radius', '0s'], // does not support transition on border radius, because we remove border radius while dragging
            ],
            ...children('*', {
                // animations:
                transition : [
                    // original:
                    [basics.transition],
                    
                    // overwrites:
                    
                    // borders:
                    ['border-width' , '0s'], // does not support transition on border width , because we use it to make a separator
                    ['border-radius', '0s'], // does not support transition on border radius, because we remove border radius while dragging
                ],
            }),
        }),
    });
};
export const usesOrderableListItemLayout = () => {
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
        
        
        
        // animations:
        transition : [
            // original:
            [lists.itemTransition],
            
            // overwrites:
            
            // borders:
            ['border-width' , '0s'], // does not support transition on border width , because we use it to make a separator
            ['border-radius', '0s'], // does not support transition on border radius, because we remove border radius while dragging
        ],
    });
};



export default () => [
    scope('orderableList', {
        // layouts:
        ...usesOrderableListLayout(),
    }, { specificityWeight: 2 }),
    scope('orderableListItem', {
        // layouts:
        ...usesOrderableListItemLayout(),
    }, { specificityWeight: 3 }),
];
