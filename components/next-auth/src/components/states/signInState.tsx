'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useRef,
    useState,
    useEffect,
    useMemo,
}                           from 'react'

// next-js:
import {
    // navigations:
    useRouter,
    usePathname,
    useSearchParams,
}                           from 'next/navigation'

// auth-js:
import type {
    // types:
    BuiltInProviderType,
}                           from '@auth/core/providers'

// next-auth:
import {
    // apis:
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    EventHandler,
    useMergeEvents,
    useScheduleTriggerEvent,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    GlobalStackableProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCard,
    
    
    
    // utility-components:
    paragraphify,
    ModalBaseProps,
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // types:
    CredentialsConfigClient,
}                           from '../../types.js'
import {
    // utilities:
    invalidSelector,
    getAuthErrorDescription,
    resolveProviderName as defaultResolveProviderName,
    
    isClientError,
}                           from '../utilities.js'
import {
    // hooks:
    FieldHandlers,
    useFieldState,
}                           from '../hooks.js'
import {
    passwordResetPath      as defaultPasswordResetPath,
    usernameValidationPath as defaultUsernameValidationPath,
    emailValidationPath    as defaultEmailValidationPath,
    passwordValidationPath as defaultPasswordValidationPath,
    signUpPath             as defaultSignUpPath,
    emailConfirmationPath  as defaultEmailConfirmationPath,
}                           from '../../api-paths.js'



// hooks:

// states:

//#region signInState

// types:
export type SignInSection =
    | 'signUp'
    | 'signIn'
    | 'recover'
    | 'reset'
export type ControllableSignInSection = Exclude<SignInSection, 'reset'>
export type BusyState =
    | false               // idle
    |'signUp'             // busy: sign up
    | BuiltInProviderType // busy: login with ...
    | 'recover'           // busy: recover
    | 'reset'             // busy: reset
export type ValidityStatus =
    |boolean
    |'unknown'
    |'loading'
    |'error'



// contexts:
export interface SignInState {
    // constraints:
    nameMinLength              : number
    nameMaxLength              : number
    
    emailMinLength             : number
    emailMaxLength             : number
    emailFormat                : RegExp
    emailFormatHint            : React.ReactNode
    
    usernameMinLength          : number
    usernameMaxLength          : number
    usernameFormat             : RegExp
    usernameFormatHint         : React.ReactNode
    usernameProhibitedHint     : React.ReactNode
    
    passwordMinLength          : number
    passwordMaxLength          : number
    passwordHasUppercase       : boolean
    passwordHasLowercase       : boolean
    passwordProhibitedHint     : React.ReactNode
    
    
    
    // data:
    callbackUrl                : string|null
    passwordResetToken         : string|null
    emailConfirmationToken     : string|null
    
    
    
    // states:
    section                    : SignInSection
    isSignUpSection            : boolean
    isSignInSection            : boolean
    isRecoverSection           : boolean
    isResetSection             : boolean
    tokenVerified              : null|{}|false
    emailVerified              : null|boolean
    isSignUpApplied            : boolean
    isRecoverApplied           : boolean
    isResetApplied             : boolean
    isBusy                     : BusyState
    
    
    
    // fields & validations:
    userInteracted             : boolean
    
    formRef                    : React.MutableRefObject<HTMLFormElement|null>
    
    nameRef                    : React.MutableRefObject<HTMLInputElement|null>
    name                       : string
    nameHandlers               : FieldHandlers<HTMLInputElement>
    nameFocused                : boolean
    nameValid                  : boolean
    nameValidLength            : boolean
    
    emailRef                   : React.MutableRefObject<HTMLInputElement|null>
    email                      : string
    emailHandlers              : FieldHandlers<HTMLInputElement>
    emailFocused               : boolean
    emailValid                 : ValidityStatus
    emailValidLength           : boolean
    emailValidFormat           : boolean
    emailValidAvailable        : ValidityStatus
    
    usernameRef                : React.MutableRefObject<HTMLInputElement|null>
    username                   : string
    usernameHandlers           : FieldHandlers<HTMLInputElement>
    usernameFocused            : boolean
    usernameValid              : ValidityStatus
    usernameValidLength        : boolean
    usernameValidFormat        : boolean
    usernameValidAvailable     : ValidityStatus
    usernameValidNotProhibited : ValidityStatus
    
    usernameOrEmailRef         : React.MutableRefObject<HTMLInputElement|null>
    usernameOrEmail            : string
    usernameOrEmailHandlers    : FieldHandlers<HTMLInputElement>
    usernameOrEmailFocused     : boolean
    usernameOrEmailValid       : boolean
    
    passwordRef                : React.MutableRefObject<HTMLInputElement|null>
    password                   : string
    passwordHandlers           : FieldHandlers<HTMLInputElement>
    passwordFocused            : boolean
    passwordValid              : ValidityStatus
    passwordValidLength        : boolean
    passwordValidUppercase     : boolean
    passwordValidLowercase     : boolean
    passwordValidNotProhibited : ValidityStatus
    
    password2Ref               : React.MutableRefObject<HTMLInputElement|null>
    password2                  : string
    password2Handlers          : FieldHandlers<HTMLInputElement>
    password2Focused           : boolean
    password2Valid             : boolean
    password2ValidLength       : boolean
    password2ValidUppercase    : boolean
    password2ValidLowercase    : boolean
    password2ValidMatch        : boolean
    
    
    
    // navigations:
    gotoSignUp                 : () => void
    gotoSignIn                 : () => void
    gotoRecover                : () => void
    gotoHome                   : () => void
    
    
    
