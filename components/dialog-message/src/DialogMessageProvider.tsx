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
    DialogMessage,
    FetchErrorMessage,
}                           from './types.js'
import {
    // utilities:
    paragraphify,
}                           from './utilities.js'
import {
    // contexts:
    ShowMessageFieldErrorOptions,
    ShowMessageFetchErrorOptions,
    DialogMessageApi,
    DialogMessageContext,
}                           from './DialogMessageContext.js'



// react components:
export interface DialogMessageProviderProps {
    // components:
    modalStatusComponent         ?: React.ReactComponentElement<any, ModalStatusProps<Element>>
    
    cardHeaderComponent          ?: React.ReactComponentElement<any, CardHeaderProps<Element>>
    cardBodyComponent            ?: React.ReactComponentElement<any, CardBodyProps<Element>>
    cardFooterComponent          ?: React.ReactComponentElement<any, CardFooterProps<Element>>
    
    closeButtonComponent         ?: React.ReactComponentElement<any, ButtonProps>
    okButtonComponent            ?: React.ReactComponentElement<any, ButtonProps>
    
    fieldErrorListComponent      ?: React.ReactComponentElement<any, ListProps<Element>>
    fieldErrorListItemComponent  ?: React.ReactComponentElement<any, ListItemProps<Element>>
    fieldErrorIconDefault        ?: IconProps<Element>['icon']
    fieldErrorIconComponent      ?: React.ReactComponentElement<any, IconProps<Element>>
    fieldErrorFocusDefault       ?: boolean
    fetchErrorMessageDefault     ?: FetchErrorMessage
}
const DialogMessageProvider = (props: React.PropsWithChildren<DialogMessageProviderProps>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        modalStatusComponent        = (<ModalStatus theme='primary' modalCardStyle='scrollable' lazy={true} /> as React.ReactComponentElement<any, ModalStatusProps<Element>>),
        
        cardHeaderComponent         = (<CardHeader<Element>                                                 /> as React.ReactComponentElement<any, CardHeaderProps<Element>>),
        cardBodyComponent           = (<CardBody<Element>                                                   /> as React.ReactComponentElement<any, CardBodyProps<Element>>),
        cardFooterComponent         = (<CardFooter<Element>                                                 /> as React.ReactComponentElement<any, CardFooterProps<Element>>),
        
        closeButtonComponent        = (<CloseButton                                                         /> as React.ReactComponentElement<any, ButtonProps>),
        okButtonComponent           = (<Button                                                              /> as React.ReactComponentElement<any, ButtonProps>),
        
        fieldErrorListComponent     = (<List<Element> listStyle='flat'                                      /> as React.ReactComponentElement<any, ListProps<Element>>),
        fieldErrorListItemComponent = (<ListItem<Element>                                                   /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        fieldErrorIconDefault       = 'text_fields',
        fieldErrorIconComponent     = (<Icon<Element> icon={fieldErrorIconDefault}                          /> as React.ReactComponentElement<any, IconProps<Element>>),
        fieldErrorFocusDefault      = true,
        fetchErrorMessageDefault    = ({isRequestError, isServerError}) => <>
            <p>
                Oops, there was an error processing the command.
            </p>
            {isRequestError && <p>
                There was a <strong>problem contacting our server</strong>.
                <br />
                Make sure your internet connection is available.
            </p>}
            {isServerError && <p>
                Please try again in a few minutes.
                <br />
                If the problem still persists, please contact our technical support.
            </p>}
        </>,
    } = props;
    
    
    
    // states:
    const [dialogMessage, setDialogMessage]      = useState<DialogMessage|false>(false);
    
    const prevDialogMessage                      = useRef<DialogMessage|undefined>(dialogMessage || undefined);
    if (dialogMessage) prevDialogMessage.current = dialogMessage;
    
    const signalsDialogMessageClosed             = useRef<(() => void)[]>([]);
    
    const isMounted                              = useMountedFlag();
    
    
    
    // refs:
    
    
    
    // stable callbacks:
    const showMessage             = useEvent(async (dialogMessage : React.SetStateAction<DialogMessage|false>                           ): Promise<void> => {
        setDialogMessage(dialogMessage);
        return new Promise<void>((resolved) => {
            signalsDialogMessageClosed.current.push(resolved); // wait until <ModalStatus> to be closed by user
        });
    });
    
    const showMessageError        = useEvent(async (error         : React.ReactNode                                                     ): Promise<void> => {
        await showMessage({
            theme   : 'danger',
            title   : 'Error',
            message : error,
        });
    });
    const showMessageFieldError   = useEvent(async (invalidFields : ArrayLike<Element>|undefined, options?: ShowMessageFieldErrorOptions): Promise<void> => {
        // conditions:
        if (!invalidFields?.length) return; // no field error => nothing to show => ignore
        
        
        
        // show message:
        const isPlural = (invalidFields?.length > 1);
        await showMessageError(<>
            <p>
                There {isPlural ? 'are some' : 'is an'} invalid field{isPlural ? 's' : ''} that {isPlural ? 'need' : 'needs'} to be fixed:
            </p>
            {/* <List> */}
            {React.cloneElement<ListProps<Element>>(fieldErrorListComponent,
                // props:
                undefined,
                
                
                
                // children:
                (fieldErrorListComponent.props.children ?? Array.from(invalidFields).map((invalidField, index) =>
                    React.cloneElement<ListItemProps<Element>>(fieldErrorListItemComponent,
                        // props:
                        {
                            key : fieldErrorListItemComponent.key ?? index,
                        },
                        
                        
                        
                        // children:
                        (fieldErrorListItemComponent.props.children ?? <>
                            {React.cloneElement<IconProps<Element>>(fieldErrorIconComponent,
                                // props:
                                {
                                    // appearances:
                                    icon : fieldErrorIconComponent.props.icon ?? (
                                        ((invalidField.parentElement?.previousElementSibling as HTMLElement)?.children?.[0]?.children?.[0] as HTMLElement)?.style?.getPropertyValue?.('--icon-image')?.slice?.(1, -1)
                                        ??
                                        fieldErrorIconDefault
                                    ),
                                },
                            )}
                            &nbsp;
                            {
                                (invalidField as HTMLElement).getAttribute?.('aria-label')
                                ||
                                (invalidField.children?.[0] as HTMLInputElement)?.placeholder
                            }
                        </>),
                    )
                )),
            )}
        </>);
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // focus the first fieldError:
        const fieldErrorFocus   = options?.fieldErrorFocus ?? fieldErrorFocusDefault;
        if (fieldErrorFocus) {
            const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe';
            const firstInvalidField = invalidFields?.[0];
            const firstFocusableElm = (firstInvalidField.matches(focusableSelector) ? firstInvalidField : firstInvalidField?.querySelector(focusableSelector)) as HTMLElement|null;
            firstInvalidField.scrollIntoView({
                block    : 'start',
                behavior : 'smooth',
            });
            firstFocusableElm?.focus?.({ preventScroll: true });
        } // if
    });
    const showMessageFetchError   = useEvent(async (error         : any,                          options?: ShowMessageFetchErrorOptions): Promise<void> => {
        await showMessageError(
            // axios' human_readable server error   response:
            // axios' human_readable server message response:
            ((): React.ReactElement|undefined => {
                const data = error?.response?.data;
                
                
                
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
                const response = error?.cause;
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
                const isRequestError = ( // the request was made but no response was received
                    // axios'  error request:
                    !!error?.request
                    ||
                    // fetch's error request:
                    (error instanceof TypeError)
                );
                
                let errorCode = (
                    // axios'  error status code:
                    error?.response?.status
                    ??
                    // fetch's error status code:
                    error?.cause?.status // passing a `Response` object
                    ??
                    error?.cause         // passing a `Response`'s status code
                );
                if (typeof(errorCode) !== 'number') errorCode = 0;
                const isClientError  = (errorCode >= 400) && (errorCode <= 499);
                const isServerError  = (errorCode >= 500) && (errorCode <= 599);
                
                const fetchErrorMessage = options?.fetchErrorMessage ?? fetchErrorMessageDefault;
                return (typeof(fetchErrorMessage) === 'function') ? fetchErrorMessage({ isRequestError, isClientError, isServerError }) : fetchErrorMessage;
            })()
        );
    });
    const showMessageSuccess      = useEvent(async (success       : React.ReactNode                                                     ): Promise<void> => {
        await showMessage({
            theme   : 'success',
            title   : 'Success',
            message : success,
        });
    });
    const showMessageNotification = useEvent(async (notification  : React.ReactNode                                                     ): Promise<void> => {
        await showMessage({
            theme   : 'primary',
            title   : 'Notification',
            message : notification,
        });
    });
    
    
    
    // refs:
    const okButtonRefInternal     = useRef<HTMLButtonElement|null>(null);
    const okButtonRef             = useMergeRefs(
        // preserves the original `elmRef` from `okButtonComponent`:
        okButtonComponent.props.elmRef,
        
        
        
        okButtonRefInternal,
    );
    
    
    
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
    return (
        <DialogMessageContext.Provider value={dialogMessageApi}>
            {props.children}
            
            {React.cloneElement<ModalStatusProps<Element>>(modalStatusComponent,
                // props:
                {
                    // variants:
                    theme            : modalStatusComponent.props.theme ?? prevDialogMessage.current?.theme ?? 'primary',
                    
                    
                    
                    // handlers:
                    onExpandedChange : handleModalExpandedChange,
                    onExpandStart    : handleModalFocus,
                    onCollapseEnd    : handleClosedDialogMessage,
                },
                
                
                
                // children:
                (modalStatusComponent.props.children ?? (!!dialogMessage && <>
                    {React.cloneElement<CardHeaderProps<Element>>(cardHeaderComponent,
                        // props:
                        undefined,
                        
                        
                        
                        // children:
                        cardHeaderComponent.props.children ?? <>
                            {dialogMessage.title ?? 'Notification'}
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
                        cardBodyComponent.props.children ?? dialogMessage.message,
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
