// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    ifContainerWidthAtLeast,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    addressEditorBreakpoints,
}                           from './breakpoints.js'
import {
    // configs:
    addressEditorEditors,
    cssAddressEditorEditorConfig,
}                           from './config.js'



// styles:
export const onAddressEditorStylesChange = watchChanges(cssAddressEditorEditorConfig.onChange);

export const usesAddressEditorLayout   = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // children:
        ...children('*', { // <ResponsiveContainer>
            // layout:
            display             : 'grid',
            gridTemplateColumns : 'repeat(6, 1fr)',
            gridAutoFlow        : 'row',
            gridAutoRows        : 'auto',
            
            
            
            // containers:
            containerType       : 'inline-size',
            
            
            
            // children:
            ...children('*', {
                gridColumnEnd     : 'span 6',
            }),
            ...ifContainerWidthAtLeast(addressEditorBreakpoints.sm, {
                ...children(['.firstName', '.lastName'], {
                    gridColumnEnd : 'span 3',
                }),
            }),
            ...ifContainerWidthAtLeast(addressEditorBreakpoints.md, {
                ...children(['.zone', '.zip'], {
                    gridColumnEnd : 'span 3',
                }),
            }),
            ...ifContainerWidthAtLeast(addressEditorBreakpoints.lg, {
                ...children(['.city', '.zone', '.zip'], {
                    gridColumnEnd : 'span 2',
                }),
            }),
            
            
            
            // customize:
            ...usesCssProps(addressEditorEditors), // apply config's cssProps
        }),
    });
};

export const usesAddressEditorEditorItemVariants   = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(addressEditorEditors);
    
    
    
    return style({
        // variants:
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesAddressEditorLayout(),
    
    // variants:
    ...usesAddressEditorEditorItemVariants(),
});
