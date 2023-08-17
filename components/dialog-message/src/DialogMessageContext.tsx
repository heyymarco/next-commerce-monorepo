// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
}                           from 'react'

// internals:
import type {
    // types:
    DialogMessage,
    FetchErrorMessage,
}                           from './types.js'



// contexts:
export interface ShowMessageFieldErrorOptions {
    fieldErrorFocus   ?: boolean
}
export interface ShowMessageFetchErrorOptions {
    fetchErrorMessage ?: FetchErrorMessage
}
export interface DialogMessageApi {
    // dialogs:
    showMessage             : (dialogMessage : React.SetStateAction<DialogMessage|false>                           ) => Promise<void>
    showMessageError        : (error         : React.ReactNode                                                     ) => Promise<void>
    showMessageFieldError   : (invalidFields : ArrayLike<Element>|undefined, options?: ShowMessageFieldErrorOptions) => Promise<void>
    showMessageFetchError   : (error         : any,                          options?: ShowMessageFetchErrorOptions) => Promise<void>
    showMessageSuccess      : (success       : React.ReactNode                                                     ) => Promise<void>
    showMessageNotification : (notification  : React.ReactNode                                                     ) => Promise<void>
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
