// cssfn:
import {
    // writes css in javascript:
    fallback,
    children,
    style,
    scope,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
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
import {
    // features:
    usesImage,
}                           from '../features/image.js'



// styles:
export const onImageStylesChange = watchChanges(cssImageConfig.onChange);

export const usesImageLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule, borderVars} = usesBorder({
        borderStyle  : 'none',        // protects from inheritance by <ancestor>'s `borderStyle`  while still be able to override via `borderVars.borderStyle`
        borderWidth  : '0px',         // protects from inheritance by <ancestor>'s `borderWidth`  while still be able to override via `borderVars.borderWidth`
        borderColor  : 'transparent', // protects from inheritance by <ancestor>'s `borderColor`  while still be able to override via `borderVars.borderColor`
        borderRadius : '0px',         // protects from inheritance by <ancestor>'s `borderRadius` while still be able to override via `borderVars.borderRadius`
    });
    const {imageVars} = usesImage();
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null,    // never
        orientationBlockSelector  : '&',     // always
        itemsSelector             : 'img',   // select the <img>
        defaultOrientation        : 'block', // assumes the <Image>'s orientation is block, even if only containing single <img>
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // positions:
            position            : 'relative', // suppress <NextImage>'s warning message
            
            
            
            // layouts:
            display             : 'inline-grid', // use *inline* grid, so the blocking behavior is similar to native <img>
            // gridTemplate        : [[
            //     '"image" auto',
            //     '/',
            //     'auto'
            // ]],
            justifyItems        : 'stretch',     // fills the whole <wrapper> with <img> horizontally (in case of the <wrapper>'s size is set manually)
            alignItems          : 'stretch',     // fills the whole <wrapper> with <img> vertically   (in case of the <wrapper>'s size is set manually)
            
            
            
            // sizes:
            ...fallback({
                width       : imageVars.intrinsicWidth,  // the default width  if not overriden by custom css
                height      : imageVars.intrinsicHeight, // the default height if not overriden by custom css
            }),
            
            
            
            // scrolls:
            overflow            : 'hidden', // a fix for chrome
            
            
            
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
                // gridArea : 'image', // cover the whole <wrapper>, in case of the <img> and <status> are shown simultaneously, so they *overlap* each other
                gridArea : '1 / 1 / -1 / -1', // cover the whole <wrapper>, in case of the <img> and <status> are shown simultaneously, so they *overlap* each other
            }),
            ...children(':where(img)', {
                // positions:
                ...fallback({
                    // position : 'absolute',                 // fills the <wrapper> BUT can't take space
                    position    : ['relative', '!important'], // fills the <wrapper> AND can take space   // !important : to override <NextImage>'s position
                }),
                
                
                
                // sizes:
                ...fallback({
                    width       : ['unset'   , '!important'], // makes the <wrapper>'s size to auto_size // !important : to override <NextImage>'s width
                    height      : ['unset'   , '!important'], // makes the <wrapper>'s size to auto_size // !important : to override <NextImage>'s height
                }),
                minInlineSize   : 0,      // starts growing from 0px up to "image" gridArea
                minBlockSize    : 0,      // starts growing from 0px up to "image" gridArea
                maxInlineSize   : '100%', // do not overflow the "image" gridArea
                maxBlockSize    : '100%', // do not overflow the "image" gridArea
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                borderStartStartRadius : borderVars.borderStartStartRadius, // always be overrden by `groupableRule()` because of `orientationBlockSelector : '&'`
                borderStartEndRadius   : borderVars.borderStartEndRadius,   // always be overrden by `groupableRule()` because of `orientationBlockSelector : '&'`
                borderEndStartRadius   : borderVars.borderEndStartRadius,   // always be overrden by `groupableRule()` because of `orientationBlockSelector : '&'`
                borderEndEndRadius     : borderVars.borderEndEndRadius,     // always be overrden by `groupableRule()` because of `orientationBlockSelector : '&'`
                
                
                
                // customize:
                ...usesCssProps(images), // apply config's cssProps
            }),
            ...children(':where(.status)', {
                // positions:
                zIndex          : 1, // place on the top of <Image>
                
                
                
                // sizes:
                justifySelf     : 'center', // center the status indicator, instead of filling the <wrapper>
                alignSelf       : 'center', // center the status indicator, instead of filling the <wrapper>
                
                
                
                // typos:
                fontSize        : '2rem',
            }),
        }),
        
        
        
        // features:
        ...borderRule(), // must be placed at the last
    });
};

export default () => [
    scope('main', {
        ...usesImageLayout(),
    }, { specificityWeight: 0 }),
];
