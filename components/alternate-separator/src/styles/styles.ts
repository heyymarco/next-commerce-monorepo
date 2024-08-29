// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
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
        display  : 'grid',
        gridArea : [[
            '"horz1 text horz2" auto',
            '/',
            '1fr max-content 1fr',
        ]],
        
        
        
        // children:
        ...children(['.horz1', '.text', '.horz2'], {
            opacity : alternateSeparators.opacity,
        }),
        ...children('.horz1', {
            // positions:
            gridArea : 'horz1',
        }),
        ...children('.text', {
            // positions:
            gridArea : 'text',
        }),
        ...children('.horz2', {
            // positions:
            gridArea : 'horz2',
        }),
        
        
        
        // customize:
        ...usesCssProps(alternateSeparators), // apply config's cssProps
        opacity : null, // ignore opacity from config's cssProps
    });
};

export default () => style({
    // layouts:
    ...usesAlternateSeparatorLayout(),
});
