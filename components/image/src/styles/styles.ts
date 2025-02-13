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
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
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
    // dependencies:
    
    // features:
    const {borderRule, borderVars} = usesBorder();
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,  // craft the <img>'s borderRadius manually
        orientationBlockSelector  : null,  // craft the <img>'s borderRadius manually
        itemsSelector             : 'img', // select the <img>
    });
    
    
    
    return style({
        // resets:
        ...stripoutFigure(), // clear browser's default styling on `<figure>`// capabilities:
        
        
        
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // positions:
            position           : 'relative', // suppress <NextImage>'s warning message
            
            
            
            // layouts:
            display            : 'inline-grid', // use *inline* grid, so the blocking behavior is similar to native <img>
            gridTemplate       : [[
                '"image" auto',
                '/',
                'auto'
            ]],
            justifyItems       : 'center',  // default center the items horizontally
            alignItems         : 'center',  // default center the items vertically
            justifyContent     : 'stretch', // fill the whole <figure> horizontally (if the <figure> size is set manually)
            alignContent       : 'stretch', // fill the whole <figure> vertically   (if the <figure> size is set manually)
            
            
            
            // scrolls:
            overflow           : 'hidden', // a fix for chrome
            
            
            
            // borders:
            border                 : borderVars.border,
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            
            
            
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
                minInlineSize  : 0,      // starts growing from 0px up to "image" gridArea
                minBlockSize   : 0,      // starts growing from 0px up to "image" gridArea
                maxInlineSize  : '100%', // do not overflow the "image" gridArea
                maxBlockSize   : '100%', // do not overflow the "image" gridArea
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                borderStartStartRadius : groupableVars.borderStartStartRadius,
                borderStartEndRadius   : groupableVars.borderStartEndRadius,
                borderEndStartRadius   : groupableVars.borderEndStartRadius,
                borderEndEndRadius     : groupableVars.borderEndEndRadius,
                
                
                
                // customize:
                ...usesCssProps(images), // apply config's cssProps
            }),
            ...children(':where(.status)', {
                // positions:
                zIndex         : 1, // placed on the top of <Image>
                
                
                
                // typos:
                fontSize       : '2rem',
            }),
        }),
        
        
        
        // features:
        ...borderRule(), // must be placed at the last
    });
};

export default () => style({
    // layouts:
    ...usesImageLayout(),
});
