// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    useMergeRefs,
    useMountedFlag,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // simple-components:
    IconProps,
    Icon,
    ButtonProps,
    Button,
    CloseButton,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    ListProps,
    List,
    CardHeaderProps,
    CardHeader,
    CardFooterProps,
    CardFooter,
    CardBodyProps,
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'

// heymarco components:
import {
    // dialog-components:
    ModalStatusProps,
    ModalStatus,
}                           from '@heymarco/modal-status'

// internals:
import type {
    // types:
    FieldErrorList,
    
    
    
    // args:
    FieldErrorInfo,
    FetchErrorInfo,
    
    
    
    // dynamic data:
    FieldErrorTitle,
    FieldErrorMessage,
    
    FetchErrorTitle,
    FetchErrorMessage,
    
    
    
    // options:
    ShowMessageOptions,
    
    
    
    // states:
    DialogMessage,
    DialogMessageError,
    DialogMessageFieldError,
    DialogMessageFetchError,
    DialogMessageSuccess,
    DialogMessageNotification,
}                           from './types.js'
import {
    // utilities:
    paragraphify,
    isTypeError,
    isReactNode,
    isFieldErrorList,
    isError,
}                           from './utilities.js'
import {
    // contexts:
    DialogMessageApi,
    DialogMessageContext,
}                           from './DialogMessageContext.js'



// defaults:
const _fieldErrorTitleDefault     : Exclude<FieldErrorTitle  , Function> = undefined;
const _fieldErrorMessageDefault   : Extract<FieldErrorMessage, Function> = ({fieldErrors}) => {
    const isPlural = (fieldErrors?.length > 1);
    return (
        <p>
            There {isPlural ? 'are some' : 'is an'} invalid field{isPlural ? 's' : ''} that {isPlural ? 'need' : 'needs'} to be fixed:
        </p>
    );
};
const _fieldErrorIconFindDefault  : NonNullable<DialogMessageFieldError['fieldErrorIconFind' ]> = (fieldError: Element) => ((fieldError.parentElement?.previousElementSibling as HTMLElement)?.children?.[0]?.children?.[0] as HTMLElement)?.style?.getPropertyValue?.('--icon-image')?.slice?.(1, -1);
const _fieldErrorIconDefault      : NonNullable<DialogMessageFieldError['fieldErrorIcon'     ]> = 'text_fields';
const _fieldErrorLabelFindDefault : NonNullable<DialogMessageFieldError['fieldErrorLabelFind']> = (fieldError: Element) => (fieldError as HTMLElement).getAttribute?.('aria-label') || (fieldError.children?.[0] as HTMLInputElement)?.placeholder;
const _fieldErrorFocusDefault     : NonNullable<DialogMessageFieldError['fieldErrorFocus'    ]> = true;

const _fetchErrorTitleDefault     : Exclude<FetchErrorTitle  , Function> = undefined;
const _fetchErrorMessageDefault   : Extract<FetchErrorMessage, Function> = ({isRequestError, isServerError}) => <>
    <p>
        Oops, there was an error processing the command.
    </p>
    {isRequestError && <p>
        There was a <strong>problem contacting our server</strong>.
        <br />
        Make sure your internet connection is available.
    </p>}
    {isServerError && <p>
        There was a <strong>problem on our server</strong>.
        <br />
        The server may be busy or currently under maintenance.
    </p>}
    {isServerError && <p>
        Please try again in a few minutes.
        <br />
        If the problem still persists, please contact our technical support.
    </p>}
</>;



// react components:
export interface DialogMessageProviderProps {
    // components:
    modalStatusComponent         ?: React.ReactComponentElement<any, ModalStatusProps<Element>>
    
    cardHeaderComponent          ?: React.ReactComponentElement<any, CardHeaderProps<Element>>
    cardBodyComponent            ?: React.ReactComponentElement<any, CardBodyProps<Element>>
    cardFooterComponent          ?: React.ReactComponentElement<any, CardFooterProps<Element>>
    
    closeButtonComponent         ?: React.ReactComponentElement<any, ButtonProps>
    okButtonComponent            ?: React.ReactComponentElement<any, ButtonProps>
    
