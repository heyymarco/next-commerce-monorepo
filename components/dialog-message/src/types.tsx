// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import type {
    // dialog-components:
    ModalBaseProps,
}                           from '@heymarco/modal-status'



// types:
export interface DialogMessage
    extends
        Omit<ModalBaseProps<Element>,
            // messages:
            |'title'   // we redefined `title`   prop
            |'message' // we redefined `message` prop
        >
{
    // messages:
    title         ?: React.ReactNode
    message        : React.ReactNode
}

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

export type FieldErrorTitle   = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)
export type FieldErrorMessage = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)

export type FetchErrorTitle   = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
export type FetchErrorMessage = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
