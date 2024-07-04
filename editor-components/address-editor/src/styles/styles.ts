// cssfn:
import {
    // writes css in javascript:
    rule,
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
    ifContainerWidthBetween,
    
    
    
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
                gridColumnEnd     : 'span 6', // span all fields to maximum wide
            }),
            ...ifContainerWidthAtLeast(addressEditorBreakpoints.sm, {
                ...children(['.firstName', '.lastName'], {
                    gridColumnEnd : 'span 3', // span the [firstName, lastName] to half wide
                }),
            }),
            ...ifContainerWidthBetween(addressEditorBreakpoints.sm, addressEditorBreakpoints.md, {
                ...children(['.country', '.state', '.city', '.zip'], {
                    gridColumnEnd : 'span 3', // span the [country, state, city, zip] to half wide
                }),
                // exception:
                ...rule(':has(>.city:nth-child(3):last-child)', { // if only having [country, state, city] fields
                    ...children('.country', {
                        gridColumnEnd : 'span 6', // span the country to maximum wide, while the last [state, city] is still half wide
                    }),
                }),
            }),
            ...ifContainerWidthAtLeast(addressEditorBreakpoints.lg, {
                ...children(['.state', '.city', '.zip'], {
                    gridColumnEnd : 'span 2',
                }),
                // exception:
                ...rule(':has(>.city:nth-child(3):last-child)', { // if only having [country, state, city] fields
                    ...children('.country', {
                        gridColumnEnd : 'span 2', // span the country to 1/3 wide, while the last [state, city] is still 1/3 wide
                    }),
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
