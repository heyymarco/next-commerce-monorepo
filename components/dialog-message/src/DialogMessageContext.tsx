// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
}                           from 'react'

// reusable-ui components:
import type {
    // simple-components:
    IconProps,
}                           from '@reusable-ui/components'

// internals:
import type {
    // types:
    DialogMessage,
    
    FieldErrorTitle,
    FieldErrorMessage,
    
    FetchErrorTitle,
    FetchErrorMessage,
}                           from './types.js'



// contexts:
export interface ShowMessageErrorOptions {
    title              ?: React.ReactNode
}
export interface ShowMessageFieldErrorOptions {
    fieldErrorTitle    ?: FieldErrorTitle
    
    fieldErrorMessage  ?: FieldErrorMessage
    fieldErrorIconFind ?: (invalidField: Element) => string|null|undefined
    fieldErrorIcon     ?: IconProps<Element>['icon']
    fieldErrorFocus    ?: boolean
    
    context            ?: any
}
export interface ShowMessageFetchErrorOptions {
    fetchErrorTitle    ?: FetchErrorTitle
    
    fetchErrorMessage  ?: FetchErrorMessage
    
    context            ?: any
}
export interface ShowMessageSuccessOptions {
    title              ?: React.ReactNode
}
export interface ShowMessageNotificationOptions {
    title              ?: React.ReactNode
}

export interface DialogMessageApi {
    // dialogs:
    showMessage             : (dialogMessage : React.SetStateAction<DialogMessage|false>                             ) => Promise<void>
    showMessageError        : (error         : React.ReactNode             , options?: ShowMessageErrorOptions       ) => Promise<void>
    showMessageFieldError   : (invalidFields : ArrayLike<Element>|undefined, options?: ShowMessageFieldErrorOptions  ) => Promise<void>
    showMessageFetchError   : (error         : any                         , options?: ShowMessageFetchErrorOptions  ) => Promise<void>
    showMessageSuccess      : (success       : React.ReactNode             , options?: ShowMessageSuccessOptions     ) => Promise<void>
    showMessageNotification : (notification  : React.ReactNode             , options?: ShowMessageNotificationOptions) => Promise<void>
}
export const DialogMessageContext = createContext<DialogMessageApi>({
    // dialogs:
    showMessage             : async () => {}, // outside a <DialogMessageProvider> => do nothing
    showMessageError        : async () => {}, // outside a <DialogMessageProvider> => do nothing
    showMessageFieldError   : async () => {}, // outside a <DialogMessageProvider> => do nothing
    showMessageFetchError   : async () => {}, // outside a <DialogMessageProvider> => do nothing
    showMessageSuccess      : async () => {}, // outside a <DialogMessageProvider> => do nothing
    showMessageNotification : async () => {}, // outside a <DialogMessageProvider> => do nothing
});
