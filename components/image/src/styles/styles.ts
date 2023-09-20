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
    // removes browser's default stylesheet:
    stripoutFigure,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // configs:
    images,
    cssImageConfig,
}                           from './config.js'



// styles:
export const onImageStylesChange = watchChanges(cssImageConfig.onChange);

export const usesImageLayout = () => {
    return style({
        // resets:
        ...stripoutFigure(), // clear browser's default styling on `<figure>`
        
        
        
        // layouts:
        ...style({
            // positions:
            position           : 'relative', // suppress <NextImage>'s warning message
            
            
            
            // layouts:
            display            : 'inline-grid', // use *inline* grid, so the blocking behavior is similar to native <img>
            gridTemplate       : [[
                '"image" 1fr',
                '/',
                '1fr'
            ]],
            justifyItems       : 'center', // default center the items horizontally
            alignItems         : 'center', // default center the items vertically
            justifyContent     : 'center', // center the whole image horizontally
            alignContent       : 'center', // center the whole image vertically
            
            
            
            // scrolls:
            overflow           : 'hidden', // a fix for chrome
            
            
            
            // children:
            ...children([':where(img)', ':where(.status)'], {
                // positions:
                gridArea : 'image',
            }),
            ...children(':where(img)', {
                // positions:
                // position    : 'absolute',                 // fill the <figure> BUT can't take space
                position       : ['relative', '!important'], // fill the <figure> AND can take space // !important : to override <NextImage>'s position
                
                
                
                // sizes:
                minInlineSize  : 0,      // starts growing from 0px up to justifySelf
                minBlockSize   : 0,      // starts growing from 0px up to alignSelf
                maxInlineSize  : '100%', // do not overflow the <parent>
                maxBlockSize   : '100%', // do not overflow the <parent>
                
                
                
                // customize:
                ...usesCssProps(images), // apply config's cssProps
            }),
            ...children(':where(.status)', {
                // positions:
                zIndex         : 99, // should be on top of <Image>
                
                
                
                // typos:
                fontSize       : '2rem',
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesImageLayout(),
});
