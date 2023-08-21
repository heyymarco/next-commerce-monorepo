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
    showMessage             <TAnswer extends any>(dialogMessage             : React.SetStateAction<DialogMessage<TAnswer>|false>                                       ): Promise<void>
    showMessage             <TAnswer extends any>(message                   : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<void>
    
    showMessageError        <TAnswer extends any>(dialogMessageError        : DialogMessageError<TAnswer>|false                                                        ): Promise<void>
    showMessageError        <TAnswer extends any>(error                     : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<void>
    
    showMessageFieldError   <TAnswer extends any>(dialogMessageFieldError   : DialogMessageFieldError<TAnswer>|false                                                   ): Promise<void>
    showMessageFieldError   <TAnswer extends any>(fieldErrors               : FieldErrorList                                    , options?: ShowMessageOptions<TAnswer>): Promise<void>
    
    showMessageFetchError   <TAnswer extends any>(dialogMessageFetchError   : DialogMessageFetchError<TAnswer>|false                                                   ): Promise<void>
    showMessageFetchError   <TAnswer extends any>(fetchError                : any                                               , options?: ShowMessageOptions<TAnswer>): Promise<void>
    
    showMessageSuccess      <TAnswer extends any>(dialogMessageSuccess      : DialogMessageSuccess<TAnswer>|false                                                      ): Promise<void>
    showMessageSuccess      <TAnswer extends any>(success                   : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<void>
    
    showMessageNotification <TAnswer extends any>(dialogMessageNotification : DialogMessageNotification<TAnswer>|false                                                 ): Promise<void>
    showMessageNotification <TAnswer extends any>(notification              : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<void>
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
