'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useId,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    
    
    
    // composite-components:
    TabPanelProps,
    TabPanel,
    TabProps,
    Tab,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    // reusable-ui components:
    TabSignUpProps,
    TabSignUp,
}                           from './TabSignUp.js'
import {
    // reusable-ui components:
    TabSignInProps,
    TabSignIn,
}                           from './TabSignIn.js'
import {
    // reusable-ui components:
    TabRecoverProps,
    TabRecover,
}                           from './TabRecover.js'
import {
    // reusable-ui components:
    TabResetProps,
    TabReset,
}                           from './TabReset.js'

// internals:
import {
    SignInState,
    SignInStateProps,
    SignInStateProvider,
    useSignInState,
}                           from './states/signInState.js'



// styles:
export const useSignInStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles.js')
, { id: 'mhxnjino7v' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export type SignInChildrenWithState = (signInState: SignInState) => React.ReactNode
export interface SignInProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<BasicProps<TElement>,
            // children:
            |'children' // not supported
        >,
        
        // states:
        SignInStateProps,
        
        // tabs:
        TabSignUpProps,
        TabSignInProps,
        TabRecoverProps,
        TabResetProps
{
    // auths:
    signUpEnable                 ?: boolean
    
    
    
    // components:
    bodyComponent                ?: React.ReactComponentElement<any, BasicProps<TElement>>
    tabComponent                 ?: React.ReactComponentElement<any, TabProps<Element>>
    signUpTabPanelComponent      ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    signInTabPanelComponent      ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    recoverTabPanelComponent     ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    resetTabPanelComponent       ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    
    switchSignUpButtonComponent  ?: ButtonComponentProps['buttonComponent']
    switchSignInButtonComponent  ?: ButtonComponentProps['buttonComponent']
    gotoSignInButtonComponent    ?: ButtonComponentProps['buttonComponent']
    gotoRecoverButtonComponent   ?: ButtonComponentProps['buttonComponent']
    gotoHomeButtonComponent      ?: ButtonComponentProps['buttonComponent']
}
const SignIn         = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    return (
        <SignInStateProvider {...props}>
            <SignInInternal {...props} />
        </SignInStateProvider>
    );
};
const SignInInternal = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    // styles:
    const styleSheet = useSignInStyleSheet();
    
    
    
    // rest props:
    const {
        // configs:
        credentialsConfig   : _credentialsConfig,   // remove
        
        
        
        // auths:
        signUpEnable        = true,
        providers,
        resolveProviderName : _resolveProviderName, // remove
        basePath            : _basePath,            // remove
        
        
        
        // pages:
        homepagePath        : _homepagePath,        // remove
        
        
        
        // components:
        bodyComponent               = (<Content mild={true} />                                                           as React.ReactComponentElement<any, BasicProps<TElement>>),
        tabComponent                = (<Tab headerComponent={null}>{undefined}</Tab>                                     as React.ReactComponentElement<any, TabProps<Element>>),
        signUpTabPanelComponent     = (<TabPanel />                                                                      as React.ReactComponentElement<any, TabPanelProps<Element>>),
        signInTabPanelComponent     = (<TabPanel />                                                                      as React.ReactComponentElement<any, TabPanelProps<Element>>),
        recoverTabPanelComponent    = (<TabPanel />                                                                      as React.ReactComponentElement<any, TabPanelProps<Element>>),
        resetTabPanelComponent      = (<TabPanel />                                                                      as React.ReactComponentElement<any, TabPanelProps<Element>>),
        
        switchSignUpButtonComponent = (<ButtonIcon icon='account_box' buttonStyle='link' size='sm' iconPosition='end' /> as React.ReactComponentElement<any, ButtonProps>),
        switchSignInButtonComponent = (<ButtonIcon icon='login'       buttonStyle='link' size='sm' iconPosition='end' /> as React.ReactComponentElement<any, ButtonProps>),
        gotoSignInButtonComponent   = (<ButtonIcon icon='arrow_back'  buttonStyle='link' size='sm' />                    as React.ReactComponentElement<any, ButtonProps>),
        gotoRecoverButtonComponent  = (<ButtonIcon icon='help_center' buttonStyle='link' size='sm' />                    as React.ReactComponentElement<any, ButtonProps>),
        gotoHomeButtonComponent     = (<ButtonIcon icon='home'        buttonStyle='link' size='sm' />                    as React.ReactComponentElement<any, ButtonProps>),
        
        signUpTitleComponent,
        signInTitleComponent,
        recoverTitleComponent,
        resetTitleComponent,
        
        signUpButtonComponent,
        
        usernameInputComponent,
        passwordInputComponent,
        signInButtonComponent,
        signInWithButtonComponent,
        alternateSignInSeparatorComponent,
        
        sendRecoverLinkButtonComponent,
        
        emailInputComponent,
        password2InputComponent,
        resetPasswordButtonComponent,
        
        passwordTooltipComponent,
        password2TooltipComponent,
        passwordValidationListComponent,
        password2ValidationListComponent,
        passwordValidationListItemComponent,
        password2ValidationListItemComponent,
        passwordValidationIconComponent,
        password2ValidationIconComponent,
        
        tokenValidationModalStatusComponent,
    ...restBasicProps} = props;
    
    
    
    // identifiers:
    const defaultId = useId();
    
    
    
    // states:
    const {
        // states:
        section,
        
        
        
        // navigations:
        gotoSignUp,
        gotoSignIn,
        gotoRecover,
        gotoHome,
    } = useSignInState();
    
    
    
    // handlers:
    const switchSignUpButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        gotoSignUp();
    });
    const switchSignUpButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `switchSignUpButtonComponent`:
        switchSignUpButtonComponent.props.onClick,
        
        
        
        // actions:
        switchSignUpButtonHandleClickInternal,
    );
    const switchSignInButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        gotoSignIn();
    });
    const switchSignInButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `switchSignInButtonComponent`:
        switchSignInButtonComponent.props.onClick,
        
        
        
        // actions:
        switchSignInButtonHandleClickInternal,
    );
    const gotoSignInButtonHandleClickInternal   = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        gotoSignIn();
    });
    const gotoSignInButtonHandleClick           = useMergeEvents(
        // preserves the original `onClick` from `gotoSignInButtonComponent`:
        gotoSignInButtonComponent.props.onClick,
        
        
        
        // actions:
        gotoSignInButtonHandleClickInternal,
    );
    const gotoRecoverButtonHandleClickInternal  = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        gotoRecover();
    });
    const gotoRecoverButtonHandleClick          = useMergeEvents(
        // preserves the original `onClick` from `gotoRecoverButtonComponent`:
        gotoRecoverButtonComponent.props.onClick,
        
        
        
        // actions:
        gotoRecoverButtonHandleClickInternal,
    );
    const gotoHomeButtonHandleClickInternal     = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault();
        
        
        
        // actions:
        gotoHome();
    });
    const gotoHomeButtonHandleClick             = useMergeEvents(
        // preserves the original `onClick` from `gotoHomeButtonComponent`:
        gotoHomeButtonComponent.props.onClick,
        
        
        
        // actions:
        gotoHomeButtonHandleClickInternal,
    );
    
    
    
    // nested components:
    const SwitchSignUpButton = () => React.cloneElement<ButtonProps>(switchSignUpButtonComponent,
        // props:
        {
            // classes:
            className : switchSignUpButtonComponent.props.className ?? 'switchSignUp',
            
            
            
            // handlers:
            onClick   : switchSignUpButtonHandleClick,
        },
        
        
        
        // children:
        switchSignUpButtonComponent.props.children                  ?? <>Don&apos;t have an account? <strong>SignUp</strong></>,
    );
    const SwitchSignInButton = () => React.cloneElement<ButtonProps>(switchSignInButtonComponent,
        // props:
        {
            // classes:
            className : switchSignInButtonComponent.props.className ?? 'switchSignIn',
            
            
            
            // handlers:
            onClick   : switchSignInButtonHandleClick,
        },
        
        
        
        // children:
        switchSignInButtonComponent.props.children                  ?? <>Already have an account? <strong>SignIn</strong></>,
    );
    const GotoSignInButton   = () => React.cloneElement<ButtonProps>(gotoSignInButtonComponent,
        // props:
        {
            // classes:
            className : gotoSignInButtonComponent.props.className   ?? 'gotoSignIn',
            
            
            
            // handlers:
            onClick   : gotoSignInButtonHandleClick,
        },
        
        
        
        // children:
        gotoSignInButtonComponent.props.children                    ?? 'Back to Sign In',
    );
    const GotoRecoverButton  = () => React.cloneElement<ButtonProps>(gotoRecoverButtonComponent,
        // props:
        {
            // classes:
            className : gotoRecoverButtonComponent.props.className  ?? 'gotoRecover',
            
            
            
            // handlers:
            onClick   : gotoRecoverButtonHandleClick,
        },
        
        
        
        // children:
        gotoRecoverButtonComponent.props.children                   ?? 'Forgot Password?',
    );
    const GotoHomeButton     = () => React.cloneElement<ButtonProps>(gotoHomeButtonComponent,
        // props:
        {
            // classes:
            className : gotoHomeButtonComponent.props.className     ?? 'gotoHome',
            
            
            
            // handlers:
            onClick   : gotoHomeButtonHandleClick,
        },
        
        
        
        // children:
        gotoHomeButtonComponent.props.children                      ?? 'Back to Home',
    );
    
    
    
    // jsx:
    /* <Tab> */
    return React.cloneElement<TabProps<Element>>(tabComponent,
        // props:
        {
            // identifiers:
            id               : tabComponent.props.id               ?? defaultId,
            
            
            
            // states:
            expandedTabIndex : tabComponent.props.expandedTabIndex ?? ((): number => {
                switch (section) {
                    case 'signUp' : return 0;
                    case 'recover': return 1 + (+signUpEnable);
                    case 'reset'  : return 2 + (+signUpEnable);
                    case 'signIn' :
                    default       : return 0 + (+signUpEnable);
                } // switch
            })(),
            
            
            
            // components:
            bodyComponent    : tabComponent.props.bodyComponent    ?? (
                /* <Content> */
                React.cloneElement<BasicProps<TElement>>(bodyComponent,
                    // props:
                    {
                        // other props:
                        ...restBasicProps,
                        ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
                        
                        
                        
                        // classes:
                        mainClass : bodyComponent.props.mainClass ?? props.mainClass ?? styleSheet.main
                    },
                )
            ),
        },
        
        
        
        // children:
        tabComponent.props.children ?? [
            (!!signUpEnable && React.cloneElement<TabPanelProps<Element>>(signUpTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : signUpTabPanelComponent.key              ?? 'signUp',
                    
                    
                    
                    // classes:
                    className : signUpTabPanelComponent.props.className  ?? 'signUp',
                },
                
                
                
                // children:
                <TabSignUp
                    // components:
                    signUpTitleComponent={signUpTitleComponent}
                    
                    usernameInputComponent={usernameInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    signUpButtonComponent={signUpButtonComponent}
                />,
                <SwitchSignInButton />,
                <GotoHomeButton />,
            )),
            React.cloneElement<TabPanelProps<Element>>(signInTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : signInTabPanelComponent.key              ?? 'signIn',
                    
                    
                    
                    // classes:
                    className : signInTabPanelComponent.props.className  ?? 'signIn',
                },
                
                
                
                // children:
                <TabSignIn
                    // auths:
                    providers={providers}
                    
                    
                    
                    // components:
                    signInTitleComponent={signInTitleComponent}
                    
                    usernameInputComponent={usernameInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    signInButtonComponent={signInButtonComponent}
                    signInWithButtonComponent={signInWithButtonComponent}
                    alternateSignInSeparatorComponent={alternateSignInSeparatorComponent}
                />,
                (!!signUpEnable && <SwitchSignUpButton />),
                <GotoRecoverButton />,
                <GotoHomeButton />,
            ),
            React.cloneElement<TabPanelProps<Element>>(recoverTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : recoverTabPanelComponent.key             ?? 'recover',
                    
                    
                    
                    // classes:
                    className : recoverTabPanelComponent.props.className ?? 'recover',
                },
                
                
                
                // children:
                <TabRecover
                    // components:
                    recoverTitleComponent={recoverTitleComponent}
                    
                    usernameInputComponent={usernameInputComponent}
                    sendRecoverLinkButtonComponent={sendRecoverLinkButtonComponent}
                />,
                <GotoSignInButton />,
            ),
            React.cloneElement<TabPanelProps<Element>>(resetTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : resetTabPanelComponent.key               ?? 'reset',
                    
                    
                    
                    // classes:
                    className : resetTabPanelComponent.props.className   ?? 'reset',
                },
                
                
                
                // children:
                <TabReset
                    // components:
                    resetTitleComponent={resetTitleComponent}
                    
                    emailInputComponent={emailInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    password2InputComponent={password2InputComponent}
                    resetPasswordButtonComponent={resetPasswordButtonComponent}
                    
                    passwordTooltipComponent={passwordTooltipComponent}
                    password2TooltipComponent={password2TooltipComponent}
                    passwordValidationListComponent={passwordValidationListComponent}
                    password2ValidationListComponent={password2ValidationListComponent}
                    passwordValidationListItemComponent={passwordValidationListItemComponent}
                    password2ValidationListItemComponent={password2ValidationListItemComponent}
                    passwordValidationIconComponent={passwordValidationIconComponent}
                    password2ValidationIconComponent={password2ValidationIconComponent}
                    
                    tokenValidationModalStatusComponent={tokenValidationModalStatusComponent}
                />,
                <GotoSignInButton />,
            ),
        ],
    );
};
export {
    SignIn,
    SignIn as default,
};
