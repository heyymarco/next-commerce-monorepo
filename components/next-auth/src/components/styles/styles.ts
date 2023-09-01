// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifContainerWidthAtLeast,
    ifContainerWidthBetween,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
    
    
    
    // base-content-components:
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // elements:
    signInTabElm,
    recoverTabElm,
    resetTabElm,
    
    signInTitleElm,
    recoverTitleElm,
    resetTitleElm,
    
    usernameElm,
    passwordElm,
    password2Elm,
    signinElm,
    sendRecoverLinkElm,
    resetPasswordElm,
    
    signinSeparatorElm,
    
    gotoSignUpElm,
    gotoSignInElm,
    gotoRecoverElm,
    gotoHomeElm,
}                           from './elements.js'
import {
    // configs:
    signIns,
    cssSignInConfig,
}                           from './config.js'



// styles:
export const onSignInStylesChange = watchChanges(onContentStylesChange, cssSignInConfig.onChange);

export const usesSignInTitleColor = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground(basics);
    const {foregroundRule, foregroundVars} = usesForeground(basics);
    
    
    
    return style({
        // layouts:
        ...style({
            // accessibilities:
            ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                // backgrounds:
                backg     : backgroundVars.altBackgColor,
                
                
                
                // foregrounds:
                foreg     : foregroundVars.altForeg,
            }),
            
            
            
            // foregrounds:
            foreg     : backgroundVars.altBackgColor,
            
            
            
            // spacings:
            margin    : '0px', // kill <h1> auto margin
            
            
            
            // typos:
            textAlign : 'center',
        }),
        
        
        
        // features:
        ...backgroundRule(), // must be placed at the last
        ...foregroundRule(), // must be placed at the last
    });
};

export const usesSignInLayout = () => {
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // children:
            ...children([signInTabElm, recoverTabElm, resetTabElm], {
                // layouts:
                display : 'grid',
                
                
                
                // spacings:
                gap     : spacers.default,
                
                
                
                // children:
                ...children('form', {
                    // layouts:
                    display : 'contents',
                    
                    
                    
                    // children:
                    ...children([signInTitleElm, recoverTitleElm, resetTitleElm], {
                        // positions:
                        gridArea     : 'title',
                        
                        
                        
                        // appearances:
                        ...usesSignInTitleColor(),
                    }),
                    ...children(usernameElm, {
                        // positions:
                        gridArea     : 'username',
                    }),
                    ...children(passwordElm, {
                        // positions:
                        gridArea     : 'password',
                    }),
                    ...children(password2Elm, {
                        // positions:
                        gridArea     : 'password2',
                    }),
                    ...children(signinElm, {
                        ...rule('.credentials', {
                            // positions:
                            gridArea : 'actionBtn',
                        }),
                    }),
                    ...children(sendRecoverLinkElm, {
                        // positions:
                        gridArea     : 'actionBtn',
                    }),
                    ...children(resetPasswordElm, {
                        // positions:
                        gridArea     : 'actionBtn',
                    }),
                    ...children(signinSeparatorElm, {
                        // positions:
                     // gridArea     : 'separator', // conditional separator => use implicit area
                        gridColumn   : '1 / -1',
                        alignSelf    : 'center',
                        
                        
                        
                        // layouts:
                        display      : 'flex',
                        
                        
                        
                        // spacings:
                        margin       : 0,
                    }),
                    ...children('.signinGroup', {
                        // layouts:
                        display : 'contents',
                        
                        
                        
                        // children:
                        ...children(signinElm, {
                            // sizes:
                            gridColumnEnd         : 'span 6',
                            ...ifContainerWidthBetween('sm', 'md', {
                                gridColumnEnd     : 'span 3',
                                ...rule(':nth-child(2n+1):nth-last-child(1)', {
                                    gridColumnEnd : 'span 6',
                                }),
                            }),
                            ...ifContainerWidthAtLeast('lg', {
                                gridColumnEnd     : 'span 2',
                                ...rule([
                                    ':nth-child(3n+1):nth-last-child(2)',
                                    ':nth-child(3n+2):nth-last-child(1)',
                                ], {
                                    gridColumnEnd : 'span 3',
                                }),
                                ...rule(':nth-child(3n+1):nth-last-child(1)', {
                                    gridColumnEnd : 'span 6',
                                }),
                            }),
                        }),
                    }),
                }),
                ...children(gotoSignUpElm, {
                    // positions:
                    gridArea         : 'gotoSignUp',
                    justifySelf      : 'center',
                }),
                ...children(gotoSignInElm, {
                    // positions:
                    gridArea         : 'gotoSignIn',
                    justifySelf      : 'start',
                }),
                ...children(gotoRecoverElm, {
                    // positions:
                    gridArea         : 'gotoRecover',
                    justifySelf      : 'end',
                }),
                ...children(gotoHomeElm, {
                    // positions:
                    gridArea         : 'gotoHome',
                    justifySelf      : 'start',
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'tabs')), // apply config's cssProps starting with tabs***
            }),
            ...children(signInTabElm, {
                // layouts:
                containerType : 'inline-size',
                gridTemplate  : [[
                    '"  title       title       title       title       title       title    " min-content',
                    '" username    username    username    username    username    username  " min-content',
                    '" password    password    password    password    password    password  " min-content',
                    '" gotoHome    gotoHome    gotoHome   gotoRecover gotoRecover gotoRecover" min-content',
                    '" actionBtn   actionBtn   actionBtn   actionBtn   actionBtn   actionBtn " min-content',
                    '"gotoSignUp  gotoSignUp  gotoSignUp  gotoSignUp  gotoSignUp  gotoSignUp " min-content',
                 // '" separator   separator   separator   separator   separator   separator " min-content', // conditional separator => use implicit area
                    '"........... ........... ........... ........... ........... ..........." auto',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'signInTab')), // apply config's cssProps starting with signInTab***
            }),
            ...children(recoverTabElm, {
                // layouts:
                gridTemplate  : [[
                    '"  title       title       title       title       title       title    " min-content',
                    '" username    username    username    username    username    username  " min-content',
                    '" actionBtn   actionBtn   actionBtn   actionBtn   actionBtn   actionBtn " min-content',
                    '"gotoSignIn  gotoSignIn  gotoSignIn  ........... ........... ..........." min-content',
                    '"........... ........... ........... ........... ........... ..........." auto',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'recoverTab')), // apply config's cssProps starting with recoverTab***
            }),
            ...children(resetTabElm, {
                // layouts:
                gridTemplate  : [[
                    '"  title       title       title       title       title       title    " min-content',
                    '" username    username    username    username    username    username  " min-content',
                    '" password    password    password    password    password    password  " min-content',
                    '" password2   password2   password2   password2   password2   password2 " min-content',
                    '" actionBtn   actionBtn   actionBtn   actionBtn   actionBtn   actionBtn " min-content',
                    '"gotoSignIn  gotoSignIn  gotoSignIn  ........... ........... ..........." min-content',
                    '"........... ........... ........... ........... ........... ..........." auto',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'resetTab')), // apply config's cssProps starting with resetTab***
            }),
            
            
            
            // customize:
            ...usesCssProps(signIns), // apply config's cssProps
        }),
    });
};

export const usesSignInVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(signIns);
    
    
    
    return style({
        // variants:
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesSignInLayout(),
    
    // variants:
    ...usesSignInVariants(),
});
