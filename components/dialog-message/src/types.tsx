// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import type {
    // simple-components:
    IconProps,
}                           from '@reusable-ui/components'

// heymarco components:
import type {
    // dialog-components:
    ModalBaseProps,
}                           from '@heymarco/modal-status'



// options:
export interface ShowMessageOptions
    extends
        Omit<ModalBaseProps<Element>,
            // contents:
            |'title'   // we redefined `title`   prop
            |'message' // we redefined `message` prop
        >
{
}
export interface ShowMessageErrorOptions        extends ShowMessageOptions {
    // contents:
    title              ?: React.ReactNode
}
export interface ShowMessageFieldErrorOptions   extends ShowMessageOptions {
    // contents:
    fieldErrorTitle    ?: FieldErrorTitle
    
    fieldErrorMessage  ?: FieldErrorMessage
    fieldErrorIconFind ?: (invalidField: Element) => string|null|undefined
    fieldErrorIcon     ?: IconProps<Element>['icon']
    fieldErrorFocus    ?: boolean
    
    
    
    // contexts:
    context            ?: any
}
export interface ShowMessageFetchErrorOptions   extends ShowMessageOptions {
    // contents:
    fetchErrorTitle    ?: FetchErrorTitle
    
    fetchErrorMessage  ?: FetchErrorMessage
    
    
    
    // contexts:
    context            ?: any
}
export interface ShowMessageSuccessOptions      extends ShowMessageOptions {
    // contents:
    title              ?: React.ReactNode
}
export interface ShowMessageNotificationOptions extends ShowMessageOptions {
    // contents:
    title              ?: React.ReactNode
}



// states:
export interface DialogMessage                  extends ShowMessageOptions {
    // contents:
    title              ?: React.ReactNode
    message             : React.ReactNode
}



// args:
export interface FieldErrorInfo {
    // data:
    invalidFields  : ArrayLike<Element>
    
    
    
    // contexts:
    context        : any
}
export interface FetchErrorInfo {
    // data:
    isRequestError : boolean
    isClientError  : boolean
    isServerError  : boolean
    
    errorCode      : number
    error          : any
    
    
    
    // contexts:
    context        : any
}



// dynamic data:
export type FieldErrorTitle   = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)
export type FieldErrorMessage = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)

export type FetchErrorTitle   = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
export type FetchErrorMessage = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