    // actions:
    doSignUp                   : () => Promise<void>
    doSignIn                   : () => Promise<void>
    doSignInWith               : (providerType: BuiltInProviderType) => Promise<void>
    doRecover                  : () => Promise<void>
    doReset                    : () => Promise<void>
    
    
    
    // utilities:
    resolveProviderName        : (oAuthProvider: BuiltInProviderType) => string
}

const noopHandler : FieldHandlers<HTMLInputElement> = { onChange: () => {} };
const SignInStateContext = createContext<SignInState>({
    // constraints:
    nameMinLength              : 0,
    nameMaxLength              : 0,
    
    emailMinLength             : 0,
    emailMaxLength             : 0,
    emailFormat                : /./,
    emailFormatHint            : null,
    
    usernameMinLength          : 0,
    usernameMaxLength          : 0,
    usernameFormat             : /./,
    usernameFormatHint         : null,
    usernameProhibitedHint     : null,
    
    passwordMinLength          : 0,
    passwordMaxLength          : 0,
    passwordHasUppercase       : false,
    passwordHasLowercase       : false,
    passwordProhibitedHint     : null,
    
    
    
    // data:
    callbackUrl                : null,
    passwordResetToken         : null,
    emailConfirmationToken     : null,
    
    
    
    // states:
    section                    : 'signIn',
    isSignUpSection            : false,
    isSignInSection            : false,
    isRecoverSection           : false,
    isResetSection             : false,
    tokenVerified              : null,
    emailVerified              : null,
    isSignUpApplied            : false,
    isRecoverApplied           : false,
    isResetApplied             : false,
    isBusy                     : false,
    
    
    
    // fields & validations:
    userInteracted             : false,
    
    formRef                    : { current: null },
    
    nameRef                    : { current: null },
    name                       : '',
    nameHandlers               : noopHandler,
    nameFocused                : false,
    nameValid                  : false,
    nameValidLength            : false,
    
    emailRef                   : { current: null },
    email                      : '',
    emailHandlers              : noopHandler,
    emailFocused               : false,
    emailValid                 : 'unknown',
    emailValidLength           : false,
    emailValidFormat           : false,
    emailValidAvailable        : 'unknown',
    
    usernameRef                : { current: null },
    username                   : '',
    usernameHandlers           : noopHandler,
    usernameFocused            : false,
    usernameValid              : 'unknown',
    usernameValidLength        : false,
    usernameValidFormat        : false,
    usernameValidAvailable     : 'unknown',
    usernameValidNotProhibited : 'unknown',
    
    usernameOrEmailRef         : { current: null },
    usernameOrEmail            : '',
    usernameOrEmailHandlers    : noopHandler,
    usernameOrEmailFocused     : false,
    usernameOrEmailValid       : false,
    
    passwordRef                : { current: null },
    password                   : '',
    passwordHandlers           : noopHandler,
    passwordFocused            : false,
    passwordValid              : false,
    passwordValidLength        : false,
    passwordValidUppercase     : false,
    passwordValidLowercase     : false,
    passwordValidNotProhibited : 'unknown',
    
    password2Ref               : { current: null },
    password2                  : '',
    password2Handlers          : noopHandler,
    password2Focused           : false,
    password2Valid             : false,
    password2ValidLength       : false,
    password2ValidUppercase    : false,
    password2ValidLowercase    : false,
    password2ValidMatch        : false,
    
    
    
    // navigations:
    gotoSignUp                 : () => {},
    gotoSignIn                 : () => {},
    gotoRecover                : () => {},
    gotoHome                   : () => {},
    
    
    
    // actions:
    doSignUp                   : async () => {},
    doSignIn                   : async () => {},
    doSignInWith               : async () => {},
    doRecover                  : async () => {},
    doReset                    : async () => {},
    
    
    
    // utilities:
    resolveProviderName        : () => '',
});
SignInStateContext.displayName  = 'SignInState';

export const useSignInState = (): SignInState => {
    return useContext(SignInStateContext);
}



// react components:
export interface SignInStateProps {
    // configs:
    credentialsConfigClient    : CredentialsConfigClient
    
    
    
    // auths:
    resolveProviderName       ?: (oAuthProvider: BuiltInProviderType) => string
    basePath                  ?: string
    
    
    
    // pages:
    homepagePath              ?: string
    defaultCallbackUrl        ?: string|null
    
    
    
    // tabs:
    defaultSection            ?: ControllableSignInSection
    section                   ?: ControllableSignInSection
    onSectionChange           ?: EventHandler<ControllableSignInSection>
    
    
    
