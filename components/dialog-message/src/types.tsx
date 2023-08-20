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



// types:
export type FieldErrorList = ArrayLike<Element>|null|undefined



// args:
export interface FieldErrorInfo {
    // data:
    fieldErrors    : Exclude<FieldErrorList, null|undefined>
    
    
    
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



// states:
export interface DialogMessage             extends ShowMessageOptions {
    // contents:
    title               ?: React.ReactNode
    message              : React.ReactNode
}
export interface DialogMessageError        extends ShowMessageOptions {
    // contents:
    title               ?: React.ReactNode
    error                : React.ReactNode
}
export interface DialogMessageFieldError   extends ShowMessageOptions {
    // contents:
    fieldErrorTitle     ?: FieldErrorTitle
    
    fieldErrors          : FieldErrorList
    fieldErrorMessage   ?: FieldErrorMessage
    fieldErrorIconFind  ?: (fieldError: Element) => string|null|undefined
    fieldErrorIcon      ?: IconProps<Element>['icon']
    fieldErrorLabelFind ?: (fieldError: Element) => string|null|undefined
    fieldErrorFocus     ?: boolean
    
    
    
    // contexts:
    context             ?: any
}
export interface DialogMessageFetchError   extends ShowMessageOptions {
    // contents:
    fetchErrorTitle     ?: FetchErrorTitle
    
    fetchError           : any
    fetchErrorMessage   ?: FetchErrorMessage
    
    
    
    // contexts:
    context             ?: any
}
export interface DialogMessageSuccess      extends ShowMessageOptions {
    // contents:
    title               ?: React.ReactNode
    success              : React.ReactNode
}
export interface DialogMessageNotification extends ShowMessageOptions {
    // contents:
    title               ?: React.ReactNode
    notification         : React.ReactNode
}
