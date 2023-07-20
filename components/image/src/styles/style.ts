// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // removes browser's default stylesheet:
    stripoutFigure,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



export default () => style({
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
            objectFit  : 'contain', // default to contain (no image part is loss)
            // visibility : 'visible', // override Site.global // not needed anymore
            
            
            
            // sizes:
            flex      : [[1, 1, 'auto']],        // growable, shrinkable, initial from <img>'s height
            width     : ['unset', '!important'], // remove <NextImage>'s width
            height    : ['unset', '!important'], // remove <NextImage>'s height
            maxWidth  : '100%',
            maxHeight : '100%',
            minHeight : 0,
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
