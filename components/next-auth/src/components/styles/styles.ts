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
    // a spacer (gap) management system:
    spacers,
    
    
    
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
}                           from '@reusable-ui/components'

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
    
    gotoHomeElm,
    gotoSignInElm,
    gotoRecoverElm,
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
                display      : 'grid',
                
                
                
                // spacings:
                gap: spacers.default,
                
                
                
                // children:
                ...children('form', {
                    // layouts:
                    display: 'contents',
                    
                    
                    
                    // children:
                    ...children([signInTitleElm, recoverTitleElm, resetTitleElm], {
                        // positions:
                        gridArea  : 'title',
                        
                        
                        
                        // appearances:
                        ...usesSignInTitleColor(),
                    }),
                    ...children(usernameElm, {
                        // positions:
                        gridArea : 'username',
                    }),
                    ...children(passwordElm, {
                        // positions:
                        gridArea : 'password',
                    }),
                    ...children(password2Elm, {
                        // positions:
                        gridArea : 'password2',
                    }),
                    ...children(signinElm, {
                        ...rule('.credentials', {
                            // positions:
                            gridArea : 'actionBtn',
                        }),
                    }),
                    ...children(sendRecoverLinkElm, {
                        // positions:
                        gridArea : 'actionBtn',
                    }),
                    ...children(resetPasswordElm, {
                        // positions:
                        gridArea : 'actionBtn',
                    }),
                    ...children(signinSeparatorElm, {
                        // positions:
                        gridArea  : 'separator',
                        alignSelf : 'center',
                        
                        
                        
                        // layouts:
                        display: 'flex',
                        
                        
                        
                        // spacings:
                        margin   : 0,
                    }),
                }),
                ...children(gotoHomeElm, {
                    // positions:
                    gridArea    : 'gotoHome',
                    justifySelf : 'start',
                }),
                ...children(gotoSignInElm, {
                    // positions:
                    gridArea    : 'gotoSignIn',
                    justifySelf : 'start',
                }),
                ...children(gotoRecoverElm, {
                    // positions:
                    gridArea    : 'gotoRecover',
                    justifySelf : 'end',
                }),
            }),
            ...children(signInTabElm, {
                // layouts:
                gridTemplate : [[
                    '"title             title" min-content',
                    '"username       username" min-content',
                    '"password       password" min-content',
                    '"actionBtn     actionBtn" min-content',
                    '"gotoHome    gotoRecover" min-content',
                    '"separator     separator" min-content',
                    '"........... ..........." auto',
                    '/',
                    '1fr 1fr'
                ]],
            }),
            ...children(recoverTabElm, {
                // layouts:
                gridTemplate : [[
                    '"title             title" min-content',
                    '"username       username" min-content',
                    '"actionBtn     actionBtn" min-content',
                    '"gotoSignIn  ..........." min-content',
                    '"........... ..........." auto',
                    '/',
                    '1fr 1fr'
                ]],
            }),
            ...children(resetTabElm, {
                // layouts:
                gridTemplate : [[
                    '"title             title" min-content',
                    '"username       username" min-content',
                    '"password       password" min-content',
                    '"password2     password2" min-content',
                    '"actionBtn     actionBtn" min-content',
                    '"gotoSignIn  ..........." min-content',
                    '"........... ..........." auto',
                    '/',
                    '1fr 1fr'
                ]],
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