    fieldErrorTitleDefault       ?: DialogMessageFieldError['fieldErrorTitle']
    fieldErrorMessageDefault     ?: DialogMessageFieldError['fieldErrorMessage']
    fieldErrorListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    fieldErrorListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    fieldErrorIconFindDefault    ?: DialogMessageFieldError['fieldErrorIconFind']
    fieldErrorIconDefault        ?: DialogMessageFieldError['fieldErrorIcon']
    fieldErrorIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
    fieldErrorLabelFindDefault   ?: DialogMessageFieldError['fieldErrorLabelFind']
    fieldErrorFocusDefault       ?: DialogMessageFieldError['fieldErrorFocus']
    
    fetchErrorTitleDefault       ?: DialogMessageFetchError['fetchErrorTitle']
    fetchErrorMessageDefault     ?: DialogMessageFetchError['fetchErrorMessage']
}
const DialogMessageProvider = (props: React.PropsWithChildren<DialogMessageProviderProps>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        modalStatusComponent        = (<ModalStatus modalCardStyle='scrollable' lazy={true} /> as React.ReactComponentElement<any, ModalStatusProps<Element>>),
        
        cardHeaderComponent         = (<CardHeader<Element>                                 /> as React.ReactComponentElement<any, CardHeaderProps<Element>>),
        cardBodyComponent           = (<CardBody<Element>                                   /> as React.ReactComponentElement<any, CardBodyProps<Element>>),
        cardFooterComponent         = (<CardFooter<Element>                                 /> as React.ReactComponentElement<any, CardFooterProps<Element>>),
        
        closeButtonComponent        = (<CloseButton                                         /> as React.ReactComponentElement<any, ButtonProps>),
        okButtonComponent           = (<Button                                              /> as React.ReactComponentElement<any, ButtonProps>),
        
        fieldErrorTitleDefault      = _fieldErrorTitleDefault,
        fieldErrorMessageDefault    = _fieldErrorMessageDefault,
        fieldErrorListComponent     = (<List<Element> listStyle='flat'                      /> as React.ReactComponentElement<any, ListProps<Element>>),
        fieldErrorListItemComponent = (<ListItem<Element>                                   /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        fieldErrorIconFindDefault   = _fieldErrorIconFindDefault,
        fieldErrorIconDefault       = _fieldErrorIconDefault,
        fieldErrorIconComponent     = (<Icon<Element> icon={undefined as any}               /> as React.ReactComponentElement<any, IconProps<Element>>),
        fieldErrorLabelFindDefault  = _fieldErrorLabelFindDefault,
        fieldErrorFocusDefault      = _fieldErrorFocusDefault,
        
        fetchErrorTitleDefault      = _fetchErrorTitleDefault,
        fetchErrorMessageDefault    = _fetchErrorMessageDefault,
    } = props;
    
    
    
    // states:
    const [dialogMessage, setDialogMessage] = useState<DialogMessage|false>(false);
    const signalsDialogMessageClosed        = useRef<(() => void)[]>([]);
    const isMounted                         = useMountedFlag();
    
    
    
    // stable callbacks:
    const showMessage             = useEvent(async (dialogMessage             : React.SetStateAction<DialogMessage|false>            | React.ReactNode, options?: ShowMessageOptions): Promise<void> => {
        // handle overloads:
        if (isReactNode(dialogMessage, 'message')) {
            return await showMessage({ // recursive call
                // contents:
                message : dialogMessage,
                
                
                
                // options:
                ...options, // DialogMessage extends ShowMessageOptions
            });
        } // if
        
        
        
        // show|hide message:
        setDialogMessage(dialogMessage);
        
        
        
        // when message closed:
        return new Promise<void>((resolved) => {
            signalsDialogMessageClosed.current.push(resolved); // wait until <ModalStatus> to be closed by user
        });
    });
    
    const showMessageError        = useEvent(async (dialogMessageError        :                      DialogMessageError|false        | React.ReactNode, options?: ShowMessageOptions): Promise<void> => {
        // handle overloads:
        if (isReactNode(dialogMessageError, 'error')) {
            return await showMessageError({ // recursive call
                // contents:
                error : dialogMessageError,
                
                
                
                // options:
                ...options, // DialogMessageError extends ShowMessageOptions
            });
        } // if
        
        
        
        // hide message if `false`:
        if (dialogMessageError === false) return await showMessage(false);
        
        
        
        // defaults:
        const {
            // contents:
            title  = 'Error',  // if [title] not defined => defaults to 'Error'
            error,             // take the [error] as [message]
            
            
            
            // options:
            theme  = 'danger', // if [theme] not defined => defaults to 'danger'
        ...restShowMessageOptions} = dialogMessageError;
        
        
        
        // show message:
        return await showMessage({
            // contents:
            title,
            message : error,
            
            
            
            // options:
            theme,
            ...restShowMessageOptions,
        });
    });
    const showMessageFieldError   = useEvent(async (dialogMessageFieldError   :                      DialogMessageFieldError|false   | FieldErrorList , options?: ShowMessageOptions): Promise<void> => {
        // handle overloads:
        if (isFieldErrorList(dialogMessageFieldError, 'fieldErrors')) {
            return await showMessageFieldError({ // recursive call
                // contents:
                fieldErrors : dialogMessageFieldError,
                
                
                
                // options:
                ...options, // DialogMessageFieldError extends ShowMessageOptions
            });
        } // if
        
        
        
        // hide message if `false`:
        if (dialogMessageFieldError === false) return await showMessageError(false);
        
        
        
        // defaults:
        const {
            // contents:
            fieldErrorTitle     = fieldErrorTitleDefault,
            
            fieldErrors,        // take the [fieldErrors] as a part of [error message]
            fieldErrorMessage   = fieldErrorMessageDefault,
            fieldErrorIconFind  = fieldErrorIconFindDefault,
            fieldErrorIcon      = fieldErrorIconDefault,
            fieldErrorLabelFind = fieldErrorLabelFindDefault,
            fieldErrorFocus     = fieldErrorFocusDefault,
            
            
            
            // contexts:
            context,            // take the [context] to be passed into title|message constructor
        ...restShowMessageOptions} = dialogMessageFieldError;
        
        
        
        // conditions:
        if (!fieldErrors?.length) return; // no field error => nothing to show => ignore
        
        
        
        // populate data:
        const fieldErrorInfo : FieldErrorInfo = {
            // data:
            fieldErrors,
            
            
            
            // contexts:
            context,
        };
        
        
        
        // show message:
        let title   : React.ReactNode      = (typeof(fieldErrorTitle  ) === 'function') ? fieldErrorTitle(fieldErrorInfo  ) : fieldErrorTitle;
        if (title   === undefined) title   = _fieldErrorTitleDefault;
        let message : React.ReactNode      = (typeof(fieldErrorMessage) === 'function') ? fieldErrorMessage(fieldErrorInfo) : fieldErrorMessage;
        if (message === undefined) message = _fieldErrorMessageDefault(fieldErrorInfo);
        await showMessageError({
            // contents:
            title,
            error : <>
                {message}
                {/* <List> */}
                {React.cloneElement<ListProps<Element>>(fieldErrorListComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    (fieldErrorListComponent.props.children ?? Array.from(fieldErrors).map((fieldError, index) =>
                        React.cloneElement<ListItemProps<Element>>(fieldErrorListItemComponent,
                            // props:
                            {
                                key : fieldErrorListItemComponent.key ?? index,
                            },
                            
                            
                            
                            // children:
                            (fieldErrorListItemComponent.props.children ?? ((): React.ReactNode => {
                                let icon : DialogMessageFieldError['fieldErrorIcon']|null = fieldErrorIconComponent.props.icon;
                                if (icon === undefined) icon = fieldErrorIconFind(fieldError);
                                if (icon === undefined) icon = fieldErrorIcon;
                                const label = fieldErrorLabelFind(fieldError);
                                return (<>
                                    {!!icon && React.cloneElement<IconProps<Element>>(fieldErrorIconComponent,
                                        // props:
                                        {
                                            // appearances:
                                            icon : icon,
                                        },
                                    )}
                                    {!!icon && !!label && <>
                                        &nbsp;
                                    </>}
                                    {label}
                                </>);
                            })()),
                        )
                    )),
                )}
            </>,
            
            
            
            // options:
            ...restShowMessageOptions,
        });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // focus the first fieldError:
        if (fieldErrorFocus) {
            const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe';
            const firstFieldError   = fieldErrors?.[0];
            const firstFocusableElm = (firstFieldError.matches(focusableSelector) ? firstFieldError : firstFieldError?.querySelector(focusableSelector)) as HTMLElement|null;
            firstFieldError.scrollIntoView({
                block    : 'start',
                behavior : 'smooth',
            });
            firstFocusableElm?.focus?.({ preventScroll: true });
        } // if
    });
    const showMessageFetchError   = useEvent(async (dialogMessageFetchError   :                      DialogMessageFetchError|false   | any            , options?: ShowMessageOptions): Promise<void> => {
        // handle overloads:
        if (isError(dialogMessageFetchError, 'fetchError')) {
            return await showMessageFetchError({ // recursive call
                // contents:
                fetchError : dialogMessageFetchError,
                
                
                
                // options:
                ...options, // DialogMessageFetchError extends ShowMessageOptions
            });
        } // if
        dialogMessageFetchError = dialogMessageFetchError as unknown as (DialogMessageFetchError|false); // for satisfying TS
        
        
        
        // hide message if `false`:
        if (dialogMessageFetchError === false) return await showMessageError(false);
        
        
        
        // defaults:
        const {
            // contents:
            fetchErrorTitle   = fetchErrorTitleDefault,
            
            fetchError,       // take the [fetchError] as a part of [error message]
            fetchErrorMessage = fetchErrorMessageDefault,
            
            
            
            // contexts:
            context,          // take the [context] to be passed into title|message constructor
        ...restShowMessageOptions} = dialogMessageFetchError;
        
        
        
        // populate data:
        const isRequestError = (  // the request was made but no response was received
            // axios'  error request:
            !!fetchError?.request // the request property must be exist
            ||
            // rtkq's  error request:
            isTypeError(fetchError?.error)
            ||
            // fetch's error request:
            isTypeError(fetchError)
        );
        
        let errorCode = (
            // axios'  error status code:
            fetchError?.response?.status
            ??
            // rtkq's  error status code:
            fetchError?.status
            ??
            // fetch's error status code:
            fetchError?.cause?.status // passing a `Response` object
            ??
            fetchError?.cause         // passing a `Response`'s status code
        );
        if (typeof(errorCode) !== 'number') errorCode = 0; // ignore if the code is not a number
        const isClientError  = (errorCode >= 400) && (errorCode <= 499); // 400-499
        const isServerError  = (errorCode >= 500) && (errorCode <= 599); // 500-599
        
        const fetchErrorInfo : FetchErrorInfo = {
            // data:
            isRequestError,
            isClientError,
            isServerError,
            
            errorCode,
            error : fetchError,
            
            
            
            // contexts:
            context,
        };
        
        
        
        // show message:
        let title   : React.ReactNode      = (typeof(fetchErrorTitle  ) === 'function') ? fetchErrorTitle(fetchErrorInfo  ) : fetchErrorTitle;
        if (title   === undefined) title   = _fetchErrorTitleDefault;
        await showMessageError({
            // contents:
            title,
            error : (
                // axios'  human_readable server error   response:
                // axios'  human_readable server message response:
                // rtkq's  human_readable server error   response:
                // rtkq's  human_readable server message response:
                ((): React.ReactElement|undefined => {
                    const data = (
                        fetchError?.response?.data // axios' response data
                        ??
                        fetchError?.data           // rtkq's response data
                    );
                    
                    
                    
                    // response as json:
                    if (typeof(data) === 'object') {
                        const error   = data?.error;
                        if ((typeof(error)   === 'string') && !!error  ) return paragraphify(error);   // not an empty string => a valid error message
                        
                        const message = data?.message;
                        if ((typeof(message) === 'string') && !!message) return paragraphify(message); // not an empty string => a valid error message
                    }
                    // response as text:
                    else if (typeof(data) === 'string') {
                        if (!!data) return paragraphify(data); // not an empty string => a valid error message
                    } // if
                    
                    
                    
                    return undefined; // unknown response format => skip
                })()
                ??
                // fetch's human_readable server error   response:
                // fetch's human_readable server message response:
                (await (async (): Promise<React.ReactElement|undefined> => {
                    // conditions:
                    const response = fetchError?.cause; // a `Response` object passed on Error('string', Response)
                    if (!(response instanceof Response)) return undefined; // not a `Response` object => skip
                    const contentType = response.headers.get('Content-Type');
                    if (!contentType) return undefined; // no 'Content-Type' defined => skip
                    
                    
                    
                    // response as json:
                    if ((/^application\/json/i).test(contentType)) {
                        try {
                            const data    = await response.json();
                            
                            const error   = data?.error;
                            if ((typeof(error)   === 'string') && !!error  ) return paragraphify(error);   // not an empty string => a valid error message
                            
                            const message = data?.message;
                            if ((typeof(message) === 'string') && !!message) return paragraphify(message); // not an empty string => a valid error message
                        }
                        catch {
                            return undefined; // parse failed => skip
                        } // try
                    }
                    // response as text:
                    else if ((/^text/i).test(contentType)) {
                        try {
                            const text = await response.text();
                            
                            if (!!text) return paragraphify(text); // not an empty string => a valid error message
                        }
                        catch {
                            return undefined; // parse failed => skip
                        } // try
                    } // if
                    
                    
                    
                    return undefined; // unknown response format => skip
                })())
                ??
                // if there is a request/client/server error => assumes as a connection problem:
                ((): React.ReactNode => {
                    let message : React.ReactNode      = (typeof(fetchErrorMessage) === 'function') ? fetchErrorMessage(fetchErrorInfo) : fetchErrorMessage;
                    if (message === undefined) message = _fetchErrorMessageDefault(fetchErrorInfo);
                    return message;
                })()
            ),
            
            
            
            // options:
            ...restShowMessageOptions,
        });
    });
    const showMessageSuccess      = useEvent(async (dialogMessageSuccess      :                      DialogMessageSuccess|false      | React.ReactNode, options?: ShowMessageOptions): Promise<void> => {
        // handle overloads:
        if (isReactNode(dialogMessageSuccess, 'success')) {
            return await showMessageSuccess({ // recursive call
                // contents:
                success : dialogMessageSuccess,
                
                
                
                // options:
                ...options, // DialogMessageSuccess extends ShowMessageOptions
            });
        } // if
        
        
        
        // hide message if `false`:
        if (dialogMessageSuccess === false) return await showMessage(false);
        
        
        
        // defaults:
        const {
            // contents:
            title  = 'Success', // if [title] not defined => defaults to 'Success'
            success,            // take the [success] as [message]
            
            
            
            // options:
            theme  = 'success', // if [theme] not defined => defaults to 'success'
        ...restShowMessageOptions} = dialogMessageSuccess;
        
        
        
        // show message:
        return await showMessage({
            // contents:
            title,
            message : success,
            
            
            
            // options:
            theme,
            ...restShowMessageOptions,
        });
    });
    const showMessageNotification = useEvent(async (dialogMessageNotification :                      DialogMessageNotification|false | React.ReactNode, options?: ShowMessageOptions): Promise<void> => {
        // handle overloads:
        if (isReactNode(dialogMessageNotification, 'notification')) {
            return await showMessageNotification({ // recursive call
                // contents:
                notification : dialogMessageNotification,
                
                
                
                // options:
                ...options, // DialogMessageNotification extends ShowMessageOptions
            });
        } // if
        
        
        
        // hide message if `false`:
        if (dialogMessageNotification === false) return await showMessage(false);
        
        
        
        // defaults:
        const {
            // contents:
            title  = 'Notification', // if [title] not defined => defaults to 'Notification'
            notification,            // take the [notification] as [message]
            
            
            
            // options:
            theme  = 'primary',      // if [theme] not defined => defaults to 'primary'
        ...restShowMessageOptions} = dialogMessageNotification;
        
        
        
        // show message:
        return await showMessage({
            // contents:
            title,
            message : notification,
            
            
            
            // options:
            theme,
            ...restShowMessageOptions,
        });
    });
    
    
    
    // refs:
    const okButtonRefInternal     = useRef<HTMLButtonElement|null>(null);
    const okButtonRef             = useMergeRefs(
        // preserves the original `elmRef` from `okButtonComponent`:
        okButtonComponent.props.elmRef,
        
        
        
        okButtonRefInternal,
    );
    
    
    
    // cache:
    const prevDialogMessage       = useRef<DialogMessage|false>(dialogMessage);
    if (dialogMessage !== false) prevDialogMessage.current = dialogMessage;
    
    
    
    // handlers:
    const handleCloseDialogMessage          = useEvent((): void => {
        setDialogMessage(false); // close the <ModalStatus>
    });
    const closeButtonHandleClick            = useMergeEvents(
        // preserves the original `onClick` from `closeButtonComponent`:
        closeButtonComponent.props.onClick,
        
        
        
        // actions:
        handleCloseDialogMessage,
    );
    const okButtonHandleClick               = useMergeEvents(
        // preserves the original `onClick` from `okButtonComponent`:
        okButtonComponent.props.onClick,
        
        
        
        // actions:
        handleCloseDialogMessage,
    );
    
    const handleModalExpandedChangeInternal = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}) => {
        // conditions:
        if (expanded) return; // only interested of collapsed event
        
        
        
        // actions:
        handleCloseDialogMessage();
    });
    const handleModalExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange` from `modalStatusComponent`:
        modalStatusComponent.props.onExpandedChange,
        
        
        
        // actions:
        handleModalExpandedChangeInternal,
    );
    
    const handleModalFocusInternal          = useEvent(() => {
        setTimeout(() => {
            okButtonRefInternal.current?.focus();
        }, 0); // wait to next macroTask, to make sure the keyboard event from <Input> was gone
    });
    const handleModalFocus                  = useMergeEvents(
        // preserves the original `onExpandStart` from `modalStatusComponent`:
        modalStatusComponent.props.onExpandStart,
        
        
        
        // actions:
        handleModalFocusInternal,
    );
    
    const handleClosedDialogMessageInternal = useEvent((): void => {
        // clear the prevDialogMessage *after* the <ModalStatus> is fully hidden:
        prevDialogMessage.current = false;
        
        
        
        // notify the <ModalStatus> is closed by user:
        for (const signalDialogMessageClosed of signalsDialogMessageClosed.current) {
            signalDialogMessageClosed();
        } // for
        signalsDialogMessageClosed.current.splice(0); // clear
    });
    const handleClosedDialogMessage         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `modalStatusComponent`:
        modalStatusComponent.props.onCollapseEnd,
        
        
        
        // actions:
        handleClosedDialogMessageInternal,
    );
    
    
    
    // apis:
    const dialogMessageApi = useMemo<DialogMessageApi>(() => ({
        // dialogs:
        showMessage,             // stable ref
        showMessageError,        // stable ref
        showMessageFieldError,   // stable ref
        showMessageFetchError,   // stable ref
        showMessageSuccess,      // stable ref
        showMessageNotification, // stable ref
    }), []);
    
    
    
    // jsx:
    const {
        // contents:
        title,   // take
        message, // take
    ...restModalBaseProps} = prevDialogMessage.current || {};
    const isExpanded = (dialogMessage !== false);
    return (
        <DialogMessageContext.Provider value={dialogMessageApi}>
            {props.children}
            
            {React.cloneElement<ModalStatusProps<Element>>(modalStatusComponent,
                // props:
                {
                    // other props:
                    ...restModalBaseProps,
                    ...modalStatusComponent.props, // overwrites restModalBaseProps (if any conflics)
                    
                    
                    
                    // handlers:
                    onExpandedChange : handleModalExpandedChange,
                    onExpandStart    : handleModalFocus,
                    onCollapseEnd    : handleClosedDialogMessage,
                },
                
                
                
                // children:
                (modalStatusComponent.props.children ?? (isExpanded && <>
                    {React.cloneElement<CardHeaderProps<Element>>(cardHeaderComponent,
                        // props:
                        undefined,
                        
                        
                        
                        // children:
                        cardHeaderComponent.props.children ?? <>
                            {title}
                            {React.cloneElement<ButtonProps>(closeButtonComponent,
                                // props:
                                {
                                    // handlers:
                                    onClick : closeButtonHandleClick,
                                },
                            )}
                        </>,
                    )}
                    {React.cloneElement<CardBodyProps<Element>>(cardBodyComponent,
                        // props:
                        undefined,
                        
                        
                        
                        // children:
                        cardBodyComponent.props.children ?? message,
                    )}
                    {React.cloneElement<CardFooterProps<Element>>(cardFooterComponent,
                        // props:
                        undefined,
                        
                        
                        
                        // children:
                        cardFooterComponent.props.children ?? React.cloneElement<ButtonProps>(okButtonComponent,
                            // props:
                            {
                                // refs:
                                elmRef  : okButtonRef,
                                
                                
                                
                                // handlers:
                                onClick : okButtonHandleClick,
                            },
                            
                            
                            
                            // children:
                            okButtonComponent.props.children ?? 'Okay',
                        ),
                    )}
                </>)),
            )}
        </DialogMessageContext.Provider>
    );
};
export {
    DialogMessageProvider,
    DialogMessageProvider as default,
}
