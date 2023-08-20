// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
}                           from 'react'

// internals:
import type {
    // options:
    ShowMessageOptions,
    ShowMessageErrorOptions,
    ShowMessageFieldErrorOptions,
    ShowMessageFetchErrorOptions,
    ShowMessageSuccessOptions,
    ShowMessageNotificationOptions,
    
    
    
    // states:
    DialogMessage,
}                           from './types.js'



// utilities:
const notNestedError = async (): Promise<void> => {
    throw Error('The `useDialogMessage()` hook must be nested in `<DialogMessageProvider>`.');
};



// contexts:
export interface DialogMessageApi {
    // dialogs:
    showMessage             (dialogMessage : React.SetStateAction<DialogMessage|false>                             ): Promise<void>
    showMessage             (message       : React.ReactNode             , options?: ShowMessageOptions            ): Promise<void>
    
    showMessageError        (error         : React.ReactNode             , options?: ShowMessageErrorOptions       ): Promise<void>
    showMessageFieldError   (invalidFields : ArrayLike<Element>|undefined, options?: ShowMessageFieldErrorOptions  ): Promise<void>
    showMessageFetchError   (error         : any                         , options?: ShowMessageFetchErrorOptions  ): Promise<void>
    showMessageSuccess      (success       : React.ReactNode             , options?: ShowMessageSuccessOptions     ): Promise<void>
    showMessageNotification (notification  : React.ReactNode             , options?: ShowMessageNotificationOptions): Promise<void>
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
