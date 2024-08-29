// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
}                           from '@cssfn/core'                  // writes css in javascript

// internals:
import {
    // configs:
    alternateSeparators,
}                           from './config.js'



// styles:
export const usesAlternateSeparatorLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"horz1 text horz2" auto',
            '/',
            '1fr max-content 1fr',
        ]],
        alignItems   : 'center', // center items vertically
        
        
        
        // children:
        ...children(['.horz1', '.horz2'], {
            // spacings:
            margin: 0,
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(alternateSeparators, 'horz')), // apply config's cssProps starting with horz***
        }),
        ...children('.horz1', {
            // positions:
            gridArea : 'horz1',
        }),
        ...children('.text', {
            // positions:
            gridArea : 'text',
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(alternateSeparators, 'text')), // apply config's cssProps starting with text***
        }),
        ...children('.horz2', {
            // positions:
            gridArea : 'horz2',
        }),
        
        
        
        // customize:
        ...usesCssProps(alternateSeparators), // apply config's cssProps
    });
};

export default () => style({
    // layouts:
    ...usesAlternateSeparatorLayout(),
});
