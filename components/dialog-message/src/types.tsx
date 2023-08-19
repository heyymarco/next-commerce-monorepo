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
    // contents:
    title         ?: React.ReactNode
}
export interface ShowMessageErrorOptions        extends ShowMessageOptions {
    title              ?: React.ReactNode
}
export interface ShowMessageFieldErrorOptions   extends ShowMessageOptions {
    fieldErrorTitle    ?: FieldErrorTitle
    
    fieldErrorMessage  ?: FieldErrorMessage
    fieldErrorIconFind ?: (invalidField: Element) => string|null|undefined
    fieldErrorIcon     ?: IconProps<Element>['icon']
    fieldErrorFocus    ?: boolean
    
    context            ?: any
}
export interface ShowMessageFetchErrorOptions   extends ShowMessageOptions {
    fetchErrorTitle    ?: FetchErrorTitle
    
    fetchErrorMessage  ?: FetchErrorMessage
    
    context            ?: any
}
export interface ShowMessageSuccessOptions      extends ShowMessageOptions {
    title              ?: React.ReactNode
}
export interface ShowMessageNotificationOptions extends ShowMessageOptions {
    title              ?: React.ReactNode
}



// states:
export interface DialogMessage extends ShowMessageOptions {
    // contents:
    message        : React.ReactNode
}



// args:
export interface FieldErrorInfo {
    invalidFields  : ArrayLike<Element>
    
    context        : any
}
export interface FetchErrorInfo {
    isRequestError : boolean
    isClientError  : boolean
    isServerError  : boolean
    
    errorCode      : number
    error          : any
    
    context        : any
}



// dynamic data:
export type FieldErrorTitle   = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)
export type FieldErrorMessage = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)

export type FetchErrorTitle   = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
export type FetchErrorMessage = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
