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
    FieldErrorList,
    
    
    
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



// utilities:
const notNestedError = async (): Promise<void> => {
    throw Error('The `useDialogMessage()` hook must be nested in `<DialogMessageProvider>`.');
};



// contexts:
export interface DialogMessageApi {
    // dialogs:
    showMessage             (dialogMessage             : React.SetStateAction<DialogMessage|false>                              ): Promise<void>
    showMessage             (message                   : React.ReactNode                          , options?: ShowMessageOptions): Promise<void>
    
    showMessageError        (dialogMessageError        : DialogMessageError|false                                               ): Promise<void>
    showMessageError        (error                     : React.ReactNode                          , options?: ShowMessageOptions): Promise<void>
    
    showMessageFieldError   (dialogMessageFieldError   : DialogMessageFieldError|false                                          ): Promise<void>
    showMessageFieldError   (fieldErrors               : FieldErrorList                           , options?: ShowMessageOptions): Promise<void>
    
    showMessageFetchError   (dialogMessageFetchError   : DialogMessageFetchError|false                                          ): Promise<void>
    showMessageFetchError   (fetchError                : any                                      , options?: ShowMessageOptions): Promise<void>
    
    showMessageSuccess      (dialogMessageSuccess      : DialogMessageSuccess|false                                             ): Promise<void>
    showMessageSuccess      (success                   : React.ReactNode                          , options?: ShowMessageOptions): Promise<void>
    
    showMessageNotification (dialogMessageNotification : DialogMessageNotification|false                                        ): Promise<void>
    showMessageNotification (notification              : React.ReactNode                          , options?: ShowMessageOptions): Promise<void>
}
export const DialogMessageContext = createContext<DialogMessageApi>({
    // dialogs:
    showMessage             : notNestedError,
    showMessageError        : notNestedError,
    showMessageFieldError   : notNestedError,
    showMessageFetchError   : notNestedError,
    showMessageSuccess      : notNestedError,
    showMessageNotification : notNestedError,
});



// const answer = await showMessageOptions({
//     title   : 'ask',
//     message : 'do you love me'?
//     options : {
//         yes   : <Button>Yes</Button>
//         no    : <Button>No</Button>
//         maybe : <Button theme='primary'>Maybe</Button>
//     }
// });
