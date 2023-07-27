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
            position       : 'relative', // suppress <NextImage>'s warning message
            
            
            
            // layouts:
            display        : 'inline-flex', // make an inline element like <img>
            flexDirection  : 'column',      // we'll manipulate the <img> height
            justifyContent : 'center',
            alignItems     : 'center',
            
            
            
            // sizes:
            width          : 'fit-content', // follows the <img> width
            
            
            
            // children:
            ...children(':where(img)', {
                // positions:
                // position   : 'absolute',              // fill the <figure> BUT can't take space
                position   : ['relative', '!important'], // fill the <figure> AND can take space // !important : to override <NextImage>'s position
                
                
                
                // appearances:
                // visibility : 'visible', // override Site.global // not needed anymore
                
                
                
                // sizes:
                flex      : [[1, 1, 'auto']],        // growable, shrinkable, initial from <img>'s height
                width     : ['unset', '!important'], // remove <NextImage>'s width
                height    : ['unset', '!important'], // remove <NextImage>'s height
                maxWidth  : '100%',
                maxHeight : '100%',
                minHeight : 0,
                
                
                
                // customize:
                ...usesCssProps(images), // apply config's cssProps
            }),
            ...children(':where(.status)', {
                // positions:
                position   : 'absolute',
                zIndex     : 99,
                
                
                
                // typos:
                fontSize   : '2rem',
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesImageLayout(),
});
