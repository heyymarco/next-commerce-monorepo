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
    signUpTabElm,
    signInTabElm,
    recoverTabElm,
    resetTabElm,
    
    signUpTitleElm,
    signInTitleElm,
    recoverTitleElm,
    resetTitleElm,
    
    emailElm,
    usernameElm,
    passwordElm,
    password2Elm,
    doSignUpElm,
    doSignInElm,
    doRecover,
    doReset,
    
    signinSeparatorElm,
    
    switchSignUpElm,
    switchSignInElm,
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
            ...children([signUpTabElm, signInTabElm, recoverTabElm, resetTabElm], {
                // layouts:
                display : 'grid',
                
                
                
                // spacings:
                gap     : spacers.default,
                
                
                
                // children:
                ...children('form', {
                    // layouts:
                    display : 'contents',
                    
                    
                    
                    // children:
                    ...children([signUpTitleElm, signInTitleElm, recoverTitleElm, resetTitleElm], {
                        // positions:
                        gridArea     : 'title',
                        
                        
                        
                        // appearances:
                        ...usesSignInTitleColor(),
                    }),
                    ...children(emailElm, {
                        // positions:
                        gridArea     : 'email',
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
                    ...children(doSignUpElm, {
                        // positions:
                        gridArea : 'actionBtn',
                    }),
                    ...children(doSignInElm, {
                        ...rule('.credentials', {
                            // positions:
                            gridArea : 'actionBtn',
                        }),
                    }),
                    ...children(doRecover, {
                        // positions:
                        gridArea     : 'actionBtn',
                    }),
                    ...children(doReset, {
                        // positions:
                        gridArea     : 'actionBtn',
                    }),
                    ...children(signinSeparatorElm, {
                        // positions:
                        gridArea     : 'separator',
                        justifySelf  : 'stretch', // stretch horizontally
                        alignSelf    : 'center',  // center  vertically
                        
                        
                        
                        // layouts:
                        display      : 'flex',
                        
                        
                        
                        // spacings:
                        margin       : 0,
                    }),
                    ...children('.signinGroup', {
                        // layouts:
                        display : 'contents',
                        
                        
                        
                        // children:
                        ...children(doSignInElm, {
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
                ...children(switchSignUpElm, {
                    // positions:
                    gridArea         : 'switchSignUp',
                    justifySelf      : 'center',
                }),
                ...children(switchSignInElm, {
                    // positions:
                    gridArea         : 'switchSignIn',
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
            ...children(signUpTabElm, {
                // layouts:
                containerType  : 'inline-size', // responsive container
                gridTemplate   : [[
                    '"    title        title        title        title        title        title   " min-content',
                    '"  username     username     username     username     username     username  " min-content',
                    '"  password     password     password     password     password     password  " min-content',
                    '"  password2    password2    password2    password2    password2    password2 " min-content',
                    '"  gotoHome     gotoHome     gotoHome    gotoRecover  gotoRecover  gotoRecover" min-content',
                    '"  actionBtn    actionBtn    actionBtn    actionBtn    actionBtn    actionBtn " min-content',
                    '"switchSignIn switchSignIn switchSignIn switchSignIn switchSignIn switchSignIn" min-content',
                    '"  separator    separator    separator    separator    separator    separator " min-content',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                justifyContent : 'stretch', // (default) stretch the content horizontally
                alignContent   : 'start',   // (default) center  the content vertically
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'signUpTab')), // apply config's cssProps starting with signUpTab***
            }),
            ...children(signInTabElm, {
                // layouts:
                containerType  : 'inline-size', // responsive container
                gridTemplate   : [[
                    '"    title        title        title        title        title        title   " min-content',
                    '"  username     username     username     username     username     username  " min-content',
                    '"  password     password     password     password     password     password  " min-content',
                    '"  gotoHome     gotoHome     gotoHome    gotoRecover  gotoRecover  gotoRecover" min-content',
                    '"  actionBtn    actionBtn    actionBtn    actionBtn    actionBtn    actionBtn " min-content',
                    '"switchSignUp switchSignUp switchSignUp switchSignUp switchSignUp switchSignUp" min-content',
                    '"  separator    separator    separator    separator    separator    separator " min-content',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                justifyContent : 'stretch', // (default) stretch the content horizontally
                alignContent   : 'start',   // (default) center  the content vertically
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'signInTab')), // apply config's cssProps starting with signInTab***
            }),
            ...children(recoverTabElm, {
                // layouts:
                gridTemplate   : [[
                    '"    title        title        title        title        title        title   " min-content',
                    '"  username     username     username     username     username     username  " min-content',
                    '"  actionBtn    actionBtn    actionBtn    actionBtn    actionBtn    actionBtn " min-content',
                    '" gotoSignIn   gotoSignIn   gotoSignIn  ............ ............ ............" min-content',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                justifyContent : 'stretch', // (default) stretch the content horizontally
                alignContent   : 'start',   // (default) center  the content vertically
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signIns, 'recoverTab')), // apply config's cssProps starting with recoverTab***
            }),
            ...children(resetTabElm, {
                // layouts:
                gridTemplate   : [[
                    '"    title        title        title        title        title        title   " min-content',
                    '"    email        email        email        email        email        email   " min-content',
                    '"  password     password     password     password     password     password  " min-content',
                    '"  password2    password2    password2    password2    password2    password2 " min-content',
                    '"  actionBtn    actionBtn    actionBtn    actionBtn    actionBtn    actionBtn " min-content',
                    '" gotoSignIn   gotoSignIn   gotoSignIn  ............ ............ ............" min-content',
                    '/',
                    '1fr 1fr 1fr 1fr 1fr 1fr'
                ]],
                justifyContent : 'stretch', // (default) stretch the content horizontally
                alignContent   : 'start',   // (default) center  the content vertically
                
                
                
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