    // components:
    signInWithDialogComponent ?: React.ReactComponentElement<any, (ModalBaseProps<Element, ModalExpandedChangeEvent<any>> & GlobalStackableProps)>|null
}
const SignInStateProvider = (props: React.PropsWithChildren<SignInStateProps>) => {
    // rest props:
    const {
        // configs:
        credentialsConfigClient,
        
        
        
        // auths:
        resolveProviderName       : resolveProviderNameUnstable,
        basePath                  = '/api/auth',
        
        
        
        // pages:
        homepagePath              = '/',
        defaultCallbackUrl        = null,
        
        
        
        // tabs:
        defaultSection            : defaultUncontrollableSection = 'signIn',
        section                   : controllableSection,
        onSectionChange           : onControllableSectionChange,
        
        
        
        // components:
        signInWithDialogComponent = (<ModalCard<Element> theme='primary' backdropStyle='static' inheritEnabled={false} /> as React.ReactComponentElement<any, (ModalBaseProps<Element, ModalExpandedChangeEvent<any>> & GlobalStackableProps)>),
        
        
        
        // children:
        children,
    } = props;
    const resolveProviderName = useEvent<Required<SignInStateProps>['resolveProviderName']>((oAuthProvider) => { // make a stable ref
        return (resolveProviderNameUnstable ?? defaultResolveProviderName)(oAuthProvider);
    });
    const passwordResetPath      = `${basePath}/${defaultPasswordResetPath}`;
    const usernameValidationPath = `${basePath}/${defaultUsernameValidationPath}`;
    const emailValidationPath    = `${basePath}/${defaultEmailValidationPath}`;
    const passwordValidationPath = `${basePath}/${defaultPasswordValidationPath}`;
    const signUpPath             = `${basePath}/${defaultSignUpPath}`;
    const emailConfirmationPath  = `${basePath}/${defaultEmailConfirmationPath}`;
    
    
    
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname();
    const searchParams = useSearchParams();
    
    
    
    // data:
    const callbackUrlRef            = useRef<string|null>(searchParams?.get('callbackUrl'           ) || defaultCallbackUrl);
    const callbackUrl               = callbackUrlRef.current;
    
    const passwordResetTokenRef     = useRef<string|null>(searchParams?.get('passwordResetToken'    ) || null);
    const passwordResetToken        = passwordResetTokenRef.current;
    
    const emailConfirmationTokenRef = useRef<string|null>(searchParams?.get('emailConfirmationToken') || null);
    const emailConfirmationToken    = emailConfirmationTokenRef.current;
    
    
    
    // states:
    const isControllableSection = (controllableSection !== undefined);
    const [uncontrollableSection, setUncontrollableSection] = useState<SignInSection>(
        !!passwordResetToken
        ? 'reset' // special_uncontrollable
        : defaultUncontrollableSection
    );
    const section : SignInSection = (
        (uncontrollableSection === 'reset')
        ? 'reset' // special_uncontrollable
        : (controllableSection /*controllable*/ ?? uncontrollableSection /*uncontrollable*/)
    );
    const handleUncontrollableSectionChange = useEvent<EventHandler<ControllableSignInSection>>((newSection) => {
        // update state if uncontrollable -or- controllable with initially 'reset'_special_uncontrollable:
        if (!isControllableSection || (uncontrollableSection === 'reset')) setUncontrollableSection(newSection);
    });
    const handleSectionChange               = useMergeEvents(
        // preserves the original `onControllableSectionChange` from `props`:
        onControllableSectionChange,       /*controllable*/
        
        
        
        // actions:
        handleUncontrollableSectionChange, /*uncontrollable*/
    );
    const scheduleTriggerEvent              = useScheduleTriggerEvent();
    const triggerSectionChange              = useEvent<EventHandler<ControllableSignInSection>>((newSection) => {
        if (handleSectionChange) scheduleTriggerEvent(() => { // runs the `on(Controllable|Uncontrollable)SectionChange` event *next after* current macroTask completed
            // fire `on(Controllable|Uncontrollable)SectionChange` react event:
            handleSectionChange(newSection);
        });
    });
    
    const isSignUpSection                          = (section === 'signUp');
    const isSignInSection                          = (section === 'signIn');
    const isRecoverSection                         = (section === 'recover');
    const isResetSection                           = (section === 'reset');
    
    const [tokenVerified    , setTokenVerified   ] = useState<null|{ email: string, username: string|null }|false>(!passwordResetToken ? false : null);
    const [emailVerified    , setEmailVerified   ] = useState<null|boolean>(!emailConfirmationToken ? false : null);
    
    const [isSignUpApplied  , setIsSignUpApplied ] = useState<boolean>(false);
    const [isRecoverApplied , setIsRecoverApplied] = useState<boolean>(false);
    const [isResetApplied   , setIsResetApplied  ] = useState<boolean>(false);
    
    const [isBusy           , setIsBusyInternal  ] = useState<BusyState>(false);
    
    const isMounted                                = useMountedFlag();
    
    
    
    // fields:
    const formRef            = useRef<HTMLFormElement|null>(null);
    const nameRef            = useRef<HTMLInputElement|null>(null);
    const emailRef           = useRef<HTMLInputElement|null>(null);
    const usernameRef        = useRef<HTMLInputElement|null>(null);
    const usernameOrEmailRef = useRef<HTMLInputElement|null>(null);
    const passwordRef        = useRef<HTMLInputElement|null>(null);
    const password2Ref       = useRef<HTMLInputElement|null>(null);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [userInteracted  , setUserInteracted  ] = useState<boolean>(false);
    const ignoreFocusRef     = useRef<boolean>(false);
    const fieldsHandleChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        // actions:
        setUserInteracted(true);
    });
    const fieldsHandleFocus  = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        // conditions:
        if (userInteracted        ) return; // already marked as userInteracted => ignore)
        if (ignoreFocusRef.current) return; // only interested focusing by user (ignore by system)
        
        
        
        // actions:
        setTimeout(() => {
            setTimeout(() => {
                // conditions:
                if (!event.target.matches(':focus')) return; // focus on very brief moment => ignore
                
                
                
                // actions:
                setUserInteracted(true);
            }, 0);
        }, 0);
    });
    const [name            , setName            , nameFocused           , nameHandlers           ] = useFieldState({ onChange: fieldsHandleChange, onFocus: fieldsHandleFocus });
    const [email           , setEmail           , emailFocused          , emailHandlers          ] = useFieldState({ onChange: fieldsHandleChange, onFocus: fieldsHandleFocus });
    const [username        , setUsername        , usernameFocused       , usernameHandlers       ] = useFieldState({ onChange: fieldsHandleChange, onFocus: fieldsHandleFocus });
    const [usernameOrEmail , setUsernameOrEmail , usernameOrEmailFocused, usernameOrEmailHandlers] = useFieldState({ onChange: fieldsHandleChange, onFocus: fieldsHandleFocus });
    const [password        , setPassword        , passwordFocused       , passwordHandlers       ] = useFieldState({ onChange: fieldsHandleChange, onFocus: fieldsHandleFocus });
    const [password2       , setPassword2       , password2Focused      , password2Handlers      ] = useFieldState({ onChange: fieldsHandleChange, onFocus: fieldsHandleFocus });
    
    
    
    // utilities:
    const internalSetFocus = (element: HTMLInputElement|null|undefined) => {
        if (!element) return;
        ignoreFocusRef.current = true;
        element.focus();
        setTimeout(() => {
            setTimeout(() => {
                ignoreFocusRef.current = false;
            }, 0);
        }, 0);
    };
    
    
    
    // constraints:
    const {
        name     : {
            minLength      : nameMinLength,
            maxLength      : nameMaxLength,
        },
        email    : {
            minLength      : emailMinLength,
            maxLength      : emailMaxLength,
            
            format         : emailFormat,
            formatHint     : emailFormatHint,
        },
        username : {
            minLength      : usernameMinLength,
            maxLength      : usernameMaxLength,
            
            format         : usernameFormat,
            formatHint     : usernameFormatHint,
            
            prohibitedHint : usernameProhibitedHint,
        },
        password : {
            minLength      : passwordMinLength,
            maxLength      : passwordMaxLength,
            
            hasUppercase   : passwordHasUppercase,
            hasLowercase   : passwordHasLowercase,
            
            prohibitedHint : passwordProhibitedHint,
        },
    } = credentialsConfigClient;
    
    
    
    // validations:
    const isDataEntry                = ((section === 'signUp') || (section === 'reset'));
    
    const nameValidLength            = !isDataEntry ? (name.length      >= 1) : ((name.length      >= nameMinLength    ) && (name.length      <= nameMaxLength    ));
    const nameValid                  = nameValidLength;
    
    const emailValidLength           = !isDataEntry ? (email.length     >= 5) : ((email.length     >= emailMinLength   ) && (email.length     <= emailMaxLength   ));
    const emailValidFormat           = !!email.match(emailFormat);
    const [emailValidAvailableRaw       , setEmailValidAvailable       ] = useState<ValidityStatus>('unknown');
    const emailValidAvailable        = !isDataEntry ? true                    : emailValidAvailableRaw;
    const emailValid                 = emailValidLength && emailValidFormat && emailValidAvailable;
    
    const usernameValidLength        = !isDataEntry ? (username.length  >= 1) : ((username.length  >= usernameMinLength) && (username.length  <= usernameMaxLength));
    const usernameValidFormat        = !isDataEntry ? true                    : !!username.match(usernameFormat);
    const [usernameValidAvailableRaw    , setUsernameValidAvailable    ] = useState<ValidityStatus>('unknown');
    const usernameValidAvailable     = !isDataEntry ? true                    : usernameValidAvailableRaw;
    const [usernameValidNotProhibitedRaw, setUsernameValidNotProhibited] = useState<ValidityStatus>('unknown');
    const usernameValidNotProhibited = !isDataEntry ? true                    : usernameValidNotProhibitedRaw;
    const usernameValid              = usernameValidLength && usernameValidFormat && usernameValidAvailable && usernameValidNotProhibited;
    
    const usernameOrEmailValid       = (usernameOrEmail.length >= 1);
    
    const passwordValidLength        = !isDataEntry ? (password.length  >= 1) : ((password.length  >= passwordMinLength) && (password.length  <= passwordMaxLength));
    const passwordValidUppercase     = !isDataEntry ? true                    : (!passwordHasUppercase || !!password.match(/[A-Z]/));
    const passwordValidLowercase     = !isDataEntry ? true                    : (!passwordHasLowercase || !!password.match(/[a-z]/));
    const [passwordValidNotProhibitedRaw, setPasswordValidNotProhibited] = useState<ValidityStatus>('unknown');
    const passwordValidNotProhibited = !isDataEntry ? true                    : passwordValidNotProhibitedRaw;
    const passwordValid              = passwordValidLength && passwordValidUppercase && passwordValidLowercase && passwordValidNotProhibited;
    
    const password2ValidLength       = !isDataEntry ? (password2.length >= 1) : ((password2.length >= passwordMinLength) && (password2.length <= passwordMaxLength));
    const password2ValidUppercase    = !isDataEntry ? true                    : (!passwordHasUppercase || !!password2.match(/[A-Z]/));
    const password2ValidLowercase    = !isDataEntry ? true                    : (!passwordHasLowercase || !!password2.match(/[a-z]/));
    const password2ValidMatch        = !isDataEntry ? true                    : (!!password && (password2 === password));
    const password2Valid             = password2ValidLength && password2ValidUppercase && password2ValidLowercase && password2ValidMatch;
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // effects:
    
    // displays an error passed by `next-auth`:
    useEffect(() => {
        // conditions:
        const error = searchParams?.get('error');
        if (!error) return; // no error passed => ignore
        
        
        
        // report the failure:
        showMessageError(getAuthErrorDescription(error));
    }, []);
    
    // remove passed queryString(s):
    useEffect(() => {
        // conditions:
        if (!pathName) return; // the router is not ready => ignore
        if (
            !searchParams?.get('error')
            &&
            !searchParams?.get('callbackUrl')
            &&
            !searchParams?.get('passwordResetToken')
            &&
            !searchParams?.get('emailConfirmationToken')
        ) return; // no queryString(s) passed => nothing to remove => ignore
        
        
        
        try {
            // get current browser's queryString:
            const newSearchParams = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
            
            // remove `?error=***` on browser's url:
            newSearchParams.delete('error');
            
            // remove `?callbackUrl=***` on browser's url:
            newSearchParams.delete('callbackUrl');
            
            // remove `?passwordResetToken=***` on browser's url:
            newSearchParams.delete('passwordResetToken');
            
            // remove `?emailConfirmationToken=***` on browser's url:
            newSearchParams.delete('emailConfirmationToken');
            
            // update browser's url:
            router.replace(`${pathName}${!!newSearchParams.size ? `?${newSearchParams}` : ''}`, { scroll: false });
        }
        catch {
            // ignore any error
        } // if
    }, [pathName]);
    
    // validate password reset token at startup:
    const hasPasswordResetTokenInitialized = useRef(false); // make sure the validation is never performed twice
    useEffect(() => {
        // conditions:
        if (!passwordResetToken)                      return; // no token => nothing to reset => ignore
        if (tokenVerified !== null)                   return; // already verified with success/failed result => ignore
        if (hasPasswordResetTokenInitialized.current) return; // already performed => ignore
        hasPasswordResetTokenInitialized.current = true;      // mark as performed
        
        
        
        // actions:
        (async () => {
            // attempts validate password reset token:
            try {
                const response = await fetch(`${passwordResetPath}?passwordResetToken=${encodeURIComponent(passwordResetToken)}`, {
                    method : 'GET',
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                const data = await response.json();
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // passwordResetTokenValidation succeeded => save the success:
                setTokenVerified(data);
                
                
                
                // now the user can fill the passwordResetToken form
            }
            catch (error: any) { // error
                // save the failure:
                setTokenVerified(false);
                
                
                
                // report the failure:
                await showMessageFetchError(error);
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // passwordResetTokenValidation failed due to network|client|server error => redirect to signIn tab:
                gotoSignIn();
            } // try
        })();
    }, [passwordResetToken, tokenVerified]);
    
    // validate email confirmation token at startup:
    const hasEmailConfirmationTokenInitialized = useRef(false); // make sure the validation is never performed twice
    useEffect(() => {
        // conditions:
        if (!emailConfirmationToken)                      return; // no token => nothing to confirm => ignore
        if (emailVerified !== null)                       return; // already verified with success/failed result => ignore
        if (hasEmailConfirmationTokenInitialized.current) return; // already performed => ignore
        hasEmailConfirmationTokenInitialized.current = true;      // mark as performed
        
        
        
        // actions:
        (async () => {
            // attempts validate email confirmation token:
            try {
                const response = await fetch(emailConfirmationPath, {
                    method  : 'PATCH',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    body    : JSON.stringify({ emailConfirmationToken }),
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                const data = await response.json();
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // emailConfirmationTokenValidation succeeded => save the success:
                setEmailVerified(true);
                
                
                
                // report the success:
                showMessageSuccess(
                    data.message
                    ? paragraphify(data.message)
                    : (
                        <p>
                            Your email has been successfully confirmed. Now you can sign in with your username (or email) and password.
                        </p>
                    )
                );
            }
            catch (error: any) { // error
                // save the failure:
                setEmailVerified(false);
                
                
                
                // report the failure:
                await showMessageFetchError(error);
                // if (!isMounted.current) return; // unmounted => abort
                
                
                
                // emailConfirmationTokenValidation failed due to network|client|server error => no need to redirect to another tab, because signIn tab is the default tab
                // stays on signIn tab
            } // try
        })();
    }, [emailConfirmationToken, emailVerified]);
    
    // validate email availability:
    useEffect(() => {
        // conditions:
        if (
            !isSignUpSection
            ||
            !email
            ||
            !emailValidLength
            ||
            !emailValidFormat
        ) {
            setEmailValidAvailable('unknown');
            return;
        } // if
        
        
        
        // actions:
        const abortController = new AbortController();
        (async () => {
            // attempts validate email availability:
            try {
                // delay a brief moment, waiting for the user typing:
                setEmailValidAvailable('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (abortController.signal.aborted) return;
                
                
                
                setEmailValidAvailable('loading');
                const response = await fetch(`${emailValidationPath}?email=${encodeURIComponent(email)}`, {
                    method : 'GET',
                    signal : abortController.signal,
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                if (!abortController.signal.aborted) setEmailValidAvailable(true);
            }
            catch (error) {
                // save the failure:
                if (!abortController.signal.aborted) setEmailValidAvailable(isClientError(error) ? false : 'error');
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            abortController.abort();
        };
    }, [isSignUpSection, email, emailValidLength, emailValidFormat]);
    
    // validate username availability:
    useEffect(() => {
        // conditions:
        if (
            !isSignUpSection
            ||
            !username
            ||
            !usernameValidLength
            ||
            !usernameValidFormat
        ) {
            setUsernameValidAvailable('unknown');
            return;
        } // if
        
        
        
        // actions:
        const abortController = new AbortController();
        (async () => {
            // attempts validate username availability:
            try {
                // delay a brief moment, waiting for the user typing:
                setUsernameValidAvailable('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (abortController.signal.aborted) return;
                
                
                
                setUsernameValidAvailable('loading');
                const response = await fetch(`${usernameValidationPath}?username=${encodeURIComponent(username)}`, {
                    method : 'GET',
                    signal : abortController.signal,
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                if (!abortController.signal.aborted) setUsernameValidAvailable(true);
            }
            catch (error) {
                // save the failure:
                if (!abortController.signal.aborted) setUsernameValidAvailable(isClientError(error) ? false : 'error');
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            abortController.abort();
        };
    }, [isSignUpSection, username, usernameValidLength, usernameValidFormat]);
    
    // validate username not_prohibited:
    useEffect(() => {
        // conditions:
        if (
            !isSignUpSection
            ||
            !username
            ||
            !usernameValidLength
            ||
            !usernameValidFormat
        ) {
            setUsernameValidNotProhibited('unknown');
            return;
        } // if
        
        
        
        // actions:
        const abortController = new AbortController();
        (async () => {
            // attempts validate username not_prohibited:
            try {
                // delay a brief moment, waiting for the user typing:
                setUsernameValidNotProhibited('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (abortController.signal.aborted) return;
                
                
                
                setUsernameValidNotProhibited('loading');
                const response = await fetch(`${usernameValidationPath}?username=${encodeURIComponent(username)}`, {
                    method : 'PUT',
                    signal : abortController.signal,
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                if (!abortController.signal.aborted) setUsernameValidNotProhibited(true);
            }
            catch (error) {
                // save the failure:
                if (!abortController.signal.aborted) setUsernameValidNotProhibited(isClientError(error) ? false : 'error');
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            abortController.abort();
        };
    }, [isSignUpSection, username, usernameValidLength, usernameValidFormat]);
    
    // validate password not_prohibited:
    useEffect(() => {
        // conditions:
        if (
            (!isSignUpSection && !isResetSection)
            ||
            !password
            ||
            !passwordValidLength
        ) {
            setPasswordValidNotProhibited('unknown');
            return;
        } // if
        
        
        
        // actions:
        const abortController = new AbortController();
        (async () => {
            // attempts validate password not_prohibited:
            try {
                // delay a brief moment, waiting for the user typing:
                setPasswordValidNotProhibited('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (abortController.signal.aborted) return;
                
                
                
                setPasswordValidNotProhibited('loading');
                const response = await fetch(`${passwordValidationPath}?password=${encodeURIComponent(password)}`, {
                    method : 'PUT',
                    signal : abortController.signal,
                });
                if (!response.ok) throw Error(response.statusText, { cause: response });
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                if (!abortController.signal.aborted) setPasswordValidNotProhibited(true);
            }
            catch (error) {
                // save the failure:
                if (!abortController.signal.aborted) setPasswordValidNotProhibited(isClientError(error) ? false : 'error');
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            abortController.abort();
        };
    }, [isSignUpSection, password, passwordValidLength]);
    
    // focus on email field when the section is 'signUp':
    useEffect(() => {
        // conditions:
        if (section !== 'signUp') return; // other than 'signUp' => ignore
        
        
        
        // actions:
        internalSetFocus(nameRef.current);
    }, [section]);
    
    // focus on usernameOrEmail field when the section is 'signIn' or 'recover':
    useEffect(() => {
        // conditions:
        if ((section !== 'signIn') && (section !== 'recover')) return; // other than 'signIn' or 'recover' => ignore
        
        
        
        // actions:
        internalSetFocus(usernameOrEmailRef.current);
    }, [section]);
    
    // focus on password field after successfully verified the password reset token:
    useEffect(() => {
        // conditions:
        if (!tokenVerified) return; // NOT verified with success result => ignore
        
        
        
        // actions:
        internalSetFocus(passwordRef.current);
    }, [tokenVerified]);
    
    // focus on usernameOrEmail field after successfully verified the email confirmation token:
    useEffect(() => {
        // conditions:
        if (!emailVerified) return; // NOT verified with success result => ignore
        
        
        
        // actions:
        internalSetFocus(usernameOrEmailRef.current);
    }, [emailVerified]);
    
    // resets input states when the `section` changes:
    const prevSection = useRef<SignInSection>(section);
    useIsomorphicLayoutEffect(() => { // we use `useIsomorphicLayoutEffect` to quickly reset `setUserInteracted` as soon as possible, before the <Tooltip> popping in
        // conditions:
        if (prevSection.current === section) return; // no change => ignore
        prevSection.current = section; // sync
        
        
        
        // reset request states:
        setIsSignUpApplied(false);
        setIsRecoverApplied(false);
        setIsResetApplied(false);
        
        
        
        // reset fields & validations:
        setEnableValidation(false);
        setUserInteracted(false);
        setName('');
        setEmail('');
        setUsername('');
        setUsernameOrEmail('');
        setPassword('');
        setPassword2('');
    }, [section]);
    
    
    
    // stable callbacks:
    const setIsBusy    = useEvent((isBusy: BusyState) => {
        signInState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoSignUp   = useEvent(() => {
        triggerSectionChange('signUp');
    });
    const gotoSignIn   = useEvent(() => {
        triggerSectionChange('signIn');
    });
    const gotoRecover  = useEvent(() => {
        triggerSectionChange('recover');
    });
    const gotoHome     = useEvent(() => {
        router.push(homepagePath);
    });
    
    const doSignUp     = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts apply signUp:
        setIsBusy('signUp'); // mark as busy
        try {
            const response = await fetch(signUpPath, {
                method  : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body    : JSON.stringify({ name, email, username, password }),
            });
            if (!response.ok) throw Error(response.statusText, { cause: response });
            const data = await response.json();
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setIsSignUpApplied(true); // mark signUp as applied
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            setPassword2('');
            
            
            
            // report the success:
            await showMessageSuccess(
                data.message
                ? paragraphify(data.message)
                : (
                    (response.status === 201)
                    ? (
                        <>
                            <p>
                                Your account has been successfully created.
                            </p>
                            <p>
                                We have sent a confirmation link to your email to activate your account. Please check your inbox in a moment.
                            </p>
                        </>
                    )
                    : (
                        <>
                            <p>
                                Your account has been successfully created.
                            </p>
                            <p>
                                Now you can sign in with the new username and password.
                            </p>
                        </>
                    )
                )
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // signUp succeeded => redirect to signIn tab:
            gotoSignIn();
        }
        catch (error: any) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // signUp failed due to network|client|server error => user can retry signUp again:
            // focus to name field:
            nameRef.current?.setSelectionRange(0, name.length);
            nameRef.current?.focus();
        } // try
    });
    const doSignIn     = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts sign in using credentials:
        setIsBusy('credentials'); // mark as busy
        const result = await signIn('credentials', { username: usernameOrEmail, password, redirect: false });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!!result?.error) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            
            
            
            // report the failure:
            await showMessageError(getAuthErrorDescription(result?.error ?? 'CredentialsSignin'));
            
            
            
            // signIn failed due to network|client|server error => user can retry signIn again:
            // focus to password field:
            passwordRef.current?.setSelectionRange(0, password.length);
            passwordRef.current?.focus();
        }
        else { // success
            // resets:
            setUsernameOrEmail('');
            setPassword('');
            
            
            
            // signIn succeeded => redirect to origin page:
            if (callbackUrl) {
                // redirect to `callbackUrl` (if supplied)
                
                
                
                router.replace(callbackUrl);
                
                
                
                // in case of redirect to current page => just hide the busy indicator after redirect finished
                setIsBusy(false); // unmark as busy
                
                
                
                // resets:
                setEnableValidation(false);
             // setUsernameOrEmail(''); // already reseted above
             // setPassword('');        // already reseted above
            }
            else {
                // stays on signIn tab
                
                
                
                setIsBusy(false); // unmark as busy
                
                
                
                // resets:
                setEnableValidation(false);
             // setUsernameOrEmail(''); // already reseted above
             // setPassword('');        // already reseted above
            } // if
        } // if
    });
    const doSignInWith = useEvent(async (providerType: BuiltInProviderType): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // attempts sign in using OAuth:
        setIsBusy(providerType); // mark as busy
        const result = await signIn(providerType, {
            callbackUrl:
                callbackUrl // signInWith succeeded => redirect to `callbackUrl` (if supplied)
                ||          // -or-
                undefined   // signInWith succeeded => stays on signIn tab
        });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!!result?.error) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
            
            
            
            // signInWith failed due to network|client|server error => user can retry signIn again:
            // stays on signIn tab
        }
        else { // success
            // signInWith succeeded => report the success:
            if (signInWithDialogComponent) {
                showDialog(
                    React.cloneElement<(ModalBaseProps<Element, ModalExpandedChangeEvent<any>> & GlobalStackableProps)>(signInWithDialogComponent,
                        // props:
                        {
                            // global stackable:
                            viewport : signInWithDialogComponent.props.viewport ?? formRef,
                        },
                        
                        
                        
                        // children:
                        (signInWithDialogComponent.props.children ?? <CardBody>
                            <p>
                                <Busy />&nbsp;Authenticating using {providerType}...
                            </p>
                        </CardBody>),
                    )
                );
            } // if
        } // if
    });
    const doRecover    = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts request recover password:
        setIsBusy('recover'); // mark as busy
        try {
            const response = await fetch(passwordResetPath, {
                method  : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body    : JSON.stringify({ username: usernameOrEmail }),
            });
            if (!response.ok) throw Error(response.statusText, { cause: response });
            const data = await response.json();
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setIsRecoverApplied(true); // mark recoverRequest as sent
            setIsBusy(false); // unmark as busy
            
            
            
            // report the success:
            await showMessageSuccess(
                data.message
                ? paragraphify(data.message)
                : (
                    <p>
                        A password reset link sent to your email. Please check your inbox in a moment.
                    </p>
                )
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // requestRecoverPassword succeeded => redirect to signIn tab:
            gotoSignIn();
        }
        catch (error: any) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            
            
            
            // requestRecoverPassword failed due to network|client|server error => user can retry requestRecoverPassword again:
            // focus to usernameOrEmail field:
            usernameOrEmailRef.current?.setSelectionRange(0, usernameOrEmail.length);
            usernameOrEmailRef.current?.focus();
        } // try
    });
    const doReset      = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const fieldErrors = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        // attempts apply password reset:
        setIsBusy('reset'); // mark as busy
        try {
            const response = await fetch(passwordResetPath, {
                method  : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body    : JSON.stringify({ passwordResetToken, password }),
            });
            if (!response.ok) throw Error(response.statusText, { cause: response });
            const data = await response.json();
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setIsResetApplied(true); // mark passwordReset as applied
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            setPassword2('');
            
            
            
            // report the success:
            await showMessageSuccess(
                data.message
                ? paragraphify(data.message)
                : (
                    <p>
                        The password has been successfully changed. Now you can sign in with the new password.
                    </p>
                )
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // resetPassword succeeded => redirect to signIn tab:
            gotoSignIn();
        }
        catch (error: any) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // resetPassword failed due to network|client|server error => user can retry resetPassword again:
            // focus to password field:
            passwordRef.current?.setSelectionRange(0, password.length);
            passwordRef.current?.focus();
        } // try
    });
    
    
    
    // apis:
    const signInState = useMemo<SignInState>(() => ({
        // constraints:
        nameMinLength,              // stable value
        nameMaxLength,              // stable value
        
        emailMinLength,             // stable value
        emailMaxLength,             // stable value
        emailFormat,                // stable value
        emailFormatHint,            // stable value
        
        usernameMinLength,          // stable value
        usernameMaxLength,          // stable value
        usernameFormat,             // stable value
        usernameFormatHint,         // stable value
        usernameProhibitedHint,     // stable value
        
        passwordMinLength,          // stable value
        passwordMaxLength,          // stable value
        passwordHasUppercase,       // stable value
        passwordHasLowercase,       // stable value
        passwordProhibitedHint,     // stable value
        
        
        
        // data:
        callbackUrl,                // mutable value
        passwordResetToken,         // mutable value
        emailConfirmationToken,     // mutable value
        
        
        
        // states:
        section,                    // mutable value
        isSignUpSection,            // mutable value
        isSignInSection,            // mutable value
        isRecoverSection,           // mutable value
        isResetSection,             // mutable value
        tokenVerified,              // mutable value
        emailVerified,              // mutable value
        isSignUpApplied,            // mutable value
        isRecoverApplied,           // mutable value
        isResetApplied,             // mutable value
        isBusy,                     // mutable value
        
        
        
        // fields & validations:
        userInteracted,             // mutable value
        
        formRef,                    // stable ref
        
        nameRef,                    // stable ref
        name,                       // mutable value
        nameHandlers,               // stable ref
        nameFocused,                // mutable value
        nameValid,                  // mutable value
        nameValidLength,            // mutable value
        
        emailRef,                   // stable ref
        email : (
            isResetSection
            ? (tokenVerified === false) ? '' : (tokenVerified?.email ?? '')
            : email
        ),                          // mutable value
        emailHandlers,              // stable ref
        emailFocused,               // mutable value
        emailValid,                 // mutable value
        emailValidLength,           // mutable value
        emailValidFormat,           // mutable value
        emailValidAvailable,        // mutable value
        
        usernameRef,                // stable ref
        username,                   // mutable value
        usernameHandlers,           // stable ref
        usernameFocused,            // mutable value
        usernameValid,              // mutable value
        usernameValidLength,        // mutable value
        usernameValidFormat,        // mutable value
        usernameValidAvailable,     // mutable value
        usernameValidNotProhibited, // mutable value
        
        usernameOrEmailRef,         // stable ref
        usernameOrEmail,            // mutable value
        usernameOrEmailHandlers,    // stable ref
        usernameOrEmailFocused,     // mutable value
        usernameOrEmailValid,       // mutable value
        
        passwordRef,                // stable ref
        password,                   // mutable value
        passwordHandlers,           // stable ref
        passwordFocused,            // mutable value
        passwordValid,              // mutable value
        passwordValidLength,        // mutable value
        passwordValidUppercase,     // mutable value
        passwordValidLowercase,     // mutable value
        passwordValidNotProhibited, // mutable value
        
        password2Ref,               // stable ref
        password2,                  // mutable value
        password2Handlers,          // stable ref
        password2Focused,           // mutable value
        password2Valid,             // mutable value
        password2ValidLength,       // mutable value
        password2ValidUppercase,    // mutable value
        password2ValidLowercase,    // mutable value
        password2ValidMatch,        // mutable value
        
        
        
        // navigations:
        gotoSignUp,                 // stable ref
        gotoSignIn,                 // stable ref
        gotoRecover,                // stable ref
        gotoHome,                   // stable ref
        
        
        
        // actions:
        doSignUp,                   // stable ref
        doSignIn,                   // stable ref
        doSignInWith,               // stable ref
        doRecover,                  // stable ref
        doReset,                    // stable ref
        
        
        
        // utilities:
        resolveProviderName,        // stable ref
    }), [
        // data:
        callbackUrl,
        passwordResetToken,
        emailConfirmationToken,
        
        
        
        // states:
        section,
        isSignUpSection,
        isSignInSection,
        isRecoverSection,
        isResetSection,
        tokenVerified,
        emailVerified,
        isSignUpApplied,
        isRecoverApplied,
        isResetApplied,
        isBusy,
        
        
        
        // fields & validations:
        userInteracted,
        
        name,
        nameFocused,
        nameValid,
        nameValidLength,
        
        email,
        emailFocused,
        emailValid,
        emailValidLength,
        emailValidFormat,
        emailValidAvailable,
        
        username,
        usernameFocused,
        usernameValid,
        usernameValidLength,
        usernameValidFormat,
        usernameValidAvailable,
        usernameValidNotProhibited,
        
        usernameOrEmail,
        usernameOrEmailFocused,
        usernameOrEmailValid,
        
        password,
        passwordFocused,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        passwordValidNotProhibited,
        
        password2,
        password2Focused,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
    ]);
    
    
    
    // jsx:
    return (
        <SignInStateContext.Provider value={signInState}>
            <AccessibilityProvider
                 // accessibilities:
                enabled={
                    !isBusy // disabled if busy
                    &&
                    (
                        (isSignUpSection  && !isSignUpApplied)                                                            // on 'signUp'  section => enabled if registration___was_NOT_sent
                        ||
                        (isSignInSection                        && (!emailConfirmationToken || (emailVerified !== null))) // on 'signIn'  section => enabled if                                 no_emailConfirmationToken -or-  email_has_verified          (success or failed)
                        ||
                        (isRecoverSection && !isRecoverApplied)                                                           // on 'recover' section => enabled if recoverRequest_was_NOT_sent
                        ||
                        (isResetSection   && !isResetApplied    && (!!passwordResetToken    && (!!tokenVerified       ))) // on 'reset'   section => enabled if passwordReset__was_NOT_sent and has_passwordResetToken    -and- token_has_verified_as_valid (success only)
                    )
                }
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
                    {children}
                </ValidationProvider>
            </AccessibilityProvider>
        </SignInStateContext.Provider>
    );
};
export {
    SignInStateProvider,
    SignInStateProvider as default,
}
//#endregion signInState
