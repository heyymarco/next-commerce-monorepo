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
const notNestedError = async (): Promise<any|undefined> => {
    throw Error('The `useDialogMessage()` hook must be nested in `<DialogMessageProvider>`.');
};



// contexts:
export interface DialogMessageApi {
    // dialogs:
    showMessage             <TAnswer extends any>(dialogMessage             : React.SetStateAction<DialogMessage<TAnswer>|false>                                       ): Promise<TAnswer|undefined>
    showMessage             <TAnswer extends any>(message                   : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<TAnswer|undefined>
    
    showMessageError        <TAnswer extends any>(dialogMessageError        : DialogMessageError<TAnswer>|false                                                        ): Promise<TAnswer|undefined>
    showMessageError        <TAnswer extends any>(error                     : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<TAnswer|undefined>
    
    showMessageFieldError   <TAnswer extends any>(dialogMessageFieldError   : DialogMessageFieldError<TAnswer>|false                                                   ): Promise<TAnswer|undefined>
    showMessageFieldError   <TAnswer extends any>(fieldErrors               : FieldErrorList                                    , options?: ShowMessageOptions<TAnswer>): Promise<TAnswer|undefined>
    
    showMessageFetchError   <TAnswer extends any>(dialogMessageFetchError   : DialogMessageFetchError<TAnswer>|false                                                   ): Promise<TAnswer|undefined>
    showMessageFetchError   <TAnswer extends any>(fetchError                : any                                               , options?: ShowMessageOptions<TAnswer>): Promise<TAnswer|undefined>
    
    showMessageSuccess      <TAnswer extends any>(dialogMessageSuccess      : DialogMessageSuccess<TAnswer>|false                                                      ): Promise<TAnswer|undefined>
    showMessageSuccess      <TAnswer extends any>(success                   : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<TAnswer|undefined>
    
    showMessageNotification <TAnswer extends any>(dialogMessageNotification : DialogMessageNotification<TAnswer>|false                                                 ): Promise<TAnswer|undefined>
    showMessageNotification <TAnswer extends any>(notification              : React.ReactNode                                   , options?: ShowMessageOptions<TAnswer>): Promise<TAnswer|undefined>
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
